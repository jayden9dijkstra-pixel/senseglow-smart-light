import { useEffect, useState } from "react";
import { BLACK_FRIDAY_START, BLACK_FRIDAY_END } from "@/lib/blackFriday";

/** Refresh visible offers at campaign boundaries, also when a sleeping tab resumes. */
export function useOfferDate() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const time = now.getTime();
    const next = [BLACK_FRIDAY_START, BLACK_FRIDAY_END].find((boundary) => boundary > time);
    const refresh = () => setNow(new Date());
    const timer = next == null ? undefined : window.setTimeout(refresh, Math.min(next - time, 2_147_483_647));
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [now]);
  return now;
}