import { BLACK_FRIDAY_BANNER, isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";

export function BlackFridayBanner() {
  const now = useOfferDate();
  if (!isBlackFriday(now)) return null;
  return (
    <div className="soft-yellow font-playful px-4 py-2 text-center text-[15px] font-semibold" data-no-translate data-print-hidden>
      {BLACK_FRIDAY_BANNER}
    </div>
  );
}