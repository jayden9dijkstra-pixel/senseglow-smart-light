import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/lib/seoContent";

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
  const canonical = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/+$/, "")}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
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
