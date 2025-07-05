import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherDashbord.css";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaBullseye,
  FaInfoCircle,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [scheduleInputs, setScheduleInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    // Fetch all appointments for this teacher
    axios
      .get(
        "https://full-stack-student-teacher-booking.onrender.com/api/appointment",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const filtered = res.data.filter(
          (appt) => appt.teacher?._id?.toString() === user._id.toString()
        );
        setAppointments(filtered);
      })
      .catch((err) => console.error("Error fetching appointments:", err));

    // Fetch all messages received/sent by this teacher
    console.log("user._id:", user._id);
    console.log(
      `https://full-stack-student-teacher-booking.onrender.com/api/message/${user._id}`
    );

    axios
      .get(
        `https://full-stack-student-teacher-booking.onrender.com/api/message/${user._id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [user]);

  const handleSchedule = (id) => {
    const dateTime = scheduleInputs[id];
    if (!dateTime) return alert("Please select a date and time.");

    axios
      .patch(
        `https://full-stack-student-teacher-booking.onrender.com/api/appointment/${id}/datetime`,
        { dateTime },
        { withCredentials: true }
      )
      .then(() =>
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, dateTime } : app))
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
        `https://full-stack-student-teacher-booking.onrender.com/api/appointment/${id}/status`,
        { status },
        { withCredentials: true }
      )
      .then(() =>
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        )
      )
      .catch((err) => {
        console.error("Failed to update status:", err);
        alert("Failed to update status");
      });
  };

  const handleMessageClick = (studentId, studentName) => {
    navigate("/message", {
      state: {
        studentId,
        teacherId: user._id,
        teacherName: user.username,
      },
    });
  };

  return (
    <div className="teacher-dashboard">
      <h2 className="teacher-title">🧑‍🏫 Teacher Dashboard</h2>

      {/* 🔔 Appointments */}
      <div className="card-container">
        {appointments.length === 0 ? (
          <p className="no-data-message">No appointment requests yet.</p>
        ) : (
          appointments.map((appt) => {
            const dateObj = new Date(appt.dateTime);
            const dateContent = isNaN(dateObj.getTime())
              ? "[not scheduled]"
              : dateObj.toLocaleString();

            return (
              <div key={appt._id} className="appointment-card">
                <p className="card-text">
                  <FaUserGraduate /> <strong>Student:</strong>{" "}
                  {appt.student?.username}
                </p>
                <p className="card-text">
                  <FaCalendarAlt /> <strong>Date:</strong> {dateContent}
                </p>
                <p className="card-text">
                  <FaBullseye /> <strong>Purpose:</strong> {appt.purpose}
                </p>
                <p className="card-text">
                  <FaInfoCircle /> <strong>Status:</strong>{" "}
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

                  {appt.status !== "pending" && appt.status !== "cancelled" && (
                    <button
                      className="btn btn-cancel"
                      onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 💬 Recent Messages */}
      <h3 className="msg-section-title">💬 Messages</h3>
      <div className="messages-preview">
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="msg-preview-card">
              <p>
                <strong> From:</strong>{" "}
                {msg.sender?._id === user._id
                  ? "You"
                  : msg.sender?.username || "Unknown"}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {msg.receiver?._id === user._id
                  ? "You"
                  : msg.receiver?.username || "Unknown"}
              </p>
              <p>
                <strong>Message:</strong> {msg.content}
              </p>
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
              {msg.sender?._id !== user._id && (
                <button
                  className="msg-btn"
                  onClick={() =>
                    handleMessageClick(msg.sender._id, msg.sender.username)
                  }
                >
                  💬 Reply
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
