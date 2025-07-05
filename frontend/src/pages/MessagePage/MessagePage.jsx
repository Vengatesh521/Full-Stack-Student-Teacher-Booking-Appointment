import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar"; // ✅ make sure correct path
import "./MessagePage.css";

const MessagePage = () => {
  const { state } = useLocation();
  const { teacherId, teacherName } = state || {};

  const [messages, setMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://full-stack-student-teacher-booking.onrender.com/api/auth/profile",
        { withCredentials: true }
      )
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user profile", err));
  }, []);

  useEffect(() => {
    if (!user?._id || !teacherId) return;

    axios
      .get(
        `https://full-stack-student-teacher-booking.onrender.com/api/message/${user._id}/${teacherId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load messages", err));

    axios
      .get(
        `https://full-stack-student-teacher-booking.onrender.com/api/appointment/teacher/${teacherId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to load appointments", err));
  }, [user, teacherId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    axios
      .post(
        `https://full-stack-student-teacher-booking.onrender.com/api/message/send`,
        {
          sender: user._id,
          receiver: teacherId,
          content: newMessage,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
      })
      .catch((err) => console.error("Failed to send message", err));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="message-page">
      <Navbar user={user} />
      <h2>💬 Messages with {teacherName}</h2>

      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`msg ${msg.sender === user._id ? "sent" : "received"}`}
          >
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend} disabled={!newMessage.trim()}>
          Send
        </button>
      </div>

      <h3>📋 Appointments with {teacherName}</h3>
      <div className="appointment-container">
        {appointments.map((appt) => (
          <div key={appt._id} className={`appt-item ${appt.status}`}>
            <p>
              <strong>Date:</strong>{" "}
              {appt.dateTime
                ? new Date(appt.dateTime).toLocaleString()
                : "Not scheduled"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-text ${appt.status}`}>
                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              </span>
            </p>
            <p>
              <strong>Purpose:</strong> {appt.purpose || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagePage;
