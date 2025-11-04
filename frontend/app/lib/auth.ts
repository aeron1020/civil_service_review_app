import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

export function saveToken(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  window.dispatchEvent(new Event("storage"));
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.dispatchEvent(new Event("storage"));
}

export function logout() {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
      refresh,
    });

    const data = res.data;
    saveToken(data.access, data.refresh);
    return data.access;
  } catch (err) {
    clearToken();
    return null;
  }
}
