"use client";

import { useEffect, useState } from "react";

interface QuizTimerProps {
  durationMinutes: number; // total quiz duration in minutes
  onExpire?: () => void; // callback when time runs out
  isPaused?: boolean; // optional to pause the timer
}

export default function QuizTimer({
  durationMinutes,
  onExpire,
  isPaused,
}: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // seconds

  // Format time helper
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onExpire]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-[var(--accent)]">
          Time Left: {formatTime(timeLeft)}
        </span>
        {timeLeft === 0 && (
          <span className="text-red-500 font-bold">⏰ Time's up!</span>
        )}
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-1000"
          style={{ width: `${(timeLeft / (durationMinutes * 60)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
