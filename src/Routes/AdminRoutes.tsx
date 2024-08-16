import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminPrivate from '../protection/AdminPrivate';
import AdminPlogin from '../protection/AdminPlogin';
import Users from '../Components/Admin/Users';
import UsersProfile from '../Components/Admin/UserProfile';

const AdminRoutes = () => {
  return (
    <Router>
      <Routes>
       <Route path='/adminLogin' element={<AdminPlogin/>}>

       </Route>
       <Route path='/adminHome' element={<AdminPrivate/>}>
       <Route path='/adminHome/Users' element={<Users/>}/>
       <Route path='/adminHome/usersprofile' element={<UsersProfile/>}/>
       </Route>
      </Routes>
    </Router>
  );
}

export default AdminRoutes