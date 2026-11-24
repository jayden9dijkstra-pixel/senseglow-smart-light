/** Amsterdam is UTC+1 during this campaign. End is exclusive, including all of 23:59. */
export const BLACK_FRIDAY_START = Date.parse("2026-11-23T00:00:00+01:00");
export const BLACK_FRIDAY_END = Date.parse("2026-12-01T00:00:00+01:00");

export function isBlackFriday(now: Date): boolean {
  const time = now.getTime();
  return time >= BLACK_FRIDAY_START && time < BLACK_FRIDAY_END;
}

export const BLACK_FRIDAY_BANNER = "Black Friday t/m 30 nov: Wall Lamp-sets 20% korting, andere lampen 15–20%";
export const BLACK_FRIDAY_CART = "Black Friday: 15% vanaf 2 lampen, 20% vanaf 4";
export const BLACK_FRIDAY_DELIVERY = "Geef je het als kerstcadeau? Bestel op tijd.";