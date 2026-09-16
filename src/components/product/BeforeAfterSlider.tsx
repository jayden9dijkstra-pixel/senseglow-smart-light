import { useCallback, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface BeforeAfterSliderProps {
  /** Foto van de ruimte met de lamp uit */
  beforeSrc: string;
  /** Foto van dezelfde ruimte met de lamp aan */
  afterSrc: string;
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider = ({
  beforeSrc,
  afterSrc,
  alt,
  beforeLabel,
  afterLabel,
  className = "",
}: BeforeAfterSliderProps) => {
  const { t } = useI18n();
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none overflow-hidden rounded-sm ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <img src={beforeSrc} alt={alt} loading="lazy" className="block w-full h-full object-cover" />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={afterSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="block w-full h-full object-cover"
        />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 bg-background/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground">
        {beforeLabel ?? t("Lamp uit")}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 bg-background/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground">
        {afterLabel ?? t("Lamp aan")}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-background/90"
        style={{ left: `${position}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-[0_8px_24px_-16px_hsl(var(--foreground)/0.6)]"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <span className="text-foreground/70 text-sm">‹ ›</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={t("Schuif tussen lamp uit en lamp aan")}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
};
