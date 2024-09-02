import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "../pages/User/Home"; // Import Home component
import { isUser } from "../api/user";
import { clearUser, login, logout, setUser } from "../redux/slices/home";
import { useEffect, useState } from "react";
import Login from "../pages/User/Login";
import Signup from "../pages/User/SignUP";

const RegisterPrivate = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.authSlice.userInfo); // Access 'auth' state slice

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await isUser();
        console.log(response)
        if (response.data.message === "user is authenticated") {
          const { email, id, user_id,image_url,userName } = response.data.user;
          dispatch(login());
          dispatch(setUser({ email, id, user_id,image_url,userName }));
        } else {
          dispatch(logout());
          dispatch(clearUser());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Ensure dispatch is a dependency to prevent warnings
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <Signup />;
  } else {
    return <Navigate to="/home" replace />;
  }

};

export default RegisterPrivate


