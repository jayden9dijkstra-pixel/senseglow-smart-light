import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const bundles = [
  {
    name: "Night Safety Pack",
    quantity: "2 stuks",
    ideal: "Ideaal voor trap + gang",
    price: "99.99",
    originalPrice: "109.90",
    discount: "9%",
    badge: "Meest gekozen",
    popular: true,
    features: [
      "2x SenseGlow™ LED strip",
      "Gratis verzending",
      "30 dagen retourrecht"
    ]
  },
  {
    name: "Home Glow Pack",
    quantity: "3 stuks",
    ideal: "Trap + gang + slaapkamer",
    price: "139.99",
    originalPrice: "164.85",
    discount: "15%",
    badge: "Beste waarde",
    features: [
      "3x SenseGlow™ LED strip",
      "Gratis verzending",
      "Extra voordeel",
      "30 dagen retourrecht"
    ]
  },
  {
    name: "Whole Home Security Pack",
    quantity: "5 stuks",
    ideal: "Complete woningverlichting",
    price: "219.99",
    originalPrice: "274.75",
    discount: "20%",
    badge: "Maximaal voordeel",
    features: [
      "5x SenseGlow™ LED strip",
      "Gratis verzending",
      "Maximaal voordeel",
      "Premium support",
      "30 dagen retourrecht"
    ]
  }
];

export const BundlesSection = () => {
  const [selectedBundle, setSelectedBundle] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-brand-orange/5">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Bespaar met bundels
            </h2>
            <p className="text-lg text-muted-foreground">
              Hoe meer je beschermt, hoe meer je bespaart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <Card 
                key={index} 
                onClick={() => setSelectedBundle(index)}
                className={`p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                  selectedBundle === index
                    ? 'border-brand-orange border-2 shadow-2xl bg-gradient-to-b from-background to-brand-orange/5' 
                    : 'bg-background border-border hover:shadow-xl'
                }`}
              >
                {bundle.badge && (
                  <Badge className="absolute top-4 right-4 bg-brand-orange text-white">
                    {bundle.badge}
                  </Badge>
                )}

                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">{bundle.name}</h3>
                    <p className="text-sm text-muted-foreground">{bundle.quantity}</p>
                    <p className="text-sm font-medium text-brand-orange">{bundle.ideal}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">€{bundle.price}</span>
                      <Badge variant="secondary" className="bg-brand-orange/10 text-brand-orange">
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
                        <Check className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button 
                    className={`w-full ${
                      bundle.popular 
                        ? 'bg-brand-orange hover:bg-brand-orange/90 text-white' 
                        : 'bg-foreground hover:bg-foreground/90 text-background'
                    }`}
                    size="lg"
                  >
                    Kies {bundle.quantity}
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
