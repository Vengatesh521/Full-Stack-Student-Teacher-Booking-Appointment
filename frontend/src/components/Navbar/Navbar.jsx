import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const roleLabel = {
    admin: "🛡️ Admin",
    teacher: "👨‍🏫 Teacher",
    student: "🎓 Student",
  }[user?.role];

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

  useEffect(() => {
    // placeholder if future nav cleanup needed
    return () => {};
  }, []);

  return (
    <nav className="navbar-container">
      <div
        className="navbar-left"
        onClick={() => {
          navigate("/");
        }}
      >
        🎓 <span className="brand">College Portal</span>
      </div>

      <div className="navbar-middle">
        {roleLabel && <span className="role-center">{roleLabel}</span>}
      </div>

      <div className="spacer" />

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
