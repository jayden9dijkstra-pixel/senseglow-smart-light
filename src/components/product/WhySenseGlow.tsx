import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { WHY_HEADING, WHY_CONTACT_TEXT, whyItems } from "@/lib/whySenseGlow";

export const WhySenseGlow = ({ handles, className = "" }: { handles: string[]; className?: string }) => {
  const { t, locale } = useI18n();
  const prefix = locale === "nl" ? "" : `/${locale}`;
  return (
    <section className={`space-y-3 ${className}`}>
      <h2 className="text-2xl font-bold text-foreground">{t(WHY_HEADING)}</h2>
      <ul className="space-y-2">
        {whyItems(handles).map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-foreground/80">
            <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{t(item)}</span>
          </li>
        ))}
        <li className="flex items-start gap-2.5 text-foreground/80">
          <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          <Link to={`${prefix}/contact`} className="underline underline-offset-4 hover:text-primary">{t(WHY_CONTACT_TEXT)}</Link>
        </li>
      </ul>
    </section>
  );
};
