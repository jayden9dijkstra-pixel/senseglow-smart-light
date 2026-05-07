import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { SizeVariant, bundlePricing, bundleNames, incVatPrices, computeBundlePricing } from "@/lib/productConfig";
import { computeArcBundlePricing, parseArcVariant } from "@/lib/arcProductConfig";
import { parseFlexVariant, computeFlexBundlePricing } from "@/lib/flexProductConfig";

type ColorVariant = string;

// ─── Helpers ───────────────────────────────────────────

type ProductType = "standard" | "arc" | "flex";

function detectProductType(product: ShopifyProduct): ProductType {
  const opts = product.node.variants.edges[0]?.node.selectedOptions || [];
  if (opts.some((o) => o.name.toLowerCase() === "uitstraalkleur")) return "arc";
  if (opts.some((o) => o.name.toLowerCase().includes("emitting"))) return "flex";
  return "standard";
}

// ─── Standard bundle data (size-based) ─────────────────

const createBundleData = (size: SizeVariant | string, fallbackUnitPrice?: number, productLabel = "SenseGlow™") => {
  const known = (bundlePricing as Record<string, ReturnType<typeof computeBundlePricing>>)[size];
  const pricing = known || computeBundlePricing(fallbackUnitPrice ?? 0);
  return [
    {
      name: bundleNames[2], quantity: 2 as const, quantityLabel: "2 stuks",
      sizeLabel: size, label: "Duopak",
      subtekst: "Ideaal om te starten",
      price: pricing.two.price, originalPrice: pricing.two.originalPrice,
      discount: pricing.two.discount, save: pricing.two.save,
      badge: null as string | null, popular: false,
      features: [`2x ${productLabel} ${size}`, "Gratis verzending", "30 dagen retourrecht"],
    },
    {
      name: bundleNames[3], quantity: 3 as const, quantityLabel: "3 stuks",
      sizeLabel: size,
      label: "Familiepak",
      subtekst: "Voor het hele huis",
      price: pricing.three.price, originalPrice: pricing.three.originalPrice,
      discount: pricing.three.discount, save: pricing.three.save,
      badge: "⭐ Meest gekozen", popular: true,
      features: [`3x ${productLabel} ${size}`, "Gratis verzending", "13% korting", "30 dagen retourrecht"],
    },
    {
      name: bundleNames[4], quantity: 4 as const, quantityLabel: "4 stuks",
      sizeLabel: size, label: "Voordeelpak",
      subtekst: "Maximale besparing",
      price: pricing.four.price, originalPrice: pricing.four.originalPrice,
      discount: pricing.four.discount, save: pricing.four.save,
      badge: "Maximaal voordeel" as string | null,
      features: [`4x ${productLabel} ${size}`, "Gratis verzending", "20% korting", "Premium support", "30 dagen retourrecht"],
    },
  ];
};

// ─── Arc bundle data (wattage-based, dynamic pricing) ──

const createArcBundleData = (wattage: string, unitPrice: number) => {
  const p = computeArcBundlePricing(unitPrice);
  return [
    {
      name: "Duo Set", quantity: 2 as const, quantityLabel: "2 stuks",
      sizeLabel: `${wattage} model`, label: "Symmetrisch bij je voordeur",
      subtekst: "Links en rechts voor een gebalanceerde uitstraling",
      price: p.two.price, originalPrice: p.two.originalPrice,
      discount: p.two.discount, save: p.two.save,
      badge: "⭐ Meest gekozen" as string | null, popular: true,
      features: [`2x SenseGlow Arc™ ${wattage}`, "Gratis verzending", "11% korting", "30 dagen retourrecht"],
    },
    {
      name: "Trio Set", quantity: 3 as const, quantityLabel: "3 stuks",
      sizeLabel: `${wattage} model`, label: "Meerdere muren, één lijn",
      subtekst: "Creëer ritme en diepte in je buitenruimte",
      price: p.three.price, originalPrice: p.three.originalPrice,
      discount: p.three.discount, save: p.three.save,
      badge: null as string | null, popular: false,
      features: [`3x SenseGlow Arc™ ${wattage}`, "Gratis verzending", "13% korting", "30 dagen retourrecht"],
    },
    {
      name: "Complete Set", quantity: 4 as const, quantityLabel: "4 stuks",
      sizeLabel: `${wattage} model`, label: "Volledige transformatie",
      subtekst: "Voor een premium lichtervaring rondom je woning",
      price: p.four.price, originalPrice: p.four.originalPrice,
      discount: p.four.discount, save: p.four.save,
      badge: "Maximaal voordeel" as string | null,
      features: [`4x SenseGlow Arc™ ${wattage}`, "Gratis verzending", "20% korting", "Premium support", "30 dagen retourrecht"],
    },
  ];
};

// ─── Flex/Lantern bundle data (color-based, dynamic pricing) ───

const createFlexBundleData = (colorLabel: string, unitPrice: number, productName: string = "SenseGlow Flex™") => {
  const p = computeFlexBundlePricing(unitPrice);
  return [
    {
      name: "Duo Set", quantity: 2 as const, quantityLabel: "2 stuks",
      sizeLabel: colorLabel, label: productName.includes("Lantern") ? "Twee kanten van je tuin" : "Bureau + bedside",
      subtekst: productName.includes("Lantern") ? "Sfeer aan beide zijden" : "Twee plekken, één stijl",
      price: p.two.price, originalPrice: p.two.originalPrice,
      discount: p.two.discount, save: p.two.save,
      badge: null as string | null, popular: false,
      features: [`2x ${productName}`, "Gratis verzending", "11% korting", "30 dagen retourrecht"],
    },
    {
      name: "Meest gekozen", quantity: 3 as const, quantityLabel: "3 stuks",
      sizeLabel: colorLabel, label: productName.includes("Lantern") ? "Langs het tuinpad" : "Bureau + kast + bed",
      subtekst: productName.includes("Lantern") ? "Warm licht langs het hele pad" : "Licht precies waar je het nodig hebt",
      price: p.three.price, originalPrice: p.three.originalPrice,
      discount: p.three.discount, save: p.three.save,
      badge: "⭐ Meest gekozen" as string | null, popular: true,
      features: [`3x ${productName}`, "Gratis verzending", "13% korting", "30 dagen retourrecht"],
    },
    {
      name: "Complete Set", quantity: 4 as const, quantityLabel: "4 stuks",
      sizeLabel: colorLabel, label: productName.includes("Lantern") ? "Rondom je woning" : "Heel je huis verlicht",
      subtekst: productName.includes("Lantern") ? "Volledig verlichte buitenruimte" : "Maximale flexibiliteit, maximale besparing",
      price: p.four.price, originalPrice: p.four.originalPrice,
      discount: p.four.discount, save: p.four.save,
      badge: "Maximaal voordeel" as string | null,
      features: [`4x ${productName}`, "Gratis verzending", "20% korting", "Premium support", "30 dagen retourrecht"],
    },
  ];
};

// ─── Component ─────────────────────────────────────────

interface BundlesSectionProps {
  product?: ShopifyProduct;
  selectedVariant?: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    selectedOptions: Array<{ name: string; value: string }>;
  };
  headlineOverride?: string;
}

export const BundlesSection = ({ product, selectedVariant, headlineOverride }: BundlesSectionProps) => {
  const [selectedBundle, setSelectedBundle] = useState<number | null>(0);
  const addItem = useCartStore((state) => state.addItem);

  const productType = useMemo(() => product ? detectProductType(product) : "standard", [product]);

  // ─── Standard state
  const [selectedSize, setSelectedSize] = useState<SizeVariant>("20cm");
  const [selectedColor, setSelectedColor] = useState<ColorVariant>("");

  // ─── Arc state
  const [selectedWattage, setSelectedWattage] = useState("6W");
  const [selectedBodyColor, setSelectedBodyColor] = useState("");
  const [selectedLightColor, setSelectedLightColor] = useState("");

  // ─── Flex state
  const [selectedFlexColor, setSelectedFlexColor] = useState("");
  const [selectedFlexType, setSelectedFlexType] = useState("");

  // ─── Detect available options ────────────────────────

  const availableColors = useMemo(() => {
    if (!product) return [{ value: "zwart", label: "Zwart", gradient: "bg-gradient-to-br from-gray-700 via-gray-900 to-black" }];

    const colorMap: Record<string, { label: string; gradient: string }> = {
      silver: { label: "Zilver", gradient: "bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400" },
      black: { label: "Zwart", gradient: "bg-gradient-to-br from-gray-700 via-gray-900 to-black" },
      white: { label: "Wit", gradient: "bg-gradient-to-br from-gray-100 via-white to-gray-200" },
      pink: { label: "Roze", gradient: "bg-gradient-to-br from-pink-300 via-pink-200 to-pink-400" },
      green: { label: "Groen", gradient: "bg-gradient-to-br from-green-300 via-green-200 to-green-400" },
    };

    const found = new Set<string>();

    if (productType === "arc") {
      product.node.variants.edges.forEach((v) => {
        v.node.selectedOptions.forEach((opt) => {
          if (opt.name.toLowerCase() === "uitstraalkleur") {
            const val = opt.value.toLowerCase();
            if (val.startsWith("black")) found.add("black");
            if (val.startsWith("white")) found.add("white");
          }
        });
      });
    } else if (productType === "flex") {
      product.node.variants.edges.forEach((v) => {
        const parsed = parseFlexVariant(v.node.selectedOptions);
        found.add(parsed.bodyColor);
      });
    } else {
      product.node.variants.edges.forEach((v) => {
        v.node.selectedOptions.forEach((opt) => {
          const val = opt.value.toLowerCase();
          if (val.includes("silver")) found.add("silver");
          if (val.includes("black")) found.add("black");
          if (val.includes("white")) found.add("white");
        });
      });
    }

    return Array.from(found).map((key) => ({
      value: key,
      label: colorMap[key]?.label || key,
      gradient: colorMap[key]?.gradient || "",
    }));
  }, [product, productType]);

  // Arc options
  const arcOptions = useMemo(() => {
    if (productType !== "arc" || !product) return { wattages: [] as string[], lightColors: [] as string[] };
    const wSet = new Set<string>();
    const lcSet = new Set<string>();
    product.node.variants.edges.forEach((v) => {
      const parsed = parseArcVariant(v.node.selectedOptions);
      if (parsed.wattage) wSet.add(parsed.wattage);
      if (parsed.lightColor) lcSet.add(parsed.lightColor === "warm" ? "Warm licht" : "Koud licht");
    });
    return { wattages: Array.from(wSet).sort((a, b) => parseInt(a) - parseInt(b)), lightColors: Array.from(lcSet) };
  }, [product, productType]);

  // Flex options
  const flexTypes = useMemo(() => {
    if (productType !== "flex" || !product) return [] as string[];
    const types = new Set<string>();
    product.node.variants.edges.forEach((v) => {
      const parsed = parseFlexVariant(v.node.selectedOptions);
      types.add(parsed.type === "remote" ? "Met afstandsbediening" : "Standaard");
    });
    return Array.from(types);
  }, [product, productType]);

  // Standard sizes
  const sizes = useMemo(() => {
    const allSizes: SizeVariant[] = ["20cm", "30cm", "40cm", "50cm"];
    if (!product || productType !== "standard") return allSizes.filter((s) => s !== "50cm").map((s) => ({ value: s, label: s, price: incVatPrices[s] }));
    const available = new Set<string>();
    product.node.variants.edges.forEach((v) => {
      v.node.selectedOptions.forEach((opt) => {
        const val = opt.value.toLowerCase();
        if (val.includes("20cm") || val.includes("20 ")) available.add("20cm");
        if (val.includes("30cm") || val.includes("30 ")) available.add("30cm");
        if (val.includes("40cm") || val.includes("40 ")) available.add("40cm");
        if (val.includes("50cm") || val.includes("50 ")) available.add("50cm");
      });
    });
    return allSizes.filter((s) => available.has(s)).map((s) => ({ value: s, label: s, price: incVatPrices[s] }));
  }, [product, productType]);

  // ─── Sync with selected variant ──────────────────────

  useEffect(() => {
    if (!selectedVariant) return;

    if (productType === "arc") {
      const parsed = parseArcVariant(selectedVariant.selectedOptions);
      if (parsed.wattage) setSelectedWattage(parsed.wattage);
      if (parsed.bodyColor) setSelectedBodyColor(parsed.bodyColor.toLowerCase());
      setSelectedLightColor(parsed.lightColor === "warm" ? "Warm licht" : "Koud licht");
    } else if (productType === "flex") {
      const parsed = parseFlexVariant(selectedVariant.selectedOptions);
      setSelectedFlexColor(parsed.bodyColor);
      setSelectedFlexType(parsed.type === "remote" ? "Met afstandsbediening" : "Standaard");
    } else {
      for (const opt of selectedVariant.selectedOptions) {
        const val = opt.value.toLowerCase();
        if (val.includes("20cm") || (val.includes("20") && !val.includes("50"))) setSelectedSize("20cm");
        else if (val.includes("30")) setSelectedSize("30cm");
        else if (val.includes("40")) setSelectedSize("40cm");
        else if (val.includes("50")) setSelectedSize("50cm");
        if (val.includes("silver")) setSelectedColor("silver");
        else if (val.includes("black")) setSelectedColor("black");
        else if (val.includes("white")) setSelectedColor("white");
      }
    }
  }, [selectedVariant, productType]);

  // ─── Find variant ────────────────────────────────────

  const findVariant = () => {
    if (!product) return selectedVariant;

    if (productType === "arc") {
      return product.node.variants.edges.find((v) => {
        const parsed = parseArcVariant(v.node.selectedOptions);
        return parsed.wattage === selectedWattage &&
          parsed.bodyColor.toLowerCase() === selectedBodyColor &&
          ((selectedLightColor === "Warm licht" && parsed.lightColor === "warm") ||
           (selectedLightColor === "Koud licht" && parsed.lightColor === "cold"));
      })?.node || selectedVariant;
    }

    if (productType === "flex") {
      return product.node.variants.edges.find((v) => {
        const parsed = parseFlexVariant(v.node.selectedOptions);
        const colorMatch = parsed.bodyColor === selectedFlexColor;
        const typeMatch = (selectedFlexType === "Met afstandsbediening" && parsed.type === "remote") ||
                          (selectedFlexType === "Standaard" && parsed.type === "standard");
        return colorMatch && typeMatch;
      })?.node || selectedVariant;
    }

    const colorKey = selectedColor;
    const sizeKey = selectedSize.replace("cm", "");
    return product.node.variants.edges.find((v) => {
      const matchesSize = v.node.selectedOptions.some((opt) => opt.value.toLowerCase().includes(`${sizeKey}cm`));
      const matchesColor = v.node.selectedOptions.some((opt) => opt.value.toLowerCase().includes(colorKey));
      return matchesSize && matchesColor;
    })?.node || selectedVariant;
  };

  // ─── Bundle data ─────────────────────────────────────

  const unitPrice = useMemo(() => {
    if (!product) return 100;
    if (productType === "arc") {
      const v = product.node.variants.edges.find((v) => {
        const parsed = parseArcVariant(v.node.selectedOptions);
        return parsed.wattage === selectedWattage;
      });
      return v ? parseFloat(v.node.price.amount) : 100;
    }
    if (productType === "flex") {
      return parseFloat(product.node.variants.edges[0]?.node.price.amount || "100");
    }
    return 0;
  }, [product, productType, selectedWattage]);

  const currentColorLabel = productType === "flex"
    ? availableColors.find((c) => c.value === selectedFlexColor)?.label || selectedFlexColor
    : productType === "arc"
      ? availableColors.find((c) => c.value === selectedBodyColor)?.label || selectedBodyColor
      : availableColors.find((c) => c.value === selectedColor)?.label || selectedColor;

  const bundles = productType === "arc"
    ? createArcBundleData(selectedWattage, unitPrice)
    : productType === "flex"
      ? createFlexBundleData(currentColorLabel, unitPrice, product?.node.title || "SenseGlow Flex™")
      : createBundleData(selectedSize);

  // ─── Add to cart ─────────────────────────────────────

  const handleAddBundleToCart = (bundleIndex: number) => {
    if (!product) { toast.error("Product niet gevonden"); return; }
    const bundle = bundles[bundleIndex];
    const variantForSelection = findVariant();
    if (!variantForSelection) { toast.error("Selecteer eerst een productvariant"); return; }

    const perUnitIncVat = (parseFloat(bundle.price) / bundle.quantity).toFixed(2);
    addItem({
      product,
      variantId: variantForSelection.id,
      variantTitle: variantForSelection.title,
      price: { amount: perUnitIncVat, currencyCode: variantForSelection.price.currencyCode },
      quantity: bundle.quantity,
      selectedOptions: variantForSelection.selectedOptions,
      isBundle: true,
      bundleName: bundle.name,
      bundleSize: productType === "arc" ? selectedWattage : productType === "flex" ? currentColorLabel : selectedSize,
      bundleIncVatTotal: bundle.price,
    });
  };

  // ─── Selector key for animation ──────────────────────

  const selectorKey = productType === "arc"
    ? `${selectedWattage}-${selectedBodyColor}-${selectedLightColor}`
    : productType === "flex"
      ? `${selectedFlexColor}-${selectedFlexType}`
      : `${selectedSize}-${selectedColor}`;

  // ─── Render ──────────────────────────────────────────

  return (
    <section id="bundels" className="py-20 md:py-32 bg-background-secondary animate-fade-in transition-all duration-500">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <p className="text-sm uppercase tracking-wider text-glow font-medium">
              {headlineOverride || "90% van onze klanten kiest meer dan 1 SenseGlow™"}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Bespaar met bundels
            </h2>
            <p className="text-lg text-muted-foreground">
              Hoe meer je kiest, hoe meer je bespaart
            </p>
          </div>

          {/* Selector bar */}
          <div className="flex justify-center mb-10">
            <div className="bg-background border border-border rounded-xl p-5 inline-flex flex-col sm:flex-row items-center gap-6 flex-wrap">
              {/* Primary dimension: Wattage / Size / nothing for Flex */}
              {productType === "arc" && (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Vermogen</span>
                  <div className="flex gap-2 flex-wrap">
                    {arcOptions.wattages.map((w) => (
                      <button key={w} onClick={() => setSelectedWattage(w)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedWattage === w
                            ? "bg-glow/15 text-glow border border-glow/50 shadow-[0_0_12px_hsl(var(--glow)/0.15)]"
                            : "bg-background-secondary text-muted-foreground border border-border hover:border-glow/30 hover:text-foreground"
                        }`}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {productType === "standard" && (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Maat</span>
                  <div className="flex gap-2">
                    {sizes.map((s) => (
                      <button key={s.value} onClick={() => setSelectedSize(s.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedSize === s.value
                            ? "bg-glow/15 text-glow border border-glow/50 shadow-[0_0_12px_hsl(var(--glow)/0.15)]"
                            : "bg-background-secondary text-muted-foreground border border-border hover:border-glow/30 hover:text-foreground"
                        }`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(productType === "arc" || productType === "standard") && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-border" />
                  <div className="block sm:hidden h-px w-full bg-border" />
                </>
              )}

              {/* Color swatches */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Kleur</span>
                <div className="flex gap-3">
                  {availableColors.map((c) => {
                    const isActive = productType === "arc" ? selectedBodyColor === c.value
                      : productType === "flex" ? selectedFlexColor === c.value
                      : selectedColor === c.value;
                    return (
                      <button key={c.value}
                        onClick={() => {
                          if (productType === "arc") setSelectedBodyColor(c.value);
                          else if (productType === "flex") setSelectedFlexColor(c.value);
                          else setSelectedColor(c.value);
                        }}
                        className="flex flex-col items-center gap-1.5 group">
                        <div className={`w-9 h-9 rounded-full ${c.gradient} transition-all duration-200 ${
                          isActive ? "ring-2 ring-glow ring-offset-2 ring-offset-background scale-110" : "ring-1 ring-border group-hover:ring-glow/40"
                        }`} />
                        <span className={`text-[11px] font-medium transition-colors ${isActive ? "text-glow" : "text-muted-foreground"}`}>
                          {c.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Light color (Arc only) */}
              {productType === "arc" && arcOptions.lightColors.length > 1 && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-border" />
                  <div className="block sm:hidden h-px w-full bg-border" />
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Licht</span>
                    <div className="flex gap-2">
                      {arcOptions.lightColors.map((lc) => (
                        <button key={lc} onClick={() => setSelectedLightColor(lc)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedLightColor === lc
                              ? "bg-glow/15 text-glow border border-glow/50 shadow-[0_0_12px_hsl(var(--glow)/0.15)]"
                              : "bg-background-secondary text-muted-foreground border border-border hover:border-glow/30 hover:text-foreground"
                          }`}>
                          {lc}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Type (Flex only) */}
              {productType === "flex" && flexTypes.length > 1 && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-border" />
                  <div className="block sm:hidden h-px w-full bg-border" />
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Uitvoering</span>
                    <div className="flex gap-2">
                      {flexTypes.map((t) => (
                        <button key={t} onClick={() => setSelectedFlexType(t)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedFlexType === t
                              ? "bg-glow/15 text-glow border border-glow/50 shadow-[0_0_12px_hsl(var(--glow)/0.15)]"
                              : "bg-background-secondary text-muted-foreground border border-border hover:border-glow/30 hover:text-foreground"
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bundle cards */}
          <div key={selectorKey} className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {bundles.map((bundle, index) => {
              const isHighlighted = bundle.popular;
              return (
                <Card key={index} onClick={() => setSelectedBundle(index)}
                  className={`p-8 relative overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full glass ${
                    isHighlighted
                      ? "border-primary border-2 bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10"
                      : selectedBundle === index
                        ? "border-glow border-2"
                        : "hover:border-glow/50 hover:shadow-lg hover:shadow-glow/5"
                  }`}>
                  {bundle.badge && (
                    <Badge className={`absolute top-4 right-4 ${
                      isHighlighted ? "bg-primary text-primary-foreground text-sm px-3 py-1" : "bg-primary text-primary-foreground"
                    }`}>
                      {bundle.badge}
                    </Badge>
                  )}

                  <div className="flex flex-col flex-grow">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">{bundle.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-glow/30 text-glow">
                          {bundle.sizeLabel}
                        </Badge>
                      </div>
                      <p className={`text-sm font-medium ${isHighlighted ? "text-primary" : "text-glow"}`}>{bundle.label}</p>
                      <p className="text-sm text-muted-foreground">{bundle.subtekst}</p>
                    </div>

                    <div className="space-y-2 mt-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground animate-[scale-in_0.4s_ease-out] origin-left"
                          style={{ textShadow: "0 0 20px hsl(var(--glow) / 0.3)", animation: "scale-in 0.4s ease-out, glow-pulse 0.6s ease-out" }}>
                          €{bundle.price}
                        </span>
                        <Badge variant="secondary" className="bg-glow/10 text-glow animate-fade-in">
                          -{bundle.discount}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-through animate-fade-in">Was €{bundle.originalPrice}</p>
                      <p className={`text-sm font-semibold ${isHighlighted ? "text-primary" : "text-glow"} animate-fade-in`}>
                        Je bespaart €{bundle.save}
                      </p>
                    </div>

                    <div className="space-y-3 py-4 border-y border-border mt-6 flex-grow">
                      {bundle.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? "text-primary" : "text-glow"}`} />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button onClick={(e) => { e.stopPropagation(); setSelectedBundle(index); handleAddBundleToCart(index); }}
                      className={`w-full mt-6 ${
                        isHighlighted ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                      size="lg">
                      Kies {bundle.quantityLabel}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
