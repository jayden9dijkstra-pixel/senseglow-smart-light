/**
 * Google-reviews van het bedrijfsprofiel.
 *
 * BELANGRIJK: hier komen uitsluitend echte, door klanten geschreven reviews in.
 * Nooit verzonnen teksten, namen of scores toevoegen.
 *
 * 1. Zet hieronder de deel-link van je Google-bedrijfsprofiel
 *    (Google Bedrijfsprofiel > Reviews > "Meer reviews vragen" > link kopiëren).
 * 2. Zodra een klant een review heeft geplaatst, neem je die hier letterlijk over.
 */

export const GOOGLE_REVIEW_URL = "";

export interface GoogleReview {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Datum zoals op Google getoond, bijvoorbeeld "september 2026" */
  date: string;
}

export const GOOGLE_REVIEWS: GoogleReview[] = [];

export function getAverageRating(reviews: GoogleReview[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return +(total / reviews.length).toFixed(1);
}
