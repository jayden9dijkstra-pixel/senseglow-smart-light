/** SenseGlow-logo: SG-monogram op een zachtgele tegel met lampgloed, plus de naam in Manrope. */
export function BrandLogo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 flex-none drop-shadow-[0_2px_4px_rgba(120,80,30,0.25)] md:h-9 md:w-9" aria-hidden>
        <defs>
          <linearGradient id="sgTile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FDF2D8" />
            <stop offset="1" stopColor="#F6DCA6" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#sgTile)" />
        <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" fill="none" stroke="#C9A061" strokeOpacity="0.45" />
        <circle cx="31" cy="9" r="3.5" fill="#FFB074" />
        <text x="19" y="27.5" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif" fontWeight="800" fontSize="17" letterSpacing="-0.5" fill="#2A1A10">SG</text>
      </svg>
      <span className={`text-[22px] font-extrabold leading-none tracking-[-0.03em] md:text-2xl ${inverted ? "text-[#FFF8EF]" : "text-[#2A1A10]"}`} style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
        SenseGlow
      </span>
    </span>
  );
}
