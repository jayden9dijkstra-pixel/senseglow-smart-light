import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search } from "lucide-react";
import logoNew from "@/assets/logo-new.png";

export const SiteHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background">
      {/* Top bar with icons and logo */}
      <div className="container">
        <div className="flex h-32 items-center py-4 relative">
          {/* Mobile Layout */}
          <div className="flex md:hidden w-full items-center justify-between">
            {/* Left - Search */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Center - Logo */}
            <button 
              onClick={() => navigate("/")}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-90 transition-opacity duration-300"
              aria-label="Ga naar homepage"
            >
              <img 
                src={logoNew} 
                alt="SenseGlow Logo" 
                className="relative h-20 w-auto object-contain"
              />
            </button>
            
            {/* Right - Cart */}
            <CartDrawer />
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Left - Search Icon */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Center - Logo */}
            <button 
              onClick={() => navigate("/")}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-90 transition-opacity duration-300"
              aria-label="Ga naar homepage"
            >
              <img 
                src={logoNew} 
                alt="SenseGlow Logo" 
                className="relative h-24 w-auto object-contain"
              />
            </button>
            
            {/* Right - Theme Toggle & Cart */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <CartDrawer />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar with navigation - editorial line separator */}
      <div className="border-t border-foreground/10 bg-background">
        <div className="container">
          <nav className="flex items-center justify-center gap-12 py-4">
            <a 
              href="/" 
              className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-300"
            >
              HOME
            </a>
            <a
              href="/product/motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2025-11-07-06-57-58"
              className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-300"
            >
              PRODUCTEN
            </a>
            <a 
              href="/contact" 
              className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-300"
            >
              CONTACT
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
