import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Sidebar icon component
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
      }}
    >
      {icon}
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <nav style={styles.sidebar}>
        <div style={styles.logo}>G</div>
        <SidebarIcon icon="🏠" active />
        <SidebarIcon icon="📚" />
        <SidebarIcon icon="🎥" onClick={() => navigate("/live-class")} />
        <SidebarIcon icon="📋" />
        <SidebarIcon icon="🏆" />
      </nav>
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
};

export default App;
