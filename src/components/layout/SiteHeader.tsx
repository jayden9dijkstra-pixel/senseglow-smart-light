import { Link, useNavigate } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { MobileNav } from "@/components/layout/MobileNav";
import { SGMonogram } from "@/components/brand/SGMonogram";

export const SiteHeader = () => {
  const navigate = useNavigate();
  const { localizePath } = useI18n();

  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Links: logo */}
          <button
            onClick={() => navigate(localizePath("/"))}
            className="flex items-center shrink-0"
            aria-label="SenseGlow – naar de homepage"
          >
            <SGMonogram className="h-8 md:h-10 w-auto" />
            <span className="sr-only">SenseGlow</span>
          </button>

          {/* Rechts: acties */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <CartDrawer />

            <MobileNav />
          </div>
        </div>
      </div>

      <div className="border-b border-border" />
    </header>
  );
};
