import { Mail } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/businessInfo";

/** Klein blok 'Vragen? Mail ons' met het support-mailadres. */
export const AskUs = () => (
  <div className="flex items-start gap-3 rounded-2xl border border-foreground/10 p-4">
    <Mail className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden />
    <p className="text-base text-foreground">
      <span className="font-semibold">Vragen? Mail ons</span>
      <br />
      <a href={`mailto:${BUSINESS_INFO.email}`} className="text-primary underline underline-offset-4">{BUSINESS_INFO.email}</a>
    </p>
  </div>
);
