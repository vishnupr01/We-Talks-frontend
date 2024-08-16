import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Adminlogin, Adminlogout, clearAdmin, setAdmin } from '../redux/slices/admin';
import { isAdmin } from '../api/admin';
import Mainpage from '../pages/Admin/Mainpage';

const AdminPrivate = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const AdminInfo = useSelector((state) => state.adminSlice.adminInfo);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await isAdmin();
        console.log("problem",response);
        if (response.data.message === 'Admin is authenticated') {
          const { email, name } = response.data.admin;
          console.log('authenticated');
          dispatch(Adminlogin());
          dispatch(setAdmin({ email, name }));
        } else {
          console.log('not authenticated');
          dispatch(Adminlogout());
          dispatch(clearAdmin());
        }
      } catch (error) {
        console.log('Error checking admin authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [dispatch]);

  console.log('AdminInfo:', AdminInfo);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (AdminInfo) {
    return <Mainpage/>
  } else {
    return <Navigate to="/adminLogin" replace />;
  }
};

export default AdminPrivate;
