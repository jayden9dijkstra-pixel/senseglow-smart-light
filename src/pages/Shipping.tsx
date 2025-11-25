import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, Clock } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { Search, User } from "lucide-react";
import logoNew from "@/assets/logo-new.png";

const Shipping = () => {
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
                Verzending & Levering
              </h1>
              <p className="text-lg text-muted-foreground">
                SenseGlow werkt met zorgvuldig geselecteerde fulfilmentpartners om kwaliteit en consistentie te waarborgen.
              </p>
            </div>

            <Card className="border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 to-transparent">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-8 w-8 text-brand-orange" />
                  <h2 className="text-2xl font-bold">Gratis verzending op alle bestellingen</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  Binnen Nederland & België. Geen verborgen kosten, geen minimale bestelwaarde.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                      <Clock className="h-6 w-6 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-lg">Verwerking</h3>
                  </div>
                  <p className="text-muted-foreground">24–48 uur</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                      <Truck className="h-6 w-6 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-lg">Levertijd</h3>
                  </div>
                  <p className="text-muted-foreground">5–10 werkdagen</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                      <Package className="h-6 w-6 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-lg">Track & Trace</h3>
                  </div>
                  <p className="text-muted-foreground">Automatisch per e-mail</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-lg">Regio</h3>
                  </div>
                  <p className="text-muted-foreground">Nederland & België</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-brand-orange/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Waarom 5–10 dagen?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Wij produceren in kleinere batches zodat je altijd een vers product ontvangt — geen massaproductie, geen verouderde voorraad. Dit garandeert de hoogste kwaliteit en zorgt ervoor dat je het nieuwste en beste product in handen krijgt.
                </p>
              </CardContent>
            </Card>

            {/* Garantie Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Garantie</h2>
              <Card className="border-brand-orange/20">
                <CardContent className="p-8 space-y-6">
                  <p className="text-lg">
                    Wij staan achter de kwaliteit van onze producten. <strong>SenseGlow biedt 1 jaar functionele garantie</strong> op alle producten.
                  </p>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-brand-orange">Gedekt door de garantie:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-brand-orange mt-1">✓</span>
                        <span>Fabricagefouten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-orange mt-1">✓</span>
                        <span>Defecte sensor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-orange mt-1">✓</span>
                        <span>LED die uitvalt binnen 1 jaar (zonder gebruikersschade)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-muted-foreground">Niet gedekt:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1">✗</span>
                        <span>Val-, stoot- of waterschade</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">✗</span>
                        <span>Onjuist gebruik</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">✗</span>
                        <span>Normale slijtage van batterijen of kabels</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-muted-foreground pt-4 border-t">
                    Onze garantie is gebaseerd op de premium standaard binnen de LED-markt.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 30 Dagen Garantie */}
            <Card className="border-brand-orange bg-gradient-to-br from-brand-orange/5 to-transparent">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">30 Dagen Risicovrij Proberen</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Wij geloven dat je SenseGlow zult waarderen vanaf het eerste gebruik.
                </p>
                <div className="max-w-2xl mx-auto text-left space-y-4">
                  <p className="text-muted-foreground">
                    Daarom bieden wij: <strong className="text-foreground">30 dagen risicovrij testen.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    Bevalt je product niet? Stuur het binnen 30 dagen terug — wij verwerken je terugbetaling zodra je retour is ontvangen en gecontroleerd.
                  </p>
                  <p className="text-muted-foreground">
                    Dit geeft je volledige zekerheid zonder verplichtingen.
                  </p>
                </div>
              </CardContent>
            </Card>
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
                  <li><a href="/over" className="hover:text-background">Over SenseGlow</a></li>
                  <li><a href="/duurzaamheid" className="hover:text-background">Duurzaamheid</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base mb-4 uppercase">JURIDISCH</h4>
                <ul className="text-sm space-y-2 text-background/80">
                  <li><a href="/privacy" className="hover:text-background">Privacybeleid</a></li>
                  <li><a href="/voorwaarden" className="hover:text-background">Algemene voorwaarden</a></li>
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

export default Shipping;
