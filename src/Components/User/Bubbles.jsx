import React from 'react';
import { useSelector } from 'react-redux';

const Bubbles = ({message,receiverProfile}) => {
  console.log("page rendered");
  
  const { id,image_url } = useSelector((state) => state.authSlice.user);
  const fromMe=message.senderId===id
  const chatClassname=fromMe ?'chat-end':'chat-start'
  const profilePic=fromMe? image_url:receiverProfile
  const bubbleBgColor= fromMe?'bg-blue-500':"bg-zinc-600"
  const shakeClass=message.shouldShake? "shake":""
console.log("message issue",message);
const getTimeElapsed = (createdAt) => {
  const postTime = new Date(createdAt);
  return postTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

  return (
    <div className={`chat ${chatClassname}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            alt="Chat Avatar"
            src={profilePic}
          />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>
        {message.message}
      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        {getTimeElapsed(message.createdAt)}
      </div>
    </div>
  );
};

export default Bubbles;
