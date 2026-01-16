import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Add transitioning class for smooth animation
    document.documentElement.classList.add("transitioning");
    setIsTransitioning(true);
    
    // Use requestAnimationFrame for smoother transition start
    requestAnimationFrame(() => {
      setTheme(newTheme);
    });
    
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
      setIsTransitioning(false);
    }, 1250);
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <div className="w-16 h-8 bg-muted rounded-full opacity-0" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleThemeChange}
      disabled={isTransitioning}
      className="relative w-16 h-8 bg-muted rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait"
      aria-label={isDark ? "Schakel naar dagmodus" : "Schakel naar nachtmodus"}
      style={{ willChange: "auto" }}
    >
      {/* Track icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun 
          className={`w-4 h-4 ${
            isDark ? "text-muted-foreground opacity-50" : "text-primary opacity-100"
          }`}
          style={{ 
            transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), color 600ms cubic-bezier(0.4, 0, 0.2, 1)" 
          }}
        />
        <Moon 
          className={`w-4 h-4 ${
            isDark ? "text-primary opacity-100" : "text-muted-foreground opacity-50"
          }`}
          style={{ 
            transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), color 600ms cubic-bezier(0.4, 0, 0.2, 1)" 
          }}
        />
      </div>
      
      {/* Slider thumb with GPU-accelerated animation */}
      <div
        className="absolute top-1 w-6 h-6 rounded-full bg-background border border-border pointer-events-none"
        style={{
          transform: `translateX(${isDark ? "32px" : "4px"})`,
          transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          willChange: "transform"
        }}
      />
    </button>
  );
};
