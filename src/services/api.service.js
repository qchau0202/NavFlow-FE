import axios from "axios";
import API_CONFIG from "../config/api.config";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Handle token refresh or logout here
      return Promise.reject(error);
    }

    // Retry logic for network errors
    if (
      error.message === "Network Error" &&
      !originalRequest._retry &&
      originalRequest._retryCount < API_CONFIG.RETRY_ATTEMPTS
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
