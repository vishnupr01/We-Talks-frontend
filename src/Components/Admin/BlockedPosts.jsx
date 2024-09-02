import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../api/userFunctions';
import showBlockedAlert from '../../popups/alert';
import { useNavigate } from 'react-router-dom';
import { getBlockedPosts, unblockPost } from '../../api/admin';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast'

const BlockedPosts = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    console.log("heyyy useEffect working");

    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      console.log("function working");
      const response = await getBlockedPosts();
      console.log(response.data.data);
      setUserData(response.data.data);
    } catch (error) {
      console.log("error response", error);
      if (error) {
        if (error.response.data.message === 'User is blocked') {
          showBlockedAlert()
          navigate('/login')
        }
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const unBlockPosts = async (postId) => {
    try {
      const response = await unblockPost(postId)
      await fetchData()
      if(response.data.data===true){
        toast.success("post unblocked")
      }
      console.log("response for blocked posts", response);


      // navigate(`/adminHome/blockedPosts`)
    } catch (error) {

    }

  }

  console.log("children data", userData);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='flex ml-10 mt-4'>
        <FontAwesomeIcon icon={faBan} className="text-xl mt-2 text-red-500" />
        <h1 className='text-2xl text-black font-bold ml-4' >Blocked Posts</h1>
      </div>
      {userData.posts.length===0&&<p className=' text-xl ml-16 mt-10 text-black'> Blocked posts are empty</p>}
      <div className="mt-2 flex justify-center">

        <div className="max-w-3xl mt-14 ">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
          
            {userData.posts.map((post) => (
            
              <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className='ml-56'>
                  <Menu as="span" className="relative">
                    <Menu.Button
                      as="div" // Changed from button to div to avoid default button behavior
                      className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer" // Add cursor-pointer for better UX
                    >
                      <EllipsisVerticalIcon className="w-6 h-6" />
                    </Menu.Button>
                    <Menu.Items
                      className="absolute   z-10 right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-2">

                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={() => unBlockPosts(post._id)}
                              className={`block w-full px-4 py-2 text-left text-sm cursor-pointer ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                              <FontAwesomeIcon icon={faBan} className="text-xl" />
                              <span className="pl-2">UnBlock</span>
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
                <img src={post.images[0]} alt="Post" className="w-full h-auto object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black">{post.title}</h3>
                  <p className="text-gray-600">{post.description}</p>
                </div>

              </div>

            ))}
          </div>
        </div>
      </div>
    </>
  )
};


export default BlockedPosts
