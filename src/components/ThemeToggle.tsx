import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 bg-muted rounded-full opacity-0" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-16 h-8 bg-muted rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? "Schakel naar dagmodus" : "Schakel naar nachtmodus"}
    >
      {/* Track icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun 
          className={`w-4 h-4 transition-opacity duration-300 ${
            isDark ? "text-muted-foreground opacity-50" : "text-glow opacity-100"
          }`} 
        />
        <Moon 
          className={`w-4 h-4 transition-opacity duration-300 ${
            isDark ? "text-glow opacity-100" : "text-muted-foreground opacity-50"
          }`} 
        />
      </div>
      
      {/* Slider thumb */}
      <div
        className={`
          absolute top-1 w-6 h-6 rounded-full 
          bg-background border border-border
          transition-all duration-500 ease-out
          ${isDark ? "left-9" : "left-1"}
        `}
      />
    </button>
  );
};
