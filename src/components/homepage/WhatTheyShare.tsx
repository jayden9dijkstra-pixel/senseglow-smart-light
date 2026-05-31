import { Wrench, BatteryCharging, Magnet, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: Wrench,
    title: "Geen elektricien nodig",
    body: "Magnetisch, plakstrip of twee schroeven. Geïnstalleerd in minuten, niet uren.",
  },
  {
    icon: BatteryCharging,
    title: "USB-C oplaadbaar of solar",
    body: "Geen AA-batterijen, geen wegwerp. Eens per maand bijladen, of laat de zon het werk doen.",
  },
  {
    icon: Magnet,
    title: "Verhuist mee",
    body: "Magnetische bevestiging betekent: kamer uit, lamp in de tas. Geen gaten, geen sporen.",
  },
  {
    icon: ShieldCheck,
    title: "Eén jaar garantie + 30 dagen retour",
    body: "Iets niet zoals het hoort? support@senseglow.shop. Wij sturen vervanger of geld terug.",
  },
];

export const WhatTheyShare = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Onze filosofie
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-4">
              Wat ze met elkaar gemeen hebben
            </h2>
            <p className="text-base text-foreground/60">
              Eén filosofie achter elk product: licht zonder gedoe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="p-7 rounded-2xl border border-foreground/8 bg-background-secondary/40 backdrop-blur-sm animate-fade-in-slow"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="p-3 bg-glow/10 rounded-xl w-fit mb-5">
                  <Icon className="h-6 w-6 text-glow" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-3">
                  {title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
