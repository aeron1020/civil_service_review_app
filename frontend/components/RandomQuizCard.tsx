"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shuffle, ArrowRight, Zap } from "lucide-react";

export default function RandomQuizCard() {
  const quizModes = [
    { type: "VER", title: "Verbal", color: "from-blue-500/20" },
    { type: "ANA", title: "Analytical", color: "from-purple-500/20" },
    { type: "NUM", title: "Numerical", color: "from-emerald-500/20" },
    { type: "GEN", title: "General Info", color: "from-amber-500/20" },
    { type: "CLE", title: "Clerical", color: "from-rose-500/20" },
  ];

  return (
    <div className="mt-12">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <Zap size={12} fill="currentColor" /> Adaptive Learning
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.85]">
          Try Random <span className="text-gradient">Quiz Mode</span>
        </h2>

        <p className="opacity-50 font-medium max-w-lg mx-auto leading-relaxed">
          Break the pattern. Test your mastery with 20 randomized questions
          pulled from our entire database.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {quizModes.map(({ type, title, color }, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/quiz-type/${type}`}>
              <div className="glass-card-3d p-8 flex flex-col h-full cursor-pointer group relative overflow-hidden">
                {/* Dynamic Glow Effect */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${color} to-transparent blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50`}
                />

                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-8 text-[var(--accent)] group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500 shadow-inner">
                  <Shuffle size={24} />
                </div>

                <h3 className="text-2xl font-black mb-3 tracking-tight">
                  {title} Mix
                </h3>

                <p className="text-sm opacity-50 leading-relaxed mb-10 flex-grow font-medium">
                  Practice with a fresh, unpredictable session of{" "}
                  {title.toLowerCase()} questions to simulate exam-day pressure.
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-black/5 dark:border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors">
                    Start Random Quiz
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
