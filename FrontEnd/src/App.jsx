// App.js
import { Routes, Route } from "react-router-dom";

// Main pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import TeachOnG from "./components/TeachOnG";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOTP from "./components/VerifyOTP";

// Wrapper
import StudentWrapper from "./components/StudentWrapper";

// Admin
import AdminDashboard from "./components/AdminDashboard";

// Teacher
import TeacherDashboard from "./pages/TeachersDashboard";

function App() {

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/teach" element={<TeachOnG />} />
        <Route path="/explore" element={<Explore />} />

        {/* Student Wrapper with IDs */}
        <Route path="/student/dashboard" element={<StudentWrapper pageId="dashboard" />} />
        <Route path="/student/courses" element={<StudentWrapper pageId="courses" />} />
        <Route path="/student/my-courses" element={<StudentWrapper pageId="my-courses" />} />
        <Route path="/student/profile" element={<StudentWrapper pageId="profile" />} />
        <Route path="/student/course/:id" element={<StudentWrapper pageId="course-detail" />} />

        {/* Admin Route*/}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Teacher Route */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
