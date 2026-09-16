import { useEffect, useState } from "react";
import { Globe2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGE_CHOICE_KEY, type Locale, useI18n } from "@/i18n/I18nProvider";

/**
 * Nederlandse bezoekers zien niets: de winkel staat al in het Nederlands.
 * Alleen bij een anderstalige browser verschijnt onderin een smalle balk.
 * De balk blokkeert de pagina niet en is altijd weg te klikken.
 */
const options: Array<{ locale: Locale; label: string }> = [
  { locale: "en", label: "English" },
  { locale: "fr", label: "Français" },
];

export function LanguageChooser() {
  const { setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(LANGUAGE_CHOICE_KEY) === "true") return;
      const lang = (navigator.language || "nl").slice(0, 2).toLowerCase();
      if (lang === "nl") return;
      setOpen(true);
    } catch {
      // stil: liever geen balk dan een blokkade
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(LANGUAGE_CHOICE_KEY, "true");
    } catch {
      // stil
    }
  };

  if (!open) return null;

  const choose = (locale: Locale) => {
    setOpen(false);
    setLocale(locale);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4">
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-primary/20 bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
        <Globe2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="flex-1 text-xs text-muted-foreground">
          Also available in English and Français
        </span>
        {options.map((option) => (
          <Button
            key={option.locale}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => choose(option.locale)}
            className="h-8 rounded-full border-primary/20 px-3 text-xs"
          >
            {option.label}
          </Button>
        ))}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Sluiten"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
