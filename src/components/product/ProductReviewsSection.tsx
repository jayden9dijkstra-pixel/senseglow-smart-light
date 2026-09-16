import { Star } from "lucide-react";

const Stars = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} van 5 sterren`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i <= value ? "fill-primary text-primary" : "text-foreground/25"
        }`}
        aria-hidden="true"
      />
    ))}
  </div>
);

/**
 * Eenvoudige reviewbalk met gevulde sterren.
 * Echte reviews worden later toegevoegd; tot die tijd tonen we alleen de
 * gevulde vijf sterren, want dat klopt met de echte review die geplaatst is.
 */
export const ProductReviewsSection = () => (
  <section
    id="reviews"
    className="w-full scroll-mt-24 overflow-hidden bg-background py-12 md:py-16"
  >
    <div className="mx-auto max-w-5xl px-6 md:px-8">
      <div className="flex flex-col items-center gap-2">
        <Stars value={5} />
        <p className="text-sm text-foreground/60">5,0 op Google</p>
      </div>
    </div>
  </section>
);
