import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookAppointment.css";

const BookAppointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId, studentName, teacherId, teacherName } = state || {};
  const [form, setForm] = useState({ dateTime: "", purpose: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://full-stack-student-teacher-booking.onrender.com/api/appointment/book",
        { studentId, teacherId, ...form },
        { withCredentials: true }
      );
      setMessage("✅ " + res.data.message);
      setForm({ dateTime: "", purpose: "" });

      // ✅ Redirect to homepage after 1 second
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.message || "Booking failed."));
    }
  };

  if (!studentId || !teacherId) return <p>Missing user or teacher info.</p>;

  return (
    <div className="booking-container">
      <h2 className="booking-title">📅 Book Appointment</h2>

      <div className="info-box">
        <p>
          <strong>Student:</strong> {studentName} ID: ({studentId})
        </p>
        <p>
          <strong>Teacher:</strong> {teacherName} ID: ({teacherId})
        </p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Purpose</label>
        <input
          type="text"
          name="purpose"
          placeholder="Why are you booking?"
          value={form.purpose}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Appointment</button>
      </form>

      {message && <p className="booking-message">{message}</p>}
    </div>
  );
};

export default BookAppointment;
