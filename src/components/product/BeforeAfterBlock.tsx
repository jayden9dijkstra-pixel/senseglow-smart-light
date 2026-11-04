import { BeforeAfterSlider } from "./BeforeAfterSlider";
import type { BeforeAfterPair } from "@/lib/beforeAfterImages";

/** Voor/na-schuif als eerste sectie onder het koopblok. */
export function BeforeAfterBlock({ pair }: { pair: BeforeAfterPair }) {
  return (
    <section className="space-y-2 pt-2" aria-label="Lamp uit en aan">
      <BeforeAfterSlider beforeSrc={pair.off} afterSrc={pair.on} alt={pair.alt} className="aspect-[4/3] rounded-xl bg-secondary/60" />
      <p className="text-center text-xs text-foreground/50">Sleep de schuif: lamp uit en aan</p>
    </section>
  );
}
