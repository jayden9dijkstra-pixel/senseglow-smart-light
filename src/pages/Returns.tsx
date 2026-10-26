import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowLeft, RotateCcw, Euro, FileText } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export const ReturnsContent = () => {
  const navigate = useNavigate();
  const { localizePath } = useI18n();

  return (
    <>
      <div className="container py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        <div className="space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Retourneren</h1>
            <p className="text-lg text-foreground/60">
              30 dagen bedenktijd, volledige terugbetaling, geen gedoe.
            </p>
          </div>

          {/* 3 info cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: RotateCcw, title: "30 dagen retour", sub: "Bovenop je wettelijke 14 dagen." },
              { icon: Euro, title: "Retourkosten door ons", sub: "Wij betalen de retourzending, ook zonder defect." },
              { icon: FileText, title: "Modelformulier beschikbaar", sub: "Verplicht volgens NL-recht." },
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

          {/* Steps */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Hoe het werkt</h2>
            <div className="space-y-4">
              {[
                { n: "1", title: "Mail naar support@senseglow.shop", body: "Vermeld je bestelnummer en welk product je wilt retourneren. Je krijgt binnen 24u werkdagen een retourbevestiging met instructies." },
                { n: "2", title: "Verpak het product", body: "Bij voorkeur in de originele verpakking. Zorg dat het product onbeschadigd is en compleet (lampen, kabels, montagestrip)." },
                { n: "3", title: "Verzend terug", body: "Retouradres: SenseGlow (Jayden Ecom), Tolheksleane 4A, 8821 MD Kimswerd. Dit is een post- en retouradres, geen bezoekadres of winkel. De retourkosten zijn voor onze rekening; in de retourbevestiging staat hoe je een label krijgt of de kosten vergoed worden." },
                { n: "4", title: "Wij verwerken en betalen terug", body: "Binnen 14 dagen na ontvangst van de retourzending krijg je het volledige aankoopbedrag terug op dezelfde betaalmethode die je gebruikte bij de bestelling." },
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

          {[
            { title: "Wat als het product defect is?", body: "Mail ons direct met een foto/video van het defect. Bij erkende defecten sturen we óf direct een vervanger, óf betalen we het volledige bedrag (inclusief jouw retour-verzendkosten) terug. Geen gedoe." },
            { title: "Wat valt onder de garantie?", body: "Naast je wettelijke garantie krijg je 1 jaar extra functionele garantie van SenseGlow. Als het product binnen die periode kapot gaat door normaal gebruik, lossen we het op. Schade door val, water (behalve Solar Lantern die IP65 is), of opzettelijke beschadiging valt er niet onder." },
          ].map(({ title, body }) => (
            <Card key={title} className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-foreground/60 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}

          {/* Wettelijk herroepingsrecht */}
          <Card id="herroepingsrecht" className="border-foreground/10 bg-background">
            <CardContent className="p-6 space-y-2">
              <h2 className="font-semibold text-lg">Wettelijk herroepingsrecht van 14 dagen</h2>
              <p className="text-foreground/60 leading-relaxed">
                Je hebt altijd het wettelijke recht om je aankoop binnen 14 dagen na ontvangst zonder opgave van reden te herroepen. Onze 30 dagen retour komt daar bovenop. Je kunt herroepen met een e-mail naar support@senseglow.shop of met het modelformulier.
              </p>
              <Link to={localizePath("/herroepingsformulier")} className="inline-block text-primary underline underline-offset-4">
                Naar het modelformulier voor herroeping
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const Returns = () => (
  <PageLayout>
    <ReturnsContent />
  </PageLayout>
);

export default Returns;
