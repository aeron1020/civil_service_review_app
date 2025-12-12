// auth.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

/* ========================
   Token Storage
========================= */

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

const storage = (() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  // return window.sessionStorage ?? window.localStorage;

  return window.localStorage;
})();

export const getToken = () => storage.getItem(ACCESS_KEY);
export const getRefreshToken = () => storage.getItem(REFRESH_KEY);

export function saveToken(access: string, refresh?: string) {
  storage.setItem(ACCESS_KEY, access);
  if (refresh) storage.setItem(REFRESH_KEY, refresh);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
}

export function clearToken() {
  storage.removeItem(ACCESS_KEY);
  storage.removeItem(REFRESH_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
}

export function logout() {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/* ========================
   Token Expiration Helpers
========================= */

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

export const getTokenRemainingTime = () => {
  const token = getToken();
  if (!token) return 0;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return Math.max(0, decoded.exp * 1000 - Date.now());
  } catch {
    return 0;
  }
};

/* ========================
   Refresh Token Logic
========================= */

const plainAxios = axios.create();

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshQueue.push(cb);
};

export const onRefreshed = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearToken();
    return null;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const res = await plainAxios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/token/refresh/`,
      { refresh }
    );

    const { access, refresh: newRefresh } = res.data;

    saveToken(access, newRefresh);

    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    onRefreshed(access);

    return access;
  } catch {
    clearToken();
    onRefreshed(null);
    return null;
  } finally {
    isRefreshing = false;
  }
}

/* ========================
   Multi-Tab Logout Sync
========================= */

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === ACCESS_KEY && !e.newValue) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  });
}

/* ========================
   Export Token Service
========================= */

export const tokenService = {
  get: getToken,
  getRefresh: getRefreshToken,
  save: saveToken,
  clear: clearToken,
  logout,
  expired: isTokenExpired,
  remaining: getTokenRemainingTime,
  refresh: refreshToken,
  isRefreshing: () => isRefreshing,
  subscribe: subscribeTokenRefresh,
};
