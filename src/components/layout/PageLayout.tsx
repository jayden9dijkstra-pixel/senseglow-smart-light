import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { Seo } from "@/components/seo/Seo";
import { getRouteSeo } from "@/lib/seoContent";

interface PageSeoOverride {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  preloadImage?: string;
  preloadImageSrcSet?: string;
}

interface PageLayoutProps {
  children: ReactNode;
  seo?: PageSeoOverride;
}

export const PageLayout = ({ children, seo }: PageLayoutProps) => {
  const { pathname } = useLocation();
  const base = getRouteSeo(pathname);

  return (
    <PageTransition>
      <Seo
        title={seo?.title ?? base.title}
        description={seo?.description ?? base.description}
        path={seo?.path ?? pathname}
        noindex={seo?.noindex}
        jsonLd={seo?.jsonLd}
        preloadImage={seo?.preloadImage}
        preloadImageSrcSet={seo?.preloadImageSrcSet}
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <NewsletterPopup />
      </div>
    </PageTransition>
  );
};
