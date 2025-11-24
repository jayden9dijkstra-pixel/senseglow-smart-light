import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, RefreshCw, Mail, CheckCircle } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { Search, User } from "lucide-react";
import logoNew from "@/assets/logo-new.png";

const Returns = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="w-full border-b shadow-lg bg-gradient-to-r from-white via-brand-orange/5 to-white">
          <div className="container">
            <div className="flex h-40 items-center py-6">
              {/* Mobile Layout */}
              <div className="flex md:hidden w-full items-center">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Search className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                  </Button>
                </div>
                
                <button 
                  onClick={() => navigate("/")}
                  className="flex-1 flex justify-center relative cursor-pointer hover:scale-105 transition-transform duration-300"
                  aria-label="Ga naar homepage"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-transparent rounded-2xl blur-xl"></div>
                  <img 
                    src={logoNew} 
                    alt="SenseGlow Logo" 
                    className="relative h-28 w-auto object-contain drop-shadow-lg"
                  />
                </button>
                
                <CartDrawer />
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex w-full items-center justify-between">
                <Button variant="ghost" size="icon">
                  <Search className="h-6 w-6" />
                </Button>
                
                <button 
                  onClick={() => navigate("/")}
                  className="relative cursor-pointer hover:scale-105 transition-transform duration-300"
                  aria-label="Ga naar homepage"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-transparent rounded-2xl blur-xl"></div>
                  <img 
                    src={logoNew} 
                    alt="SenseGlow Logo" 
                    className="relative h-32 w-auto object-contain drop-shadow-lg"
                  />
                </button>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                  </Button>
                  <CartDrawer />
                </div>
              </div>
            </div>
          </div>

          {/* USP Bar */}
          <div className="bg-brand-orange text-white py-3 overflow-hidden relative">
            <div className="flex animate-scroll">
              <div className="flex-shrink-0 flex items-center gap-8 px-4">
                <span className="whitespace-nowrap">✓ Gratis verzending</span>
                <span className="whitespace-nowrap">✓ Voor 23:00 besteld, vandaag verstuurd</span>
                <span className="whitespace-nowrap">✓ 30 dagen retourrecht</span>
              </div>
              <div className="flex-shrink-0 flex items-center gap-8 px-4">
                <span className="whitespace-nowrap">✓ Gratis verzending</span>
                <span className="whitespace-nowrap">✓ Voor 23:00 besteld, vandaag verstuurd</span>
                <span className="whitespace-nowrap">✓ 30 dagen retourrecht</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-12 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar home
          </Button>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-orange to-brand-orange/70 bg-clip-text text-transparent">
                Retourneren & Ruilen
              </h1>
              <p className="text-lg text-muted-foreground">
                Wij willen dat je volledig tevreden bent met je aankoop.
              </p>
            </div>

            <Card className="border-brand-orange/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Retourvoorwaarden</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-brand-orange flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">30 dagen bedenktijd</h3>
                      <p className="text-muted-foreground">Je hebt 30 dagen de tijd om te beslissen of je het product wilt behouden.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="h-6 w-6 text-brand-orange flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Product moet ongebruikt zijn</h3>
                      <p className="text-muted-foreground">Het product moet in originele staat zijn, met alle originele verpakkingen en labels.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-6 w-6 text-brand-orange flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Retourkosten</h3>
                      <p className="text-muted-foreground">Retourkosten zijn voor de klant. Wij adviseren track & trace verzending.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-brand-orange flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Ruilen of terugbetaling</h3>
                      <p className="text-muted-foreground">Je kunt kiezen voor een ander product of volledige terugbetaling.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-brand-orange bg-gradient-to-br from-brand-orange/5 to-transparent">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <Mail className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Hoe retourneren?</h2>
                    <p className="text-muted-foreground">
                      Stuur een e-mail naar <a href="mailto:support@senseglow.nl" className="text-brand-orange hover:underline font-semibold">support@senseglow.nl</a>
                    </p>
                  </div>
                </div>
                
                <div className="bg-background/50 p-6 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    Ons team stuurt je het juiste retouradres op basis van je fulfilmentlocatie.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Vermeld je ordernummer in de e-mail voor een snelle afhandeling.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-3xl font-bold mb-6">Veel gestelde vragen over retourneren</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Hoe lang duurt het voordat ik mijn geld terugkrijg?</h3>
                    <p className="text-muted-foreground">
                      Zodra we je retour hebben ontvangen en gecontroleerd, verwerken we de terugbetaling binnen 5–7 werkdagen.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Kan ik mijn product ruilen voor een ander formaat?</h3>
                    <p className="text-muted-foreground">
                      Ja, dat is mogelijk. Vermeld dit in je retour-e-mail en we helpen je graag verder.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Wat als mijn product defect is?</h3>
                    <p className="text-muted-foreground">
                      Bij een defect product vallen de retourkosten voor ons. Neem contact op via support@senseglow.nl met foto's of een video van het defect.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Moet ik de originele verpakking gebruiken?</h3>
                    <p className="text-muted-foreground">
                      Wij adviseren de originele verpakking te gebruiken om schade tijdens transport te voorkomen, maar dit is niet verplicht. Zorg wel voor stevige verpakking.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-foreground text-background mt-16">
          <div className="container py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-base mb-4 uppercase">KLANTENSERVICE</h3>
                <ul className="text-sm space-y-2 text-background/80">
                  <li><a href="/contact" className="hover:text-background">Contact</a></li>
                  <li><a href="/verzending" className="hover:text-background">Verzending</a></li>
                  <li><a href="/retourneren" className="hover:text-background">Retourneren</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base mb-4 uppercase">OVER ONS</h4>
                <ul className="text-sm space-y-2 text-background/80">
                  <li><a href="#" className="hover:text-background">Over SenseGlow</a></li>
                  <li><a href="#" className="hover:text-background">Duurzaamheid</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base mb-4 uppercase">JURIDISCH</h4>
                <ul className="text-sm space-y-2 text-background/80">
                  <li><a href="#" className="hover:text-background">Privacybeleid</a></li>
                  <li><a href="#" className="hover:text-background">Algemene voorwaarden</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base mb-4 uppercase">VOLG ONS</h4>
                <p className="text-sm text-background/80">
                  Instagram | Facebook | Pinterest
                </p>
              </div>
            </div>
            <div className="text-center text-xs text-background/60 pt-8 border-t border-background/20">
              <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Returns;
