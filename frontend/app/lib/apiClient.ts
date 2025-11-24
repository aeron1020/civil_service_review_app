// apiClient.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenService } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api`
  : "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/** ======================================
 * 🔁 TOKEN REFRESH QUEUE HANDLER
 * ====================================== */
let isRefreshing = false;
type QueueItem = {
  resolve: (config?: AxiosRequestConfig) => void;
  reject: (error?: any) => void;
};
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
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
            if (latestToken && config.headers) {
              config.headers.Authorization = `Bearer ${latestToken}`;
            }
            resolve(config);
          },
          reject: (err) => reject(err),
        });
      });
    }
  }

  if (token && config.headers) {
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

/** ======================================
 * 🧾 Helper to normalize errors (exported)
 * ====================================== */
export function extractError(err: unknown): string {
  const e = err as AxiosError | any;
  const data = e?.response?.data;

  if (!data) return e?.message ?? "Request failed";
  if (typeof data === "string") return data;
  if (data?.detail && typeof data.detail === "string") return data.detail;
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length) {
    return String(data.non_field_errors[0]);
  }

  // Safely inspect first meaningful value from object (avoid direct numeric indexing)
  const vals = Object.values(data).filter((v) => v !== null && v !== undefined);
  if (vals.length) {
    const first = vals[0];
    if (Array.isArray(first) && first.length && typeof first[0] === "string") {
      return first[0];
    }
    if (typeof first === "string") {
      return first;
    }
    try {
      return String(first);
    } catch {
      /* fallthrough */
    }
  }

  return "Request failed";
}

export default api;
