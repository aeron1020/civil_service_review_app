// import { getToken, isTokenExpired, refreshToken, logout } from "./auth";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// /**
//  * ✅ Universal API wrapper
//  * - Adds Authorization
//  * - Auto-refreshes if expired
//  * - Handles unauthorized gracefully
//  */
// export async function apiFetch(endpoint: string, options: any = {}) {
//   let token = getToken();

//   // Try to refresh expired token
//   if (!token || isTokenExpired()) {
//     token = await refreshToken();
//     if (!token) {
//       logout();
//       throw new Error("Session expired, please log in again.");
//     }
//   }

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//     ...(options.headers || {}),
//   };

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   // Auto logout if backend rejects
//   if (res.status === 401) {
//     logout();
//     throw new Error("Unauthorized — please log in again.");
//   }

//   return res;
// }
