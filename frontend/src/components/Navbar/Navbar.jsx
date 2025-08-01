import React, { useEffect } from "react";
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

  // ensure any future nav effect can close things if needed
  useEffect(() => {
    // placeholder for cleanup if expanded later
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

      <div className="spacer" />

      <div className="navbar-right">
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
