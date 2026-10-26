import { Star } from "lucide-react";
import { GOOGLE_REVIEWS, getAverageRating } from "@/lib/googleReviews";

/**
 * Reviewscore. Verschijnt alleen als er echte, geverifieerde reviews zijn
 * (aantal > 0), en dan met het echte gemiddelde en aantal. Zonder reviews
 * rendert dit niets: geen sterren, geen teller.
 */
export const ReviewSummary = ({ className = "" }: { className?: string }) => {
  const count = GOOGLE_REVIEWS.length;
  const average = getAverageRating(GOOGLE_REVIEWS);
  if (count === 0 || average === null) return null;
  const rounded = Math.round(average);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex" aria-label={`${average.toFixed(1).replace(".", ",")} van 5 sterren`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= rounded ? "fill-primary text-primary" : "text-foreground/25"}`}
            aria-hidden="true"
          />
        ))}
      </span>
      <span className="text-sm text-foreground/60">
        {average.toFixed(1).replace(".", ",")} ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
};

export const ProductReviewsSection = () =>
  GOOGLE_REVIEWS.length === 0 ? null : (
    <section id="reviews" className="w-full scroll-mt-24 overflow-hidden bg-background py-12 md:py-16">
      <div className="mx-auto flex max-w-5xl justify-center px-6 md:px-8">
        <ReviewSummary />
      </div>
    </section>
  );
