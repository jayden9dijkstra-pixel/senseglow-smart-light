import { responsiveImg, shopifySized } from "@/lib/shopifyImage";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { NAV_ITEMS } from "@/components/layout/navItems";

type NavGroup = { title: string; items: { href: string; label: string; hint?: string; handle?: string }[] };

const GROUPS: NavGroup[] = NAV_ITEMS.map((item) => ({
  title: item.label,
  items: item.children
    ? item.children.map((c) => ({ ...c, handle: c.href.startsWith("/product/") ? c.href.slice(9) : undefined }))
    : [{ href: item.href, label: item.label }],
}));
const PRODUCT_HANDLES = GROUPS.flatMap((g) => g.items).flatMap((i) => (i.handle ? [i.handle] : []));

/** Mobiel menu: volledig scherm, vijf producten met fotootje, daaronder service. */
export function MobileNav() {
  const { t, localizePath } = useI18n();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open || Object.keys(images).length) return;
    Promise.all(PRODUCT_HANDLES.map((h) => fetchProductByHandle(h).catch(() => null))).then((list) => {
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
            <DialogPrimitive.Title className="text-sm font-medium text-foreground/75">{t("Menu")}</DialogPrimitive.Title>
            <DialogPrimitive.Close className="p-2 text-foreground/70" aria-label={t("Sluiten")}>
              <X className="h-6 w-6" />
            </DialogPrimitive.Close>
          </div>
          <nav className="mt-2 flex flex-col overflow-y-auto" aria-label={t("Hoofdmenu")}>
            {GROUPS.map((g) =>
              g.items.length === 1 && !g.items[0].handle && g.items[0].label === g.title ? (
                <Link
                  key={g.title}
                  to={localizePath(g.items[0].href)}
                  onClick={() => setOpen(false)}
                  className="mt-4 flex min-h-11 items-center justify-between border-b border-foreground/10 py-2.5 text-base font-semibold text-foreground"
                >
                  {t(g.title)}
                  <ChevronRight className="h-4 w-4 text-foreground/75" />
                </Link>
              ) : (
                <div key={g.title} className="mt-4 flex flex-col first:mt-0">
                  <p className="pb-1 text-sm font-semibold uppercase tracking-wide text-foreground/75">{t(g.title)}</p>
                  {g.items.map((p) =>
                    p.handle ? (
                      <Link
                        key={p.href}
                        to={localizePath(p.href)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 border-b border-foreground/10 py-2.5"
                      >
                        <span className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                          {images[p.handle] && <img src={shopifySized(images[p.handle], 200)} alt="" width={48} height={48} loading="lazy" className="h-full w-full object-cover" />}
                        </span>
                        <span className="flex-1">
                          <span className="block text-base font-medium text-foreground">{t(p.label)}</span>
                          {p.hint && <span className="block text-sm text-foreground/75">{t(p.hint)}</span>}
                        </span>
                        <ChevronRight className="h-4 w-4 text-foreground/75" />
                      </Link>
                    ) : (
                      <Link
                        key={p.href}
                        to={localizePath(p.href)}
                        onClick={() => setOpen(false)}
                        className="flex min-h-11 items-center py-2 text-base text-foreground/80"
                      >
                        {t(p.label)}
                      </Link>
                    )
                  )}
                </div>
              )
            )}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
