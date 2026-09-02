import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { paymentMethods } from "@/components/layout/PaymentIcons";
import { subscribeToNewsletter, DISCOUNT_CODE } from "@/lib/klaviyo";

const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await subscribeToNewsletter(email, "SenseGlow footer");
    setLoading(false);
    if (result.ok) {
      setSuccess(true);
      setEmail("");
    } else {
      toast.error(result.message);
    }
  };

  if (success) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <Check className="h-4 w-4 text-glow" />
          Je staat op de lijst.
        </div>
        <p className="text-sm text-foreground/50">
          Gebruik <span className="text-glow font-medium">{DISCOUNT_CODE}</span> bij het afrekenen voor 10% korting.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-foreground/50">
        Krijg 10% korting bij launch en wees als eerste op de hoogte.
      </p>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jouw@email.nl"
        required
        disabled={loading}
        aria-label="E-mailadres"
        className="h-11 rounded-full"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-500"
      >
        {loading ? "Bezig..." : "Houd me op de hoogte"}
      </Button>
      <p className="text-[11px] text-foreground/35 leading-relaxed">
        Geen spam. Uitschrijven kan altijd. Liever mailen?{" "}
        <a href="mailto:support@senseglow.shop" className="text-glow hover:underline">
          support@senseglow.shop
        </a>
      </p>
    </form>
  );
};

const linkClass =
  "text-foreground/50 hover:text-glow transition-colors duration-500";

export const SiteFooter = () => {
  return (
    <footer className="bg-background text-foreground border-t border-foreground/6">
      <div className="container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Klantenservice</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/contact" className={linkClass}>Contact</Link></li>
                <li><Link to="/verzending" className={linkClass}>Verzending</Link></li>
                <li><Link to="/retourneren" className={linkClass}>Retourneren</Link></li>
                <li><Link to="/bestelling-volgen" className={linkClass}>Bestelling volgen</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Over ons</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/over" className={linkClass}>Over SenseGlow</Link></li>
                <li><Link to="/duurzaamheid" className={linkClass}>Duurzaamheid</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Juridisch</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className={linkClass}>Privacybeleid</Link></li>
                <li><Link to="/voorwaarden" className={linkClass}>Algemene voorwaarden</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Blijf op de hoogte</h4>
              <FooterNewsletter />
            </div>
          </div>

          <div className="pt-10 border-t border-foreground/6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/35 text-center mb-6">
              Veilig betalen met
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {paymentMethods.map(({ name, Icon }) => (
                <Icon key={name} className="h-7 w-auto text-foreground/40" />
              ))}
            </div>
          </div>

          <div className="text-[11px] text-foreground/30 pt-10 mt-10 border-t border-foreground/6">
            <p>© 2026 Jayden Ecom (SenseGlow™). Alle rechten voorbehouden. KvK 99634929 · BTW NL005399692B39</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
