import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherDashbord.css";

const TeacherDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    if (!user?._id) return;

    axios
      .get("http://localhost:5000/api/appointment", {
        withCredentials: true,
      })
      .then((res) => {
        const filtered = res.data.filter(
          (appt) => appt.teacher?._id?.toString() === user._id.toString()
        );
        setAppointments(filtered);
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  }, [user]);

  const handleUpdateStatus = (id, status) => {
    axios
      .put(
        `http://localhost:5000/api/teacher/update-status/${id}`,
        { status },
        { withCredentials: true }
      )
      .then(() =>
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: status } : app))
        )
      )
      .catch(() => alert("Failed to update status"));
  };

  return (
    <div className="teacher-dashboard">
      <h2 className="teacher-title">🧑‍🏫 Teacher Dashboard</h2>

      {appointments.length === 0 ? (
        <p className="no-data-message">No appointment requests yet.</p>
      ) : (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Date & Time</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.student?.username}</td>
                <td>{new Date(appt.dateTime).toLocaleString()}</td>
                <td>{appt.purpose}</td>
                <td>{appt.status}</td>
                <td>
                  <button
                    className="btn-approve"
                    onClick={() => handleUpdateStatus(appt._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                  >
                    Cancel
                  </button>
                  <button className="btn-schedule">Schedule</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherDashboard;
