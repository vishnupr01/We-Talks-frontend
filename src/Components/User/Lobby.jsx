import React, { useState } from 'react';
import { searchRoom } from '../../api/room';
import AgoraRTC from 'agora-rtc-sdk-ng'; // Adjust the import path as needed
import dotenv from 'dotenv'
import { useNavigate } from 'react-router-dom';
// dotenv.config()
const Lobby = () => {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [client, setClient] = useState(null);
  const navigate=useNavigate()

  const enterRoom = async (e) => {
    e.preventDefault();
    navigate('/home/room',{ state: {roomId,roomName } })
    // try {
      
    //   const appId =  process.env.REACT_APP_AGORA_APP_ID; 
    //   const token = null
    //   const uid = Math.floor(Math.random() * 10000); 
      
    //   // Create the Agora client
    //   const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    //   setClient(agoraClient);
      
    //   // Join the Agora room
    //   await agoraClient.join(appId, roomId, token, uid);
    //   console.log('Room entered successfully');

    // } catch (error) {
    //   console.error('Error entering room:', error);
    // }
  };

  return (
    <div className='bg-zinc-800 h-screen w-full'>
      <main id="room__lobby__container">
        <div id="form__container">
          <div id="form__container__header">
            <p>👋 Create or Join Room</p>
          </div>

          <form id="lobby__form" onSubmit={enterRoom}>
            <div className="form__field__wrapper">
              <label>Your Name</label>
              <input
                onChange={(e) => setRoomName(e.target.value)}
                type="text"
                name="name"
                required
                placeholder="Enter your display name..."
              />
            </div>

            <div className="form__field__wrapper">
              <label>Room Name</label>
              <input
                onChange={(e) => setRoomId(e.target.value)}
                type="text"
                name="room"
                required
                placeholder="Enter room name..."
              />
            </div>

            <div className="form__field__wrapper">
              <button
                type="submit"
                className="bg-violet-500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
              >
                Go to Room
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="form__field__wrapper mt-4 ml-8">
            <button
              className="bg-violet-500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
              type="button"
            >
              Create Room
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Lobby;
