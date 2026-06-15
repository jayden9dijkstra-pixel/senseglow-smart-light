import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Package, Clock, RotateCcw, Shield, FileText } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";


const Contact = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Contact</h1>
            <p className="text-lg text-foreground/60">
              Vraag over je bestelling, een product, of iets anders? We mailen binnen 24 uur op werkdagen terug.
            </p>
          </div>

          {/* Two cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-glow/10 rounded-lg w-fit">
                  <Mail className="h-6 w-6 text-glow" />
                </div>
                <h3 className="font-semibold text-xl">E-mail</h3>
                <a href="mailto:support@senseglow.shop" className="text-glow hover:underline font-semibold block">
                  support@senseglow.shop
                </a>
                <p className="text-sm text-foreground/60">
                  Voor alle vragen, bestellingen, producten, retourzendingen, technische hulp. Reactietijd: binnen 24 uur op werkdagen (ma-vr, 09:00-17:00).
                </p>
                <Button
                  onClick={() => (window.location.href = "mailto:support@senseglow.shop")}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                >
                  Stuur een mail
                </Button>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-glow/10 rounded-lg w-fit">
                  <Package className="h-6 w-6 text-glow" />
                </div>
                <h3 className="font-semibold text-xl">Bestelling volgen</h3>
                <p className="text-sm text-foreground/60">
                  Bestelnummer of track-code bij de hand? Volg je pakket direct via DHL.
                </p>
                <Button
                  onClick={() => navigate("/bestelling-volgen")}
                  variant="outline"
                  className="rounded-full mt-2"
                >
                  Volg mijn bestelling →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ shortcuts */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Veelgestelde vragen</h2>
            <div className="space-y-2">
              {[
                { icon: Clock, label: "Hoe snel wordt mijn bestelling geleverd?", to: "/verzending" },
                { icon: RotateCcw, label: "Hoe retourneer ik een product?", to: "/retourneren" },
                { icon: Shield, label: "Wat valt onder de garantie?", to: "/retourneren" },
                { icon: FileText, label: "Modelformulier herroeping nodig?", to: "/retourneren" },
              ].map(({ icon: Icon, label, to }) => (
                <button
                  key={label}
                  onClick={() => navigate(to)}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-foreground/10 bg-background hover:border-glow/40 hover:bg-glow/5 transition-colors text-left"
                >
                  <Icon className="h-5 w-5 text-glow flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  <span className="text-glow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bedrijfsgegevens */}
          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Bedrijfsgegevens</h2>
              <div className="space-y-2 text-sm text-foreground/70">
                <p><strong>Jayden Ecom (handelend onder de naam SenseGlow™)</strong></p>
                <p>KvK-nummer: 99634929</p>
                <p>BTW-nummer: NL005399692B39</p>
                <p>Vestigingsadres: Tolheksleane 4 A, 8821 MD Kimswerd</p>
                <p>E-mail: <a href="mailto:support@senseglow.shop" className="text-glow hover:underline">support@senseglow.shop</a></p>
                <p>Web: senseglow.shop</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
