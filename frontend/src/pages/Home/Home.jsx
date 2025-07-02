import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Admin from "../../components/Common/AdminDashbord/AdminDashbord";
import Teacher from "../../components/Common/TeacherDashbord/TeacherDashbord";
import Student from "../../components/Common/StudentDashbord/StudentDashbord";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/profile", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to load user profile", err);
      });
  }, []);

  if (!user) return <div className="home">Loading profile...</div>;

  return (
    <div className="home">
      <h2>Welcome, {user.name || user.username} 👋</h2>
      <p>Role: {user.role}</p>

      {user.role === "admin" && <Admin user={user} />}

      {user.role === "teacher" && <Teacher user={user} />}

      {user.role === "student" && <Student user={user} />}
    </div>
  );
};

export default Home;
