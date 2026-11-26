import { createElement, useEffect, useState } from "react";

const MODEL_VIEWER_SRC = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

/** Laadt <model-viewer> pas als het blok in beeld komt, zodat de koopknop niet trager wordt. */
let viewerLoading: Promise<void> | undefined;
function useModelViewer() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    if (customElements.get("model-viewer")) { setReady(true); return; }
    viewerLoading ??= new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = MODEL_VIEWER_SRC;
      script.onload = () => resolve();
      script.onerror = () => { viewerLoading = undefined; reject(new Error("3D niet geladen")); };
      document.head.appendChild(script);
    });
    void viewerLoading.then(() => { if (mounted) setReady(true); }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  return ready;
}

/** Draaibaar 3D-model van de lamp, met warme lampgloed eromheen. */
export function Lamp3D({ src, alt, poster }: { src: string; alt: string; poster?: string }) {
  const ready = useModelViewer();
  return (
    <div className="night-glow lift relative aspect-square w-full overflow-hidden rounded-3xl md:aspect-[4/3]">
      {ready ? (
        createElement("model-viewer", {
          src,
          alt,
          poster,
          "camera-controls": "",
          "auto-rotate": window.matchMedia("(prefers-reduced-motion: reduce)").matches ? undefined : "",
          "auto-rotate-delay": "0",
          "rotation-per-second": "24deg",
          "interaction-prompt": "none",
          "shadow-intensity": "1",
          exposure: "1.7",
          "environment-image": "neutral",
          "touch-action": "pan-y",
          style: { width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" },
        })
      ) : (
        poster ? <img src={poster} alt={alt} className="h-full w-full object-contain" /> : <div className="h-full w-full bg-secondary" />
      )}
      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-[#FFD48A]">Draai met je vinger om de lamp te bekijken</p>
    </div>
  );
}
