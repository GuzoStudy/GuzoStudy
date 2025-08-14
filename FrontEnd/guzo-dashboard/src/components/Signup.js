// src/components/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();

  // state for the form
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");

  // handle inputs
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Signed up!");
        nav("/login");
      } else {
        setErr(data.message || "Something broke :/");
      }
    } catch (error) {
      console.error("signup err ->", error);
      setErr("Server's not happy right now...");
    }
  };

  return (
    <div style={wrapStyle}>
      <h2>Sign Up</h2>
      <form onSubmit={submitForm} style={formStyle}>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={form.username}
          onChange={onChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={form.email}
          onChange={onChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={form.password}
          onChange={onChange}
          required
          style={inputStyle}
        />
        {err && <p style={errStyle}>{err}</p>}
        <button type="submit" style={btnStyle}>
          Sign up
        </button>
      </form>
      <p>
        Already signed up?{" "}
        <span
          style={{ color: "#55a", cursor: "pointer" }}
          onClick={() => nav("/login")}>
          log in here
        </span>
      </p>
    </div>
  );
}

// styles (yeah I know, should be in css file)
const wrapStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
  background: "#f0f0f0",
  fontFamily: "sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "270px",
};

const inputStyle = {
  padding: "9px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #aaa",
};

const btnStyle = {
  padding: "9px",
  background: "#5555aa",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const errStyle = {
  color: "red",
  fontSize: "12px",
};
