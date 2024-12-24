import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
  // Check if the token exists in the cookie
  const token = Cookies.get('token'); // Replace 'authToken' with your cookie name

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
