import { Star } from "lucide-react";
import { GOOGLE_REVIEW, googleRatingLabel } from "@/lib/googleReviews";

/** Merkreviewscore met het echte aantal Google-reviews. */
export const ReviewSummary = ({ className = "" }: { className?: string }) => {
  if (GOOGLE_REVIEW.count === 0) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex" aria-label={`${GOOGLE_REVIEW.rating} van 5 sterren`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= GOOGLE_REVIEW.rating ? "fill-primary text-primary" : "text-foreground/75"}`}
            aria-hidden="true"
          />
        ))}
      </span>
      <span className="text-sm text-foreground/75">{googleRatingLabel()}</span>
    </div>
  );
};

export const ProductReviewsSection = () =>
  GOOGLE_REVIEW.count === 0 ? null : (
    <section id="reviews" className="w-full scroll-mt-24 overflow-hidden bg-background py-12 md:py-16">
      <div className="mx-auto flex max-w-5xl justify-center px-6 md:px-8">
        <ReviewSummary />
      </div>
    </section>
  );
