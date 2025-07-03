import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashbord.css";
import AppointmentsTable from "../AppointmentsTable/AppointmentsTable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/teachers", { withCredentials: true })
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Teacher fetch error:", err));

    axios
      .get("http://localhost:5000/api/auth/students", { withCredentials: true })
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Student fetch error:", err));
  }, []);

  const handleApprove = (id) => {
    axios
      .put(
        `http://localhost:5000/api/auth/approve-student/${id}`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        setStudents((prev) => prev.filter((s) => s._id !== id));
      })
      .catch((err) => alert("Approval failed"));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "teachers":
        return (
          <div className="admin-section">
            <h3>🧑‍🏫 All Teachers</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t._id}>
                    <td>{t.username}</td>
                    <td>{t.email}</td>
                    <td>{t.subject}</td>
                    <td>{t.department}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "approve":
        return (
          <div className="admin-section">
            <h3>✅ Approve Students</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.username}</td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(s._id)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "appointments":
        return <AppointmentsTable />;

      case "settings":
        return (
          <p className="coming-soon">⚙️ Manage System Settings - Coming Soon</p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">👩‍💼 Admin Dashboard</h2>

      <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === "teachers" ? "active" : ""}`}
          onClick={() => setActiveTab("teachers")}
        >
          Teachers
        </button>
        <button
          className={`tab-btn ${activeTab === "approve" ? "active" : ""}`}
          onClick={() => setActiveTab("approve")}
        >
          Approve Students
        </button>
        <button
          className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          View Appointments
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default AdminDashboard;
