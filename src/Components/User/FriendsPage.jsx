import React, { useEffect, useState } from 'react';
import { fetchAllFriends, searchFriend } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash'; // Import debounce from lodash

const FriendPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query
  const navigate = useNavigate();

  const fetchFriends = async (query = '') => {
    try {
      setLoading(true);
      const response = query ? await searchFriend(query) : await fetchAllFriends();
      setFriends(response.data.data);
      console.log("my friends", response);
    } catch (error) {
      console.error("Failed to fetch friends", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendProfile = (userId) => {
    navigate(`/home/friendProfile`, { state: { userId } });
  };

  useEffect(() => {
    fetchFriends(); // Initial fetch of all friends
  }, []);

  // Debounced version of fetchFriends to avoid frequent API calls
  const debouncedFetchFriends = debounce((query) => {
    fetchFriends(query);
  }, 300);

  useEffect(() => {
    debouncedFetchFriends(searchQuery);
  }, [searchQuery]);

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All friends</h1>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search Friends"
          className="w-full p-2 border bg-white rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state on input change
        />
      </div>
      {friends.length === 0 && <p className="mb-4 text-gray-600">No friends yet..</p>}
      {friends.length === 1 && <p className="mb-4 text-gray-600">{friends.length} friend</p>}
      {friends.length > 1 && <p className="mb-4 text-gray-600">{friends.length} friends</p>}
      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            className="flex items-center p-2 mb-2 border rounded-md hover:bg-gray-100"
          >
            <img
              src={friend.profileImg}
              alt={friend.name}
              className="w-10 h-10 rounded-full object-cover mr-4"
            />
            <div className="flex-grow">
              <p className="font-semibold">{friend.name}</p>
              <p className="text-sm text-gray-600">{friend.mutualFriends} mutual friends</p>
            </div>
            <button 
              className="p-2 text-gray-600"
              onClick={() => handleFriendProfile(friend._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 12h12M6 12l6 6m-6-6l6-6"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendPage;
