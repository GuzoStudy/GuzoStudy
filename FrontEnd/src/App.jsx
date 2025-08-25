import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import SignUp from '../src/pages/SignUp';
import Explore from '../src/pages/Explore';
import TeachOnG from './components/TeachOnG';
import ChatBot from './components/ChatBot';

function App() {
  const [setUserRole] = useState(null); // "teacher" or "student"

  const handleSignUp = (role) => {
    setUserRole(role);
  };

  return (
    <div className="min-h-screen bg-white">
      <Routes>
  <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/teach" element={<TeachOnG />} />
        <Route path="/explore" element={<Explore />} />

        {/* Dashboards */}
      </Routes>
      <ChatBot />
    </div>
  );
}

export default App;
