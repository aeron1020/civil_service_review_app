import api from "./apiClient";

export async function getCurrentUser() {
  try {
    const res = await api.get("/users/profile/");
    return res.data.user;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await api.post("/users/auth/logout/");
  } finally {
    window.location.href = "/login";
  }
}
