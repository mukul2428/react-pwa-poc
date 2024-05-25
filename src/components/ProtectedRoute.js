import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedUser = localStorage.getItem("token");
  if (!loggedUser) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
