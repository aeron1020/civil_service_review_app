"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/app/lib/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  text: string;
  explanation: string;
  choices: Choice[];
}

interface Passage {
  id: number;
  title: string;
  text: string;
  questions: Question[];
}

interface DataSet {
  id: number;
  title: string;
  description: string;
  image: string;
  questions: Question[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  passages: Passage[];
  datasets: DataSet[];
}

interface ResultDetail {
  question: string;
  your_answer: string;
  result: string;
  explanation: string;
}

interface QuizResult {
  quiz: string;
  score: number;
  correct: number;
  total: number;
  details: ResultDetail[];
}

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSelect = (questionId: number, choiceId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setResult(null);
    setError(null);

    const payload = {
      answers: Object.entries(answers).map(([qId, cId]) => ({
        question: Number(qId),
        choice: cId,
      })),
    };

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/quizzes/${id}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.detail || data.error || "Failed to submit quiz");
    } catch (err) {
      console.error("Submit error:", err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (!quiz) return <p className="text-center mt-10">Quiz not found.</p>;

  return (
    <div className="pt-24 p-6 max-w-3xl mx-auto animate-fadeIn">
      <div className="glass-card p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-[var(--accent)] to-blue-500 bg-clip-text text-transparent">
          {quiz.title}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {quiz.description}
        </p>

        {/* 👇 Hide questions once result appears */}
        {!result && (
          <div className="space-y-8">
            {/* Standalone Questions (e.g., Vocabulary, Grammar) */}
            {quiz.questions?.map((q, index) => (
              <div
                key={q.id}
                className="glass-card p-5 rounded-2xl border border-white/20 hover:border-[var(--accent)]/40 transition-all duration-200"
              >
                <h2 className="font-semibold text-lg mb-4 text-[var(--foreground)]">
                  {index + 1}. {q.text}
                </h2>

                <ul className="space-y-3">
                  {q.choices.map((c) => (
                    <li key={c.id}>
                      <div
                        onClick={() => handleSelect(q.id, c.id)}
                        className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-md border flex justify-between items-center
                  ${
                    answers[q.id] === c.id
                      ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] font-semibold scale-[1.02] shadow-md"
                      : "border-white/20 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
                  }`}
                      >
                        <span>{c.text}</span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                            answers[q.id] === c.id
                              ? "border-[var(--accent)] bg-[var(--accent)]"
                              : "border-[var(--accent)]/40"
                          }`}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 🧩 Reading Comprehension (Passages + their Questions) */}
            {quiz.passages?.map((p, pIndex) => (
              <div key={p.id} className="mt-10">
                <div className="glass-card p-6 rounded-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    Reading Comprehension {pIndex + 1}: {p.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {p.text}
                  </p>

                  {p.questions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="mt-6 glass-card p-5 rounded-2xl border border-white/20 hover:border-[var(--accent)]/40 transition-all duration-200"
                    >
                      <h3 className="font-semibold text-lg mb-4 text-[var(--foreground)]">
                        {qIndex + 1}. {q.text}
                      </h3>

                      <ul className="space-y-3">
                        {q.choices.map((c) => (
                          <li key={c.id}>
                            <div
                              onClick={() => handleSelect(q.id, c.id)}
                              className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-md border flex justify-between items-center
                        ${
                          answers[q.id] === c.id
                            ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] font-semibold scale-[1.02] shadow-md"
                            : "border-white/20 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
                        }`}
                            >
                              <span>{c.text}</span>
                              <div
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                  answers[q.id] === c.id
                                    ? "border-[var(--accent)] bg-[var(--accent)]"
                                    : "border-[var(--accent)]/40"
                                }`}
                              ></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 📊 Data Interpretation (with images + questions) */}
            {quiz.datasets?.map((d, dIndex) => (
              <div key={d.id} className="mt-10">
                <div className="glass-card p-6 rounded-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    Data Interpretation {dIndex + 1}: {d.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {d.description}
                  </p>

                  {/* 🖼 Display dataset image */}
                  {d.image && (
                    <div className="flex justify-center mb-6">
                      <img
                        src={d.image}
                        alt={d.title}
                        className="max-h-80 rounded-lg shadow-lg border border-white/10"
                      />
                    </div>
                  )}

                  {/* Questions related to the dataset */}
                  {d.questions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="mt-6 glass-card p-5 rounded-2xl border border-white/20 hover:border-[var(--accent)]/40 transition-all duration-200"
                    >
                      <h3 className="font-semibold text-lg mb-4 text-[var(--foreground)]">
                        {qIndex + 1}. {q.text}
                      </h3>

                      <ul className="space-y-3">
                        {q.choices.map((c) => (
                          <li key={c.id}>
                            <div
                              onClick={() => handleSelect(q.id, c.id)}
                              className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-md border flex justify-between items-center
                    ${
                      answers[q.id] === c.id
                        ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] font-semibold scale-[1.02] shadow-md"
                        : "border-white/20 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
                    }`}
                            >
                              <span>{c.text}</span>
                              <div
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                  answers[q.id] === c.id
                                    ? "border-[var(--accent)] bg-[var(--accent)]"
                                    : "border-[var(--accent)]/40"
                                }`}
                              ></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>

            {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          </div>
        )}

        {/* ✅ Result Section */}
        {result && (
          <div className="text-center animate-fadeIn mt-6">
            <h2 className="text-2xl font-semibold mb-2">
              🎉 Your Result is Ready!
            </h2>
            <div className="glass-card inline-block px-8 py-5 mt-4 rounded-2xl border border-[var(--accent)]/30">
              <p className="text-lg mb-1">
                Score:{" "}
                <strong className="text-[var(--accent)] text-2xl">
                  {result.score}%
                </strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Correct:{" "}
                <strong className="text-green-600">{result.correct}</strong> /{" "}
                {result.total}
              </p>
            </div>

            <h3 className="mt-8 text-xl font-semibold mb-4 text-[var(--foreground)]">
              Detailed Breakdown
            </h3>
            <ul className="text-left space-y-4">
              {result.details.map((d, i) => (
                <li
                  key={i}
                  className={`glass-card p-4 rounded-xl border-l-4 ${
                    d.result === "correct"
                      ? "border-green-500/80"
                      : "border-red-500/80"
                  }`}
                >
                  <p className="font-semibold">{d.question}</p>
                  <p
                    className={`text-sm mt-1 ${
                      d.result === "correct"
                        ? "text-green-500 font-medium"
                        : "text-red-400 font-medium"
                    }`}
                  >
                    {d.result.toUpperCase()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {d.explanation}
                  </p>
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold mt-8 hover:bg-blue-600 transition-all duration-200 shadow-md"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
