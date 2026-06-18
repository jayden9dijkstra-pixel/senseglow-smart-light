import { ReactNode } from "react";
import { PageTransition } from "@/components/PageTransition";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { NewsletterPopup } from "@/components/NewsletterPopup";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <NewsletterPopup />
      </div>
    </PageTransition>
  );
};
