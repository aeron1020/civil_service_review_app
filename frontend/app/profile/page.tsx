"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/apiClient";
import { getUserProfile } from "../lib/api";

interface QuizResult {
  id: number;
  quiz_title: string;
  quiz_type: string;
  score: number;
  correct: number;
  total: number;
  submitted_at: string;
}

interface UserProfileData {
  user: {
    id: number;
    username: string;
    email: string;
    date_joined?: string;
  };
  quiz_results: QuizResult[];
}

interface QuizSummary {
  code: string;
  name: string;
  average_score: number;
  best_score: number;
  total_quizzes: number;
}

export default function ProfileDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "summary" | "history">(
    "details"
  );
  const [quizSummary, setQuizSummary] = useState<QuizSummary[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);

        const QUIZ_TYPE_LABELS: Record<string, string> = {
          NUM: "Numerical Ability",
          VER: "Verbal Ability",
          ANA: "Analytical Ability",
          CLE: "Clerical Ability",
          GEN: "General Information",
        };

        const typesMap: Record<string, QuizSummary> = {};

        data.quiz_results.forEach((q: QuizResult) => {
          if (!typesMap[q.quiz_type]) {
            typesMap[q.quiz_type] = {
              code: q.quiz_type,
              name: QUIZ_TYPE_LABELS[q.quiz_type] || q.quiz_type || "Unknown",
              average_score: 0,
              best_score: 0,
              total_quizzes: 0,
            };
          }

          const t = typesMap[q.quiz_type];
          t.total_quizzes += 1;
          t.average_score += q.score;
          t.best_score = Math.max(t.best_score, q.score);
        });

        setQuizSummary(
          Object.values(typesMap).map((s) => ({
            ...s,
            average_score:
              s.total_quizzes > 0
                ? parseFloat((s.average_score / s.total_quizzes).toFixed(2))
                : 0,
          }))
        );
      } catch (err: any) {
        if (err?.response?.status === 401) {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading profile...</p>;
  }

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
      {/* HERO HEADER */}
      <div className="glass-card flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl animate-fadeIn text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {profile.user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, {profile.user.username}
          </h1>
          <p className="text-gray-500 mt-1">
            Track your progress, performance, and quiz activity.
          </p>
        </div>
      </div>

      {/* TOP ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl animate-fadeIn">
          <h3 className="text-gray-500 text-sm">Total Quizzes Taken</h3>
          <p className="mt-2 text-4xl font-bold">
            {profile.quiz_results.length}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl animate-fadeIn">
          <h3 className="text-gray-500 text-sm">Average Score</h3>
          <p className="mt-2 text-4xl font-bold">
            {quizSummary.length
              ? (
                  quizSummary.reduce((a, b) => a + b.average_score, 0) /
                  quizSummary.length
                ).toFixed(1)
              : "0"}
            %
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl animate-fadeIn">
          <h3 className="text-gray-500 text-sm">Best Subject</h3>
          <p className="mt-2 text-2xl font-semibold">
            {quizSummary.length
              ? quizSummary
                  .filter((s) => s.total_quizzes > 0)
                  .reduce((a, b) => (a.best_score > b.best_score ? a : b)).name
              : "None"}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b border-white/10 flex gap-8 mt-4">
        {(["details", "summary", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              pb-2 text-sm font-medium relative
              ${
                activeTab === tab
                  ? "text-indigo-600 font-semibold"
                  : "text-indigo-300 hover:text-indigo-100"
              }
            `}
          >
            {tab === "details"
              ? "User Details"
              : tab === "summary"
              ? "Quiz Summary"
              : "Quiz History"}

            {activeTab === tab && (
              <span className="absolute left-0 -bottom-[2px] w-full h-[2px] bg-indigo-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* USER DETAILS */}
      {activeTab === "details" && (
        <div className="glass-card p-8 rounded-2xl space-y-3 animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">Account Information</h2>
          <p>Email: {profile.user.email}</p>
          {profile.user.date_joined && (
            <p>
              Joined: {new Date(profile.user.date_joined).toLocaleDateString()}
            </p>
          )}
          <p>Total Attempts: {profile.quiz_results.length}</p>
        </div>
      )}

      {/* QUIZ SUMMARY */}
      {activeTab === "summary" && (
        <div className="glass-card p-8 rounded-2xl space-y-3 animate-fadeIn">
          {quizSummary.map((q) => (
            <div
              key={q.code}
              className="glass-card p-6 rounded-2xl animate-fadeIn"
            >
              <h3 className="text-lg font-bold">{q.name}</h3>
              <p className="text-sm text-gray-500">{q.code}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all ${
                    q.average_score >= 80
                      ? "bg-green-500"
                      : q.average_score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${q.average_score}%` }}
                ></div>
              </div>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Avg Score: <strong>{q.average_score}%</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Best Score: <strong>{q.best_score}%</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Attempts: <strong>{q.total_quizzes}</strong>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* QUIZ HISTORY */}
      {activeTab === "history" && (
        <div className="glass-card p-8 rounded-2xl space-y-3 animate-fadeIn">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="py-2 px-3">Quiz</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3 text-center">Score</th>
                <th className="py-2 px-3 text-center">Correct</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {profile.quiz_results.map((q) => (
                <tr key={q.id} className="glass-card bg-opacity-60 rounded-xl">
                  <td className="py-3 px-4 font-medium">{q.quiz_title}</td>
                  <td className="py-3 px-4">{q.quiz_type}</td>
                  <td
                    className={`py-3 px-4 text-center font-semibold ${
                      q.score >= 80
                        ? "text-green-600"
                        : q.score >= 50
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {q.score}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {q.correct}/{q.total}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(q.submitted_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
