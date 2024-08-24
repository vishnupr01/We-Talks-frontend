import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import dotenv from 'dotenv'
import { getToken } from '../../api/room';
// dotenv.config()
const APP_ID = "83aa3fc60aad468c9daa2d90ee10f8b4" // Replace with your Agora App ID


const Room = () => {
  const location = useLocation()
  const [remoteUsers, setRemoteUsers] = useState([])
  const { roomId, roomName } = location.state || {};
  const [token, setToken] = useState(null)
  const [activeMemberContainer, setActiveMemberContainer] = useState(true)
  const [activeChatContainer, setActiveChatContainer] = useState(true)
  const [userIdInDisplayFrame, setUserIdInDisplayFrame] = useState(null);
  const memberContainerRef = useRef(null)
  const chatContainerRef = useRef(null)
  useEffect(() => {
    if (memberContainerRef.current) {
      memberContainerRef.current.style.display = activeMemberContainer ? 'block' : 'none';

    }
  }, [activeMemberContainer])
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.style.display = activeChatContainer ? 'block' : 'none'

    }
  }, [activeChatContainer])
  const toggleMemberContainer = () => {
    setActiveMemberContainer(!activeMemberContainer);
  };

  const toggleChatContainer = () => {
    setActiveChatContainer(!activeChatContainer);
  };

  useEffect(() => {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, []);
  useEffect(() => {
    let uid = sessionStorage.getItem('uid');
    if (!uid) {
      uid = String(Math.floor(Math.random() * 10000));
      sessionStorage.setItem('uid', uid);
      // const fetchToken = async () => {
      //   const response = await getToken(roomId, uid)
      //   setToken(response.data.data)
      // }
      // fetchToken()

    }

    let rtcClient;

    const joinRoomInit = async () => {
      console.log('uid', uid);

      rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      await rtcClient.join(APP_ID, roomId || 'main', token, uid);

      console.log("is function working");
      rtcClient.on('user-published', handleUserPublished);
      rtcClient.on('user-left', handleUserLeft)
      await joinStream();
    };

    const joinStream = async () => {
      try {
        console.log("second user");

        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        // let player = `<div class="video__container" id="user-container-${uid}">
        //                   <div class="video-player" id="user-${uid}"></div>
        //                 </div>`;
                        const player = document.createElement('div');
                        console.log("my playerrr",player);
                        
            player.innerHTML = `<div class="video__container" id="user-container-${uid}">
            <h1>hello</h1>
                         <div class="video-player" id="user-${uid}"></div>
                         </div>`;
             document.getElementById('streams__container').appendChild(player);
        // document.getElementById('streams__container').insertAdjacentHTML('beforeend', player);
        document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)
        localTracks[1].play(`user-${uid}`);

        await rtcClient.publish(localTracks);

      } catch (error) {
        throw error

      } finally {

        rtcClient.on('user-published', handleUserPublished);
        rtcClient.on('user-left', handleUserLeft)

      }


    };

    const handleUserPublished = async (user, mediaType) => {
      alert("hi")
      console.log("user on skype", user);

     

      await rtcClient.subscribe(user, mediaType);
      setRemoteUsers((prevUsers) => ([...prevUsers, user ]))
      setRemoteUsers([...remoteUsers ]);
      let player = document.getElementById(`user-container-${user.uid}`);
      if (!player) {
        player = `<div class="video__container" id="user-container-${user.uid}">
                    <h1>hi</h1>
                    <div class="video-player" id="user-${user.uid}"></div>
                  </div>`;
        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player);
        document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandVideoFrame)

      }
      const displayFrame = document.getElementById('stream__box');
      if (displayFrame.style.display) {
        player.style.height = '100px'
        player.style.width = '100px'
      }

      if (mediaType === 'video') {
        user.videoTrack.play(`user-${user.uid}`);
      }
      if (mediaType === 'audio') {
        // user.audioTrack.play();
      }
    };

    joinRoomInit();

    console.log("remoteUsers", remoteUsers);
    const handleUserLeft = (user) => {
      delete remoteUsers[user.uid]
      document.getElementById(`user-container-${user.uid}`).remove()
    };


    // for(let i=0;videoFrames.length>i;i++){
    //   videoFrames[i].addEventListener('click',expandVideoFrame)
    // }

    return () => {
      if (rtcClient) rtcClient.leave();
    };
  }, [roomId]);

  const expandVideoFrame = (e) => {
    const displayFrame = document.getElementById('stream__box');
    const videoFrames = document.getElementsByClassName('video__container');


    let child = displayFrame.children[0]
    if (child) {
      console.log("child", child);

      document.getElementById('streams__container').appendChild(child);
    }

    displayFrame.style.display = 'block';
    displayFrame.appendChild(e.currentTarget);
    setUserIdInDisplayFrame(e.currentTarget.id);

    Array.from(videoFrames).forEach((frame) => {
      if (frame.id !== userIdInDisplayFrame) {
        frame.style.height = '100px';
        frame.style.width = '100px';
      }
    });
  };
  useEffect(() => {
    const videoFrames = document.getElementsByClassName('video__container');
    Array.from(videoFrames).forEach((frame) => {
      frame.addEventListener('click', expandVideoFrame);
    });
  }, [remoteUsers]);

  const handleMemberJoined = (memberId) => { /* Handle member joined */ };

  const handleChannelMessage = (message, memberId) => { /* Handle channel message */ };
  const handleUserPublished = (user, mediaType) => { /* Handle user published */ };

  console.log("my remote users", remoteUsers);
  useEffect(() => {
    console.log("Remote Users Entries:", Object.entries(remoteUsers));
  }, [remoteUsers]);
  return (
    <main class="container fixed ">
      <div className='' id="room__container">
        <section className='mb-3' ref={memberContainerRef} id="members__container">

          <div id="members__header">
            <p>Participants</p>
            <strong id="members__count">27</strong>
          </div>

          <div id="member__list">
            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Shahriar P. Shuvo 👋:</p>
            </div>

            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Shahriar P. Shuvo 👋:</p>
            </div>

            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Shahriar P. Shuvo 👋:</p>
            </div>

            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>
            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Shahriar P. Shuvo 👋:</p>
            </div>

            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Shahriar P. Shuvo 👋:</p>
            </div>

            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Shahriar P. Shuvo 👋:</p>
            </div>

            <div class="member__wrapper" id="member__1__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Sulammita</p>
            </div>

            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>
            <div class="member__wrapper" id="member__2__wrapper">
              <span class="green__icon"></span>
              <p class="member_name">Dennis Ivy</p>
            </div>
          </div>

        </section>
        <section id="stream__container">
          <div id='stream__box'></div>
          <div id='streams__container' className='ml-28'>
            <div class="video__container" id='user-container-1'>
              <h1>1</h1>
            </div>
            <div class="video__container" id='user-container-2'>
              <h1>2</h1>
            </div>


          </div>
          <div class="stream__actions">
            <button >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" /></svg>
            </button>
            <button class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" /></svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" /></svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z" /></svg>
            </button>
          </div>
        </section>

        <section className='' id="messages__container">

          <div id="messages">
            <div class="message__wrapper">
              <div class="message__body__bot">
                <strong class="message__author__bot">🤖 Mumble Bot</strong>
                <p class="message__text__bot">Welcome to the room, Don't be shy, say hello!</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body__bot">
                <strong class="message__author__bot">🤖 Mumble Bot</strong>
                <p class="message__text__bot">Dennis Ivy just entered the room!</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body">
                <strong class="message__author">Dennis Ivy</strong>
                <p class="message__text">Does anyone know hen he will be back?</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body__bot">
                <strong class="message__author__bot">🤖 Mumble Bot</strong>
                <p class="message__text__bot">Sulamita  just entered the room!</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body__bot">
                <strong class="message__author__bot">🤖 Mumble Bot</strong>
                <p class="message__text__bot">Shahriar P. Shuvo  just entered the room!</p>
              </div>
            </div>

            <div class="message__wrapper">

              <div class="message__body">
                <strong class="message__author">Sulamita</strong>
                <p class="message__text"> Great stream!</p>
              </div>
            </div>

            <div class="message__wrapper">

              <div class="message__body">
                <strong class="message__author">Dennis Ivy</strong>
                <p class="message__text"> Convert RGB color
                  codes to HEX HTML format for use
                  in web design and CSS.</p>
              </div>
            </div>

            <div class="message__wrapper">

              <div class="message__body">
                <strong class="message__author">Shahriar P. Shuvo 👋</strong>
                <p class="message__text">Does
                  anyone know hen he will be
                  back?</p>
              </div>
            </div>
            <div class="message__wrapper">

              <div class="message__body">
                <strong class="message__author">Sulamita</strong>
                <p class="message__text">Great stream!</p>
              </div>
            </div>

            <div class="message__wrapper">

              <div class="message__body">
                <strong class="message__author">Dennis Ivy</strong>
                <p class="message__text">Convert RGB color
                  codes to HEX HTML format for use
                  in web design and CSS.</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body">
                <strong class="message__author">Shahriar P. Shuvo 👋</strong>
                <p class="message__text">Does
                  anyone know hen he will be
                  back?</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body">
                <strong class="message__author">Sulamita</strong>
                <p class="message__text">Great stream!</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body__bot">
                <strong class="message__author__bot">🤖 Mumble Bot</strong>
                <p class="message__text__bot">👋 Sulamita  has left the room</p>
              </div>
            </div>

            <div class="message__wrapper">

              <div class="message__body">
                <strong class="message__author">Dennis Ivy</strong>
                <p class="message__text">Convert RGB color
                  codes to HEX HTML format for use
                  in web design and CSS.</p>
              </div>
            </div>

            <div class="message__wrapper">
              <div class="message__body">
                <strong class="message__author">Shahriar P. Shuvo 👋</strong>
                <p class="message__text">Does
                  anyone know hen he will be
                  back?</p>
              </div>
            </div>
          </div>

          <form id="message__form">
            <input type="text" name="message" placeholder="Send a message...." />
          </form>

        </section>
      </div>
    </main>
  );
};

export default Room;
