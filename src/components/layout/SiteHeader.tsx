import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoNew from "@/assets/logo-new.png";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Producten", href: "/product/motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2025-11-07-06-57-58" },
  { label: "Duurzaamheid", href: "/duurzaamheid" },
  { label: "Contact", href: "/contact" },
  { label: "Verzending", href: "/verzending" },
  { label: "Retourneren", href: "/retourneren" },
  { label: "Over Ons", href: "/over" },
];

export const SiteHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background">
      <div className="container">
        <div className="flex h-24 md:h-28 items-center relative">
          {/* Mobile Layout */}
          <div className="flex md:hidden w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground/50 hover:text-glow hover:bg-transparent gap-2 px-2">
                    <Menu className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-background border-foreground/10">
                  {menuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <a
                        href={item.href}
                        className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-foreground/70 hover:text-glow transition-colors duration-500"
                      >
                        {item.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
            
            <button 
              onClick={() => navigate("/")}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
              aria-label="Ga naar homepage"
            >
              <img 
                src={logoNew} 
                alt="SenseGlow Logo" 
                className="h-16 w-auto object-contain opacity-90"
              />
            </button>
            
            <CartDrawer />
          </div>

          {/* Desktop Layout - Architectural spacing */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Left - Navigation Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/50 hover:text-glow hover:bg-transparent gap-2">
                  <Menu className="h-4 w-4" />
                  <span className="text-[11px] uppercase tracking-[0.3em] font-medium">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background border-foreground/10">
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <a
                      href={item.href}
                      className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-foreground/70 hover:text-glow transition-colors duration-500 py-2"
                    >
                      {item.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Center - Logo */}
            <button 
              onClick={() => navigate("/")}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
              aria-label="Ga naar homepage"
            >
              <img 
                src={logoNew} 
                alt="SenseGlow Logo" 
                className="h-20 w-auto object-contain opacity-90"
              />
            </button>
            
            {/* Right - Utilities (subtle) */}
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <CartDrawer />
            </div>
          </div>
        </div>
      </div>
      
      {/* Thin editorial separator line */}
      <div className="border-b border-foreground/8" />
    </header>
  );
};
