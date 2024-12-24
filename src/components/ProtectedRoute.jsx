import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = document.cookie.split("=")[1];
  return token ? <Outlet /> : <Navigate to="/login" state={{ message: "Please login first" }} />;
};

export default ProtectedRoutes;
