import { useEffect, useRef, useState } from "react";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGE_CHOICE_KEY, type Locale, useI18n } from "@/i18n/I18nProvider";

const options: Array<{ locale: Locale; label: string; detail: string }> = [
  { locale: "nl", label: "Nederlands", detail: "Nederland" },
  { locale: "en", label: "English", detail: "International" },
  { locale: "fr", label: "Français", detail: "France et Belgique" },
];

export function LanguageChooser() {
  const { setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try { setOpen(localStorage.getItem(LANGUAGE_CHOICE_KEY) !== "true"); } catch { setOpen(true); }
  }, []);
  useEffect(() => { if (open) first.current?.focus(); }, [open]);
  if (!open) return null;

  const choose = (locale: Locale) => { setOpen(false); setLocale(locale); };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="language-title">
      <div className="w-full max-w-md rounded-lg border border-primary/20 bg-card p-6 shadow-2xl md:p-8">
        <Globe2 className="mb-5 h-6 w-6 text-primary" aria-hidden="true" />
        <h2 id="language-title" className="text-2xl font-semibold text-foreground">Kies je taal</h2>
        <p className="mt-2 text-sm text-muted-foreground">Choose your language · Choisissez votre langue</p>
        <div className="mt-7 grid gap-3">
          {options.map((option, index) => (
            <Button key={option.locale} ref={index === 0 ? first : undefined} type="button" variant="outline" onClick={() => choose(option.locale)} className="h-auto justify-between rounded-md border-primary/20 px-4 py-3 text-left hover:border-primary/60 hover:bg-primary/5">
              <span className="font-medium">{option.label}</span><span className="text-xs text-muted-foreground">{option.detail}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
