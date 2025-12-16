// // apiClient.ts
// import axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { base } from "framer-motion/client";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// console.log("API BASE URL:", BASE_URL);

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// let isRefreshing = false;

// type RetriableRequest = AxiosRequestConfig & { _retry?: boolean };

// let failedQueue: {
//   resolve: (v?: unknown) => void;
//   reject: (e?: unknown) => void;
//   config: RetriableRequest;
// }[] = [];

// function processQueue(error?: unknown) {
//   failedQueue.forEach((p) => {
//     if (error) p.reject(error);
//     else p.resolve(true);
//   });
//   failedQueue = [];
// }

// function shouldAttemptRefresh(url?: string) {
//   if (!url) return false;

//   return (
//     !url.includes("/users/auth/login") &&
//     !url.includes("/users/auth/logout") &&
//     !url.includes("/users/auth/refresh")
//     // !url.includes("/users/profile") --- IGNORE ---
//   );
// }

// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as RetriableRequest;
//     const status = error.response?.status;

//     if (!originalRequest) return Promise.reject(error);

//     if (
//       status === 401 &&
//       !originalRequest._retry &&
//       shouldAttemptRefresh(originalRequest.url)
//     ) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         console.log("⏳ Interceptor: Already refreshing, adding to queue...");
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject, config: originalRequest });
//         }).then(() => api(originalRequest));
//       }

//       isRefreshing = true;
//       console.log("🚀 Interceptor: Starting Silent Refresh...");

//       try {
//         await axios.post(
//           `${BASE_URL}/users/auth/refresh/`,
//           {},
//           { withCredentials: true }
//         );

//         processQueue();
//         isRefreshing = false;

//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);
//         isRefreshing = false;

//         // if (typeof window !== "undefined") {
//         //   window.location.href = "/login";
//         // }

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// /* ===============================
//    ERROR HELPER
// ================================= */
// export function extractError(err: unknown): string {
//   const e = err as any;
//   const data = e?.response?.data;

//   if (!data) return e?.message ?? "Request failed";
//   if (typeof data === "string") return data;
//   if (typeof data.detail === "string") return data.detail;

//   const first = Object.values(data)[0];
//   if (Array.isArray(first)) return String(first[0]);

//   return "Request failed";
// }

// export default api;

// apiClient.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // Required for cookies
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

function shouldAttemptRefresh(url?: string) {
  if (!url) return false;
  // Don't refresh on login/logout/refresh to avoid infinite loops
  return (
    !url.includes("/users/auth/login") &&
    !url.includes("/users/auth/logout") &&
    !url.includes("/users/auth/refresh")
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      shouldAttemptRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        console.log("⏳ Interceptor: Queueing request while refreshing...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      console.log(
        "🚀 Interceptor: Access Token expired. Attempting refresh..."
      );

      try {
        // We use plain axios here to avoid the interceptor loop
        await axios.post(
          `${BASE_URL}/users/auth/refresh/`,
          {},
          { withCredentials: true }
        );

        console.log("✅ Interceptor: Refresh successful.");
        isRefreshing = false;
        processQueue(); // Resolve all pending requests in queue

        return api(originalRequest); // Retry the original failed request
      } catch (refreshError) {
        console.error("❌ Interceptor: Refresh token failed or expired.");
        isRefreshing = false;
        processQueue(refreshError);

        // Optional: window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export function extractError(err: unknown): string {
  const e = err as any;
  const data = e?.response?.data;
  if (!data) return e?.message ?? "Request failed";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  return "An error occurred";
}

export default api;
