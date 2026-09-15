import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/lib/seoContent";
import { addLocale, stripLocale, useI18n } from "@/i18n/I18nProvider";

interface SeoProps {
  title: string;
  description: string;
  /** Canonical pathname, bijv. "/producten" */
  path: string;
  noindex?: boolean;
  /** Eén of meerdere JSON-LD objecten */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Optionele afbeelding om te preloaden (LCP) */
  preloadImage?: string;
  preloadImageSrcSet?: string;
}

export const Seo = ({
  title,
  description,
  path,
  noindex,
  jsonLd,
  preloadImage,
  preloadImageSrcSet,
}: SeoProps) => {
  const { locale, t } = useI18n();
  const cleanPath = stripLocale(path);
  const localePath = addLocale(cleanPath, locale);
  const canonical = `${SITE_URL}${localePath === "/" ? "/" : localePath.replace(/\/+$/, "")}`;
  const localizedTitle = t(title);
  const localizedDescription = t(description);
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang={locale} />
      <title>{localizedTitle}</title>
      <meta name="description" content={localizedDescription} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="nl" href={`${SITE_URL}${addLocale(cleanPath, "nl")}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}${addLocale(cleanPath, "en")}`} />
      <link rel="alternate" hrefLang="fr" href={`${SITE_URL}${addLocale(cleanPath, "fr")}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${addLocale(cleanPath, "nl")}`} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={localizedTitle} />
      <meta property="og:description" content={localizedDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={locale === "nl" ? "nl_NL" : locale === "fr" ? "fr_FR" : "en_US"} />
      <meta name="twitter:title" content={localizedTitle} />
      <meta name="twitter:description" content={localizedDescription} />
      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage}
          {...(preloadImageSrcSet ? { imagesrcset: preloadImageSrcSet } : {})}
        />
      )}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
