import { BLACK_FRIDAY_BANNER, isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";

export function BlackFridayBanner() {
  const now = useOfferDate();
  if (!isBlackFriday(now)) return null;
  return (
    <div className="bg-gradient-to-r from-[#FFC24D] to-[#FF9A1F] px-4 py-2 text-center text-sm font-bold text-[#1C120C]" data-no-translate data-print-hidden>
      {BLACK_FRIDAY_BANNER}
    </div>
  );
}