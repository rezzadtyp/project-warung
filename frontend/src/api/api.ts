import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8888/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");

      // Dispatch custom event to trigger logout in AuthProvider
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export default api;
