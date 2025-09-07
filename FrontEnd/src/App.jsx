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
import CourseDetail from "./components/CourseDetail";
import StudentWrapper from "./components/StudentWrapper";

// Dashboards
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./pages/TeachersDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// ⚠️ IMPORTANT: you must import Chatbot here, otherwise React will crash
import Chatbot from "./components/Chatbot";

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
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/teach" element={<TeachOnG />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chatbot" element={<Chatbot />} />

        {/* Student Pages */}
        <Route path="/dashboard" element={<StudentWrapper pageId="dashboard" />} />
        <Route path="/courses" element={<StudentWrapper pageId="courses" />} />
        <Route path="/my-courses" element={<StudentWrapper pageId="my-courses" />} />
        <Route path="/profile" element={<StudentWrapper pageId="profile" />} />
        <Route path="/:id" element={<StudentWrapper pageId="course-detail" />} />
        

        {/* Teacher */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* StudentDashboard (separate page) */}
        <Route path="/studentDashboard" element={<StudentDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
