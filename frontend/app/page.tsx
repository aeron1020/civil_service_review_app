"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch(`${API_BASE_URL}/quizzes/`);
        const data = await response.json();
        // 👇 FIX: handle paginated data
        setQuizzes(data.results || data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Civil Service Review Quizzes</h1>

      <ul className="space-y-3">
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            className="p-4 border rounded hover:bg-gray-100 transition"
          >
            <li key={quiz.id} className="p-4 border rounded hover:bg-gray-50">
              <Link href={`/quiz/${quiz.id}`}>
                <h2 className="font-semibold">{quiz.title}</h2>
                <p className="text-sm text-gray-600">{quiz.description}</p>
              </Link>
            </li>
          </li>
        ))}
      </ul>
    </div>
  );
}
