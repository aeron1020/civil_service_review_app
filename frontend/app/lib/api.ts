import api, { extractError } from "./apiClient";

/**
 * ✅ Login
 */
export async function login(username: string, password: string) {
  try {
    const res = await api.post("/users/login/", { username, password });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

/**
 * ✅ Register
 */
export async function signup(username: string, password: string) {
  try {
    const res = await api.post("/users/register/", { username, password });
    return res.data;
  } catch (error: any) {
    const message = extractError(error);
    return {
      error: message,
      errors: error.response?.data || {},
    };
  }
}

/**
 * ✅ Submit Quiz
 */
export async function submitQuiz(id: number, answers: any[]) {
  try {
    const res = await api.post(`/quizzes/${id}/submit/`, { answers });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

/**
 * ✅ users profile
 */
export async function getUserProfile() {
  try {
    const res = await api.get("/users/profile/");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

/**
 * ✅ users summary
 */
export async function getUserSummary() {
  try {
    const res = await api.get("/users/summary/");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}
