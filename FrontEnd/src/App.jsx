// App.js
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Main pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import TeachOnG from "./components/TeachOnG";

// Wrapper
import StudentWrapper from "./components/StudentWrapper";

// Admin
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleSignUp = (role) => {
    setUserRole(role);
  };

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/teach" element={<TeachOnG />} />
        <Route path="/explore" element={<Explore />} />

        {/* Student Wrapper with IDs */}
        <Route path="/student/dashboard" element={<StudentWrapper pageId="dashboard" />} />
        <Route path="/student/courses" element={<StudentWrapper pageId="courses" />} />
        <Route path="/student/my-courses" element={<StudentWrapper pageId="my-courses" />} />
        <Route path="/student/profile" element={<StudentWrapper pageId="profile" />} />
        <Route path="/student/course/:id" element={<StudentWrapper pageId="course-detail" />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
