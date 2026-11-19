/**
 * Echte anonieme merkreview uit het Google-bedrijfsprofiel van SenseGlow.
 * Niet aan een product koppelen en geen Review- of aggregateRating-markup maken.
 */
export const GOOGLE_REVIEW_URL = "";

export interface GoogleBrandReview {
  source: "Google";
  rating: number;
  count: number;
  textNl: string;
  textEn: string;
}

export const GOOGLE_REVIEW: GoogleBrandReview = {
  source: "Google",
  rating: 5,
  count: 1,
  textNl: "Erg blij met mijn SenseGlow-lamp! De bewegingssensor werkt top en hij is superhandig 's nachts als ik het grote licht niet aan wil doen. Hij ziet er mooi uit, was makkelijk te plaatsen en doet precies wat ik wilde. Echt een aanrader!",
  textEn: "Really happy with my SenseGlow lamp! The motion sensor works great and it's super useful at night when I don't want to turn on the main lights. It looks nice, was easy to set up, and does exactly what I wanted. Definitely recommend!",
};

export const googleReviewText = (locale: "nl" | "en" | "fr") =>
  locale === "nl" ? GOOGLE_REVIEW.textNl : GOOGLE_REVIEW.textEn;

export const googleReviewAttribution = (locale: "nl" | "en" | "fr") =>
  locale === "nl" ? "— een klant, via Google" : "— a customer, via Google";

/** Bij een score hoor je altijd het echte aantal Google-reviews te tonen. */
export const googleRatingLabel = () =>
  `${GOOGLE_REVIEW.rating.toFixed(1).replace(".", ",")} op ${GOOGLE_REVIEW.source} (${GOOGLE_REVIEW.count} ${GOOGLE_REVIEW.count === 1 ? "review" : "reviews"})`;
