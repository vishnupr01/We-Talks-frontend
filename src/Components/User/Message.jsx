import React, { useEffect, useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getConversations } from '../../api/messages';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../../context/SocketContext';

const Message = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { onlineUsers } = useSocketContext();

  const { image_url, name } = useSelector((state) => state.authSlice.user);
  const { receiverId } = location.state || '';

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      setConversations(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [onlineUsers]);

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const timeDiff = now - postTime;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const isOnline = useMemo(() => (conversationId) => onlineUsers.includes(conversationId), [onlineUsers]);

  const handleNavigate = (receiverId, receiverProfile, receiverName) => {
    navigate('messageBox', { state: { receiverId, receiverProfile, receiverName } });
  };

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen fixed w-full">
      <div className="md:w-1/3 lg:w-1/4 bg-white text-black p-4 h-full overflow-y-auto">
        <div className="mb-4"> 
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Messages</h3>
          <ul>
            {conversations.map((msg, index) => (
              <li key={index} className="flex items-center py-5 border-b border-gray-200">
                <button className="flex items-center flex-1" onClick={() => handleNavigate(msg.receiverId, msg.receiverProfile, msg.receiverName)}>
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full">
                      <img className="rounded-full" src={msg.receiverProfile} alt={msg.receiverName} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span className="font-semibold">{msg.receiverName}</span>
                      {isOnline(msg.receiverId) && <p className="text-green-500">online</p>}
                      <span className="text-sm text-gray-400">{getTimeElapsed(msg.updatedAt)}</span>
                    </div>
                    <p className="text-sm mr-56 text-gray-400">{msg.lastMessage}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:w-2/3 lg:w-3/4 h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default React.memo(Message);
