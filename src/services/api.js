import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
export const login = (data) => api.post("api/v1/auth/login", data);
export const register = (data) => api.post("api/v1/auth/register", data);
export const getCurrentUser = () => api.get("api/v1/auth/current");

// Traffic APIs
export { trafficService } from "./trafficService";
