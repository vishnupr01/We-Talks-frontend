import React from 'react';
import Home from '../../Components/Admin/Home';
import { Outlet } from 'react-router-dom';
import Users from '../../Components/Admin/Users';

const Mainpage = () => {
  return (
    <div className='flex  h-screen '>
     
      <Home />
      <div className="bg-white flex-1 ml-72"> 
        <h1></h1>{/* Adjusted class name and added flex-1 for flex-grow */}
        {/* <Users /> */}
        <Outlet />
      </div>
    </div>
  );
}

export default Mainpage;
