"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="absolute top-0 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-5"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 30 }}
          transition={{ duration: 0.2 }}
        >
          
          {theme === "dark" ? <Sun className={`dark:text-white/90`}/> : <Moon className={`text-white/90`} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
