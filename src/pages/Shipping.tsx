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
              { icon: Truck, title: "Gratis verzending", sub: "Geen drempel, geen kleine lettertjes." },
              { icon: Clock, title: "7-14 werkdagen", sub: "Vanaf het moment dat we je bestelling verwerken." },
              { icon: Package, title: "Met DHL", sub: "Je krijgt een track-code per mail." },
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
                  body: "Binnen 1-3 werkdagen verwerken we je bestelling en geven hem af bij DHL. Op dat moment krijg je een tweede mail met je track-code.",
                },
                {
                  n: "3",
                  title: "DHL bezorgt",
                  body: "Vanaf overdracht aan DHL duurt het 7-14 werkdagen voordat het pakket bij je voor de deur staat. Via senseglow.shop/bestelling-volgen of de DHL-app volg je 'm live.",
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
              title: "Waarom 7-14 werkdagen?",
              body: "We verzenden vanuit ons hoofdmagazijn buiten Nederland om de prijzen laag te houden. Dat scheelt jou geld; het kost wat extra dagen verzending. We zijn er eerlijk over: dit is sneller dan AliExpress maar langzamer dan Bol-bezorging morgen-thuis.",
            },
            {
              title: "Verzending alleen binnen Nederland",
              body: "Op dit moment leveren we alleen aan adressen in Nederland. België en Duitsland staan op de planning. Vragen over een specifiek adres? Mail support@senseglow.shop.",
            },
            {
              title: "Niet thuis bij bezorging?",
              body: "DHL probeert het twee keer. Lukt het beide keren niet, dan brengen ze het naar een DHL-ServicePoint in de buurt. Je krijgt een bericht waar je het kunt ophalen.",
            },
            {
              title: "Pakket niet ontvangen na 14 werkdagen?",
              body: "Mail support@senseglow.shop met je bestelnummer. We gaan direct met DHL in gesprek en zorgen dat je je product krijgt of je geld terug, geen excuses.",
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
