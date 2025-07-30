import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Navbar
import Navbar from "./components/Navbar/Navbar";

// Auth Pages
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";

// Protected Page
import Home from "./pages/Home/Home";

// Common Components
import ProtectedRoute from "./components/Common/ProtectedRoute";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import MessagePage from "./pages/MessagePage/MessagePage";

// CSS
import "./App.css";

const App = () => {
  // Import BookAppointment component

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <MessagePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
