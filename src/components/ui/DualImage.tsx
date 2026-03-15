import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface DualImageProps {
  /** Image shown in light mode (lamp off) */
  srcLight: string;
  /** Image shown in dark mode (lamp on) — if omitted, srcLight is used for both */
  srcDark?: string;
  alt: string;
  className?: string;
}

export const DualImage = ({ srcLight, srcDark, alt, className = "" }: DualImageProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No dark variant — render single image
  if (!srcDark) {
    return (
      <img
        src={srcLight}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  const isDark = mounted && theme === "dark";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Light image (lamp off) */}
      <img
        src={srcLight}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading="lazy"
        style={{
          opacity: isDark ? 0 : 1,
          transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      {/* Dark image (lamp on) */}
      <img
        src={srcDark}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading="lazy"
        style={{
          opacity: isDark ? 1 : 0,
          transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
};
