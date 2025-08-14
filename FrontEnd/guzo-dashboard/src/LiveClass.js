import React from "react";
import { Link } from "react-router-dom";

export default function LiveClass() {
  // kinda rough style object, not all perfect
  const styles = {
    wrap: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f8fa",
      padding: 20
    },
    card: {
      background: "#fff",
      borderRadius: 14,
      padding: 20,
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      textAlign: "center",
      maxWidth: 500,
      width: "100%"
    },
    title: { 
      marginBottom: 10, 
      fontSize: 26 
    },
    message: { 
      marginBottom: 15, 
      opacity: 0.75, 
      fontSize: 15 
    },
    btn: {
      padding: "8px 14px",
      borderRadius: 8,
      background: "#4647a7",
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
      display: "inline-block"
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.title}>Live Class</h1>
        <p style={styles.message}>No live class right now. Check back later!</p>
        
        {/* could be a button, but using Link for now */}
        <Link to="/" style={styles.btn}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
