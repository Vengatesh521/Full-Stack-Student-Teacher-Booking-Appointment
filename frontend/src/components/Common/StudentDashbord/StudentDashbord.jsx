import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashbord.css";

const StudentDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const [form, setForm] = useState({
    teacherId: "",
    dateTime: "",
    purpose: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/teachers", {
        withCredentials: true,
      })
      .then((res) => {
        setTeachers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Failed to fetch teachers", err));
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    const filtered = teachers.filter((t) =>
      t.username.toLowerCase().includes(val.toLowerCase())
    );
    setFiltered(filtered);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBook = (teacherId) => {
    setForm({ ...form, teacherId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = localStorage.getItem("studentId");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/appointment/book",
        {
          studentId,
          ...form,
        },
        { withCredentials: true }
      );
      setMessage("✅ " + res.data.message);
      setForm({ teacherId: "", dateTime: "", purpose: "" });
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.message || "Booking failed."));
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>

      {/* Search Teachers */}
      <div className="teacher-search">
        <h4>Search Teachers</h4>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
        />
        <ul className="teacher-list">
          {filtered.map((teacher) => (
            <li key={teacher._id} className="teacher-card">
              <div>
                <strong>{teacher.username}</strong> — {teacher.subject} (
                {teacher.department})
              </div>
              <button
                className="book-button"
                onClick={() => handleBook(teacher._id)}
              >
                Book Appointment
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Book Appointment Form */}
      <div className="appointment-form">
        <h4>Book Appointment</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="teacherId"
            placeholder="Teacher ID"
            className="form-input"
            value={form.teacherId}
            readOnly
          />
          <input
            type="datetime-local"
            name="dateTime"
            className="form-input"
            value={form.dateTime}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="purpose"
            placeholder="Purpose"
            className="form-input"
            value={form.purpose}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            Book
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>

      <div className="send-message">
        <h4>Send Messages</h4>
        <p>Feature coming soon...</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
