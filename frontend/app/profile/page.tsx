"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "../lib/api";
import { logout } from "../lib/auth";

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
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"details" | "summary" | "history">(
    "details"
  );
  const [quizSummary, setQuizSummary] = useState<QuizSummary[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: UserProfileData = await getUserProfile();
        setProfile(data);

        // Generate quiz summary per type
        const typesMap: Record<string, QuizSummary> = {};
        data.quiz_results.forEach((q: QuizResult) => {
          if (!typesMap[q.quiz_type]) {
            typesMap[q.quiz_type] = {
              code: q.quiz_type,
              name: q.quiz_title,
              average_score: 0,
              best_score: 0,
              total_quizzes: 0,
            };
          }
          const t: QuizSummary = typesMap[q.quiz_type];
          t.total_quizzes += 1;
          t.average_score += q.score;
          if (q.score > t.best_score) t.best_score = q.score;
        });

        const summaryArr: QuizSummary[] = Object.values(typesMap).map((s) => ({
          ...s,
          average_score: s.total_quizzes
            ? parseFloat((s.average_score / s.total_quizzes).toFixed(2))
            : 0,
        }));

        setQuizSummary(summaryArr);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load profile. Please log in again.");
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {profile.user.username}
      </h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {(["details", "summary", "history"] as const).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-gray-500 hover:text-[var(--accent)]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details"
              ? "User Details"
              : tab === "summary"
              ? "Quiz Summary"
              : "Quiz History"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="glass-card p-6 space-y-2">
          <p>Email: {profile.user.email}</p>
          {profile.user.date_joined && (
            <p>
              Joined: {new Date(profile.user.date_joined).toLocaleDateString()}
            </p>
          )}
          <p>Total Quizzes Taken: {profile.quiz_results.length}</p>
        </div>
      )}

      {activeTab === "summary" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizSummary.length === 0 && <p>No quiz summary available.</p>}
          {quizSummary.map((q: QuizSummary) => (
            <div
              key={q.code}
              className="glass-card p-6 transition hover:scale-[1.02]"
            >
              <h3 className="font-semibold text-lg">{q.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Type: {q.code}</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    q.average_score >= 80
                      ? "bg-green-500"
                      : q.average_score >= 50
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${q.average_score}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Avg: {q.average_score}% | Best: {q.best_score}%
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Total Quizzes: {q.total_quizzes}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="overflow-x-auto glass-card p-4">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="py-2 px-4 text-left">Quiz</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-center">Score</th>
                <th className="py-2 px-4 text-center">Correct/Total</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {profile.quiz_results.map((q: QuizResult) => (
                <tr
                  key={q.id}
                  className="border-t border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{q.quiz_title}</td>
                  <td className="py-2 px-4">{q.quiz_type}</td>
                  <td
                    className={`py-2 px-4 text-center font-semibold ${
                      q.score >= 80
                        ? "text-green-600"
                        : q.score >= 50
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {q.score}%
                  </td>
                  <td className="py-2 px-4 text-center">
                    {q.correct}/{q.total}
                  </td>
                  <td className="py-2 px-4">
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
