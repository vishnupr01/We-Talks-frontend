import React, { useEffect, useState } from 'react';
import './Spinner.css';
import { getUserProfile } from '../../api/userFunctions';
import showBlockedAlert from '../../popups/alert';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
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
    fetchData();
  }, []);
const postDetails=(postId)=>{
navigate(`/home/postDetails`,{state:{postId}})
}

  console.log("children data", userData);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return(
  <div className="mt-2 flex justify-center">
        <div className="max-w-3xl mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
            
            {userData.posts.map((post) => (
              <button onClick={()=>postDetails(post._id)}>
              <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
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


export default Posts
