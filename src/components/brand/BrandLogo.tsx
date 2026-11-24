/** SenseGlow-woordmerk: SG-monogram (Jays officiële logo) als lichtbron, plus vette naam. Puur SVG/tekst, scherp op elk scherm. */
export function BrandLogo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 flex-none md:h-9 md:w-9" aria-hidden>
        <rect width="40" height="40" rx="10" fill={inverted ? "#FFFFFF" : "#0F1B2D"} />
        <circle cx="31" cy="9" r="3.5" fill="#FFB020" />
        <text x="19" y="27.5" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif" fontWeight="800" fontSize="17" letterSpacing="-0.5" fill={inverted ? "#0F1B2D" : "#FFFFFF"}>SG</text>
      </svg>
      <span className={`text-[22px] font-extrabold leading-none tracking-[-0.03em] md:text-2xl ${inverted ? "text-white" : "text-[#0F1B2D]"}`} style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
        SenseGlow
      </span>
    </span>
  );
}
