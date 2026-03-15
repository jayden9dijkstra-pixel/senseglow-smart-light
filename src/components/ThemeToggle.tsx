import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { Lightbulb } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    document.documentElement.classList.add("transitioning");
    setIsTransitioning(true);
    
    requestAnimationFrame(() => {
      setTheme(newTheme);
    });
    
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
      setIsTransitioning(false);
    }, 1250);
  }, [theme, setTheme]);

  if (!mounted) {
    return <div className="w-10 h-10 opacity-0" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleThemeChange}
      disabled={isTransitioning}
      className="relative flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait group"
      aria-label={isDark ? "Schakel lamp uit" : "Schakel lamp aan"}
    >
      {/* Ambient glow behind icon when "on" */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, hsl(33 52% 50% / 0.25) 0%, transparent 70%)"
            : "transparent",
          transition: "background 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      
      <Lightbulb
        className={`w-5 h-5 relative z-10 transition-all duration-500 ${
          isDark
            ? "text-glow drop-shadow-[0_0_8px_hsl(33_52%_50%/0.6)]"
            : "text-foreground/40 group-hover:text-foreground/60"
        }`}
        style={{
          filter: isDark ? "drop-shadow(0 0 12px hsl(33 52% 50% / 0.5))" : "none",
          transition: "filter 1200ms cubic-bezier(0.4, 0, 0.2, 1), color 600ms ease",
        }}
        fill={isDark ? "hsl(33 52% 50% / 0.15)" : "none"}
      />
    </button>
  );
};
