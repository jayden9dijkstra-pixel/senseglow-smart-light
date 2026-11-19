import { Truck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { deliveryBetweenText } from "@/lib/delivery";

/** Verwacht bezorgvenster bij de koopknop: vandaag + 7 tot 14 werkdagen. */
export const DeliveryEstimate = () => {
  const { locale } = useI18n();
  return (
    <p className="flex items-start gap-2 text-sm text-muted-foreground">
      <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      <span>{deliveryBetweenText(new Date(), locale)}</span>
    </p>
  );
};
