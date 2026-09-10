import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoNew from "@/assets/logo-new.png?w=256&format=webp";
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
  { label: "Bundels", href: "/bundels" },
  { label: "Waarom SenseGlow", href: "/waarom-senseglow" },
];

const mobileLinks: NavChild[] = [
  { label: "Alle producten", href: "/producten" },
  ...navItems.flatMap((i) => i.children ?? []),
  { label: "Bundels", href: "/bundels" },
  { label: "Waarom SenseGlow", href: "/waarom-senseglow" },
  { label: "Bestelling volgen", href: "/bestelling-volgen" },
  { label: "Contact", href: "/contact" },
];

const NavDropdown = ({ item }: { item: NavItem }) => {
  return (
    <div className="relative group">
      <Link
        to={item.href}
        className="flex items-center gap-1 px-3 py-2 text-[13px] tracking-wide text-foreground/70 hover:text-glow transition-colors duration-300"
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </Link>

      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 focus-within:visible focus-within:opacity-100 transition-opacity duration-200 absolute left-0 top-full pt-3 z-50">
        <div className="min-w-[260px] rounded-2xl border border-foreground/10 bg-background shadow-xl p-2">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block rounded-xl px-4 py-3 hover:bg-foreground/5 transition-colors"
            >
              <span className="block text-sm font-medium text-foreground">{child.label}</span>
              {child.hint && (
                <span className="block text-xs text-foreground/50 mt-0.5">{child.hint}</span>
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

  return (
    <header className="w-full glass sticky top-0 z-50">
      <div className="container">
        <div className="flex h-20 md:h-24 items-center justify-between gap-4">
          {/* Links: logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center shrink-0"
            aria-label="Ga naar homepage"
          >
            <img
              src={logoNew}
              alt="SenseGlow logo"
              width={256}
              height={256}
              loading="eager"
              {...{ fetchpriority: "high" }}
              className="h-14 md:h-16 w-auto object-contain"
            />
          </button>

          {/* Midden: navigatie */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Hoofdmenu">
            {navItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-3 py-2 text-[13px] tracking-wide text-foreground/70 hover:text-glow transition-colors duration-300"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Rechts: acties */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10"
              onClick={() => navigate("/producten")}
              aria-label="Zoek in de collectie"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10"
              onClick={() => navigate("/bestelling-volgen")}
              aria-label="Mijn bestelling"
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
                  aria-label="Menu openen"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 bg-background border-foreground/10">
                {mobileLinks.map((link) => (
                  <DropdownMenuItem key={link.label + link.href} asChild>
                    <Link
                      to={link.href}
                      className="cursor-pointer text-sm text-foreground/70 hover:text-glow transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="border-b border-foreground/8" />
    </header>
  );
};
