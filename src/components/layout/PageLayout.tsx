import { ReactNode } from "react";
import { PageTransition } from "@/components/PageTransition";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
};
