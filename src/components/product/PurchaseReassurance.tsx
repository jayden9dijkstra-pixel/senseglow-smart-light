import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { NEW_BRAND_TRUST } from "@/lib/purchaseTrust";

export function PurchaseReassurance() {
  const { localizePath } = useI18n();
  return (
    <p className="py-3 text-lg font-medium leading-relaxed text-foreground">
      <Link to={localizePath("/retourneren")} className="underline decoration-primary underline-offset-4">
        {NEW_BRAND_TRUST}
      </Link>
    </p>
  );
}