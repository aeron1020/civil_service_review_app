import axios from "axios";
import { getToken, refreshToken, logout } from "./auth";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * 🧠 Request Interceptor
 * - Automatically attach Authorization header
 * - Refresh token if expired
 */
api.interceptors.request.use(async (config) => {
  let token = getToken();

  // Refresh token if expired or missing
  if (!token) {
    token = await refreshToken();
    if (!token) {
      logout();
      throw new axios.Cancel("Session expired — please log in again.");
    }
  }

  // Attach Authorization header
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * ⚠️ Response Interceptor
 * - Auto logout on 401
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
