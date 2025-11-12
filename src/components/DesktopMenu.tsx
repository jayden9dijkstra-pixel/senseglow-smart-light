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
    { label: "Homepagina", href: "#home" },
    { label: "Winkel", href: "#waarom" },
    { label: "Contact", href: "#products" },
    { label: "Over ons", href: "#faq" },
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
