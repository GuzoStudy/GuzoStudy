import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://guzostudy.onrender.com/api",
  withCredentials: false, // only true if you do same-domain cookie auth
});

// Attach token from AsyncStorage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token"); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Error reading token from AsyncStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
