import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DesktopMenu = () => {
  // Single product handle - the only active SenseGlow product
  const PRODUCT_HANDLE = "senseglow-ambient-motion-bar-1";
  
  const menuItems = [
    { label: "HOME", href: "/" },
    { label: "PRODUCTEN", href: `/product/${PRODUCT_HANDLE}` },
    { label: "BESTELLING VOLGEN", href: "/bestelling-volgen" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu openen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-background">
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <a
              href={item.href}
              className="cursor-pointer text-foreground hover:text-brand-orange transition-colors"
            >
              {item.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
