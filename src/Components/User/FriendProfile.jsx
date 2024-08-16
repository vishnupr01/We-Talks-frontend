import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getFriendProfile } from "../../api/userFunctions";
import toast from 'react-hot-toast';
import { newFriendRequest } from "../../api/notification";
import { fetchAllFriends, unblockUser, unFriend, userBlock } from "../../api/user";
import { getUserMessages } from "../../api/messages";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { faBan, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const FriendProfile = () => {
  const location = useLocation();
  const { userId } = location.state;
  const [loading, setLoading] = useState(true);
  const [friendProfile, setFriendProfile] = useState({});
  const [friends, setFriends] = useState([]);
  const [count, setCount] = useState(0)
  const [removedUser, setRemoveduser] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState([])
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.authSlice.user);
  console.log("state id", id);

  const blockUser = async (blockId) => {
    try {
      const response = await userBlock(blockId)
      if (response.data.status === "success") {
        setRemoveduser(prev => !prev); // Toggle state to trigger rerender

      }

      console.log("blocked user", response);


    } catch (error) {
      throw error
    }
  }
  const unBlockFriend = async (blockId) => {
    try {
      const response = await unblockUser(blockId)
      if (response.data.status === "success") {
        setRemoveduser(prev => !prev); // Toggle state to trigger rerender

      }

      console.log("blocked user", response);


    } catch (error) {
      throw error
    }
  }
  const removeFriend = async (receiverId) => {
    try {
      const response = await unFriend(receiverId)
      console.log("unfriend", response);
      if (response.data.status === "success") {
        setRemoveduser(prev => !prev); // Toggle state to trigger rerender
        toast.success("Removed");
      }


    } catch (error) {
      throw error
    }
  }
  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await newFriendRequest(receiverId);
      if (response.data.data === "Friend request already exists") {
        toast("Request already sent");
        return;
      }

      if (response.data.status === "success") {
        toast.success("Friend request sent");
      }

    } catch (error) {
      toast.error("Sending request failed");
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is not provided.");
        setLoading(false);
        return;
      }

      try {
        const profile = await getFriendProfile(userId);
        const currentUserFriendsResponse = await fetchAllFriends();
        console.log("my friendData", profile);
        // Extract friend IDs from the currentUserFriendsResponse
        const currentUserFriendsIds = currentUserFriendsResponse.data.data.map(friend => friend._id);
        setBlockedUsers(profile.data.data.blockedUsers)
        setFriends(currentUserFriendsIds);
        setFriendProfile(profile.data.data);
      } catch (error) {
        console.error("Error fetching friend profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, removedUser]);

  const isFriend = (checkId) => {
    return friends?.includes(checkId);
  };
  console.log("jokerrr", blockedUsers);
  const isBlocked = blockedUsers?.some(user => user?.blockedId === id && user?.status === "blocker");
  const checkBlocker = blockedUsers?.some(user => user?.blockedId === id && user?.status === "target" || user?.status === "blocker");

  console.log("checkbloc", isBlocked, id);

  const handleNavigate = async (receiverId) => {
    try {
      const response = await getUserMessages(receiverId);
      if (response.data.status === 'success') {
        navigate('/home/messages');
        return;
      }
      toast.error('Server error');
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!friendProfile || !friendProfile.posts) return <div>No posts available.</div>;
  console.log("my friends", blockedUsers);
  console.log("checking blocked or not", isBlocked);

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full max-w-4xl p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-pink-600 overflow-hidden">
            <img
              src={friendProfile.profileImg}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{friendProfile.userName}</h1>
            <p>{friendProfile.name}</p>
            <p className="whitespace-pre-wrap">{friendProfile.bio}</p>
          </div>
        </div>
        <div className="flex space-x-2">

          {!isFriend(friendProfile._id) && <button onClick={() => sendFriendRequest(friendProfile._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Add Friend</button>}
          {isFriend(friendProfile._id) && !checkBlocker && <button onClick={() => handleNavigate(friendProfile._id)} className="bg-gray-700 text-white px-4 py-2 rounded">Message</button>}

          <Menu as="span" className="relative ml-2 mt-2 ">
            <Menu.Button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <EllipsisVerticalIcon className="w-6 h-6" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-2">
                {isFriend(friendProfile._id) &&
                  <Menu.Item>

                    {({ active }) => (

                      <button onClick={() => removeFriend(friendProfile._id)}
                        className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      >
                        <FontAwesomeIcon icon={faUser} className="text-lg mt-2" />
                        <span className="pl-2">UnFriend</span>
                      </button>

                    )}
                  </Menu.Item>
                }
                {isBlocked &&
                  <Menu.Item>

                    {({ active }) => (

                      <button onClick={() => unBlockFriend(friendProfile._id)}
                        className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      >
                        <FontAwesomeIcon icon={faBan} className="text-lg mt-2" />
                        <span className="pl-2">UnBlock</span>
                      </button>

                    )}
                  </Menu.Item>}
                {!isBlocked &&
                  <Menu.Item>

                    {({ active }) => (

                      <button onClick={() => blockUser(friendProfile._id)}
                        className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      >
                        <FontAwesomeIcon icon={faBan} className="text-lg mt-2" />
                        <span className="pl-2">Block</span>
                      </button>

                    )}
                  </Menu.Item>}

              </div>
            </Menu.Items>
          </Menu>

        </div>
      </div>

      {/* Stats Section */}
      {!checkBlocker &&
        <div className="flex space-x-4 align-middle font-semibold">
          <div className="flex align-middle">
            <p className="text-lg font-semibold mt-1">{friendProfile.posts.length}</p>
            <p className="text-xl ml-4">posts</p>
          </div>
          <div className="flex pl-12 align-middle font-semibold">
            <p className="text-lg font-semibold mr-2">979</p>
            <p className="text-xl">friends</p>
          </div>
        </div>
      }
      {!checkBlocker &&
        <Link className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
          <span className="cursor-pointer font-bold">Posts</span>
        </Link>
      }

      {!checkBlocker && <Outlet />}
      {checkBlocker && <p className="mt-5">posts unvailable</p>}
    </div>
  );
};

export default FriendProfile;
