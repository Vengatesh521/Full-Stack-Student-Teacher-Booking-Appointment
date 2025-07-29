import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://full-stack-student-teacher-booking.onrender.com/api/auth/profile",
        { withCredentials: true }
      )
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // if (isAuthenticated === false) {
  //   return <div>Loading...</div>; // or spinner
  // }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
