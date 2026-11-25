/** Eén menu-indeling voor kopbalk en mobiel menu. */
import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "@/lib/productConfig";

export type NavChild = { label: string; hint?: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Binnen",
    href: "/producten",
    children: [
      { label: "SenseGlow Wall Lamp", hint: "Trap en gang", href: `/product/${STEP_PRODUCT_HANDLE}` },
      { label: "Ambient Motion Bar", hint: "Hal en kast", href: `/product/${PRODUCT_HANDLE}` },
      { label: "SenseGlow Wave", hint: "Keuken en kast", href: `/product/${WAVE_PRODUCT_HANDLE}` },
      { label: "SenseGlow Flex", hint: "Bureau", href: `/product/${FLEX_PRODUCT_HANDLE}` },
    ],
  },
  {
    label: "Buiten",
    href: "/producten",
    children: [
      { label: "SenseGlow Solar Lantern", hint: "Tuin, pad en schuur", href: `/product/${LANTERN_PRODUCT_HANDLE}` },
    ],
  },
  { label: "Alle producten", href: "/producten" },
  {
    label: "Service",
    href: "/contact",
    children: [
      { label: "Bestelling volgen", href: "/volg-je-bestelling" },
      { label: "Verzending & retour", href: "/verzending" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
