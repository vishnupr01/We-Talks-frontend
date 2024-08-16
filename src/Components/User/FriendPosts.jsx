import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFriendProfile } from '../../api/userFunctions';

const FriendPosts = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [friendProfile, setFriendProfile] = useState(null);
  const userId = location.state?.userId;
  const navigate=useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is not provided.");
        setLoading(false);
        return;
      }

      try {
        const profile = await getFriendProfile(userId);
        setFriendProfile(profile.data.data);
      } catch (error) {
        console.error("Error fetching friend profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  const postDetails=(postId)=>{
    navigate(`/home/postDetails`,{state:{postId}})
    }

  if (loading) return <div>Loading...</div>;

  if (!friendProfile || !friendProfile.posts) return <div>No posts available.</div>;

  return (
    <div className="mt-2 flex justify-center">
      <div className="max-w-3xl mt-4">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
          
          {friendProfile.posts.map((post) => (
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
  );
};

export default FriendPosts;
