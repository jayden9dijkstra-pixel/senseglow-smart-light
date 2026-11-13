import { BLACK_FRIDAY_BANNER, isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";

export function BlackFridayBanner() {
  const now = useOfferDate();
  if (!isBlackFriday(now)) return null;
  return (
    <div className="bg-primary px-4 py-1.5 text-center text-sm font-medium text-primary-foreground" data-no-translate>
      {BLACK_FRIDAY_BANNER}
    </div>
  );
}