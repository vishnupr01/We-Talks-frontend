import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Adminlogin, Adminlogout, clearAdmin, setAdmin } from "../redux/slices/admin";
import { isAdmin } from "../api/admin";
import AdminLogin from "../pages/Admin/AdminLogin";

const AdminPlogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const adminInfo = useSelector((state) => state.adminSlice.adminInfo); // Destructure admin state

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await isAdmin();
        console.log("hey", response);
        if (response.data?.message === "Admin is authenticated" && response.data?.admin) {
          const { email, name } = response.data.admin;
          console.log("authenticated");
          dispatch(Adminlogin());
          dispatch(setAdmin({ email, name }));
        } else {
          dispatch(Adminlogout());
          dispatch(clearAdmin());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [dispatch]);



  if (loading) {
    return <div>Loading...</div>;
  }

  
    return <AdminLogin />;
  
};

export default AdminPlogin;
