// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getToken } from "@/app/lib/auth";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// interface Choice {
//   id: number;
//   text: string;
//   is_correct: boolean;
// }

// interface Question {
//   id: number;
//   text: string;
//   explanation: string;
//   choices: Choice[];
// }

// interface Quiz {
//   id: number;
//   title: string;
//   description: string;
//   questions: Question[];
// }

// interface ResultDetail {
//   question: string;
//   your_answer: string;
//   result: string;
//   explanation: string;
// }

// interface QuizResult {
//   quiz: string;
//   score: number;
//   correct: number;
//   total: number;
//   details: ResultDetail[];
// }

// export default function QuizDetailPage() {
//   const { id } = useParams();
//   const [quiz, setQuiz] = useState<Quiz | null>(null);
//   const [answers, setAnswers] = useState<Record<number, number>>({});
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [result, setResult] = useState<QuizResult | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchQuiz() {
//       try {
//         const res = await fetch(`${API_BASE_URL}/quizzes/${id}/`);
//         const data = await res.json();
//         setQuiz(data);
//       } catch (error) {
//         console.error("Error loading quiz:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchQuiz();
//   }, [id]);

//   const handleSelect = (questionId: number, choiceId: number) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
//   };

//   const handleSubmit = async () => {
//     if (!quiz) return;
//     setSubmitting(true);
//     setResult(null);
//     setError(null);

//     const payload = {
//       answers: Object.entries(answers).map(([qId, cId]) => ({
//         question: Number(qId),
//         choice: cId,
//       })),
//     };

//     try {
//       const token = getToken();

//       const res = await fetch(`${API_BASE_URL}/quizzes/${id}/submit/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setResult(data);
//       } else {
//         console.error("Error submitting quiz:", data);
//         setError(data.detail || data.error || "Failed to submit quiz");
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError("An unexpected error occurred");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
//   if (!quiz) return <p className="text-center mt-10">Quiz not found.</p>;

//   return (
//     <div className="pt-24 p-6 max-w-3xl mx-auto animate-fadeIn">
//       <div className="glass-card p-8">
//         <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
//         <p className="text-gray-700 dark:text-gray-300 mb-6">
//           {quiz.description}
//         </p>

//         {/* 👇 Hide questions once result appears */}
//         {!result && (
//           <div className="space-y-6">
//             {quiz.questions.map((q, index) => (
//               <div
//                 key={q.id}
//                 className="glass-card p-5 rounded-xl shadow-sm border border-white/10"
//               >
//                 <h2 className="font-semibold text-lg mb-3">
//                   {index + 1}. {q.text}
//                 </h2>
//                 <ul className="space-y-2">
//                   {q.choices.map((c) => (
//                     <li key={c.id}>
//                       <div
//                         key={c.id}
//                         onClick={() => handleSelect(q.id, c.id)}
//                         className={`glass-card cursor-pointer p-3 rounded-xl border transition-all duration-200
//                           ${
//                             answers[q.id] === c.id
//                               ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-md scale-[1.02]"
//                               : "border-[var(--glass-border)] hover:border-[var(--accent)]/40 hover:shadow-sm"
//                           }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span
//                             className={`transition-colors ${
//                               answers[q.id] === c.id
//                                 ? "text-[var(--accent)] font-semibold"
//                                 : ""
//                             }`}
//                           >
//                             {c.text}
//                           </span>

//                           {/* Custom blue dot when selected */}
//                           <div
//                             className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
//                               answers[q.id] === c.id
//                                 ? "border-[var(--accent)] bg-[var(--accent)]"
//                                 : "border-[var(--accent)]/40 bg-transparent"
//                             }`}
//                           ></div>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}

//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="btn-primary"
//               >
//                 {submitting ? "Submitting..." : "Submit Quiz"}
//               </button>
//             </div>

//             {error && <p className="text-red-500 text-center mt-3">{error}</p>}
//           </div>
//         )}

//         {/* ✅ Result Section */}
//         {result && (
//           <div className="text-center animate-fadeIn">
//             <h2 className="text-2xl font-semibold mb-2">
//               🎉 Your Result is Ready!
//             </h2>
//             <div className="glass-card inline-block px-8 py-5 mt-4">
//               <p className="text-lg mb-1">
//                 Score:{" "}
//                 <strong className="text-[var(--accent)]">
//                   {result.score}%
//                 </strong>
//               </p>
//               <p>
//                 Correct:{" "}
//                 <strong className="text-green-600">{result.correct}</strong> /{" "}
//                 {result.total}
//               </p>
//             </div>

//             <h3 className="mt-6 text-xl font-semibold mb-3">
//               Detailed Breakdown
//             </h3>
//             <ul className="text-left space-y-4">
//               {result.details.map((d, i) => (
//                 <li
//                   key={i}
//                   className="glass-card p-4 border-l-4 border-[var(--accent)]"
//                 >
//                   <p className="font-semibold">{d.question}</p>
//                   <p
//                     className={`text-sm ${
//                       d.result === "correct" ? "text-green-600" : "text-red-500"
//                     }`}
//                   >
//                     {d.result.toUpperCase()}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
//                     {d.explanation}
//                   </p>
//                 </li>
//               ))}
//             </ul>

//             <button
//               onClick={() => window.location.reload()}
//               className="btn-primary mt-6"
//             >
//               Try Again
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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

interface Quiz {
  id: number;
  title: string;
  description: string;
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
            {quiz.questions.map((q, index) => (
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
