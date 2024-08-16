import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { isUser } from "../api/user";
import { clearUser, login, logout, setUser } from "../redux/slices/home";
import showBlockedAlert from "../popups/alert";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.authSlice.userInfo);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await isUser();
        if (response.data.message === "user is authenticated") {
          const { email, id, user_id, name, image_url, userName, isBlocked } = response.data.user;
          dispatch(login());
          dispatch(setUser({ email, id, name, user_id, image_url, userName, isBlocked }));
        } else {
          dispatch(logout());
          dispatch(clearUser());
        }
      } catch (error) {
        if (error.response.data.message === "user is blocked") {
          dispatch(logout());
          dispatch(clearUser());
          showBlockedAlert();
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
