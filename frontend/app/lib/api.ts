// import api, { extractError } from "./apiClient";

// /**
//  * ✅ Login
//  */
// export async function login(username: string, password: string) {
//   try {
//     const res = await api.post("/users/auth/login/", { username, password });
//     return res.data;
//   } catch (err) {
//     throw new Error(extractError(err));
//   }
// }

// /**
//  * ✅ Register
//  */
// export async function signup(
//   username: string,
//   email: string,
//   password: string
// ) {
//   try {
//     const res = await api.post("/users/register/", {
//       username,
//       email,
//       password,
//     });
//     return res.data;
//   } catch (err) {
//     throw new Error(extractError(err));
//   }
// }

// /**
//  * ✅ Submit Quiz
//  */
// export async function submitQuiz(id: number, answers: any[]) {
//   try {
//     const res = await api.post(`/quizzes/${id}/submit/`, { answers });
//     return res.data;
//   } catch (err) {
//     throw new Error(extractError(err));
//   }
// }

// /**
//  * ✅ users profile
//  */
// export async function getUserProfile() {
//   try {
//     const res = await api.get("/users/profile/");
//     return res.data;
//   } catch (err) {
//     throw new Error(extractError(err));
//   }
// }

// /**
//  * ✅ users summary
//  */
// export async function getUserSummary() {
//   try {
//     const res = await api.get("/users/summary/");
//     return res.data;
//   } catch (err) {
//     throw new Error(extractError(err));
//   }
// }

import api, { extractError } from "./apiClient";

/**
 * ✅ Login
 */
export async function login(username: string, password: string) {
  try {
    const res = await api.post("/users/auth/login/", { username, password });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

/**
 * ✅ Register - Updated with Name Fields
 */
export async function signup(
  username: string,
  email: string,
  password: string,
  first_name: string, // Added
  last_name: string // Added
) {
  try {
    const res = await api.post("/users/register/", {
      username,
      email,
      password,
      first_name, // Sent to backend
      last_name, // Sent to backend
    });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
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
