import React, { useEffect, useState } from 'react';
import { BsSend } from 'react-icons/bs';
import { sendMessage } from '../../api/messages';
import { useNavigate } from 'react-router-dom';

const MessageInput = ({ receiverId, receiverProfile,addNewMessage }) => {
  const [message, setMessage] = useState("");
  const [enableButton, setEnableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("messagInput", receiverId);

  const submitData = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      setLoading(true);
      console.log("hello");

      const response = await sendMessage(message, receiverId);
      console.log("is response", response);

      if (response.data.status === "success") {
        setMessage("");
        setEnableButton(false);
        addNewMessage()
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value) => {
    value.trim()
    setMessage(value);
    if (value.length > 0) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  return (
    <form className='px-4 my-3' onSubmit={submitData}>
      <div className='w-full relative'>
        <input
          value={message}
          maxLength={200}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white'
          placeholder='Send a message'
          required
        />
        {enableButton && (
          <button
            type='submit'
            className='absolute inset-y-0 end-0 flex items-center pe-3'
          >
            <BsSend />
          </button>
        )}
      </div>
    </form>
  );
};

export default MessageInput;
