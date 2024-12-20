import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const token = document.cookie.split("=")[1];

if (!token) {
    return <Navigate to="/login" state={{ message: "Please login first" }} />;
}

return <Outlet />;
};

export default ProtectedRoutes;
