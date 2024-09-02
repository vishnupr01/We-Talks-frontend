import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminPrivate from '../protection/AdminPrivate';
import AdminPlogin from '../protection/AdminPlogin';
import Users from '../Components/Admin/Users';
import UsersProfile from '../Components/Admin/UserProfile';
import SocialMediaDashboard from '../Components/Admin/Dashboard';
import ReportManagement from '../Components/Admin/ReportManagement';
import PostManagement from '../Components/Admin/PostManagement';
import BlockedPosts from '../Components/Admin/BlockedPosts';

const AdminRoutes = () => {
  return (
   
      <Routes>
       <Route path='/adminLogin' element={<AdminPlogin/>}/>

       <Route path='/adminHome' element={<AdminPrivate/>}>
       <Route path='/adminHome/Users' element={<Users/>}/>
       <Route path='/adminHome/usersprofile' element={<UsersProfile/>}/>
       <Route path='/adminHome/dashboard' element={<SocialMediaDashboard/>}/>
       <Route path='/adminHome/postManagement' element={<PostManagement/>}/>   
       <Route path='/adminHome/reports' element={<ReportManagement/>}/>
       <Route path='/adminHome/blockedPosts' element={<BlockedPosts/>}/>
       </Route>
      </Routes>
  
  );
}

export default AdminRoutes