import { useEffect, useRef, useState } from "react";
import { X, Check, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "@/lib/klaviyo";

const STORAGE_KEY = "senseglow_popup_dismissed";
const SHOW_AFTER_MS = 8000;
const SUCCESS_CLOSE_MS = 3000;

export const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);

    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && localStorage.getItem(STORAGE_KEY) !== "true") {
        setOpen(true);
      }
    };

    document.addEventListener("mouseleave", onExit);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onExit);
    };
  }, []);

  // Focus first field when opened
  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  // Auto-close after success
  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(close, SUCCESS_CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [success]);

  const markDismissed = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  };

  const close = () => {
    setOpen(false);
    markDismissed();
  };

  // Escape to close + focus trap
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await subscribeToNewsletter(email, "Website popup", {
      firstName,
      signupSource: "website_popup",
      signupPage: window.location.pathname,
    });
    setLoading(false);

    if (result.ok === true) {
      setSuccess(true);
      markDismissed();
      return;
    }

    setError(result.message);
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Card */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[420px] rounded-xl shadow-2xl p-8 md:p-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        style={{ backgroundColor: "#1a1613", color: "#f5efe6" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Sluiten"
          className="absolute top-4 right-4 text-[#f5efe6]/50 hover:text-[#f5efe6] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!success ? (
          <>
            <div className="flex justify-center mb-5">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(242, 185, 85, 0.12)" }}
              >
                <Mail className="h-5 w-5" style={{ color: "#f2b955" }} />
              </div>
            </div>

            <h2
              id="newsletter-popup-title"
              className="text-2xl md:text-3xl font-semibold text-center mb-3 leading-snug"
            >
              10% korting op je eerste bestelling
            </h2>
            <p className="text-sm text-center mb-7 leading-relaxed" style={{ color: "rgba(245, 239, 230, 0.65)" }}>
              Meld je aan voor onze nieuwsbrief en ontvang WELKOM10 in je inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={firstFieldRef}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Voornaam (optioneel)"
                maxLength={30}
                disabled={loading}
                aria-label="Voornaam (optioneel)"
                className="w-full h-12 rounded-lg px-4 text-sm bg-white/5 border border-white/10 placeholder:text-[#f5efe6]/35 focus:outline-none focus:border-[#f2b955]/60 transition-colors disabled:opacity-50"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                disabled={loading}
                aria-label="E-mailadres"
                className="w-full h-12 rounded-lg px-4 text-sm bg-white/5 border border-white/10 placeholder:text-[#f5efe6]/35 focus:outline-none focus:border-[#f2b955]/60 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full text-sm font-semibold tracking-wide transition-colors disabled:opacity-60"
                style={{ backgroundColor: "#f2b955", color: "#1a1613" }}
              >
                {loading ? "Bezig..." : "Ik wil 10% korting"}
              </button>
            </form>

            {error && (
              <p className="text-[13px] text-center mt-4 leading-relaxed" style={{ color: "#f2b955" }}>
                Er ging iets mis. Probeer het later opnieuw of mail ons op{" "}
                <a href="mailto:support@senseglow.shop" className="underline">
                  support@senseglow.shop
                </a>
              </p>
            )}

            <p className="text-[11px] text-center mt-5 leading-relaxed" style={{ color: "rgba(245, 239, 230, 0.4)" }}>
              Door je aan te melden ga je akkoord met onze{" "}
              <Link to="/privacy" onClick={close} className="underline hover:text-[#f2b955] transition-colors">
                privacyverklaring
              </Link>
              . Uitschrijven kan altijd.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(242, 185, 85, 0.15)" }}
              >
                <Check className="h-8 w-8" style={{ color: "#f2b955" }} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 leading-snug">
              Je zit erbij!
            </h2>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: "rgba(245, 239, 230, 0.65)" }}>
              Check je inbox voor je 10% kortingscode. Handig voor je eerste
              bestelling.
            </p>
            <button
              type="button"
              onClick={close}
              className="w-full h-12 rounded-full text-sm font-semibold tracking-wide transition-colors"
              style={{ backgroundColor: "#f2b955", color: "#1a1613" }}
            >
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
