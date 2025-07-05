import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppointmentsTable.css";

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://full-stack-student-teacher-booking.onrender.com/api/appointment",
        { withCredentials: true }
      )
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to load appointments", err));
  }, []);

  if (appointments.length === 0) {
    return <p>No appointments found.</p>;
  }

  return (
    <div className="appointments-table-container">
      <table className="appointments-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Teacher</th>
            <th>Subject</th>
            <th>Date & Time</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, index) => {
            const dateObj = new Date(appt.dateTime);
            const isValidDate = !isNaN(dateObj.getTime());
            return (
              <tr key={appt._id}>
                <td>{index + 1}</td>
                <td>
                  {appt.student?.username} ({appt.student?.email})
                </td>
                <td>
                  {appt.teacher?.username} ({appt.teacher?.email})
                </td>
                <td>{appt.teacher?.subject}</td>
                <td>
                  {isValidDate ? dateObj.toLocaleString() : "[not scheduled]"}
                </td>
                <td>{appt.purpose}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;
