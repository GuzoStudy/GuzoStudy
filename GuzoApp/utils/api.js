// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://guzostudy.onrender.com/api", // <- your live API
  withCredentials: false, // set true only if you're using httpOnly cookie auth on same domain
});

// Attach token if you use JWT in Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store your JWT at login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
