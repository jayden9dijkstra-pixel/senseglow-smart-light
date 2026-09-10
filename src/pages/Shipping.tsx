import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Clock, Package } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Shipping = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        <div className="space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Verzending</h1>
            <p className="text-lg text-foreground/60">
              Alles wat je moet weten over hoe en wanneer je SenseGlow bij je voor de deur staat.
            </p>
          </div>

          {/* 3 info cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: "Gratis verzending", sub: "Naar Nederland en België, zonder minimumbedrag." },
              { icon: Clock, title: "7-14 dagen", sub: "Totale tijd, inclusief het verwerken van je bestelling." },
              { icon: Package, title: "Met track & trace", sub: "Je krijgt een track-code per mail." },
            ].map(({ icon: Icon, title, sub }) => (
              <Card key={title} className="border-foreground/10 bg-background">
                <CardContent className="p-6 space-y-3">
                  <div className="p-3 bg-glow/10 rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-glow" />
                  </div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-foreground/60">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Hoe het werkt</h2>
            <div className="space-y-4">
              {[
                {
                  n: "1",
                  title: "Je plaatst je bestelling",
                  body: "Direct na het bestellen krijg je een bevestigingsmail. Daarmee weet je dat we hem hebben ontvangen.",
                },
                {
                  n: "2",
                  title: "We verwerken en verzenden",
                  body: "We verwerken je bestelling en geven hem af bij de vervoerder. Op dat moment krijg je een tweede mail met je track-code.",
                },
                {
                  n: "3",
                  title: "DHL bezorgt",
                  body: "Vanaf je bestelling duurt het in totaal 7 tot 14 dagen voordat het pakket bij je voor de deur staat, verwerking inbegrepen. Via senseglow.shop/bestelling-volgen volg je 'm met je track-code.",
                },
              ].map(({ n, title, body }) => (
                <Card key={n} className="border-foreground/10 bg-background">
                  <CardContent className="p-6 flex gap-5">
                    <div className="text-2xl font-bold text-glow w-10 flex-shrink-0">{n}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{title}</h3>
                      <p className="text-foreground/60 leading-relaxed">{body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Toelichting */}
          {[
            {
              title: "Waarom 7-14 dagen?",
              body: "We werken met een logistiek partner buiten Nederland om de prijzen laag te houden. Dat scheelt jou geld en kost een paar dagen extra verzendtijd. We zijn daar liever eerlijk over dan dat we bezorging van morgen beloven.",
            },
            {
              title: "Verzendgebied: Nederland en België",
              body: "We leveren aan adressen in Nederland en België. Verzending is naar beide landen gratis. Vragen over een specifiek adres? Mail support@senseglow.shop.",
            },
            {
              title: "Niet thuis bij bezorging?",
              body: "De vervoerder probeert het opnieuw of brengt het pakket naar een afhaalpunt in de buurt. Je krijgt bericht waar je het kunt ophalen.",
            },
            {
              title: "Pakket niet ontvangen na 14 dagen?",
              body: "Mail support@senseglow.shop met je bestelnummer. We zoeken het uit met de vervoerder en zorgen dat je je product krijgt of je geld terug.",
            },
          ].map(({ title, body }) => (
            <Card key={title} className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-foreground/60 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Shipping;
