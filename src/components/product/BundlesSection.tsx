import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bundleData = {
  "20cm": [
    {
      name: "Night Safety Pack",
      quantity: 2,
      quantityLabel: "2 stuks",
      sizeLabel: "20cm modellen",
      sizeDescription: "Ideaal voor trap & gang",
      label: "Ideaal voor trap & gang",
      subtekst: "Meest gekozen voor nachtveiligheid",
      price: "66.95",
      originalPrice: "69.90",
      discount: "5%",
      badge: "Meest gekozen",
      popular: true,
      features: [
        "2x SenseGlow™ 20cm LED strip",
        "Gratis verzending",
        "30 dagen retourrecht"
      ]
    },
    {
      name: "Home Glow Pack",
      quantity: 3,
      quantityLabel: "3 stuks",
      sizeLabel: "20cm modellen",
      sizeDescription: "Ideaal voor trap & gang",
      label: "Beste balans",
      subtekst: "Veiligheid én comfort voor dagelijks gebruik",
      price: "94.95",
      originalPrice: "104.85",
      discount: "10%",
      badge: "Beste waarde",
      features: [
        "3x SenseGlow™ 20cm LED strip",
        "Gratis verzending",
        "Extra voordeel",
        "30 dagen retourrecht"
      ]
    },
    {
      name: "Whole Home Security Pack",
      quantity: 5,
      quantityLabel: "5 stuks",
      sizeLabel: "20cm modellen",
      sizeDescription: "Ideaal voor trap & gang",
      label: "Volledige gemoedsrust",
      subtekst: "Voor wie alles in één keer goed wil doen",
      price: "149.95",
      originalPrice: "174.75",
      discount: "15%",
      badge: "Maximaal voordeel",
      features: [
        "5x SenseGlow™ 20cm LED strip",
        "Gratis verzending",
        "Maximaal voordeel",
        "Premium support",
        "30 dagen retourrecht"
      ]
    }
  ],
  "40cm": [
    {
      name: "Night Safety Pack",
      quantity: 2,
      quantityLabel: "2 stuks",
      sizeLabel: "40cm modellen",
      sizeDescription: "Meer licht voor grotere ruimtes",
      label: "Ideaal voor trap & gang",
      subtekst: "Meest gekozen voor nachtveiligheid",
      price: "99.95",
      originalPrice: "109.90",
      discount: "10%",
      badge: "Meest gekozen",
      popular: true,
      features: [
        "2x SenseGlow™ 40cm LED strip",
        "Gratis verzending",
        "30 dagen retourrecht"
      ]
    },
    {
      name: "Home Glow Pack",
      quantity: 3,
      quantityLabel: "3 stuks",
      sizeLabel: "40cm modellen",
      sizeDescription: "Meer licht voor grotere ruimtes",
      label: "Beste balans",
      subtekst: "Veiligheid én comfort voor dagelijks gebruik",
      price: "139.95",
      originalPrice: "164.85",
      discount: "15%",
      badge: "Beste waarde",
      features: [
        "3x SenseGlow™ 40cm LED strip",
        "Gratis verzending",
        "Extra voordeel",
        "30 dagen retourrecht"
      ]
    },
    {
      name: "Whole Home Security Pack",
      quantity: 5,
      quantityLabel: "5 stuks",
      sizeLabel: "40cm modellen",
      sizeDescription: "Meer licht voor grotere ruimtes",
      label: "Volledige gemoedsrust",
      subtekst: "Voor wie alles in één keer goed wil doen",
      price: "219.95",
      originalPrice: "274.75",
      discount: "20%",
      badge: "Maximaal voordeel",
      features: [
        "5x SenseGlow™ 40cm LED strip",
        "Gratis verzending",
        "Maximaal voordeel",
        "Premium support",
        "30 dagen retourrecht"
      ]
    }
  ]
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
  const [selectedSize, setSelectedSize] = useState<"20cm" | "40cm">("20cm");
  const addItem = useCartStore((state) => state.addItem);

  const bundles = bundleData[selectedSize];

  const handleAddBundleToCart = (bundleIndex: number) => {
    if (!product || !selectedVariant) {
      toast.error("Selecteer eerst een productvariant");
      return;
    }

    const bundle = bundles[bundleIndex];
    
    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: {
        amount: (parseFloat(bundle.price) / bundle.quantity).toFixed(2),
        currencyCode: selectedVariant.price.currencyCode,
      },
      quantity: bundle.quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success(`${bundle.name} toegevoegd!`, {
      description: `${bundle.quantity}x ${product.node.title} (${selectedSize}) - €${bundle.price}`,
      position: "top-center",
    });
  };

  return (
    <section className="py-20 md:py-32 bg-background-secondary animate-fade-in">
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
                <Select value={selectedSize} onValueChange={(value: "20cm" | "40cm") => setSelectedSize(value)}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="20cm">20cm</SelectItem>
                    <SelectItem value="40cm">40cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <Card 
                key={`${selectedSize}-${index}`}
                onClick={() => setSelectedBundle(index)}
                className={`p-8 relative overflow-hidden transition-all duration-300 cursor-pointer ${
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

                <div className="space-y-6">
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
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">€{bundle.price}</span>
                      <Badge variant="secondary" className="bg-glow/10 text-glow">
                        -{bundle.discount}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-through">
                      Was €{bundle.originalPrice}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 py-4 border-y border-border">
                    {bundle.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-glow flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBundle(index);
                      handleAddBundleToCart(index);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
