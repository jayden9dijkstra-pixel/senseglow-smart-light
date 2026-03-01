import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { SizeVariant, bundlePricing, bundleNames, incVatPrices } from "@/lib/productConfig";

type ColorVariant = "zilver" | "zwart";

const createBundleData = (size: SizeVariant) => {
  const pricing = bundlePricing[size];
  
  return [
    {
      name: bundleNames[2],
      quantity: 2 as const,
      quantityLabel: "2 stuks",
      sizeLabel: `${size} modellen`,
      label: "Duo Set",
      subtekst: "Ideaal om te starten met nachtverlichting",
      price: pricing.two.price,
      originalPrice: pricing.two.originalPrice,
      discount: pricing.two.discount,
      save: pricing.two.save,
      badge: null,
      popular: false,
      features: [
        `2x SenseGlow™ ${size} LED strip`,
        "Gratis verzending",
        "30 dagen retourrecht"
      ]
    },
    {
      name: bundleNames[3],
      quantity: 3 as const,
      quantityLabel: "3 stuks",
      sizeLabel: `${size} modellen`,
      label: size === "30cm" ? "Perfect voor trap of gang" : "Meest gekozen",
      subtekst: "Veiligheid én comfort voor dagelijks gebruik",
      price: pricing.three.price,
      originalPrice: pricing.three.originalPrice,
      discount: pricing.three.discount,
      save: pricing.three.save,
      badge: "⭐ Meest gekozen",
      popular: true,
      features: [
        `3x SenseGlow™ ${size} LED strip`,
        "Gratis verzending",
        "20% korting",
        "30 dagen retourrecht"
      ]
    },
    {
      name: bundleNames[4],
      quantity: 4 as const,
      quantityLabel: "4 stuks",
      sizeLabel: `${size} modellen`,
      label: "Volledige gemoedsrust",
      subtekst: "Voor wie alles in één keer goed wil doen",
      price: pricing.four.price,
      originalPrice: pricing.four.originalPrice,
      discount: pricing.four.discount,
      save: pricing.four.save,
      badge: "Maximaal voordeel",
      features: [
        `4x SenseGlow™ ${size} LED strip`,
        "Gratis verzending",
        "25% korting",
        "Premium support",
        "30 dagen retourrecht"
      ]
    }
  ];
};

interface BundlesSectionProps {
  product?: ShopifyProduct;
  selectedVariant?: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
}

export const BundlesSection = ({ product, selectedVariant }: BundlesSectionProps) => {
  const [selectedBundle, setSelectedBundle] = useState<number | null>(0);
  const [selectedSize, setSelectedSize] = useState<SizeVariant>("20cm");
  const [selectedColor, setSelectedColor] = useState<ColorVariant>("zilver");
  const addItem = useCartStore((state) => state.addItem);

  // Sync bundle size & color with selected variant
  useEffect(() => {
    if (selectedVariant) {
      for (const opt of selectedVariant.selectedOptions) {
        const val = opt.value.toLowerCase();
        if (val.includes("20")) setSelectedSize("20cm");
        else if (val.includes("30")) setSelectedSize("30cm");
        else if (val.includes("40")) setSelectedSize("40cm");
        
        if (val.includes("silver")) setSelectedColor("zilver");
        else if (val.includes("black")) setSelectedColor("zwart");
      }
    }
  }, [selectedVariant]);

  const bundles = createBundleData(selectedSize);

  // Find the correct variant for size + color combo
  const findVariantForSizeAndColor = (size: SizeVariant, color: ColorVariant) => {
    if (!product) return selectedVariant;
    
    const colorKey = color === "zilver" ? "silver" : "black";
    const sizeKey = size.replace("cm", "");
    
    const variant = product.node.variants.edges.find(v => {
      const matchesSize = v.node.selectedOptions.some(opt => 
        opt.value.toLowerCase().includes(`${sizeKey}cm`)
      );
      const matchesColor = v.node.selectedOptions.some(opt => 
        opt.value.toLowerCase().includes(colorKey)
      );
      return matchesSize && matchesColor;
    });
    
    return variant?.node || selectedVariant;
  };

  const handleAddBundleToCart = (bundleIndex: number) => {
    if (!product) {
      toast.error("Product niet gevonden");
      return;
    }

    const bundle = bundles[bundleIndex];
    const variantForSelection = findVariantForSizeAndColor(selectedSize, selectedColor);
    
    if (!variantForSelection) {
      toast.error("Selecteer eerst een productvariant");
      return;
    }

    const perUnitIncVat = (parseFloat(bundle.price) / bundle.quantity).toFixed(2);
    
    addItem({
      product,
      variantId: variantForSelection.id,
      variantTitle: variantForSelection.title,
      price: {
        amount: perUnitIncVat,
        currencyCode: variantForSelection.price.currencyCode,
      },
      quantity: bundle.quantity,
      selectedOptions: variantForSelection.selectedOptions,
      isBundle: true,
      bundleName: bundle.name,
      bundleSize: selectedSize,
      bundleIncVatTotal: bundle.price,
    });
  };

  const sizes: { value: SizeVariant; label: string; price: string }[] = [
    { value: "20cm", label: "20cm", price: incVatPrices["20cm"] },
    { value: "30cm", label: "30cm", price: incVatPrices["30cm"] },
    { value: "40cm", label: "40cm", price: incVatPrices["40cm"] },
  ];

  const colors: { value: ColorVariant; label: string; gradient: string }[] = [
    { value: "zilver", label: "Zilver", gradient: "bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400" },
    { value: "zwart", label: "Zwart", gradient: "bg-gradient-to-br from-gray-700 via-gray-900 to-black" },
  ];

  return (
    <section id="bundels" className="py-20 md:py-32 bg-background-secondary animate-fade-in transition-all duration-500">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <p className="text-sm uppercase tracking-wider text-glow font-medium">
              90% van onze klanten kiest meer dan 1 SenseGlow™
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Bespaar met bundels
            </h2>
            <p className="text-lg text-muted-foreground">
              Hoe meer je beschermt, hoe meer je bespaart
            </p>
          </div>

          {/* Size + Color Selector */}
          <div className="flex justify-center mb-10">
            <div className="bg-background border border-border rounded-xl p-5 inline-flex flex-col sm:flex-row items-center gap-6">
              {/* Size pills */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Maat</span>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedSize(s.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize === s.value
                          ? "bg-glow/15 text-glow border border-glow/50 shadow-[0_0_12px_hsl(var(--glow)/0.15)]"
                          : "bg-background-secondary text-muted-foreground border border-border hover:border-glow/30 hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-border" />
              <div className="block sm:hidden h-px w-full bg-border" />

              {/* Color swatches */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Kleur</span>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${c.gradient} transition-all duration-200 ${
                          selectedColor === c.value
                            ? "ring-2 ring-glow ring-offset-2 ring-offset-background scale-110"
                            : "ring-1 ring-border group-hover:ring-glow/40"
                        }`}
                      />
                      <span className={`text-[11px] font-medium transition-colors ${
                        selectedColor === c.value ? "text-glow" : "text-muted-foreground"
                      }`}>
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div key={`${selectedSize}-${selectedColor}`} className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {bundles.map((bundle, index) => {
              const isHighlighted = bundle.popular;
              return (
              <Card 
                key={`${selectedSize}-${selectedColor}-${index}`}
                onClick={() => setSelectedBundle(index)}
                className={`p-8 relative overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full ${
                  isHighlighted
                    ? 'border-primary border-2 bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10'
                    : selectedBundle === index
                      ? 'border-glow border-2 bg-background' 
                      : 'bg-background border-border hover:border-glow/50'
                }`}
              >
                {bundle.badge && (
                  <Badge className={`absolute top-4 right-4 ${
                    isHighlighted 
                      ? 'bg-primary text-primary-foreground text-sm px-3 py-1' 
                      : 'bg-primary text-primary-foreground'
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
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        {selectedColor === "zilver" ? "Zilver" : "Zwart"}
                      </Badge>
                    </div>
                    <p className={`text-sm font-medium ${isHighlighted ? 'text-primary' : 'text-glow'}`}>{bundle.label}</p>
                    <p className="text-sm text-muted-foreground">{bundle.subtekst}</p>
                  </div>

                  <div className="space-y-2 mt-6">
                    <div className="flex items-baseline gap-2">
                      <span 
                        key={`price-${selectedSize}-${index}`}
                        className="text-4xl font-bold text-foreground animate-[scale-in_0.4s_ease-out] origin-left"
                        style={{
                          textShadow: '0 0 20px hsl(var(--glow) / 0.3)',
                          animation: 'scale-in 0.4s ease-out, glow-pulse 0.6s ease-out'
                        }}
                      >
                        €{bundle.price}
                      </span>
                      <Badge variant="secondary" className="bg-glow/10 text-glow animate-fade-in">
                        -{bundle.discount}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-through animate-fade-in">
                      Was €{bundle.originalPrice}
                    </p>
                    <p className={`text-sm font-semibold ${isHighlighted ? 'text-primary' : 'text-glow'} animate-fade-in`}>
                      Je bespaart €{bundle.save}
                    </p>
                  </div>

                  <div className="space-y-3 py-4 border-y border-border mt-6 flex-grow">
                    {bundle.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-primary' : 'text-glow'}`} />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBundle(index);
                      handleAddBundleToCart(index);
                    }}
                    className={`w-full mt-6 ${
                      isHighlighted 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20' 
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                    size="lg"
                  >
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
