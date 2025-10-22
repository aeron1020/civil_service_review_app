"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`${API_BASE_URL}/quizzes/${id}/`);
        const data = await res.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [id]);

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
      <p className="text-gray-600 mb-6">{quiz.description}</p>

      {quiz.questions?.map((q: any, index: number) => (
        <div key={q.id} className="mb-4 border-b pb-3">
          <h2 className="font-semibold">
            {index + 1}. {q.text}
          </h2>
          <ul className="mt-2">
            {q.choices?.map((c: any) => (
              <li key={c.id} className="ml-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name={`q-${q.id}`} value={c.id} />
                  {c.text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
