import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import en from "./en.json";
import fr from "./fr.json";

export type Locale = "nl" | "en" | "fr";
const dictionaries: Record<Exclude<Locale, "nl">, Record<string, string>> = { en, fr };
const LocaleContext = createContext<{
  locale: Locale;
  t: (text: string) => string;
  localizePath: (path: string, localeOverride?: Locale) => string;
  setLocale: (locale: Locale) => void;
}>({ locale: "nl", t: (text) => text, localizePath: (path) => path, setLocale: () => undefined });

export const LANGUAGE_STORAGE_KEY = "senseglow_language";
export const LANGUAGE_CHOICE_KEY = "senseglow_language_chosen";

export function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  return "nl";
}

export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
  return stripped || "/";
}

export function addLocale(path: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const clean = stripLocale(pathname || "/");
  return `${locale === "nl" ? "" : `/${locale}`}${clean === "/" ? "/" : clean}${suffix}`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(location.pathname);
  const t = useCallback((text: string) => locale === "nl" ? text : dictionaries[locale][text] || text, [locale]);
  const localizePath = useCallback((path: string, localeOverride = locale) => addLocale(path, localeOverride), [locale]);
  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    localStorage.setItem(LANGUAGE_CHOICE_KEY, "true");
    navigate(`${addLocale(location.pathname, next)}${location.search}${location.hash}`);
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    document.documentElement.lang = locale;
    // Alleen een bewuste keuze onthouden; de URL mag die keuze niet overschrijven.
    try {
      if (locale !== "nl" || localStorage.getItem(LANGUAGE_CHOICE_KEY) === "true") {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
      }
    } catch {
      // opslag kan geblokkeerd zijn
    }
  }, [locale]);

  // Terugkerende bezoekers die eerder Engels of Frans kozen komen daar weer uit,
  // ook als ze op een link zonder taal in het adres binnenkomen.
  useEffect(() => {
    if (locale !== "nl") return;
    let stored: string | null = null;
    try {
      if (localStorage.getItem(LANGUAGE_CHOICE_KEY) !== "true") return;
      stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      return;
    }
    if (stored !== "en" && stored !== "fr") return;
    navigate(`${addLocale(location.pathname, stored)}${location.search}${location.hash}`, { replace: true });
    // Alleen bij binnenkomst; daarna bepaalt de URL de taal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ locale, t, localizePath, setLocale }), [locale, localizePath, setLocale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useI18n = () => useContext(LocaleContext);
