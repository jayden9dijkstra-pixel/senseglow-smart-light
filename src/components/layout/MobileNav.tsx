import { responsiveImg, shopifySized } from "@/lib/shopifyImage";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "@/lib/productConfig";

const PRODUCTS = [
  { handle: PRODUCT_HANDLE, label: "Ambient Motion Bar" },
  { handle: WAVE_PRODUCT_HANDLE, label: "SenseGlow Wave" },
  { handle: STEP_PRODUCT_HANDLE, label: "SenseGlow Wall Lamp" },
  { handle: LANTERN_PRODUCT_HANDLE, label: "SenseGlow Solar Lantern" },
  { handle: FLEX_PRODUCT_HANDLE, label: "SenseGlow Flex" },
];

const SERVICE = [
  { href: "/volg-je-bestelling", label: "Bestelling volgen" },
  { href: "/contact", label: "Contact" },
];

/** Mobiel menu: volledig scherm, vijf producten met fotootje, daaronder service. */
export function MobileNav() {
  const { t, localizePath } = useI18n();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open || Object.keys(images).length) return;
    Promise.all(PRODUCTS.map((p) => fetchProductByHandle(p.handle).catch(() => null))).then((list) => {
      const map: Record<string, string> = {};
      list.forEach((p: ShopifyProduct | null) => {
        const img = p?.node.featuredImage?.url ?? p?.node.images?.edges?.[0]?.node.url;
        if (p && img) map[p.node.handle] = img;
      });
      setImages(map);
    });
  }, [open, images]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10"
          aria-label={t("Menu openen")}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content className="fixed inset-0 z-[60] flex flex-col bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden">
          <div className="flex h-12 items-center justify-between">
            <DialogPrimitive.Title className="text-sm font-medium text-foreground/60">{t("Menu")}</DialogPrimitive.Title>
            <DialogPrimitive.Close className="p-2 text-foreground/70" aria-label={t("Sluiten")}>
              <X className="h-6 w-6" />
            </DialogPrimitive.Close>
          </div>
          <nav className="mt-2 flex flex-col" aria-label={t("Hoofdmenu")}>
            {PRODUCTS.map((p) => (
              <Link
                key={p.handle}
                to={localizePath(`/product/${p.handle}`)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-foreground/10 py-2.5"
              >
                <span className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {images[p.handle] && <img src={shopifySized(images[p.handle], 200)} alt="" width={48} height={48} loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="flex-1 text-base font-medium text-foreground">{t(p.label)}</span>
                <ChevronRight className="h-4 w-4 text-foreground/40" />
              </Link>
            ))}
            <div className="mt-4 flex flex-col">
              {SERVICE.map((s) => (
                <Link
                  key={s.href}
                  to={localizePath(s.href)}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm text-foreground/70"
                >
                  {t(s.label)}
                </Link>
              ))}
            </div>
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
