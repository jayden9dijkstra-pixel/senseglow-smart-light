import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DesktopMenu = () => {
  const menuItems = [
    { label: "HOME", href: "/" },
    { label: "PRODUCTEN", href: "/product/motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2025-11-07-06-57-58" },
    { label: "CONTACT", href: "#contact" },
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
