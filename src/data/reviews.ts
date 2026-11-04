/**
 * Klantreviews voor de sectie 'Wat klanten zeggen'.
 *
 * Alleen echte reviews van klanten die het product hebben gekocht en gebruikt.
 * Nooit voorbeeld- of verzonnen reviews toevoegen. Leeg = sectie verborgen.
 */
export interface Review {
  /** Voornaam + eerste letter achternaam, bv. "Anja V." */
  name: string;
  /** Producthandle, bv. "senseglow_wall_lamp" */
  product: string;
  /** ISO-datum, bv. "2026-11-02" */
  date: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
  photo?: string;
  label: "Geverifieerde aankoop" | "Zakelijke testklant";
}

export const REVIEWS: Review[] = [];

/** Link 'Bekijk onze Google-reviews'. Blijft verborgen tot SHOW_GOOGLE_REVIEWS_LINK aan staat én er een url is. */
export const SHOW_GOOGLE_REVIEWS_LINK = false;
export const GOOGLE_REVIEWS_LINK_URL = "";

/** Reviews voor een product, of alle reviews als er geen product is opgegeven. */
export const reviewsFor = (handle?: string, list: Review[] = REVIEWS) =>
  handle ? list.filter((r) => r.product === handle) : list;
