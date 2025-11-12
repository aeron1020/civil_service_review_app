import api from "./apiClient";

/**
 * ✅ Login
 */
export async function login(username: string, password: string) {
  const res = await api.post("/token/", { username, password });
  return res.data;
}

/**
 * ✅ Register
 */
export async function signup(username: string, password: string) {
  try {
    const res = await api.post("/users/register/", { username, password });
    return res.data;
  } catch (error: any) {
    const data = error.response?.data || {};
    return {
      error:
        data?.username?.[0] || data?.password?.[0] || "Registration failed.",
      errors: data,
    };
  }
}

/**
 * ✅ Submit Quiz
 */
export async function submitQuiz(id: number, answers: any[]) {
  const res = await api.post(`/quizzes/${id}/submit/`, { answers });
  return res.data;
}

//  * ✅ users profile

export async function getUserProfile() {
  const res = await api.get("/users/profile/");
  return res.data;
}

//  * ✅ users summary
export async function getUserSummary() {
  const res = await api.get("/users/summary/");
  return res.data;
}
