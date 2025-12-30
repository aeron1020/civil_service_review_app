"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:scale-110 active:scale-95 group overflow-hidden shadow-inner"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon size={18} className="text-indigo-400 fill-indigo-400/20" />
          ) : (
            <Sun size={18} className="text-amber-500 fill-amber-500/20" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Subtle Glow Effect behind the icon */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-md ${
          isDark ? "bg-indigo-500" : "bg-amber-500"
        }`}
      />
    </button>
  );
}
