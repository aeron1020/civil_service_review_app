// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//   exp: number;
//   [key: string]: any;
// }

// export function getToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("access");
// }

// export function saveToken(access: string, refresh?: string) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem("access", access);
//   if (refresh) localStorage.setItem("refresh", refresh);
//   window.dispatchEvent(new Event("storage"));
// }

// export function clearToken() {
//   if (typeof window === "undefined") return;
//   localStorage.removeItem("access");
//   localStorage.removeItem("refresh");
//   window.dispatchEvent(new Event("storage"));
// }

// export function logout() {
//   clearToken();
//   if (typeof window !== "undefined") {
//     window.location.href = "/login";
//   }
// }

// export function isTokenExpired(): boolean {
//   const token = getToken();
//   if (!token) return true;
//   try {
//     const decoded = jwtDecode<DecodedToken>(token);
//     const currentTime = Date.now() / 1000;
//     return decoded.exp < currentTime;
//   } catch {
//     return true;
//   }
// }

// export async function refreshToken() {
//   const refresh = localStorage.getItem("refresh");
//   if (!refresh) return null;

//   try {
//     const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
//       refresh,
//     });

//     const data = res.data;
//     saveToken(data.access, data.refresh);
//     return data.access;
//   } catch (err) {
//     clearToken();
//     return null;
//   }
// }

// auth.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

/** ========================
 * 🔑 TOKEN STORAGE HELPERS
 * ======================== */

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

// use sessionStorage for better security, fallback to localStorage
const storage =
  typeof window !== "undefined"
    ? sessionStorage ?? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export function getToken() {
  return storage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return storage.getItem(REFRESH_KEY);
}

export function saveToken(access: string, refresh?: string) {
  storage.setItem(ACCESS_KEY, access);
  if (refresh) storage.setItem(REFRESH_KEY, refresh);
  window.dispatchEvent(new Event("storage"));
}

export function clearToken() {
  storage.removeItem(ACCESS_KEY);
  storage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event("storage"));
}

export function logout() {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/** ========================
 * 🧠 TOKEN VALIDATION
 * ======================== */

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

export function getTokenRemainingTime(): number {
  const token = getToken();
  if (!token) return 0;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}

/** ========================
 * 🔄 REFRESH TOKEN
 * ======================== */

// plain axios instance (no interceptors)
const plainAxios = axios.create();

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await plainAxios.post(
      "http://127.0.0.1:8000/api/token/refresh/",
      { refresh }
    );
    const { access, refresh: newRefresh } = res.data;
    saveToken(access, newRefresh);
    return access;
  } catch {
    clearToken();
    return null;
  }
}

/** ========================
 * 🌍 MULTI-TAB LOGOUT SYNC
 * ======================== */

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === ACCESS_KEY && !e.newValue) {
      window.location.href = "/login";
    }
  });
}

/** ========================
 * 🧩 EXPORT AS SERVICE
 * ======================== */

export const tokenService = {
  get: getToken,
  refresh: refreshToken,
  clear: clearToken,
  save: saveToken,
  expired: isTokenExpired,
  remaining: getTokenRemainingTime,
  logout,
};
