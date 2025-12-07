import axios from "axios";
import { auth } from "../config/firebase";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Firebase token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || "An error occurred";
      console.error("API Error:", message);

      // Handle 401 Unauthorized - only redirect if not already on landing page
      if (error.response.status === 401) {
        // Only redirect to landing if we're on a protected route
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && currentPath !== "/") {
          window.location.href = "/";
        }
        // If already on landing page, just log the error and continue
      }
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
