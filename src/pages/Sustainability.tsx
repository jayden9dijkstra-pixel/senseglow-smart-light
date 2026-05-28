import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BatteryCharging, Sun, Magnet, Wrench } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const points = [
  {
    icon: BatteryCharging,
    title: "USB-C, geen wegwerpbatterijen",
    body: "Standaard sensor-lampen verbruiken 4-6 AA-batterijen per jaar. Onze Ambient-, Wave-, en Wall Lamp-producten zijn USB-C oplaadbaar — eens per 3-6 weken. Geen lege batterijen in de afvalbak, geen nieuwe aanschaffen, geen plastic verpakkingen.",
  },
  {
    icon: Sun,
    title: "De Solar Lantern verbruikt letterlijk geen stroom",
    body: "Geen kabel naar het stopcontact. Geen extra euro op je energierekening. Een Nederlandse zomer levert genoeg op voor het hele jaar; in de winter helpt de reservecapaciteit van de accu door donkere weken heen.",
  },
  {
    icon: Magnet,
    title: "Ontworpen om mee te verhuizen",
    body: "Magnetische bevestiging en plakstrips betekenen geen geboorde gaten in de muur. Je kunt onze producten meenemen naar je volgende huis, doorgeven aan een vriend, of tweedehands verkopen. Niets is permanent stuk te krijgen door verhuizen.",
  },
  {
    icon: Wrench,
    title: "Eén jaar garantie + replacement bij defect",
    body: "Werkt iets niet zoals beloofd? Mail support@senseglow.shop en we sturen een vervanger. We gooien geen producten weg die nog te repareren of vervangen zijn. Bovenop je wettelijke conformiteitsrechten.",
  },
];

const Sustainability = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Duurzaamheid bij SenseGlow
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed">
              We maken geen klimaat-claims die we niet kunnen onderbouwen. Wel een paar concrete keuzes die het verschil maken — vooral op de lange termijn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {points.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border-foreground/10 bg-background">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-glow/10 rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-glow" />
                  </div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-6">
              <p className="text-foreground/60 leading-relaxed text-sm">
                We zijn niet perfect. Onze producten worden in Azië gemaakt en verscheept met DHL. Dat is een keuze tussen betaalbaarheid en lokale productie die we niet verbloemen. Wat we wel doen: producten ontwerpen die jaren meegaan in plaats van seizoenen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Sustainability;
