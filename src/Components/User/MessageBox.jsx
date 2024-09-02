import React, { useEffect, useState } from 'react';
import MessagesBubble from './MessagesBubble';
import MessageInput from './MessageInput';
import { getUserMessages } from '../../api/messages';
import { useLocation } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';
import { getFriendProfile } from '../../api/userFunctions';
import { useSelector } from 'react-redux';

const MessageBox = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [count, setCount] = useState(0)
  const location = useLocation();
  const { onlineUsers } = useSocketContext()
  const [blockedUsers, setBlockedUsers] = useState([])
  const { receiverId, receiverProfile, receiverName } = location.state || {};
  const { id } = useSelector((state) => state.authSlice.user);

  const fetchMessage = async (receiverId) => {
    try {
      setLoading(true);
      const response = await getUserMessages(receiverId);
      console.log("got messages", response);
      setMessages(response.data.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const fetchProfile = async (receiverId) => {
    try {
      const response = await getFriendProfile(receiverId)
      setBlockedUsers(response.data.data.blockedUsers)
    } catch (error) {
      console.log(error);
      throw error

    }
  }
  const isBlocked = blockedUsers?.some(user => user?.blockedId === id && user?.status === "blocker"||user?.status === "target");
  useEffect(() => {
    if (receiverId) {
      setStoreId(receiverId);
      fetchMessage(receiverId);
      fetchProfile(receiverId)
    }
  }, [receiverId, count]);

  const addNewMessage = () => {
    setCount(count + 1)
  }
  const isOnline = (conversationId) => {
    console.log("coneee", conversationId);

    return onlineUsers.includes(conversationId);
  }
  console.log("message arr", storeId);
  console.log("blockedUsers", blockedUsers);

  return (
    <div className='md:min-w-[450px] flex flex-col h-full'>
      <div className='bg-slate-500 px-4 py-2 mb-2'>
        <span className='text-gray-900 pl-2 text-xl  font-bold'>{receiverName}</span>
        {isOnline(receiverId) && <p className='text-gray-400 ml-2'>online</p>}
      </div>
      <div className='flex-1 mr-24 overflow-auto'>
        <MessagesBubble messages={messages } currentUserId={receiverId} receiverProfile={receiverProfile} />
      </div>
      <div className='fixed mt-96 pt-44 w-4/6'>
      {isBlocked&&<p className='ml-52 text-red-500'>You can't send more messages yep...</p>}
      {!isBlocked&&<MessageInput receiverId={storeId} receiverProfile={receiverProfile} addNewMessage={addNewMessage} />}
        
      </div>
    </div>
  );
};

export default MessageBox;
