import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashbord.css";

const StudentDashboard = ({ user }) => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

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
    const val = e.target.value.toLowerCase();
    setSearch(val);
    const filtered = teachers.filter((t) =>
      (t.username || t.email || "").toLowerCase().includes(val)
    );
    setFiltered(filtered);
  };

  const handleBook = (teacher) => {
    navigate("/book-appointment", {
      state: {
        studentId: user._id,
        studentName: user.username,
        teacherId: teacher._id,
        teacherName: teacher.username || teacher.email,
      },
    });
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🎓 Student Dashboard</h2>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search teachers..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="table-container">
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Subject</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.username || teacher.email}</td>
                <td>{teacher.subject || "-"}</td>
                <td>{teacher.department || "-"}</td>
                <td>
                  <button
                    className="book-btn"
                    onClick={() => handleBook(teacher)}
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
