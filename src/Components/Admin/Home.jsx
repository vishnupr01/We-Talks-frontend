import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faChartBar, faComments, faSignOutAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Users from './Users';
import { Routes, Route, Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Navbar */}
      
    

      
        {/* Sidebar */}
        <div className="bg-zinc-800 h-screen flex fixed  text-white  w-1/5 p-4">
          <nav className="space-y-4">
            <h1 className='text-2xl'>Admin Page</h1>
            <Link to="/adminHome/dashboard" className="flex items-center space-x-2 hover:bg-zinc-700 p-2 rounded">
              <FontAwesomeIcon icon={faChartLine} className="text-xl" />
              <span>Dashboard</span>
            </Link>
            <Link to='/adminHome/Users' className="flex items-center space-x-2 hover:bg-zinc-700 p-2 rounded">
              <FontAwesomeIcon icon={faUsers} className="text-xl" />
              <span>Users</span>
            </Link>
            <Link to="/adminHome/reports" className="flex items-center space-x-2 hover:bg-zinc-700 p-2 rounded">
              <FontAwesomeIcon icon={faChartBar} className="text-xl" />
              <span>Reports</span>
            </Link>
            <Link to="/adminHome/blockedPosts" className="flex items-center space-x-2 hover:bg-zinc-700 p-2 rounded">
              <FontAwesomeIcon icon={faTrash} className="text-xl" />
              <span>Trash</span>
            </Link>
          </nav>
          <div className="mt-auto">
            <Link to="/logout" className="flex items-center space-x-2 hover:bg-zinc-700 p-2 rounded">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
              <span>Log out</span>
            </Link>
          </div>
        </div>
        

     
        
     
    </>
  );
}

export default Home;
