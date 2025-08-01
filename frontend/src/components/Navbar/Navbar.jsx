import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // close menu on navigation
  useEffect(() => {
    const unlisten = () => setIsMenuOpen(false);
    return unlisten;
  }, []);

  return (
    <nav className="navbar-container">
      <div
        className="navbar-left"
        onClick={() => {
          navigate("/");
          setIsMenuOpen(false);
        }}
      >
        🎓 <span className="brand">College Portal</span>
      </div>

      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setIsMenuOpen((o) => !o)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="nav-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className={`navbar-middle ${isMenuOpen ? "open" : ""}`}>
        {roleLabel && <span className="role-center">{roleLabel}</span>}
      </div>

      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        <span className="username">👤 {user?.username || user?.name}</span>
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
