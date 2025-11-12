"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/app/lib/auth";
import QuizProgressBar from "@/components/QuizProgressBar";
import QuizTimer from "@/components/QuizTimer";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
}
interface QuizDebugInfo {
  visible_questions: number;
  total_questions_in_db: number;
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
  time_limit?: number;
  debug_info?: QuizDebugInfo;
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

  // ✅ Fetch quiz + store visible question IDs
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`${API_BASE_URL}/quizzes/${id}/`);
        const data = await res.json();
        setQuiz(data);

        // Derive visible question IDs for debugging and submission
        const visibleIds = [
          ...(data.questions?.map((q: any) => q.id) || []),
          ...(data.passages?.flatMap((p: any) =>
            p.questions?.map((q: any) => q.id)
          ) || []),
          ...(data.datasets?.flatMap((d: any) =>
            d.questions?.map((q: any) => q.id)
          ) || []),
        ];
        sessionStorage.setItem(
          "visible_question_ids",
          JSON.stringify(visibleIds)
        );
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [id]);

  // ✅ Separate effect for scrolling up after result
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }
  }, [result]);

  // ✅ Handle answer selection
  const handleSelect = (questionId: number, choiceId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  // ✅ Submit answers
  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setResult(null);
    setError(null);

    const visibleIds = JSON.parse(
      sessionStorage.getItem("visible_question_ids") || "[]"
    );

    const payload = {
      answers: Object.entries(answers).map(([qId, cId]) => ({
        question: Number(qId),
        choice: cId,
      })),
      visible_questions: visibleIds,
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

      if (res.ok) {
        // 🔧 Get original question order
        const allQuestions = [
          ...(quiz.questions || []),
          ...(quiz.passages?.flatMap((p) => p.questions) || []),
          ...(quiz.datasets?.flatMap((d) => d.questions) || []),
        ];

        // 🔧 Reorder result.details based on original quiz order
        const orderedDetails = allQuestions
          .map((q) => data.details.find((d: any) => d.question === q.text))
          .filter(Boolean); // remove any undefined ones

        setResult({
          ...data,
          details: orderedDetails,
        });
      } else {
        setError(data.detail || data.error || "Failed to submit quiz");
      }
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
      <QuizProgressBar
        answeredCount={Object.keys(answers).length}
        totalCount={
          quiz.debug_info?.visible_questions ?? quiz.questions?.length ?? 0
        }
      />

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
            {/* ✅ Timer */}
            {quiz && quiz.time_limit && (
              <QuizTimer
                durationMinutes={quiz.time_limit} // directly from serializer
                onExpire={() => handleSubmit()} // auto-submit when time runs out
              />
            )}

            {/* 🧠 QUIZ DEBUG INFO */}
            {quiz && (
              <div className="mb-8 text-sm text-gray-500 bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/10">
                <p>
                  <strong>📘 QUIZ DEBUG INFO</strong>
                </p>
                {(() => {
                  const questions = quiz.questions || [];
                  const passages = quiz.passages || [];
                  const datasets = quiz.datasets || [];

                  const passageQuestionIds = new Set(
                    passages.flatMap((p) => p.questions?.map((q) => q.id) || [])
                  );
                  const datasetQuestionIds = new Set(
                    datasets.flatMap((d) => d.questions?.map((q) => q.id) || [])
                  );

                  const standaloneQs = questions.filter(
                    (q) =>
                      !passageQuestionIds.has(q.id) &&
                      !datasetQuestionIds.has(q.id)
                  );

                  const passageQs = passages.flatMap((p) => p.questions || []);
                  const datasetQs = datasets.flatMap((d) => d.questions || []);

                  const allVisibleIds = new Set([
                    ...standaloneQs.map((q) => q.id),
                    ...passageQs.map((q) => q.id),
                    ...datasetQs.map((q) => q.id),
                  ]);

                  const totalVisible = allVisibleIds.size;
                  const answeredCount = Object.keys(answers).length;

                  const totalDbIds = new Set([
                    ...questions.map((q) => q.id),
                    ...passages.flatMap((p) => p.questions.map((q) => q.id)),
                    ...datasets.flatMap((d) => d.questions.map((q) => q.id)),
                  ]);

                  return (
                    <>
                      <p>
                        <strong>Quiz:</strong> {quiz.title}
                      </p>
                      <p>
                        <strong>Standalone Questions:</strong>{" "}
                        {standaloneQs.length}
                      </p>
                      <p>
                        <strong>Passage-based Questions:</strong>{" "}
                        {passageQs.length}
                      </p>
                      <p>
                        <strong>Dataset-based Questions:</strong>{" "}
                        {datasetQs.length}
                      </p>
                      <p>
                        <strong>Displayed (Visible) Questions:</strong>{" "}
                        {totalVisible}
                      </p>
                      <p>
                        <strong>Total Questions in DB (unique):</strong>{" "}
                        {totalDbIds.size}
                      </p>
                      <p>
                        <strong>User Answered:</strong> {answeredCount} /{" "}
                        {totalVisible}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}

            {/* 🧩 Questions */}
            {quiz.questions
              ?.filter(
                (q) =>
                  !quiz.passages?.some((p) =>
                    p.questions.some((pq) => pq.id === q.id)
                  ) &&
                  !quiz.datasets?.some((d) =>
                    d.questions.some((dq) => dq.id === q.id)
                  )
              )
              .map((q, index) => (
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

            {/* 🧩 Passages */}
            {quiz.passages?.map((p, pIndex) => (
              <div key={p.id} className="mt-10">
                <div className="glass-card p-6 rounded-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    Reading Comprehension: {p.title}
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

            {/* 🧩 DataSets */}
            {quiz.datasets?.map((d, dIndex) => (
              <div key={d.id} className="mt-10">
                <div className="glass-card p-6 rounded-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    Data Interpretation {dIndex + 1}: {d.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {d.description}
                  </p>

                  {d.image && (
                    <div className="flex justify-center mb-6">
                      <img
                        src={d.image}
                        alt={d.title}
                        className="max-h-80 rounded-lg shadow-lg border border-white/10"
                      />
                    </div>
                  )}

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

            {/* 🧾 Submit */}
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
          </div>
        )}

        {/* ✅ Results */}
        {result && (
          <div className="text-center animate-fadeIn mt-6">
            <h2 className="text-2xl font-semibold mb-2">
              🎉 Your Result is Ready!
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

            <h3 className="mt-10 text-xl font-semibold mb-6 text-[var(--foreground)]">
              Detailed Breakdown
            </h3>

            <ul className="text-left space-y-4">
              {result.details.map((d, i) => (
                <li
                  key={i}
                  className={`glass-card relative p-5 rounded-xl border-l-4 flex flex-col sm:flex-row sm:items-start sm:gap-4 transition-all duration-300 ${
                    d.result === "correct"
                      ? "border-green-500/80 bg-green-50/10"
                      : "border-red-500/80 bg-red-50/10"
                  }`}
                >
                  {/* Number Bubble */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold absolute -left-4 top-4 shadow-md ${
                      d.result === "correct"
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
                      {d.result === "correct" ? (
                        <span className="flex items-center text-green-500 font-medium">
                          ✅ Correct
                        </span>
                      ) : d.result === "unanswered" ? (
                        <span className="flex items-center text-gray-400 font-medium">
                          ⏸ Unanswered
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 font-medium">
                          ❌ Wrong
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                      {d.explanation}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* 🧭 Modern Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-full font-semibold text-[var(--accent)] bg-white/10 border border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-blue-400 transition-all duration-300 backdrop-blur-md"
              >
                Try Again 🔄
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
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
