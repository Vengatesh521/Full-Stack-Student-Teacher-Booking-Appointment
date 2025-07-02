import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [values, setValues] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    name: "",
    department: "",
    subject: "",
  });

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const {
      username,
      email,
      password,
      confirmPassword,
      role,
      name,
      department,
      subject,
    } = values;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !name ||
      !department ||
      !subject
    )
      return "All fields are required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email address.";

    if (password.length < 6) return "Password must be at least 6 characters.";

    if (password !== confirmPassword) return "Passwords do not match.";

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
      .post("http://localhost:5000/api/auth/register", values)
      .then((res) => {
        setMessage("✅ " + res.data.message);
        setMessageType("success");
        setValues({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          name: "",
          department: "",
          subject: "",
        });
        if (res.data.status === "Success") {
          setTimeout(() => navigate("/login"), 1000);
        }
      })
      .catch((err) => {
        setMessage(
          "❌ " + (err.response?.data?.message || "Registration failed.")
        );
        setMessageType("error");
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h3>Create Account</h3>
        </div>
        <div className="register-body">
          {message && (
            <div className={`register-alert ${messageType}`}>{message}</div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={values.username}
                onChange={(e) =>
                  setValues({ ...values, username: e.target.value })
                }
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={values.confirmPassword}
                onChange={(e) =>
                  setValues({ ...values, confirmPassword: e.target.value })
                }
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Role</label>
              <select
                value={values.role}
                onChange={(e) => setValues({ ...values, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Department */}
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={values.department}
                onChange={(e) =>
                  setValues({ ...values, department: e.target.value })
                }
              />
            </div>

            {/* Subject */}
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={values.subject}
                onChange={(e) =>
                  setValues({ ...values, subject: e.target.value })
                }
              />
            </div>

            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        </div>
        <div className="register-footer">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
