"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/app/lib/auth";
import QuizProgressBar from "@/components/QuizProgressBar";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Choice {
  id: number;
  text: string;
  is_correct?: boolean;
}

interface Question {
  id: number;
  text: string;
  explanation?: string;
  quiz_name: string;
  choices: Choice[];
}

interface Passage {
  id: number;
  title: string;
  text: string;
  questions: Question[];
}

interface QuizResponse {
  mode: string;
  quiz_type: string;
  delivered: number;
  has_passage: boolean;
  passage?: Passage | null;
  questions: Question[];
  datasets?: DataSet[];
}

interface DataSet {
  id: number;
  title: string;
  description?: string;
  image?: string;
  questions: Question[];
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

export default function RandomQuizTypePage() {
  const { type } = useParams();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // // 🧩 Fetch random quiz by type (VER, ANA, etc.)
  // useEffect(() => {
  //   async function fetchRandomQuiz() {
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`${API_BASE_URL}/quizzes/random/?type=${type}`);
  //       const data = await res.json();

  //       if (!res.ok) {
  //         setError(data.error || "Failed to load random quiz");
  //         return;
  //       }

  //       // ✅ Format to match consistent structure
  //       const formatted = {
  //         ...data,
  //         passages: data.passage ? [data.passage] : [],
  //         datasets: [],
  //       };

  //       setQuiz(formatted);

  //       // Store question IDs for submission later
  //       const visibleIds = [
  //         ...(data.questions?.map((q: any) => q.id) || []),
  //         ...(data.passage?.questions?.map((q: any) => q.id) || []),
  //       ];
  //       sessionStorage.setItem(
  //         "visible_question_ids",
  //         JSON.stringify(visibleIds)
  //       );
  //     } catch (err) {
  //       console.error("Error fetching random quiz:", err);
  //       setError("Unexpected error occurred while loading quiz.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchRandomQuiz();
  // }, [type]);

  useEffect(() => {
    async function fetchRandomQuiz() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/quizzes/random/?type=${type}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load random quiz");
          return;
        }

        // Format quiz data to include passages and datasets
        const formatted = {
          ...data,
          passages: data.passage ? [data.passage] : [],
          datasets: data.datasets || [],
        };

        setQuiz(formatted);

        // Collect visible question IDs (standalone + passages + datasets)
        const visibleIds: number[] = [
          ...(data.questions?.map((q: any) => q.id) || []),
          ...(data.passage?.questions?.map((q: any) => q.id) || []),
          ...(data.datasets?.flatMap((ds: any) =>
            ds.questions.map((q: any) => q.id)
          ) || []),
        ];

        sessionStorage.setItem(
          "visible_question_ids",
          JSON.stringify(visibleIds)
        );
      } catch (err) {
        console.error("Error fetching random quiz:", err);
        setError("Unexpected error occurred while loading quiz.");
      } finally {
        setLoading(false);
      }
    }

    fetchRandomQuiz();
  }, [type]);

  // ✅ Separate effect for scrolling up after result
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }
  }, [result]);

  const handleSelect = (questionId: number, choiceId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setError(null);
    setResult(null);

    const visibleIds = JSON.parse(
      sessionStorage.getItem("visible_question_ids") || "[]"
    );

    const payload = {
      answers: Object.entries(answers).map(([qId, cId]) => ({
        question: Number(qId),
        choice: cId,
      })),
      visible_questions: visibleIds,
      quiz_type: quiz.quiz_type,
    };

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/quizzes/random/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const allQuestions = [
          ...(quiz.questions || []),
          ...(quiz.passage?.questions || []),
          ...(quiz.datasets?.flatMap((ds) => ds.questions) || []),
        ];

        const orderedDetails = allQuestions
          .map((q) => data.details.find((d: any) => d.question === q.text))
          .filter(Boolean);

        setResult({ ...data, details: orderedDetails });
      } else {
        setError(data.detail || data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Unexpected error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading random quiz...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error || "Error loading quiz."}
      </p>
    );

  if (!quiz)
    return (
      <p className="text-center mt-10">No quiz available for this type.</p>
    );

  return (
    <div className="pt-24 p-6 max-w-3xl mx-auto animate-fadeIn">
      <QuizProgressBar
        answeredCount={Object.keys(answers).length}
        totalCount={quiz.delivered || quiz.questions?.length || 0}
      />

      <div className="glass-card p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-[var(--accent)] to-blue-500 bg-clip-text text-transparent">
          Randomized {quiz.quiz_type} Quiz
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Unique random quiz generated across all {quiz.quiz_type} quizzes.
        </p>

        {/* ✅ Quiz content */}
        {!result ? (
          <>
            {/* Standalone Questions */}
            {quiz.questions?.map((q, index) => (
              <div
                key={q.id}
                className="glass-card p-5 rounded-2xl border border-white/20 hover:border-[var(--accent)]/40 transition-all duration-200 mb-6"
              >
                {" "}
                <div className="flex justify-end">
                  <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {q.quiz_name}
                  </span>
                </div>
                <h2 className="font-semibold text-lg mb-4 text-[var(--foreground)]">
                  {index + 1}. {q.text}
                </h2>
                <ul className="space-y-3">
                  {q.choices.map((c) => (
                    <li key={c.id}>
                      <div
                        onClick={() => handleSelect(q.id, c.id)}
                        className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border flex justify-between items-center ${
                          answers[q.id] === c.id
                            ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] font-semibold scale-[1.02] shadow-md"
                            : "border-white/20 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
                        }`}
                      >
                        <span>{c.text}</span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
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

            {/* Passage Section */}
            {quiz.passage && (
              <div className="mt-10">
                <div className="glass-card p-6 rounded-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    Reading Comprehension: {quiz.passage.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
                    {quiz.passage.text}
                  </p>

                  {quiz.passage.questions.map((q, i) => (
                    <div key={q.id} className="mt-6">
                      <div className="flex justify-end">
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                          {q.quiz_name}
                        </span>
                      </div>

                      <h3 className="font-semibold mb-2">
                        {i + 1}. {q.text}
                      </h3>
                      <ul className="space-y-3">
                        {q.choices.map((c) => (
                          <li key={c.id}>
                            <div
                              onClick={() => handleSelect(q.id, c.id)}
                              className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border flex justify-between items-center ${
                                answers[q.id] === c.id
                                  ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] font-semibold scale-[1.02] shadow-md"
                                  : "border-white/20 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
                              }`}
                            >
                              <span>{c.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Dataset Section */}
            {quiz.datasets?.map((dataset, dIndex) => (
              <div key={dataset.id} className="mt-10">
                <div className="glass-card p-6 rounded-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    Dataset: {dataset.title}
                  </h2>
                  {dataset.image && (
                    <img
                      src={dataset.image}
                      alt={dataset.title}
                      className="mb-4 max-w-full rounded-lg"
                    />
                  )}
                  {dataset.questions.map((q, i) => (
                    <div key={q.id} className="mt-6">
                      <div className="flex justify-end">
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                          {q.quiz_name}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        {i + 1}. {q.text}
                      </h3>
                      <ul className="space-y-3">
                        {q.choices.map((c) => (
                          <li key={c.id}>
                            <div
                              onClick={() => handleSelect(q.id, c.id)}
                              className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border flex justify-between items-center ${
                                answers[q.id] === c.id
                                  ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] font-semibold scale-[1.02] shadow-md"
                                  : "border-white/20 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
                              }`}
                            >
                              <span>{c.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-full font-semibold text-[var(--accent)] bg-white/10 border border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-blue-400 transition-all duration-300 backdrop-blur-md"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
            {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          </>
        ) : (
          <div className="text-center animate-fadeIn mt-6">
            <h2 className="text-2xl font-semibold mb-2">
              🎉 Your Random Quiz Result!
            </h2>

            {/* Summary Card */}
            <div className="glass-card inline-block px-8 py-5 mt-4 rounded-2xl border border-[var(--accent)]/30 shadow-lg">
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

            {/* Detailed Breakdown */}
            <h3 className="mt-10 text-xl font-semibold mb-6 text-[var(--foreground)]">
              Detailed Breakdown
            </h3>

            <ul className="text-left space-y-4">
              {result.details.map((d, i) => (
                <li
                  key={i}
                  className={`glass-card relative p-5 rounded-xl border-l-4 flex flex-col sm:flex-row sm:items-start sm:gap-4 transition-all duration-300 ${
                    d.result?.toLowerCase().includes("correct")
                      ? "border-green-500/80 bg-green-50/10"
                      : "border-red-500/80 bg-red-50/10"
                  }`}
                >
                  {/* Number Bubble */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold absolute -left-4 top-4 shadow-md ${
                      d.result?.toLowerCase().includes("correct")
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* Question + Explanation */}
                  <div className="flex-1 pl-6">
                    <p className="font-semibold text-[var(--foreground)] leading-snug">
                      {d.question}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      {d.result?.toLowerCase().includes("correct") ? (
                        <span className="flex items-center text-green-500 font-medium">
                          ✅ Correct
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 font-medium">
                          ❌ Wrong
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                      {d.explanation || "No explanation provided."}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-full font-semibold text-[var(--accent)] bg-white/10 border border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-blue-400 transition-all duration-300 backdrop-blur-md"
              >
                Try Again 🔄
              </button>

              <a
                href="/"
                className="px-8 py-3 rounded-full font-semibold text-[var(--accent)] bg-white/10 border border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-blue-400 transition-all duration-300 backdrop-blur-md"
              >
                Back to Quizzes 🏠
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
