"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RandomQuizCard from "@/components/RandomQuizCard";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // change this in production

type Quiz = {
  id: number;
  title: string;
  description: string;
  quiz_type: string;
  quiz_type_display?: string;
  is_random: boolean;
  questions?: number[];
};

// 🧠 Guest Question Memory Utilities
function getTakenQuestionIds(): number[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("guest_taken_questions") || "[]");
}

function saveTakenQuestionIds(ids: number[]) {
  if (typeof window === "undefined") return;
  const current = getTakenQuestionIds();
  const merged = Array.from(new Set([...current, ...ids]));
  localStorage.setItem("guest_taken_questions", JSON.stringify(merged));
}

function hasTakenQuestion(id: number): boolean {
  return getTakenQuestionIds().includes(id);
}

function clearOldGuestQuestions(days = 7) {
  // Optional expiration logic (for weekly reset)
  const lastReset = localStorage.getItem("guest_reset_time");
  const now = Date.now();
  if (!lastReset || now - Number(lastReset) > days * 24 * 60 * 60 * 1000) {
    localStorage.removeItem("guest_taken_questions");
    localStorage.setItem("guest_reset_time", String(now));
  }
}

// ✅ NEW: Mark question as taken (can be called by quiz pages)
export function markQuestionAsTaken(id: number) {
  const current = getTakenQuestionIds();
  if (!current.includes(id)) {
    current.push(id);
    localStorage.setItem("guest_taken_questions", JSON.stringify(current));
  }
}

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");

  // ✅ Clear old data every week
  useEffect(() => {
    clearOldGuestQuestions(7);
  }, []);

  // ✅ Fetch all paginated quizzes
  useEffect(() => {
    async function fetchAllQuizzes(
      url = `${API_BASE_URL}/quizzes/`,
      all: Quiz[] = []
    ): Promise<Quiz[]> {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();

        const combined = [...all, ...(data.results || data)];
        if (data.next) return fetchAllQuizzes(data.next, combined);
        return combined;
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        return all;
      }
    }

    fetchAllQuizzes()
      .then((allQuizzes) => {
        // Exclude random quizzes
        const normalQuizzes = allQuizzes.filter((q) => !q.is_random);

        // ✅ Filter out quizzes that contain *only* taken questions (guest)
        const takenIds = getTakenQuestionIds();
        const filtered = normalQuizzes.filter((quiz) => {
          if (!quiz.questions || quiz.questions.length === 0) return true;
          // If all questions in this quiz are taken, skip it
          return !quiz.questions.every((q) => takenIds.includes(q));
        });

        setQuizzes(filtered);

        if (filtered.length > 0) {
          const firstType =
            filtered[0].quiz_type_display || filtered[0].quiz_type || "Other";
          setSelectedType(firstType);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Track taken questions after quiz submission
  useEffect(() => {
    function handleQuizCompletion(event: StorageEvent) {
      if (event.key === "quiz_submission") {
        try {
          const submitted = JSON.parse(event.newValue || "[]");
          saveTakenQuestionIds(submitted);
          localStorage.removeItem("quiz_submission"); // cleanup
        } catch (e) {
          console.error("Error saving guest question memory:", e);
        }
      }
    }
    window.addEventListener("storage", handleQuizCompletion);
    return () => window.removeEventListener("storage", handleQuizCompletion);
  }, []);

  if (loading)
    return (
      <p className="text-center mt-24 text-gray-600 animate-pulse">
        Loading quizzes...
      </p>
    );

  if (!quizzes.length)
    return <p className="text-center mt-24 text-gray-500">No quizzes found.</p>;

  // ✅ Group quizzes by quiz_type
  const grouped = quizzes.reduce((acc: Record<string, Quiz[]>, quiz) => {
    const type = quiz.quiz_type_display || quiz.quiz_type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(quiz);
    return acc;
  }, {});

  const quizTypes = Object.keys(grouped);

  // ✅ Type labels in one word
  const typeTitles: Record<string, string> = {
    ver: "Verbal",
    num: "Numerical",
    gen: "Gen Info",
    ana: "Analytical",
    cle: "Clerical",
  };

  const selectedTitle =
    typeTitles[selectedType?.toLowerCase()] || selectedType.toLowerCase();

  return (
    <div className="pt-6 px-6 animate-fadeIn min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Civil Service Review Quizzes
      </h1>

      <p className="text-center max-w-2xl mx-auto mb-10 text-gray-700 dark:text-gray-300">
        Choose a category below to explore quizzes based on the Civil Service
        Exam coverage.
      </p>

      {/* ✅ Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {quizTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border 
              ${
                selectedType === type
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                  : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-[var(--accent)]/10"
              }`}
          >
            {typeTitles[type.toLowerCase()] || type}
          </button>
        ))}
      </div>

      {/* ✅ Animated Quiz Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100 capitalize">
            {selectedTitle}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped[selectedType]
              ?.filter((quiz) => !quiz.is_random) // ✅ exclude random quizzes
              .map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="glass-card p-5 rounded-xl border border-gray-200/60 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-[0_4px_20px_rgba(10,132,255,0.25)] transition-all duration-300"
                >
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quiz.description || "No description available"}
                  </p>
                </Link>
              ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-24">
        <RandomQuizCard />
      </div>
    </div>
  );
}
