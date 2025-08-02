import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://full-stack-student-teacher-booking.onrender.com/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        🎓 College Portal
      </div>

      <div className="navbar-center">
        {user?.role === "admin" && (
          <span className="role-center">🛡️ Admin</span>
        )}
        {user?.role === "teacher" && (
          <span className="role-center">👨‍🏫 Teacher</span>
        )}
        {user?.role === "student" && (
          <span className="role-center">🎓 Student</span>
        )}
      </div>

      <div className="navbar-right">
        <span className="username">👤 {user?.username || user?.name}</span>
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
