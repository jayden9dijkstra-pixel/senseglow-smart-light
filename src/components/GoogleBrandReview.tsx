import { Star } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { GOOGLE_REVIEW, googleRatingLabel, googleReviewAttribution, googleReviewText } from "@/lib/googleReviews";

/** Compacte merkreviewscore bij de koopknop, altijd inclusief aantal. */
export function GoogleReviewLine() {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-foreground/80">
      <span className="text-cta" aria-label={`${GOOGLE_REVIEW.rating} van 5 sterren`}>
        <span aria-hidden>★★★★★</span>
      </span>
      <span>{googleRatingLabel()}</span>
    </p>
  );
}

/** Rustig homepageblok voor de enkele echte Google-merkreview. */
export function GoogleHomeReview() {
  const { locale } = useI18n();
  return (
    <section aria-labelledby="google-review-heading" className="w-full bg-background py-10 md:py-14">
      <div className="container grid max-w-5xl gap-6 md:grid-cols-[2fr_3fr] md:items-center">
        <figure className="lift overflow-hidden rounded-3xl bg-white">
          <img
            src="/images/senseglow-ambient-koffiekast.jpg"
            alt={locale === "en" ? "SenseGlow Ambient Motion Bar lighting a coffee cabinet at night" : "SenseGlow Ambient Motion Bar verlicht 's avonds een koffiekast"}
            width={375}
            height={500}
            loading="lazy"
            decoding="async"
            className="aspect-[3/4] w-full object-cover"
          />
          <figcaption className="px-4 py-3 text-sm text-foreground/75">
            {locale === "en" ? "Real photo: the Ambient Motion Bar in a kitchen cabinet" : "Echte foto: de Ambient Motion Bar in een keukenkast"}
          </figcaption>
        </figure>
        <div className="lift space-y-4 rounded-3xl bg-white p-6 text-center md:p-8">
          <h2 id="google-review-heading" className="text-2xl text-foreground md:text-3xl">
            {locale === "en" ? "Customer experience" : "Ervaring van onze klant"}
          </h2>
          <div className="flex justify-center gap-1" aria-label={`${GOOGLE_REVIEW.rating} van 5 sterren`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                aria-hidden
                className={`h-5 w-5 ${star <= GOOGLE_REVIEW.rating ? "fill-[#FFB074] text-[#FFB074]" : "text-foreground/30"}`}
              />
            ))}
          </div>
          <p className="text-sm text-foreground/75">{GOOGLE_REVIEW.count} {GOOGLE_REVIEW.count === 1 ? "review" : "reviews"}</p>
          <blockquote className="text-[17px] leading-relaxed text-foreground">
            “{googleReviewText(locale)}”
          </blockquote>
          <p className="text-base font-medium text-foreground">{googleReviewAttribution(locale)}</p>
          {locale === "nl" && <p className="text-sm text-foreground/75">(vertaald uit het Engels)</p>}
        </div>
      </div>
    </section>
  );
}
