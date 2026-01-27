import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { SizeVariant, bundlePricing } from "@/lib/productConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createBundleData = (size: SizeVariant) => {
  const pricing = bundlePricing[size];
  const sizeDescriptions: Record<SizeVariant, string> = {
    "20cm": "Ideaal voor kleine ruimtes",
    "30cm": "Perfect voor trappen & gangen",
    "40cm": "Meer licht voor grotere ruimtes",
  };
  
  return [
    {
      name: "Night Safety Pack",
      quantity: 2,
      quantityLabel: "2 stuks",
      sizeLabel: `${size} modellen`,
      sizeDescription: sizeDescriptions[size],
      label: "Ideaal voor trap & gang",
      subtekst: "Meest gekozen voor nachtveiligheid",
      price: pricing.two.price,
      originalPrice: pricing.two.originalPrice,
      discount: pricing.two.discount,
      badge: "Meest gekozen",
      popular: true,
      features: [
        `2x SenseGlow™ ${size} LED strip`,
        "Gratis verzending",
        "30 dagen retourrecht"
      ]
    },
    {
      name: "Home Glow Pack",
      quantity: 3,
      quantityLabel: "3 stuks",
      sizeLabel: `${size} modellen`,
      sizeDescription: sizeDescriptions[size],
      label: "Beste balans",
      subtekst: "Veiligheid én comfort voor dagelijks gebruik",
      price: pricing.three.price,
      originalPrice: pricing.three.originalPrice,
      discount: pricing.three.discount,
      badge: "Beste waarde",
      features: [
        `3x SenseGlow™ ${size} LED strip`,
        "Gratis verzending",
        "Extra voordeel",
        "30 dagen retourrecht"
      ]
    },
    {
      name: "Whole Home Security Pack",
      quantity: 5,
      quantityLabel: "5 stuks",
      sizeLabel: `${size} modellen`,
      sizeDescription: sizeDescriptions[size],
      label: "Volledige gemoedsrust",
      subtekst: "Voor wie alles in één keer goed wil doen",
      price: pricing.five.price,
      originalPrice: pricing.five.originalPrice,
      discount: pricing.five.discount,
      badge: "Maximaal voordeel",
      features: [
        `5x SenseGlow™ ${size} LED strip`,
        "Gratis verzending",
        "Maximaal voordeel",
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
  const addItem = useCartStore((state) => state.addItem);

  // Sync bundle size with selected variant
  useEffect(() => {
    if (selectedVariant) {
      const sizeOption = selectedVariant.selectedOptions.find(
        opt => opt.name.toLowerCase() === "maat" || opt.name.toLowerCase() === "size"
      );
      if (sizeOption) {
        const sizeValue = sizeOption.value.toLowerCase();
        if (sizeValue.includes("20")) setSelectedSize("20cm");
        else if (sizeValue.includes("30")) setSelectedSize("30cm");
        else if (sizeValue.includes("40")) setSelectedSize("40cm");
      }
    }
  }, [selectedVariant]);

  const bundles = createBundleData(selectedSize);

  // Find the correct variant for the selected size
  const findVariantForSize = (size: SizeVariant) => {
    if (!product) return selectedVariant;
    
    const variant = product.node.variants.edges.find(v => {
      const sizeOption = v.node.selectedOptions.find(
        opt => opt.name.toLowerCase() === "maat" || opt.name.toLowerCase() === "size"
      );
      return sizeOption?.value.toLowerCase().includes(size.replace("cm", ""));
    });
    
    return variant?.node || selectedVariant;
  };

  const handleAddBundleToCart = (bundleIndex: number) => {
    if (!product) {
      toast.error("Product niet gevonden");
      return;
    }

    const bundle = bundles[bundleIndex];
    const variantForSize = findVariantForSize(selectedSize);
    
    if (!variantForSize) {
      toast.error("Selecteer eerst een productvariant");
      return;
    }
    
    addItem({
      product,
      variantId: variantForSize.id,
      variantTitle: variantForSize.title,
      price: {
        amount: (parseFloat(bundle.price) / bundle.quantity).toFixed(2),
        currencyCode: variantForSize.price.currencyCode,
      },
      quantity: bundle.quantity,
      selectedOptions: variantForSize.selectedOptions,
    });

    toast.success(`${bundle.name} toegevoegd!`, {
      description: `${bundle.quantity}x ${product.node.title} (${selectedSize}) - €${bundle.price}`,
      position: "top-center",
    });
  };

  return (
    <section id="bundels" className="py-20 md:py-32 bg-background-secondary animate-fade-in transition-all duration-500">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            {/* Social Proof Header */}
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

          {/* Size Selector */}
          <div className="flex justify-center mb-10">
            <div className="bg-background border border-border rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Kies je maat:</span>
                <Select value={selectedSize} onValueChange={(value: SizeVariant) => setSelectedSize(value)}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="20cm">20cm - Compact</SelectItem>
                    <SelectItem value="30cm">30cm - Standaard</SelectItem>
                    <SelectItem value="40cm">40cm - Groot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div key={selectedSize} className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {bundles.map((bundle, index) => (
              <Card 
                key={`${selectedSize}-${index}`}
                onClick={() => setSelectedBundle(index)}
                className={`p-8 relative overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full ${
                  selectedBundle === index
                    ? 'border-glow border-2 bg-background' 
                    : 'bg-background border-border hover:border-glow/50'
                }`}
              >
                {bundle.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {bundle.badge}
                  </Badge>
                )}

                <div className="flex flex-col flex-grow">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">{bundle.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-glow/30 text-glow">
                        {bundle.sizeLabel}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-glow">{bundle.label}</p>
                    <p className="text-sm text-muted-foreground">{bundle.subtekst}</p>
                  </div>

                  {/* Pricing */}
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
                  </div>

                  {/* Features - grows to push button down */}
                  <div className="space-y-3 py-4 border-y border-border mt-6 flex-grow">
                    {bundle.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-glow flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA - always at bottom */}
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBundle(index);
                      handleAddBundleToCart(index);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
                    size="lg"
                  >
                    Kies {bundle.quantityLabel}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
