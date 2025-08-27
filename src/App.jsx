// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import pages
import LiveClassPage from "./pages/LiveClassPage";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
// import AdminDashboard from "./components/AdminDashboard";
import AdminDashboard from "./components/AdminDashboard"
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LiveClassPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
