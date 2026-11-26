import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Rotate3D } from "lucide-react";
import { Button } from "@/components/ui/button";
import { responsiveImg } from "@/lib/shopifyImage";

const Lamp3D = lazy(() => import("./Lamp3D").then((module) => ({ default: module.Lamp3D })));

export function DeferredLamp3D({ src, alt, poster }: { src: string; alt: string; poster?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setActive(true);
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const preview = <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-secondary md:aspect-[4/3]">
    {poster && <img {...responsiveImg(poster, "(min-width: 768px) 50vw, 100vw")} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />}
    <Button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cta text-cta-foreground hover:bg-cta-hover" onClick={() => setActive(true)}><Rotate3D className="mr-2 h-5 w-5" />Bekijk in 3D</Button>
  </div>;

  return <div ref={ref}>{active ? <Suspense fallback={preview}><Lamp3D src={src} alt={alt} poster={poster} /></Suspense> : preview}</div>;
}