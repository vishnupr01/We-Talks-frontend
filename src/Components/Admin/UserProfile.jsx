import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { getFriendProfile, getUserProfile } from "../../api/userFunctions";
import { blockUser, deleteAdminPost, getUserAdmin, UnBlockUser } from "../../api/admin";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const UsersProfile = () => {
  const location = useLocation();
  const {userId}=location.state
  const [count, setCount] = useState(0);
  const [loading,setLoading]=useState()
  const [friendProfile,setFriendProfile]=useState({})
  const navigate=useNavigate()
  const handleDelete = async (postId) => {
    try {
      const response =await deleteAdminPost(postId)
      console.log(response)
      if(response.data.status==="success"){
        navigate('/adminHome/usersprofile',{ state: { userId } })
        toast.success("post deleted")
      }else{
        toast.error("post deletion failed")
      }

    } catch (error) {
      if(error){
        toast.error("post deletion failed")
      }
     throw error
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is not provided."); 
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserAdmin(userId);
        setFriendProfile(profile.data.data);
      } catch (error) {
        console.error("Error fetching friend profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId,count,handleDelete]);
  const handleBlock = async (email, event) => {
    event.stopPropagation();
    try {
      console.log("Calling backend to block user:", email);
      const response = await blockUser(email);
      console.log("Issue found", response);
      setCount(count + 1);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnBlock = async (email, event) => {
    event.stopPropagation(); 
    try {
      console.log("Calling backend to unblock user:", email);
      await UnBlockUser(email);
      setCount(count + 1);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };
 

  if (loading) return <div>Loading...</div>;

  if (!friendProfile || !friendProfile.posts) return <div>No posts available.</div>;
   console.log(friendProfile);
  return (
    <div className="bg-zinc-800 text-white pr-52  min-h-screen flex flex-col items-center">
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
        {friendProfile.isBlocked ? (
                        <button onClick={(event) => handleUnBlock(friendProfile.email, event)} className="bg-green-600 text-white px-4 py-2 rounded">UnBlock</button>
                      ) : (
                        <button onClick={(event) => handleBlock(friendProfile.email, event)} className="bg-red-600 text-white px-4 py-2 rounded">Block</button>
                      )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex space-x-4  align-middle font-semibold">
        <div className="flex align-middle ">
          <p className="text-lg font-semibold mt-1">{friendProfile.posts.length}</p>
          <p className="text-xl ml-4">posts</p>
        </div>
        <div className="flex pl-12 align-middle font-semibold">
          <p className="text-lg font-semibold mr-2 ">979</p>
          <p className="text-xl ">friends</p>
        </div>

      </div>


      <Link className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
        <span className="cursor-pointer font-bold">Posts</span>
      </Link>
      <div className="mt-2 flex justify-center">
      <div className="max-w-3xl mt-4">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
          
          {friendProfile.posts
          .filter((post=>!post.blocked))
          .map((post) => (
             <button onClick={()=>postDetails(post._id)}>
            <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Menu as="div" className="relative ml-56">
                  <Menu.Button className="text-black hover:text-gray-700 focus:outline-none">
                    <EllipsisVerticalIcon className="w-6 h-6" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2">
                      
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={()=>handleDelete(post._id)} 
                            className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}
                          >
                            Delete Post
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}
                          >
                            Report
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              <img src={post.images[0]} alt="Post" className="w-full h-auto object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.description}</p>
              </div>
            </div>
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UsersProfile
