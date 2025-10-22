const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchQuizzes() {
  const response = await fetch(`${API_BASE_URL}/quizzes/`);
  if (!response.ok) throw new Error("Failed to fetch quizzes");

  const data = await response.json();

  // ✅ If paginated, return only the results array
  return data.results || data;
}

export async function fetchQuizDetail(id: number) {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}/`);
  if (!response.ok) throw new Error("Failed to fetch quiz details");
  return response.json();
}
