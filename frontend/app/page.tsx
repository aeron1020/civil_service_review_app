"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/lib/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);

    async function fetchQuizzes() {
      try {
        const response = await fetch(`${API_BASE_URL}/quizzes/`);
        const data = await response.json();
        setQuizzes(data.results || data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  if (!isAuthenticated)
    if (loading)
      // return <p className="text-center mt-10 text-red-600">Please log in.</p>;

      return (
        <p className="text-center mt-10 " style={{ marginTop: "80px" }}>
          Loading quizzes...
        </p>
      );
  if (!quizzes.length)
    return <p className="text-center mt-10">No quizzes found.</p>;

  return (
    <div className="pt-24 px-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Civil Service Review Quizzes
      </h1>
      <div className="text-center max-w-2xl mx-auto mb-8 text-gray-700">
        <p>
          Practice for the Civil Service Exam with category-based quizzes. Each
          quiz is designed to help you master specific skills and question types
          you'll encounter in the real exam.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/quiz/${quiz.id}`}
            className="glass-card p-5 hover:scale-[1.02] transition"
          >
            <h2 className="font-semibold text-lg mb-1">{quiz.title}</h2>
            <p className="text-sm opacity-80">{quiz.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
