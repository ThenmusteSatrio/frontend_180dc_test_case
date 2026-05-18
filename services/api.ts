import { logout } from "@/lib/auth";
import axios from "axios";

const USE_CUSTOM_BACKEND = false;

const api = axios.create({
  baseURL: USE_CUSTOM_BACKEND ? "http://localhost:4000/api/v1" : '/api/remote',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor Error:", error.response?.status);
    if (error.response?.status === 401 || error.response?.status === 405) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      logout();
      if (
        typeof window !== "undefined" &&
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
