import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GOOGLE_REVIEWS,
  GOOGLE_REVIEW_URL,
  getAverageRating,
} from "@/lib/googleReviews";

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
 * Klantreviews vanuit het Google-bedrijfsprofiel.
 * Er worden alleen echte, overgenomen reviews getoond. Zolang er geen reviews
 * zijn, blijft de sectie leeg met een uitnodiging om er een te schrijven.
 */
export const ProductReviewsSection = () => {
  const average = getAverageRating(GOOGLE_REVIEWS);
  const hasReviews = GOOGLE_REVIEWS.length > 0;

  return (
    <section
      id="reviews"
      className="w-full scroll-mt-24 overflow-hidden bg-background py-16 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Klantreviews op Google
          </h2>

          {hasReviews && average !== null ? (
            <div className="flex flex-col items-center gap-2">
              <Stars value={Math.round(average)} />
              <p className="text-sm text-foreground/60">
                {average} gemiddeld uit {GOOGLE_REVIEWS.length}{" "}
                {GOOGLE_REVIEWS.length === 1 ? "review" : "reviews"} op Google
              </p>
            </div>
          ) : (
            <p className="text-base text-foreground/60">
              Nog geen reviews geplaatst. We tonen hier uitsluitend beoordelingen van
              mensen die het product daadwerkelijk hebben gekocht, positief of negatief.
            </p>
          )}
        </div>

        {hasReviews && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {GOOGLE_REVIEWS.map((review, index) => (
              <article
                key={`${review.author}-${index}`}
                className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 backdrop-blur-sm"
              >
                <Stars value={review.rating} />
                <p className="mt-4 text-base leading-relaxed text-foreground/80">
                  {review.text}
                </p>
                <p className="mt-4 text-sm text-foreground/50">
                  {review.author} · {review.date}
                </p>
              </article>
            ))}
          </div>
        )}

        {GOOGLE_REVIEW_URL && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                Schrijf een review op Google
              </a>
            </Button>
            <p className="text-xs text-foreground/50">
              Je wordt doorgestuurd naar ons Google-bedrijfsprofiel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
