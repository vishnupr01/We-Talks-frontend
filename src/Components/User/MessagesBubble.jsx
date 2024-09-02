import React, { useEffect, useRef, useState } from 'react';
import Bubbles from './Bubbles';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { useSocketContext } from '../../context/SocketContext';
import notificationSound from '../../assets/sounds/notificationSound.mp3'
import { useSelector } from 'react-redux';

const MessagesBubble = ({ messages, receiverProfile,currentUserId }) => {
  console.log("message in bubble", messages);
  const [loading, setLoading] = useState(false);
  const [messagesArr, setMessagesArr] = useState([]);
  const lastMessageRef = useRef();
  const { socket } = useSocketContext();
  const { id } = useSelector((state) => state.authSlice.user);
  useEffect(() => {
    const handleNewMessage = ({createdMessage,senderId}) => {
      
      console.log("my id",currentUserId);
      console.log("receiverId",senderId); 
      if(senderId!==currentUserId){
        return
      }
      console.log('forgot that', createdMessage);
      createdMessage.shouldShake = true
      const sound=new Audio(notificationSound)
      sound.play()
      setMessagesArr((prevMessages) => [...prevMessages, createdMessage]);
    };
    if(socket)
    socket.on("newMessage", handleNewMessage);

    setMessagesArr(messages);



    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [messages, socket]);

  useEffect(() => {
    if (messagesArr.length > 0) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messagesArr]);

  console.log("result got", messagesArr);

  return (
    <div className='px-4 flex pb-6 flex-col-reverse h-5/6'>
      <div className='flex-1 overflow-auto'>
        {!loading && messagesArr.length > 0 && messagesArr.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Bubbles message={message} receiverProfile={receiverProfile} />
          </div>
        ))}
        {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
        {!loading && messagesArr.length === 0 && (
          <p className='text-center'>Send a message to start the conversation</p>
        )}
      </div>
    </div>
  );
};

export default MessagesBubble;
