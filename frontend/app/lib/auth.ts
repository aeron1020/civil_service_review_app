// export function getToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("access");
// }

// export function saveToken(token: string) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem("access", token);
// }

// export function clearToken() {
//   if (typeof window === "undefined") return;
//   localStorage.removeItem("access");
// }

// export function logout() {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("token");
//   }
// }

"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface DecodedToken {
  exp: number; // expiration timestamp
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
  // Notify other components (e.g., Navbar)
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
  // Optional: reload UI
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * Check if the access token has expired
 */
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true;
  }
}

/**
 * Automatically log out user when token is expired
 */
export function autoLogoutIfExpired() {
  const expired = isTokenExpired();
  if (expired) {
    console.warn("Token expired — logging out...");
    clearToken();
    window.location.href = "/login";
  }
}
