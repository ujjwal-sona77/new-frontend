import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  const token = document.cookie.split("=")[1];
  return token ? <Outlet /> : <Navigate to="/login" state={{ message: "Please login first" }} />;
};
  const token = document.cookie.split('=')[1]
  
  if (!token) {
    alert('Please login')
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoutes
