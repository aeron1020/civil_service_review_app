// apiClient.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenService } from "./auth";

/* ===============================
   BASE URL
================================= */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("[API] BASE_URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ===============================
   REQUEST INTERCEPTOR
================================= */
api.interceptors.request.use(
  (config) => {
    const token = tokenService.get();

    console.log("%c[API REQUEST]", "color: green; font-weight:bold;", {
      url: config.url,
      method: config.method,
      access_token: token?.slice(0, 20) + "...",
    });

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

/* ===============================
   RESPONSE INTERCEPTOR
================================= */
api.interceptors.response.use(
  (response) => {
    console.log("%c[API RESPONSE OK]", "color: blue;", response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    console.log("%c[API ERROR]", "color:red; font-weight:bold;", {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (originalRequest?.url?.includes("token/refresh")) {
      console.warn("[REFRESH] Refresh endpoint failed. Logging out.");
      tokenService.logout();
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("[AUTH] Access token expired. Attempting refresh…");

      if (tokenService.isRefreshing()) {
        console.log("[AUTH] Refresh in progress → queuing request");

        return new Promise((resolve, reject) => {
          tokenService.subscribe((newToken) => {
            if (!newToken) return reject(error);

            console.log("[AUTH] Queued request using new token");

            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      const newToken = await tokenService.refresh();

      console.log("[AUTH] Refresh Result:", newToken);

      if (!newToken) {
        console.warn("[AUTH] Refresh failed → Logging out");
        tokenService.logout();
        return Promise.reject(error);
      }

      if (originalRequest.headers)
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

      console.log("[AUTH] Retrying original request:", originalRequest.url);

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

/* ===============================
   ERROR HELPER
================================= */
export function extractError(err: unknown): string {
  const e = err as AxiosError | any;
  const data = e?.response?.data;

  if (!data) return e?.message ?? "Request failed";

  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;

  if (Array.isArray(data?.non_field_errors)) return data.non_field_errors[0];

  const first = Object.values(data)[0];

  if (Array.isArray(first)) return first[0];
  if (typeof first === "string") return first;

  return "Request failed";
}

export default api;
