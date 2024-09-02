import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import dotenv from 'dotenv'
import { getToken, spaceRequest } from '../../api/room';
import { available } from '../../redux/slices/form';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../../context/SocketContext';
import { fetchAllFriends } from '../../api/user';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleSpinner from '../skeletons/CircleSpinner';
import toast from 'react-hot-toast';

// dotenv.config()
const APP_ID = "83aa3fc60aad468c9daa2d90ee10f8b4" // Replace with your Agora App ID


const Room = () => {
  const location = useLocation()
  const videoRefs = useRef({})
  const [showSandTimer, setShowSandTimer] = useState(false);
  const [loading, setLoading] = useState(false)
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const friendsContainerRef = useRef(null);
  const [sharingScreen, setSharingScreen] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState([])
  const { roomId, description, role, roomName, tokens } = location.state || {};
  const [activeMemberContainer, setActiveMemberContainer] = useState(true)
  const [activeChatContainer, setActiveChatContainer] = useState(true)
  const [userIdInDisplayFrame, setUserIdInDisplayFrame] = useState('');
  const [count, setCount] = useState(0)
  const memberContainerRef = useRef(null)
  const chatContainerRef = useRef(null)
  const [micActivate, setMicActivate] = useState(false)
  const [cameraActivate, setCamerActivate] = useState(false)
  const [screenActivate, setScreenActivate] = useState(false)
  const [userName, setUserName] = useState()
  const [userUid, setUid] = useState(null)
  const localTracksRef = useRef(null)
  const [expandedFrameId, setExpandedFrameId] = useState(null);
  const streamsContainerRef = useRef(null);
  const displayFrameRef = useRef(null);
  const rtcClientRef = useRef(null)
  const { id } = useSelector((state) => state.authSlice.user);
  const { onlineUsers } = useSocketContext()
  const { socket } = useSocketContext();
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate()
  console.log("my roomid", roomId);
  console.log("role", role);
  console.log("roomname", roomName);
  const handeleLeave = () => {
    navigate('/home')
    return
  }
  console.log("token", tokens);
  const handlePlusClick = async (userId) => {
    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        [userId]: !prevState[userId], // Toggle loading state for the clicked friend
      }));
      // setShowSandTimer(true);
      setTimeout(() => {
        setLoadingStates((prevState) => ({
          ...prevState,
          [userId]: !prevState[userId], // Toggle loading state for the clicked friend
        }));
      }, 3000);
      await spaceRequest(roomId, tokens, userId)




    } catch (error) {
      console.log(error);

    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [userId]: !prevState[userId], // Toggle loading state for the clicked friend
      }));

    }
    // Hide sand timer after 3 seconds
  };

  useEffect(() => {

    if (memberContainerRef.current) {
      memberContainerRef.current.style.display = activeMemberContainer ? 'block' : 'none';

    }
  }, [activeMemberContainer])
  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.style.display = activeChatContainer ? 'block' : 'none'

  //   }
  // }, [activeChatContainer])
  const toggleMemberContainer = () => {
    setActiveMemberContainer(!activeMemberContainer);
  };

  // const toggleChatContainer = () => {
  //   setActiveChatContainer(!activeChatContainer);
  // };

  // useEffect(() => {

  //   const messagesContainer = document.getElementById('messages');
  //   messagesContainer.scrollTop = messagesContainer.scrollHeight;
  // }, []);
  useEffect(() => {
    const handleInvitation = (message) => {
      console.log("coming event");

      toast.error(message)
    }
    if (socket) {
      socket.on("declined", handleInvitation);
    }


    return () => {
      if (socket) {
        socket.off("declined", handleInvitation);
      }
    };

  }, [socket])



  useEffect(() => {
    let token = null
    if (role === "publisher") {
      token = tokens
    } else {
      token = roomName
    }
    token = "007eJxTYHDdt6Eq2TrsubvoxUJmZ16Nb/tib85fU/TFZ+kPqT8b3KsVGCyMExON05LNDBITU0zMLJItUxITjVIsDVJTDQ3SLJJMLrdeTWsIZGS4fno7AyMUgvisDIYGxsYmDAwA0cEheQ=="

    console.log("token gottt", token);

    const initializeRoom = async () => {

      let uid = sessionStorage.getItem('uid');
      setUid(uid)
      if (!uid) {
        uid = id;
        console.log("uidddd", uid);
        setUid(uid)
        sessionStorage.setItem('uid', uid);
      }
      try {

        // const token = "007eJxTYMjmXJEsGcu1/rznMpYoBbmrPPYvjj6fq735RyjTZMuvvyIVGCyMExON05LNDBITU0zMLJItUxITjVIsDVJTDQ3SLJJMOL0vpjUEMjJs5D3CysgAgSA+C4OhkbEJAwMA8Fsd2g=="
        rtcClientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        await rtcClientRef.current.join(APP_ID, roomId, token, uid);
        rtcClientRef.current.on('user-published', handleUserPublished);
        rtcClientRef.current.on('user-left', handleUserLeft);
        await joinStream();
      } catch (error) {
        console.log("error in join room init", error);
      }

    };

    const joinStream = async () => {
      try {
        console.log("second user");

        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = localTracks;
        const tracks = localTracksRef.current;
        const uid = sessionStorage.getItem('uid');

        localTracks[1].play(`user-${uid}`);
        console.log("localtracks available", localTracks);

        await rtcClientRef.current.publish(localTracks);
      } catch (error) {
        console.log("error in publish", error);
      } finally {
        rtcClientRef.current.on('user-published', handleUserPublished);
        rtcClientRef.current.on('user-left', handleUserLeft);
      }
    };

    const handleUserPublished = async (user, mediaType) => {
      console.log("user on skype", user);
      console.log("check media type", mediaType);

      await rtcClientRef.current.subscribe(user, mediaType);

      setRemoteUsers((prevUsers) => {
        const userExists = prevUsers.some((existingUser) => existingUser.uid === user.uid);

        if (!userExists) {
          return [...prevUsers, user];
        }

        return prevUsers;
      });

      if (mediaType === 'video') {
        user.videoTrack.play(`user-${user.uid}`);
      }

      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    };

    initializeRoom();

    const handleUserLeft = (user) => {
      setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
      const displayFrame = document.getElementById('stream__box');
      const nestedDiv = displayFrameRef.current.querySelector('div');
      if (nestedDiv.id === `user-container-${user.uid}`) {
        document.getElementById(nestedDiv.id).remove();
        displayFrame.style.display = "none";
        setExpandedFrameId(null);
        let videoFrames = document.getElementsByClassName('video__container');
        Array.from(videoFrames).forEach((frame) => {
          frame.style.height = '300px';
          frame.style.width = '300px';
        });
      } else {
        document.getElementById(`user-container-${user.uid}`).remove();
      }
    };

    return () => {
      if (rtcClientRef.current) {
        rtcClientRef.current.off('user-published', handleUserPublished);
        rtcClientRef.current.off('user-left', handleUserLeft);
        rtcClientRef.current.leave();
      }
    };
  }, [roomId]);


  const expandVideoFrame = (id) => {


    const displayFrame = document.getElementById('stream__box');
    const videoFrames = document.getElementsByClassName('video__container');

    if (expandedFrameId) {
      // Revert the currently expanded frame to its original state
      const currentFrame = document.getElementById(expandedFrameId);
      if (currentFrame) {
        currentFrame.style.height = '100px';
        currentFrame.style.width = '100px';
        const streamsContainer = document.getElementById('streams__container');
        if (streamsContainer && !streamsContainer.contains(currentFrame)) {
          streamsContainer.appendChild(currentFrame);
        }
      }
    }



    setExpandedFrameId(id);

    const newFrame = document.getElementById(id);
    if (newFrame) {
      displayFrame.style.display = 'block';
      displayFrame.appendChild(newFrame);
      newFrame.style.height = 'auto'; // Adjust to the desired expanded size
      newFrame.style.width = 'auto'; // Adjust to the desired expanded size
    }




    // Reset the size of all other frames
    Array.from(videoFrames).forEach((frame) => {
      if (frame.id !== id) {
        frame.style.height = '100px';
        frame.style.width = '100px';
      }
    });


    console.log("expandedFrameid", expandedFrameId);
  };

  const hideDisplayFrame = () => {
    console.log("hideDisplayFrame triggered");
    const displayFrame = document.getElementById('stream__box');

    if (displayFrame) {
      displayFrame.style.display = 'none'
      setCount(prevCount => prevCount + 1)
      setExpandedFrameId(null);

      const child = displayFrame.children[0];
      if (child) {
        document.getElementById('streams__container').appendChild(child);
      }

    }
  };
  useEffect(() => {
    const displayFrame = displayFrameRef.current;

    if (displayFrame) {
      displayFrame.addEventListener('click', hideDisplayFrame);

      return () => {
        displayFrame.removeEventListener('click', hideDisplayFrame);
      };
    }
  }, []);

  const toggleCamera = async (e) => {
    const tracks = localTracksRef.current
    try {

      console.log("this is my tracks", tracks);

      if (tracks[1].muted) {
        await tracks[1].setMuted(false)
        setCamerActivate(false)
      } else {
        await tracks[1].setMuted(true)
        setCamerActivate(true)
      }

    } catch (error) {
      throw error
    }

  }
  const toggleMic = async (e) => {

    try {
      const tracks = localTracksRef.current
      if (tracks[0].muted) {
        await tracks[0].setMuted(false)
        setMicActivate(false)
      } else {
        await tracks[0].setMuted(true)
        setMicActivate(true)
      }
    } catch (error) {
      throw error
    }

  }
  const toggleScreen = async () => {
    console.log("sharingScreen", sharingScreen);

    if (!sharingScreen) {
      try {
        const tracks = localTracksRef.current;
        if (tracks && tracks[1]) {
          await rtcClientRef.current.unpublish(tracks[1]);
          await tracks[1].stop();
          await tracks[1].close();
        }

        // Create a new screen share track
        const localScreenTracks = await AgoraRTC.createScreenVideoTrack();
        localTracksRef.current = [tracks[0], localScreenTracks]; // Update localTracksRef with the new screen share track

        // Play the screen share track
        const uid = sessionStorage.getItem('uid');
        localScreenTracks.play(`user-${uid}`);
        await rtcClientRef.current.publish(localScreenTracks);
        setSharingScreen(true);
      } catch (error) {
        console.error('Error while starting screen sharing:', error);
        setSharingScreen(false);
      } finally {
        setSharingScreen(true)
      }

    } else {
      try {
        // Stop and close the screen share track
        const screenTrack = localTracksRef.current[1];
        if (screenTrack) {
          await rtcClientRef.current.unpublish(screenTrack);
          await screenTrack.stop();
          await screenTrack.close();
        }
        setSharingScreen(false);
        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = [localTracks[0], localTracks[1]]; // Update localTracksRef with the new video track
        const uid = sessionStorage.getItem('uid');
        localTracks[1].play(`user-${uid}`);
        await rtcClientRef.current.publish(localTracks);

      } catch (error) {
        console.error('Error while stopping screen sharing:', error);
        setSharingScreen(true);
      } finally {
        setSharingScreen(false)
      }
    }
  };

  const toggleFriends = async () => {
    try {
      if (!showFriends) {
        console.log("hello");
        setLoading(true); // Start loading

        const response = await fetchAllFriends();

        if (response && response.data) {
          setFriends(response.data.data);
        } else {
          console.error("Unexpected response format:", response);
        }
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setShowFriends((prev) => !prev);
    }
  };

  // Run filtering logic when `friends` state updates
  useEffect(() => {
    if (friends.length > 0) {
      const onlineFriendsList = friends.filter((friend) =>
        onlineUsers.includes(friend._id)
      );
      setOnlineFriends(onlineFriendsList);
    }
  }, [friends]);

  console.log("my remote users", remoteUsers);
  console.log("remoteUssers", remoteUsers);


  let uid = sessionStorage.getItem('uid');
  return (
    <main class="container fixed mt-16">
      <div className='bg-zinc-800' id="room__container">
        <section
          style={{
            marginTop: expandedFrameId ? '20px' : '29px',
            marginLeft: expandedFrameId ? '35px' : '60px'

          }}
          className='mb-3 mt-7 ' ref={memberContainerRef} id="members__container">

          <div className="flex justify-between items-center  cursor-pointer " onClick={toggleFriends} >
            <p className='ml-4 mt-2 mb-2 text-white'>Friends Online</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-transform text-white mr-5 duration-300 ${showFriends ? 'transform rotate-180' : ''
                }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <hr />
          {loading && <div className='mb-2 mt-2'><CircleSpinner /></div>}
          {!loading && (
            <div
              ref={memberContainerRef}
              className={`overflow-hidden  transition-all duration-300 ease-in-out ${showFriends ? "max-h-96" : "max-h-0"
                }`}
            >
              <ul className="mt-2 space-y-2 pb-4 pt-2 pl-2 pr-2">
                {onlineFriends.length === 0 && <p> No one online</p>}
                {onlineFriends.map((friend) => (
                  <li key={friend._id} className="p-2 bg-black-100 rounded-md text-white flex items-center justify-between">
                    <div className='flex items-center'>
                      {/* Friend's name */}
                      <span>{friend.name}</span>
                    </div>
                    {/* Conditional rendering for the spinner or plus icon */}
                    <div className='flex items-center'>
                      {loadingStates[friend._id] ? (
                        <div className="sand-spinner"></div>
                      ) : (
                        <FontAwesomeIcon onClick={() => handlePlusClick(friend._id)} className="ml-4 cursor-pointer" icon={faPlus} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </section>
        <section className='bg-zinc-800 ' id="stream__container">

          <div
            onClick={() => hideDisplayFrame()}
            ref={displayFrameRef}
            id="stream__box"
            style={{ display: expandedFrameId === null ? 'none' : 'block' }}
          ></div>

          {/* <div id='stream__box'></div>
          {!expandedFrameId&&<div class="bg-[#3f434a] h-[60vh] hidden "></div>}
          {expandedFrameId&&renderExpandedFrame()} */}

          <div id='streams__container' className=''>

            <div
              onClick={() => expandVideoFrame(`user-container-${userUid}`)}
              ref={streamsContainerRef}
              style={{
                height: expandedFrameId ? '100px' : '200px',
                width: expandedFrameId ? '100px' : '300px',
                marginLeft: expandedFrameId ? '0px' : '100px'
              }}
              class="video__container " id={`user-container-${userUid}`}>

              <div class="video-player" id={`user-${userUid}`}></div>
            </div>

            {remoteUsers.length > 0 && remoteUsers.map((user) => (
              <button key={user.uid} onClick={() => expandVideoFrame(`user-container-${user.uid}`)}>
                <div
                  ref={streamsContainerRef}
                  className="video__container"
                  id={`user-container-${user.uid}`}
                  style={{
                    height: expandedFrameId ? '100px' : '200px',
                    width: expandedFrameId ? '100px' : '300px',


                  }}
                >

                  <div className="video-player" id={`user-${user.uid}`}></div>
                </div>
              </button>
            ))}

          </div>
          <div class="stream__actions">
            {cameraActivate && !sharingScreen &&
              <button class='active' onClick={() => toggleCamera()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" /></svg>
              </button>}
            {!cameraActivate && !sharingScreen &&
              <button onClick={() => toggleCamera()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" /></svg>
              </button>}
            {micActivate &&
              <button onClick={() => toggleMic()} id='mic-btn' class="active">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" /></svg>
              </button>}
            {!micActivate &&
              <button onClick={() => toggleMic()} id='mic-btn'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" /></svg>
              </button>}
            {sharingScreen &&
              <button onClick={() => toggleScreen()} id='screen-btn' class='active'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" /></svg>
              </button>}
            {!sharingScreen &&
              <button onClick={() => toggleScreen()} id='screen-btn'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" /></svg>
              </button>}

            <button onClick={()=>handeleLeave()} id='leave-btn'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z" /></svg>
            </button>
          </div>
        </section>

        {/* 

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

        </section> */}
        <section className='bg-zinc-800 h-full' id="messages__container "></section>
      </div>
    </main>
  );
};

export default Room;
