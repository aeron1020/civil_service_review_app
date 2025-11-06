"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";

export default function RandomQuizCard() {
  const quizModes = [
    { type: "VER", title: "Verbal" },
    { type: "ANA", title: "Analytical" },
    { type: "NUM", title: "Numerical" },
    { type: "GEN", title: "General Info" },
    { type: "CLE", title: "Clerical" },
  ];

  return (
    <div className="mt-16 text-center animate-fadeIn">
      <h2 className="text-3xl font-semibold mb-4">
        🎯 Try Randomized Quizzes by Type
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        Challenge yourself with 20 random questions from multiple quizzes of the
        same type.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-3xl mx-auto">
        {quizModes.map(({ type, title }) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="glass-card p-6 rounded-2xl transition-all duration-200 hover:shadow-[0_8px_24px_rgba(10,132,255,0.2)]"
          >
            <h3 className="font-bold text-lg mb-3">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Randomized 20-item quiz from all {title} sets.
            </p>

            <Link
              href={`/quiz-type/${type}`}
              className="btn-stylish inline-flex items-center gap-2 text-sm font-medium"
            >
              <Shuffle size={16} />
              Start Random {title}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
