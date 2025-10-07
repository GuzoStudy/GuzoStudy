import { Routes, Route } from "react-router-dom";

// Main pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOTP from "./components/VerifyOTP";
import CourseDetail from "./components/CourseDetail";
import Profile from "./pages/InstructorProfile";
import AddCourse from "./pages/AddCourse";

// Footer links pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

// Dashboards
import TeacherDashboard from "./pages/TeachersDashboard";


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
        <Route path="/explore" element={<Explore />} />

        {/* Student Pages */}
      

        {/* Teacher */}
        <Route path="/instructor/dashboard" element={<TeacherDashboard />} />
        <Route path="/instructor/profile" element={<Profile />} />
        <Route path="/instructor/add-course" element={<AddCourse />} />

        {/* Admin */}



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
