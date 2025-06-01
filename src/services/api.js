import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An error occurred, please try again.";
    console.error("API error:", errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

// Auth APIs
export const login = (data) => api.post("auth/login", data);
export const register = (data) => api.post("auth/register", data);
export const getCurrentUser = () => api.get("auth/current");

// Traffic APIs
export { trafficService } from "./trafficService";

export default api;
