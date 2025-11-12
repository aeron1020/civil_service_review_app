// import axios from "axios";
// import { getToken, refreshToken, logout } from "./auth";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
//   headers: { "Content-Type": "application/json" },
// });

// /**
//  * 🧠 Request Interceptor
//  * - Automatically attach Authorization header
//  * - Refresh token if expired
//  */
// api.interceptors.request.use(async (config) => {
//   let token = getToken();

//   // Refresh token if expired or missing
//   if (!token) {
//     token = await refreshToken();
//     if (!token) {
//       logout();
//       throw new axios.Cancel("Session expired — please log in again.");
//     }
//   }

//   // Attach Authorization header
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// /**
//  * ⚠️ Response Interceptor
//  * - Auto logout on 401
//  */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       logout();
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// apiClient.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenService } from "./auth";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

/** ======================================
 * 🔁 TOKEN REFRESH QUEUE HANDLER
 * ====================================== */
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: AxiosRequestConfig) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(); // we’ll apply token separately
  });
  failedQueue = [];
};

/** ======================================
 * 🧠 REQUEST INTERCEPTOR
 * ====================================== */
api.interceptors.request.use(async (config) => {
  const publicEndpoints = ["/token/", "/users/register/"];

  if (publicEndpoints.some((url) => config.url?.includes(url))) {
    return config;
  }

  let token = tokenService.get();

  // Token expired or missing? Attempt refresh.
  if (!token || tokenService.expired()) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const newToken = await tokenService.refresh();
        token = newToken;
        processQueue(null, newToken);
      } catch (err) {
        processQueue(err, null);
        tokenService.logout();
        throw err;
      } finally {
        isRefreshing = false;
      }
    } else {
      // Queue requests until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => {
            const latestToken = tokenService.get();
            if (latestToken) {
              config.headers.Authorization = `Bearer ${latestToken}`;
            }
            resolve(config);
          },
          reject: (err) => reject(err),
        });
      });
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** ======================================
 * ⚠️ RESPONSE INTERCEPTOR
 * ====================================== */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenService.logout();
    }
    return Promise.reject(error);
  }
);

export default api;
