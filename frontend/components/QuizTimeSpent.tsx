// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// interface QuizTimeSpentProps {
//   isPaused?: boolean;
//   onTimeUpdate?: (seconds: number) => void;
// }

// export default function QuizTimeSpent({
//   isPaused = false,
//   onTimeUpdate,
// }: QuizTimeSpentProps) {
//   const [seconds, setSeconds] = useState(0);

//   // Format into MM:SS
//   const formatTime = (s: number) => {
//     const m = Math.floor(s / 60)
//       .toString()
//       .padStart(2, "0");
//     const sec = (s % 60).toString().padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   useEffect(() => {
//     if (isPaused) return;

//     const interval = setInterval(() => {
//       setSeconds((prev) => {
//         const next = prev + 1;
//         onTimeUpdate?.(next);
//         return next;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isPaused, onTimeUpdate]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -4 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.25 }}
//       className="flex items-center justify-between mb-4"
//     >
//       <div className="flex items-center gap-3">
//         <span className="text-base font-semibold text-gray-700">
//           Time Spent:
//         </span>

//         <span
//           className="
//             px-4 py-1
//             rounded-full
//             bg-[var(--accent)]/10
//             text-[var(--accent)]
//             font-bold
//             shadow-sm
//             border border-[var(--accent)]/20
//           "
//         >
//           {formatTime(seconds)}
//         </span>
//       </div>

//       {isPaused && (
//         <span className="text-sm text-gray-500 italic">⏸ Paused</span>
//       )}
//     </motion.div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

interface QuizTimeSpentProps {
  isPaused?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  maxSeconds?: number; // optional — if you'd like it to auto-submit after X seconds
  onExpire?: () => void; // callback when maxSeconds is reached
}

export default function QuizTimeSpent({
  isPaused = false,
  onTimeUpdate,
  maxSeconds,
  onExpire,
}: QuizTimeSpentProps) {
  const [timeSpent, setTimeSpent] = useState(0); // seconds

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeSpent((prev) => {
        const next = prev + 1;

        // Push time upward to parent
        onTimeUpdate?.(next);

        // Auto-expire if maxSeconds is supplied
        if (maxSeconds && next >= maxSeconds) {
          clearInterval(interval);
          onExpire?.();
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onExpire, maxSeconds, onTimeUpdate]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-[var(--accent)]">
          Time Spent: {formatTime(timeSpent)}
        </span>
      </div>

      {/* Progress bar ONLY if maxSeconds is provided */}
      {maxSeconds && (
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-1000"
            style={{ width: `${(timeSpent / maxSeconds) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
