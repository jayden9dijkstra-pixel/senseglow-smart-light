import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { WHY_CONTACT_TEXT, whyItems } from "@/lib/whySenseGlow";
import { MIX_NOTE, isOfferProduct } from "@/lib/quantityOffer";
import { PlainList } from "./InfoAccordion";

/** Verzending, retour, garantie en kortingsregel: één keer, ingeklapt. */
export function ShippingInfo({ handles }: { handles: string[] }) {
  const { t, locale } = useI18n();
  const prefix = locale === "nl" ? "" : `/${locale}`;
  const items: React.ReactNode[] = whyItems(handles).map((i) => t(i));
  if (handles.some(isOfferProduct)) items.push(t(MIX_NOTE));
  items.push(
    <Link to={`${prefix}/contact`} className="underline underline-offset-4 hover:text-primary">{t(WHY_CONTACT_TEXT)}</Link>,
  );
  return <PlainList items={items} />;
}
