import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-2 text-sm text-foreground-muted opacity-0">
        <span className="w-4 h-4 rounded-full border border-foreground-muted" />
        <span>Nacht</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors duration-300"
      aria-label={isDark ? "Schakel naar dagmodus" : "Schakel naar nachtmodus"}
    >
      <span 
        className={`
          w-4 h-4 rounded-full border transition-all duration-300
          ${isDark 
            ? "bg-glow border-glow shadow-[0_0_8px_hsl(var(--glow)/0.5)]" 
            : "border-foreground-muted bg-transparent"
          }
        `}
      />
      <span className="tracking-wide">Nacht</span>
    </button>
  );
};
