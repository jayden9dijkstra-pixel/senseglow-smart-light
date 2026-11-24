import { createElement, useEffect, useRef, useState } from "react";

const MODEL_VIEWER_SRC = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

/** Laadt <model-viewer> pas als het blok in beeld komt, zodat de koopknop niet trager wordt. */
function useModelViewer(ref: React.RefObject<HTMLElement>) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (customElements.get("model-viewer")) return setReady(true);
      const s = document.createElement("script");
      s.type = "module";
      s.src = MODEL_VIEWER_SRC;
      s.onload = () => setReady(true);
      document.head.appendChild(s);
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return ready;
}

/** Draaibaar 3D-model van de lamp, met warme lampgloed eromheen. */
export function Lamp3D({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useModelViewer(ref);
  return (
    <div ref={ref} className="night-glow lift relative aspect-square w-full overflow-hidden rounded-3xl md:aspect-[4/3]">
      {ready ? (
        createElement("model-viewer", {
          src,
          alt,
          "camera-controls": "",
          "auto-rotate": "",
          "auto-rotate-delay": "0",
          "rotation-per-second": "24deg",
          "interaction-prompt": "none",
          "shadow-intensity": "1",
          exposure: "1.15",
          "environment-image": "neutral",
          "touch-action": "pan-y",
          style: { width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" },
        })
      ) : (
        <div className="h-full w-full animate-pulse bg-white/5" />
      )}
      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-[#FFD48A]">Draai met je vinger om de lamp te bekijken</p>
    </div>
  );
}
