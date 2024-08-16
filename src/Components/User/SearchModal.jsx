// src/components/SearchModal.js
import React, { useEffect, useState } from 'react';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SearchUser } from '../../api/userFunctions';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id, user_id } = useSelector((state) => state.authSlice.user);
  useEffect(() => {
    if (query.length >= 2) {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          const response = await SearchUser(query)
          console.log(response);
          setSearchResults(response.data.data)
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false)
        }

      }
      fetchData()
    }

  }, [query])
  const handleChange = (e) => {
    setQuery(e.target.value)
  }
  const handleFriendProfile = (userId) => {
    console.log("HH", userId);
    onClose()
    if (id === userId) {
      navigate('/profile')
      return
    }
    navigate(`/home/friendProfile`, { state: { userId } })
  };
  console.log(searchResults);
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4 mx-auto bg-white rounded-md shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Search</h2>
          <button onClick={onClose}>
            <faTimes className="text-black" />
          </button>
        </div>
        <div className="pt-4">
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 text-gray-700 border bg-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Search"
              value={query}
              onChange={handleChange}
            />
            <faSearch className="absolute top-3 right-3 text-gray-500" />
          </div>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">Recent</h3>
          <ul className="space-y-2">
            {searchResults.map((user, index) => (
              <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <button onClick={() => handleFriendProfile(user._id)}>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">@{user.userName}</p>
                    </button>
                  </div>
                </div>
                <button className="text-gray-500">
                  <faTimes />
                </button>
              </li>
            ))}
          </ul>
          <button onClick={onClose} className="block w-full mt-4 text-sm font-semibold text-center text-blue-600">
            Clear all
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SearchModal;
