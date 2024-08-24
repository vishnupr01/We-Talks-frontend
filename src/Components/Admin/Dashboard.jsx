import React, { useEffect, useState } from 'react';
import StatisticsGraph from './Graph';
import { totaUsersAndPosts } from '../../api/admin';

const SocialMediaDashboard = () => {
  const [users, setUsers] = useState()
  const [posts, setPosts] = useState()
  const fetchData = async () => {
    try {
      const response = await totaUsersAndPosts()
      setUsers(response.data.data.users)
      setPosts(response.data.data.posts)
    } catch (error) {
      console.log(error);
      throw error

    }

  }
  useEffect(() => {
    fetchData()
  }, [])
  console.log("posts:",posts,"users:",users);
  
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome back, <span className='text-green-400'>Admin</span>👋</h1>
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Export</button> */}
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-80 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-2xl font-semibold">{users}</p>
          {/* <p className="text-gray-400">in the last 7 days</p> */}
        </div>
        <div className="bg-gray-800 p-4 rounded-lg  shadow">
          <h2 className="text-xl font-bold">Total Posts</h2>
          <p className="text-2xl font-semibold">{posts}</p>
          {/* <p className="text-gray-400">posted this month</p> */}
        </div>
    
      </div>

      <StatisticsGraph />

      {/* Posts Overview */}

    </div>
  );
};

export default SocialMediaDashboard;
