import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoNew from "@/assets/logo-new.png";

export const SiteHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background">
      <div className="container">
        <div className="flex h-24 md:h-28 items-center relative">
          {/* Mobile Layout */}
          <div className="flex md:hidden w-full items-center justify-between">
            <ThemeToggle />
            
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
            {/* Left - Navigation */}
            <nav className="flex items-center gap-10">
              <a 
                href="/" 
                className="text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500"
              >
                Home
              </a>
              <a
                href="/product/motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2025-11-07-06-57-58"
                className="text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500"
              >
                Producten
              </a>
              <a 
                href="/contact" 
                className="text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500"
              >
                Contact
              </a>
            </nav>
            
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
      
      {/* Mobile Navigation - Below header */}
      <div className="md:hidden border-b border-foreground/8 bg-background">
        <div className="container">
          <nav className="flex items-center justify-center gap-8 py-3">
            <a 
              href="/" 
              className="text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500"
            >
              Home
            </a>
            <a
              href="/product/motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2025-11-07-06-57-58"
              className="text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500"
            >
              Producten
            </a>
            <a 
              href="/contact" 
              className="text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
