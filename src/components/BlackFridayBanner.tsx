import { BLACK_FRIDAY_BANNER, isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";

export function BlackFridayBanner() {
  const now = useOfferDate();
  if (!isBlackFriday(now)) return null;
  return (
    <div className="bf-announcement px-4 py-2 text-center font-sans text-[15px] font-medium not-italic" data-no-translate data-print-hidden data-bf-banner>
      {BLACK_FRIDAY_BANNER}
    </div>
  );
}