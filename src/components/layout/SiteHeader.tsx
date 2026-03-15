import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logoNew from "@/assets/logo-new.png";
// Single product handle - the only active SenseGlow product
const PRODUCT_HANDLE = "senseglow-ambient-motion-bar-1";

const menuItems = [{
  label: "Home",
  href: "/"
}, {
  label: "Producten",
  href: `/product/${PRODUCT_HANDLE}`
}, {
  label: "Bestelling Volgen",
  href: "/bestelling-volgen"
}, {
  label: "Duurzaamheid",
  href: "/duurzaamheid"
}, {
  label: "Contact",
  href: "/contact"
}, {
  label: "Verzending",
  href: "/verzending"
}, {
  label: "Retourneren",
  href: "/retourneren"
}, {
  label: "Over Ons",
  href: "/over"
}];
export const SiteHeader = () => {
  const navigate = useNavigate();
  return <header className="w-full glass sticky top-0 z-50">
      <div className="container">
        <div className="flex h-24 md:h-28 items-center relative">
          {/* Mobile Layout */}
          <div className="flex md:hidden w-full items-center justify-between">
            {/* Left - Menu with fixed width for symmetry */}
            <div className="w-20 flex justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent px-0">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-background border-foreground/10">
                  {menuItems.map(item => <DropdownMenuItem key={item.href} asChild>
                      <a href={item.href} className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-foreground/70 hover:text-glow transition-colors duration-500">
                        {item.label}
                      </a>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Center - Logo */}
            <button onClick={() => navigate("/")} className="cursor-pointer" aria-label="Ga naar homepage">
              <img src={logoNew} alt="SenseGlow Logo" className="h-[76px] w-auto object-contain" />
            </button>
            
            {/* Right - Cart with fixed width for symmetry */}
            <div className="w-20 flex justify-end">
              <CartDrawer />
            </div>
          </div>

          {/* Desktop Layout - Architectural spacing */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Left - Navigation Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent gap-3">
                  <Menu className="h-6 w-6" />
                  <span className="text-sm uppercase tracking-[0.3em] font-medium">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background border-foreground/10">
                {menuItems.map(item => <DropdownMenuItem key={item.href} asChild>
                    <a href={item.href} className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-foreground/70 hover:text-glow transition-colors duration-500 py-2">
                      {item.label}
                    </a>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Center - Logo */}
            <button onClick={() => navigate("/")} className="absolute left-1/2 -translate-x-1/2 translate-x-2 cursor-pointer" aria-label="Ga naar homepage">
              <img src={logoNew} alt="SenseGlow Logo" className="h-20 w-auto object-contain" />
            </button>
            
            {/* Right - Cart */}
            <CartDrawer />
          </div>
        </div>
      </div>
      
      {/* Thin editorial separator line */}
      <div className="border-b border-foreground/8" />
    </header>;
};