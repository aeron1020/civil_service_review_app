// const API_BASE_URL = "http://127.0.0.1:8000/api";

// export async function login(username: string, password: string) {
//   const res = await fetch(`${API_BASE_URL}/token/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     const message =
//       data?.detail ||
//       data?.non_field_errors?.[0] ||
//       "Login failed. Please check your username or password.";
//     throw new Error(message);
//   }

//   return data;
// }

// export async function signup(username: string, password: string) {
//   const res = await fetch(`${API_BASE_URL}/users/register/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });

//   const data = await res.json();

//   // ✅ Return structured result so frontend can show specific message
//   if (!res.ok) {
//     return {
//       error:
//         data?.username?.[0] ||
//         data?.password?.[0] ||
//         data?.non_field_errors?.[0] ||
//         "Registration failed. Please check your inputs.",
//       errors: data,
//     };
//   }

//   return data;
// }

// import { getToken } from "./auth";

// export async function submitQuiz(id: number, answers: any[]) {
//   const token = getToken();

//   const response = await fetch(`${API_BASE_URL}/quizzes/${id}/submit/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify({ answers }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     const message =
//       data?.error || data?.detail || "Failed to submit quiz. Please try again.";
//     throw new Error(message);
//   }

//   return data;
// }

import { apiFetch } from "./apiFetch";

/**
 * ✅ Login
 */
export async function login(username: string, password: string) {
  const res = await fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "Login failed");
  }
  return data;
}

/**
 * ✅ Register
 */
export async function signup(username: string, password: string) {
  const res = await fetch("http://127.0.0.1:8000/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      error:
        data?.username?.[0] || data?.password?.[0] || "Registration failed.",
      errors: data,
    };
  }

  return data;
}

/**
 * ✅ Submit Quiz
 */
export async function submitQuiz(id: number, answers: any[]) {
  const res = await apiFetch(`/quizzes/${id}/submit/`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "Failed to submit quiz");
  }

  return data;
}
