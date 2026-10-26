import { Truck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { DELIVERY_TEXT, deliveryWindow, formatDeliveryDate } from "@/lib/delivery";

/** Verwacht bezorgvenster bij de koopknop: vandaag + 7 tot 14 werkdagen. */
export const DeliveryEstimate = () => {
  const { locale, t } = useI18n();
  const { from, to } = deliveryWindow();
  const label = locale === "en" ? "Expected" : locale === "fr" ? "Prévu" : "Verwacht";
  return (
    <p className="flex items-start gap-2 text-sm text-muted-foreground">
      <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      <span>
        {t(DELIVERY_TEXT)}. {label}: {formatDeliveryDate(from, locale)} – {formatDeliveryDate(to, locale)}
      </span>
    </p>
  );
};
