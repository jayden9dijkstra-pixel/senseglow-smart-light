import { useEffect, useState } from "react";
import { X, Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { subscribeToNewsletter, DISCOUNT_CODE, emailSchema } from "@/lib/klaviyo";

const STORAGE_KEY = "senseglow_newsletter_popup_v1";
const SHOW_AFTER_MS = 8000;

export const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    let exitBound = false;

    const timer = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);

    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    };

    document.addEventListener("mouseleave", onExit);
    exitBound = true;

    return () => {
      window.clearTimeout(timer);
      if (exitBound) document.removeEventListener("mouseleave", onExit);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, success ? "subscribed" : "dismissed");
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Ongeldig e-mailadres");
      return;
    }

    setLoading(true);
    const result = await subscribeToNewsletter(parsed.data, "SenseGlow website popup");
    setLoading(false);

    if (result.ok === true) {
      setSuccess(true);
      try {
        localStorage.setItem(STORAGE_KEY, "subscribed");
      } catch {}
      return;
    }

    toast.error(result.message);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      toast.success("Code gekopieerd");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopiëren mislukt");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Sluit pop-up"
        onClick={close}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative w-full max-w-md glass border border-foreground/10 rounded-2xl shadow-2xl p-8 md:p-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button
          type="button"
          onClick={close}
          aria-label="Sluiten"
          className="absolute top-4 right-4 text-foreground/40 hover:text-foreground/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!success ? (
          <>
            <div className="flex justify-center mb-5">
              <div className="h-12 w-12 rounded-full bg-glow/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-glow" />
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 text-center mb-3">
              SenseGlow Nieuwsbrief
            </p>
            <h2
              id="newsletter-popup-title"
              className="text-2xl md:text-3xl font-semibold text-center mb-3 leading-snug"
            >
              10% korting op je eerste bestelling
            </h2>
            <p className="text-sm text-foreground/60 text-center mb-7 leading-relaxed">
              Schrijf je in voor de nieuwsbrief en ontvang als eerste nieuwe
              lampen, rustige interieurideeën en je welkomstcode.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                disabled={loading}
                aria-label="E-mailadres"
                className="h-12 text-center"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-glow hover:bg-glow/90 text-white text-sm uppercase tracking-[0.2em] font-medium"
              >
                {loading ? "Bezig..." : "Stuur me de code"}
              </Button>
            </form>

            <p className="text-[11px] text-foreground/40 text-center mt-5 leading-relaxed">
              Geen spam. Uitschrijven kan altijd met één klik.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="h-12 w-12 rounded-full bg-glow/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-glow" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-3">
              Welkom bij SenseGlow
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 leading-snug">
              Bedankt voor je inschrijving
            </h2>
            <p className="text-sm text-foreground/60 mb-7 leading-relaxed">
              Gebruik onderstaande code bij het afrekenen voor 10% korting op je
              eerste bestelling.
            </p>

            <button
              type="button"
              onClick={copyCode}
              className="w-full h-14 rounded-xl border-2 border-dashed border-glow/40 bg-glow/5 hover:bg-glow/10 transition-colors flex items-center justify-center gap-3 mb-5"
            >
              <span className="text-xl tracking-[0.3em] font-semibold text-glow">
                {DISCOUNT_CODE}
              </span>
              {copied ? (
                <Check className="h-4 w-4 text-glow" />
              ) : (
                <Copy className="h-4 w-4 text-glow/70" />
              )}
            </button>

            <Button
              type="button"
              onClick={close}
              className="w-full h-12 rounded-full bg-glow hover:bg-glow/90 text-white text-sm uppercase tracking-[0.2em] font-medium"
            >
              Verder winkelen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
