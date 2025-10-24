export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access");
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
