import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import LiveClass from "./LiveClass";
import Login from "./components/Login";
import Signup from "./components/Signup";

const myCourses = [
  {
    title: "JavaScript Essentials",
    progress: 0.8,
    img: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Data Structures in Python",
    progress: 0.55,
    img: "https://media.geeksforgeeks.org/wp-content/uploads/20211021164218/pythondatastructuresmin.png",
  },
  {
    title: "UI/UX Design Basics",
    progress: 0.3,
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Leaderboard",
    progress: 0,
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
];

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login state

  // Simple login handler
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/"); // redirect to dashboard after login
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Login Page */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* Signup Page */}
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard Route (Protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div style={styles.container}>
              <nav style={styles.sidebar}>
                <div style={styles.logo}>G</div>
                <SidebarIcon icon="🏠" active />
                <SidebarIcon icon="📚" />
                <SidebarIcon
                  icon="🎥"
                  onClick={() => navigate("/live-class")}
                />
                <SidebarIcon icon="📋" />
                <SidebarIcon icon="🏆" />
              </nav>

              <main style={styles.main}>
                <header style={styles.header}>
                  <div>
                    <h1 style={styles.title}>
                      Hey <strong>Abel</strong> 👋
                    </h1>
                    <p style={styles.subtitle}>
                      Ready to jump back into learning?
                    </p>
                  </div>
                  <div style={styles.profile}>
                    <button style={styles.bell}>🔔</button>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      alt="Profile"
                      style={styles.avatar}
                    />
                  </div>
                </header>

                <section style={styles.cards}>
                  <Card bg="#239a8d" icon="📚" label="My Courses" />
                  <Card
                    bg="#4647a7"
                    icon="🎥"
                    label="Live Classes"
                    onClick={() => navigate("/live-class")}
                  />
                  <Card bg="#c38630" icon="📄" label="Assignments" />
                  <Card bg="#b24764" icon="🏆" label="Leaderboard" />

                  <div style={styles.upcomingTasksSection}>
                    <h4>Upcoming Projects</h4>
                    <div style={styles.upcomingTasksBox}>
                      <div style={styles.task}>No upcoming Projects</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3>Your Courses</h3>
                  <div style={styles.courseGrid}>
                    {myCourses.map((course, i) => (
                      <div key={i} style={styles.courseCard}>
                        <img
                          src={course.img}
                          alt={course.title}
                          style={{
                            width: "100%",
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <h4 style={{ marginTop: 10 }}>{course.title}</h4>
                        <ProgressBar progress={course.progress} />
                      </div>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Live Class Route (Protected) */}
      <Route
        path="/live-class"
        element={
          <ProtectedRoute>
            <LiveClass />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirects to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

// SidebarIcon component
function SidebarIcon({ icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        fontSize: 20,
        padding: 15,
        cursor: "pointer",
        backgroundColor: active ? "#e6e8eb" : "",
        borderRadius: 10,
        marginBottom: 10,
        textAlign: "center",
      }}>
      {icon}
    </div>
  );
}

// Card component
function Card({ bg, icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: bg,
        width: 130,
        height: 100,
        borderRadius: 15,
        marginRight: 20,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 500,
        fontSize: 14,
        cursor: "pointer",
      }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
      {label}
    </div>
  );
}

// ProgressBar component
function ProgressBar({ progress }) {
  return (
    <div
      style={{
        backgroundColor: "#e6e8eb",
        height: 7,
        borderRadius: 20,
        marginTop: 8,
      }}>
      <div
        style={{
          backgroundColor: "#4647a7",
          width: `${progress * 100}%`,
          height: "100%",
          borderRadius: 20,
        }}
      />
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    fontFamily: "Segoe UI, Tahoma, sans-serif",
    backgroundColor: "#f9f9f9",
    height: "100vh",
    padding: 20,
  },
  sidebar: {
    width: 60,
    backgroundColor: "#fff",
    borderRadius: 15,
    boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 25,
  },
  main: {
    flex: 1,
    marginLeft: 25,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },
  bell: {
    background: "none",
    border: "none",
    fontSize: 25,
    cursor: "pointer",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
  },
  cards: {
    display: "flex",
    alignItems: "center",
    marginBottom: 30,
  },
  upcomingTasksSection: {
    backgroundColor: "#e6e8eb",
    borderRadius: 15,
    padding: 10,
    width: 180,
  },
  upcomingTasksBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
  },
  task: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 0 3px rgba(0,0,0,0.1)",
    marginTop: 10,
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: 15,
  },
  courseCard: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 15,
  },
};

export default App;
