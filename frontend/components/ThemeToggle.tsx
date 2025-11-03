"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      className={`
        flex items-center justify-center w-9 h-9
        rounded-full transition-all duration-300
        bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800
        text-xl
      `}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
