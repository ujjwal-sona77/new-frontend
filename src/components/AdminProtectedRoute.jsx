import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getEmailFromToken = () => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      return null; // Return null instead of throwing an error
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email;
  };

  const email_Token = getEmailFromToken();
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${email_Token}`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner component
  }

  if (user.isAdmin) {
    return <Outlet />; //
  } else {
    alert("Something went wrong. Please try again")
    return <Navigate to="/shop" />
   }

};

export default AdminAuth;
