import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const { username, password } = values;
    if (!username || !password) return "All fields are required.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setMessage("❌ " + error);
      setMessageType("error");
      return;
    }

    axios
      .post(
        "https://full-stack-student-teacher-booking.onrender.com/api/auth/login",
        values,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setMessage("✅ " + res.data.message);
        setMessageType("success");
        setTimeout(() => navigate("/"), 1000);
      })
      .catch((err) => {
        setMessage("❌ " + (err.response?.data?.message || "Login failed."));
        setMessageType("error");
      });
  };

  useEffect(() => {
    axios
      .get(
        "https://full-stack-student-teacher-booking.onrender.com/api/auth/profile",
        { withCredentials: true }
      )
      .then(() => navigate("/"))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h3>Welcome Back</h3>
          <p>Login to your account</p>
        </div>
        <div className="login-body">
          {message && (
            <div className={`login-alert ${messageType}`}>{message}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginUsername">Username</label>
              <input
                type="text"
                id="loginUsername"
                value={values.username}
                onChange={(e) =>
                  setValues({ ...values, username: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
