import { faEdit, faImage, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../api/userFunctions';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Posts from './Posts';
import showBlockedAlert from '../../popups/alert';

const ProfileComponent = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    console.log("heyyy useEffect working");
    const fetchData = async () => {
      try {
        console.log("function working");
        const response = await getUserProfile();
        console.log(response.data.data);
        setUserData(response.data.data);
      
      } catch (error) {
        if (error) {
          if (error.response.data.message === 'User is blocked') {
            showBlockedAlert()
            navigate('/login')
          }
        }
        console.log("error response", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("seted data", userData);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white text-black p-6 min-h-screen">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={userData.profileImg} // Replace with the path to the profile picture
            alt="Profile"
            className="w-20 h-18 rounded-full"
          />
        </div>
        <div>
          <div className="flex cu">
            <h2 className="text-2xl mt-2 font-semibold">{userData.userName}</h2>
            <Link to='/home/editProfile' className="flex items-center  hover:bg-blue-100  rounded">
            <FontAwesomeIcon icon={faEdit} size="lg" className="mt-2 ml-4 cursor-pointer" />
            </Link>
          </div>
          <div className="flex space-x-4 mt-4 align-middle">
            <div className="mt-2 bg">
              <FontAwesomeIcon icon={faImage} size="lg" className="ml-2" />
              <span className="ml-4 text-xl">{userData.posts.length} posts</span>
            </div>
            <div className="ml-8 mt-3">
              <Link to='friendsList' className="flex items-center  hover:bg-blue-100  rounded">
                <FontAwesomeIcon icon={faUsers} size="lg" className="ml-2" />
                <span  className="ml-2">Friends</span>
                </Link> 
              
            </div>
          </div>
          <div className="mt-2">
            <p className='font-semibold'>{userData.name}</p>
            <p className='whitespace-pre-wrap'>{userData.bio}</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 border-b justify-center border-gray-700">
      <Link to='' className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
        <span className="cursor-pointer font-bold">Posts</span>
        </Link>
        <Link to='/home/profile/saved'  className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
        
        <span className="cursor-pointer font-bold">Saved</span>
        </Link>
      </div>
    <Outlet/>
    
    </div> 
  );
};

export default ProfileComponent;
