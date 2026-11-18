import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SUPPORT_TRUST } from "@/lib/purchaseTrust";

export function PurchaseReassurance() {
  const { localizePath } = useI18n();
  return (
    <p className="flex items-start gap-2 py-2 text-base leading-snug text-foreground/85">
      <MessageCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <Link to={localizePath("/retourneren")} className="hover:underline hover:underline-offset-4">
        {SUPPORT_TRUST}
      </Link>
    </p>
  );
}
