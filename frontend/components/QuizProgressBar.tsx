"use client";

import React, { useEffect, useState } from "react";

interface QuizProgressBarProps {
  answeredCount: number;
  totalCount: number;
}

const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  answeredCount,
  totalCount,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress =
    totalCount > 0 ? Math.min((answeredCount / totalCount) * 100, 100) : 0;

  return (
    <div
      className={`fixed left-0 w-full z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "top-0 h-3 shadow-md" : "top-16 h-10 shadow-sm"
      }`}
    >
      {/* Background Bar */}
      <div className="w-full h-full bg-[rgba(240,240,245,0.5)] dark:bg-[rgba(30,30,35,0.5)] border border-[rgba(255,255,255,0.2)] dark:border-[rgba(255,255,255,0.08)] overflow-hidden rounded-full">
        {/* Progress Fill */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-in-out bg-gradient-to-r from-[var(--accent)] via-blue-500 to-cyan-400 dark:from-[var(--accent)] dark:via-blue-400 dark:to-sky-300 shadow-[0_0_8px_rgba(10,132,255,0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Label */}
      <div
        className={`absolute inset-0 flex items-center justify-center text-[11px] font-medium transition-all duration-300 ${
          scrolled
            ? "text-[rgba(255,255,255,0.85)] tracking-wider"
            : "text-[rgba(40,40,50,0.8)] dark:text-[rgba(240,240,255,0.75)]"
        }`}
      >
        {answeredCount} / {totalCount} answered ({Math.round(progress)}%)
      </div>
    </div>
  );
};

export default QuizProgressBar;
