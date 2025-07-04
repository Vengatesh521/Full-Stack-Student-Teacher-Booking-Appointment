import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherDashbord.css";

const TeacherDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [scheduleInputs, setScheduleInputs] = useState({});

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

  const handleSchedule = (id) => {
    const dateTime = scheduleInputs[id];
    if (!dateTime) {
      return alert("Please select a date and time.");
    }

    axios
      .patch(
        `http://localhost:5000/api/appointment/${id}`,
        { dateTime, status: "scheduled" },
        { withCredentials: true }
      )
      .then((res) =>
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, dateTime, status: "scheduled" } : app
          )
        )
      )
      .catch((err) => {
        console.error("Failed to schedule appointment:", err);
        alert("Failed to schedule appointment");
      });
  };

  const handleUpdateStatus = (id, status) => {
    axios
      .patch(
        `http://localhost:5000/api/appointment/${id}/status`,
        { status },
        { withCredentials: true }
      )
      .then((res) =>
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: status } : app))
        )
      )
      .catch((err) => {
        console.error("Failed to update status:", err);
        alert("Failed to update status");
      });
  };

  return (
    <div className="teacher-dashboard">
      <h2 className="teacher-title">
        <span className="teacher-icon">🧑‍🏫</span> Teacher Dashboard
      </h2>
      <div className="card-container">
        {appointments.length === 0 ? (
          <p className="no-data-message">No appointment requests yet.</p>
        ) : (
          <div className="card-container">
            {appointments.map((appt) => {
              let dateContent = "[not scheduled]";
              const dateObj = new Date(appt.dateTime);
              if (!isNaN(dateObj.getTime())) {
                dateContent = dateObj.toLocaleString();
              }
              return (
                <div key={appt._id} className="appointment-card">
                  <p className="card-text">
                    <span className="card-label">👨‍🎓 </span>{" "}
                    {appt.student?.username}
                  </p>
                  <p className="card-text">
                    <span className="card-label">Date & Time:</span>{" "}
                    {dateContent}
                  </p>
                  <p className="card-text">
                    <span className="card-label">Purpose:</span> {appt.purpose}
                  </p>
                  <p className="card-text">
                    <span className="card-label">Status:</span>{" "}
                    <span
                      className={`status-badge ${
                        appt.status === "approved"
                          ? "status-approved"
                          : appt.status === "cancelled"
                          ? "status-cancelled"
                          : "status-pending"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </p>
                  <div className="card-buttons">
                    {isNaN(dateObj.getTime()) && (
                      <>
                        <input
                          type="datetime-local"
                          value={scheduleInputs[appt._id] || ""}
                          onChange={(e) =>
                            setScheduleInputs((prev) => ({
                              ...prev,
                              [appt._id]: e.target.value,
                            }))
                          }
                          className="datetime-input"
                        />
                        <button
                          className="btn btn-schedule"
                          onClick={() => handleSchedule(appt._id)}
                        >
                          Schedule
                        </button>
                      </>
                    )}

                    {appt.status !== "approved" && (
                      <button
                        className="btn btn-approve"
                        onClick={() => handleUpdateStatus(appt._id, "approved")}
                      >
                        Approve
                      </button>
                    )}

                    {appt.status !== "pending" &&
                      appt.status !== "cancelled" && (
                        <button
                          className="btn btn-cancel"
                          onClick={() =>
                            handleUpdateStatus(appt._id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
