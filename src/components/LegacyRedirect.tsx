import { Navigate, useLocation } from "react-router-dom";
import { addLocale, localeFromPath, stripLocale } from "@/i18n/I18nProvider";

/**
 * Vangt de Shopify-adressen op (/products/<handle>, /collections/..., /pages/...)
 * die vanuit Google Shopping en de Shopify-winkel doorverwezen worden, en stuurt
 * ze naar het juiste adres op deze site. Zoekparameters zoals gclid blijven staan.
 */
export function LegacyRedirect() {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const path = stripLocale(location.pathname);

  const productMatch = path.match(/^\/products\/([^/]+)/);
  let target = "/producten";
  if (productMatch) {
    target = `/product/${decodeURIComponent(productMatch[1])}`;
  } else if (path.startsWith("/pages/")) {
    const slug = path.slice("/pages/".length).replace(/\/$/, "");
    const pages: Record<string, string> = {
      contact: "/contact",
      "contact-us": "/contact",
      shipping: "/verzending",
      verzending: "/verzending",
      returns: "/retourneren",
      retourneren: "/retourneren",
      about: "/over",
      over: "/over",
      privacy: "/privacy",
      terms: "/voorwaarden",
      voorwaarden: "/voorwaarden",
    };
    target = pages[slug] ?? "/";
  }

  return (
    <Navigate
      to={`${addLocale(target, locale)}${location.search}${location.hash}`}
      replace
    />
  );
}

/** /nl/... bestaat niet: Nederlands draait zonder voorvoegsel. */
export function DutchPrefixRedirect() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/nl(?=\/|$)/, "") || "/";
  return <Navigate to={`${path}${location.search}${location.hash}`} replace />;
}
