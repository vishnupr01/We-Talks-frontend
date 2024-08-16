import React, { useEffect, useState } from 'react';
import './Spinner.css';
import { getUserProfile } from '../../api/userFunctions';
import showBlockedAlert from '../../popups/alert';
import { useNavigate } from 'react-router-dom';
import {  savedPosts, savingPost } from '../../api/post';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import toast, { Toaster } from 'react-hot-toast';

const SavedPosts = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  const savePost=async(postId)=>{
    try {
      const response =await savingPost(postId)
      console.log("response in savedPosts",response);
      
      if(response.data.status==="success"){
        fetchData()
        toast.success("post unsaved")
      }
    } catch (error) {
      toast.error("failed")
      throw error
    }
  }
  console.log("heyyy useEffect working");
  const fetchData = async () => {
    try {
      console.log("function working");
      const response = await savedPosts();
      console.log("savedPostssss",response);
      
      console.log(response.data.data);
      setUserData(response.data.data);
    } catch (error) {
      console.log("error response", error);
      if (error) {
        console.log("hiii",error);
        
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
  useEffect(() => {
    fetchData();
  }, []);


  console.log("children data", userData);

  if (loading) {
    return <div>Loading...</div>;
  }

  return(
  <div className="mt-2 flex justify-center">
        <div className="max-w-3xl mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
            
            {userData.map((post) => (
              <button >
              <div key={post.id} className="bg-gray-200 shadow-md rounded-lg overflow-hidden">
              <Menu as="div" className="relative ml-56">
                  <Menu.Button className="text-black hover:text-gray-700 focus:outline-none">
                    <EllipsisVerticalIcon className="w-6 h-6" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2">
                      
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={()=>savePost(post._id)}
                            className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}
                          >
                           Remove
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
  )
};


export default SavedPosts
