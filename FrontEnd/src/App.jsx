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
// import StudentWrapper from "./components/StudentWrapper";
import Profile from "./pages/InstructorProfile";

// Footer links pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

// Dashboards
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./pages/TeachersDashboard";
import StudentDashboard from "./pages/StudentDashbord";


//chat bot
import Chatbot from "./components/ChatBot";

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

        {/* Student Pages */}
      
        <Route path="/studentdashboard" element={<StudentDashboard />} />

        {/* Teacher */}
        <Route path="/instructor/dashboard" element={<TeacherDashboard />} />
        <Route path="/instructor/profile" element={<Profile />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />



        {/* Footer Links */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      {/* Add more routes as needed */}
      </Routes>
      <Chatbot />
    </div>
  );
}

export default App;
