/** SenseGlow-woordmerk: SG-monogram (Jays officiële logo) als lichtbron, plus vette naam. Puur SVG/tekst, scherp op elk scherm. */
export function BrandLogo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 flex-none md:h-9 md:w-9" aria-hidden>
        <defs><radialGradient id="sgGlow" cx="0.78" cy="0.22" r="0.7"><stop offset="0" stopColor="#FFB238" stopOpacity="0.55" /><stop offset="1" stopColor="#FFB238" stopOpacity="0" /></radialGradient></defs><rect width="40" height="40" rx="11" fill={inverted ? "#FFF8EF" : "#1C120C"} /><rect width="40" height="40" rx="11" fill="url(#sgGlow)" />
        <circle cx="31" cy="9" r="3.5" fill="#FFB238" />
        <text x="19" y="27.5" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="18" letterSpacing="-0.5" fill={inverted ? "#1C120C" : "#FFFFFF"}>SG</text>
      </svg>
      <span className={`text-[22px] font-extrabold leading-none tracking-[-0.03em] md:text-2xl ${inverted ? "text-[#FFF8EF]" : "text-[#1C120C]"}`} style={{ fontFamily: "Fraunces, Georgia, serif", fontVariationSettings: '"SOFT" 100, "opsz" 72' }}>
        SenseGlow
      </span>
    </span>
  );
}
