import { Truck, Clock, Shield, Flag } from "lucide-react";

const items = [
  { icon: Truck, label: "Gratis verzending NL/BE" },
  { icon: Clock, label: "30 dagen retour" },
  { icon: Shield, label: "1 jaar garantie" },
  { icon: Flag, label: "Verstuurd vanuit Groningen" },
];

export const TrustBar = () => {
  return (
    <section className="w-full border-b border-foreground/8 bg-background-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 py-8 md:py-7">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 text-center">
              <Icon className="h-5 w-5 shrink-0 text-glow" aria-hidden="true" />
              <span className="text-xs md:text-sm text-foreground/70 leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
