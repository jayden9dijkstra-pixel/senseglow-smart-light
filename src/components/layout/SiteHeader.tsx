import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import wordmark from "@/assets/logo-wordmark.png";
import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "@/lib/productConfig";

type NavChild = { label: string; hint?: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const navItems: NavItem[] = [
  {
    label: "Voor thuis",
    href: "/producten",
    children: [
      { label: "SenseGlow Wave", hint: "Kast en keuken", href: `/product/${WAVE_PRODUCT_HANDLE}` },
      { label: "Ambient Motion Bar", hint: "Hal en wand", href: `/product/${PRODUCT_HANDLE}` },
      { label: "SenseGlow Wall Lamp", hint: "Woonkamer", href: `/product/${STEP_PRODUCT_HANDLE}` },
    ],
  },
  {
    label: "Voor buiten",
    href: "/producten",
    children: [
      { label: "SenseGlow Solar Lantern", hint: "Tuin en pad", href: `/product/${LANTERN_PRODUCT_HANDLE}` },
    ],
  },
  {
    label: "Voor werk",
    href: "/producten",
    children: [
      { label: "SenseGlow Flex", hint: "Bureau en werkplek", href: `/product/${FLEX_PRODUCT_HANDLE}` },
    ],
  },
  
  { label: "Waarom SenseGlow", href: "/waarom-senseglow" },
  {
    label: "Service",
    href: "/contact",
    children: [
      { label: "Bestelling volgen", hint: "Je pakket traceren", href: "/volg-je-bestelling" },
      { label: "Contact", hint: "Stel je vraag", href: "/contact" },
    ],
  },
];

const mobileLinks: NavChild[] = [
  { label: "Alle producten", href: "/producten" },
  ...navItems.flatMap((i) => i.children ?? []),
  
  { label: "Waarom SenseGlow", href: "/waarom-senseglow" },
  { label: "Bestelling volgen", href: "/volg-je-bestelling" },
  { label: "Contact", href: "/contact" },
];

const NavDropdown = ({ item }: { item: NavItem }) => {
  const { t, localizePath } = useI18n();
  return (
    <div className="relative group">
      <Link
        to={localizePath(item.href)}
        className="flex items-center gap-1 px-3 py-2 text-[13px] tracking-wide text-foreground/70 hover:text-foreground transition-colors duration-300"
      >
        {t(item.label)}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </Link>

      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 focus-within:visible focus-within:opacity-100 transition-opacity duration-200 absolute left-0 top-full pt-3 z-50">
        <div className="min-w-[260px] rounded-sm border border-border bg-background shadow-[0_18px_40px_-28px_hsl(var(--foreground)/0.5)] p-2">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              to={localizePath(child.href)}
              className="block rounded-sm px-4 py-3 hover:bg-secondary transition-colors"
            >
              <span className="block text-sm font-medium text-foreground">{t(child.label)}</span>
              {child.hint && (
                <span className="block text-xs text-foreground/50 mt-0.5">{t(child.hint)}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SiteHeader = () => {
  const navigate = useNavigate();
  const { t, localizePath } = useI18n();

  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-11 items-center justify-center gap-2 text-xs tracking-[0.14em]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {t("Gratis verzending in Nederland en België")}
        </div>
      </div>
      <div className="container">
        <div className="flex h-20 md:h-24 items-center justify-between gap-4">
          {/* Links: logo */}
          <button
            onClick={() => navigate(localizePath("/"))}
            className="flex items-center shrink-0"
            aria-label={t("Ga naar homepage")}
          >
            <img
              src={wordmark}
              alt="SenseGlow logo"
              loading="eager"
              {...{ fetchpriority: "high" }}
              className="h-11 md:h-14 w-auto object-contain"
              style={{ imageRendering: "auto" }}
            />
          </button>

          {/* Midden: navigatie */}
          <nav className="hidden lg:flex items-center gap-2" aria-label={t("Hoofdmenu")}>
            {navItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <Link
                  key={item.href}
                  to={localizePath(item.href)}
                  className="px-3 py-2 text-[13px] tracking-wide text-foreground/70 hover:text-foreground transition-colors duration-300"
                >
                  {t(item.label)}
                </Link>
              )
            )}
          </nav>

          {/* Rechts: acties */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10"
              onClick={() => navigate(localizePath("/producten"))}
              aria-label={t("Zoek in de collectie")}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10"
              onClick={() => navigate(localizePath("/volg-je-bestelling"))}
              aria-label={t("Mijn bestelling")}
            >
              <User className="h-5 w-5" />
            </Button>
            <CartDrawer />

            {/* Mobiel menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10"
                  aria-label={t("Menu openen")}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 bg-background border-border rounded-sm">
                {mobileLinks.map((link) => (
                  <DropdownMenuItem key={`${link.label}-${link.href}-${mobileLinks.indexOf(link)}`} asChild>
                    <Link
                      to={localizePath(link.href)}
                      className="cursor-pointer text-sm text-foreground/70 hover:text-foreground transition-colors py-2"
                    >
                      {t(link.label)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="border-b border-border" />
    </header>
  );
};
