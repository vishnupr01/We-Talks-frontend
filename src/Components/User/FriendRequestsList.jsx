import React, { useEffect, useState } from 'react';
import { confirmRequest, fetchRequests } from '../../api/notification';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import SkeletonLoading from '../skeletons/Loading';

const FriendRequest = ({ profileImage, status, name, mutualFriends, time, onConfirm, onDelete }) => (
  <div className="flex items-center p-4 bg-white border-b border-gray-200">
    <img className="w-12 h-12 rounded-full" src={profileImage} alt={`${name}'s profile`} />
    <div className="ml-4 flex-1">
      <div className="text-lg font-semibold">{name}</div>
      {status === "accepted" && <p>Request accepted</p>}
      <div className="text-gray-400 text-sm">{time}</div>
    </div>
    {status === "pending" && (
      <div className="flex space-x-2">
        <button
          onClick={onConfirm}
          className="px-4 py-1 bg-black text-white rounded-lg hover:bg-green-400 transition duration-200"
        >
          Accept
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Delete
        </button>
      </div>
    )}
  </div>
);

const FriendRequestsList = () => {
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [newData, setNewData] = useState();

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchRequests();
      setFriendRequests(response.data.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (senderId, updaterId) => {
    try {
      const response = await confirmRequest(senderId, updaterId);
      setNewData(response.data.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, [newData]);

  const handleDelete = (id) => {
    console.log(`Deleted friend request with id: ${id}`);
  };

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

  return (
    <div className="mx-auto bg-gray-100 rounded-lg h-screen max-w-8xl shadow-lg">
      <div className="p-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-black">Friend Requests</h1>
        {friendRequests.length===0&&<p>No friend requests</p>}
        {friendRequests.length>0&&<p className="text-gray-600">9 friend requests</p>}
        
      </div>
      <div>
        {loading ? (
          
          [...Array(2)].map((_, idx) => <SkeletonLoading key={idx} />)
        ) : (
          friendRequests.map((request) => (
            <FriendRequest
              key={request.id}
              profileImage={request.senderDetails.profileImg}
              name={request.senderDetails.name}
              time={getTimeElapsed(request.createdAt)}
              onConfirm={() => handleConfirm(request._id, request.sender)}
              onDelete={() => handleDelete(request.id)}
              status={request.status}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequestsList;
