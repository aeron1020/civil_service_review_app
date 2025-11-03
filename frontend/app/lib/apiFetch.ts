import { getToken, isTokenExpired, refreshToken, logout } from "./auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * ✅ Wrapper for all API requests
 * - Auto adds Authorization header
 * - Auto refreshes token if expired
 * - Auto logout if refresh fails
 */
export async function apiFetch(endpoint: string, options: any = {}) {
  let token = getToken();

  // 🔄 If token is expired or missing, try refreshing
  if (!token || isTokenExpired()) {
    token = await refreshToken();
    if (!token) {
      logout();
      throw new Error("Session expired, please log in again.");
    }
  }

  // ✅ Add headers
  options.headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // ✅ Send request
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // 🚨 If backend says unauthorized after refresh → logout
  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized — session expired.");
  }

  return res;
}
