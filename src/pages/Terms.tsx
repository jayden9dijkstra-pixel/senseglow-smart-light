import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { Search, User } from "lucide-react";
import logoNew from "@/assets/logo-new.png";

const Terms = () => {
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
                Algemene Voorwaarden
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Onze algemene voorwaarden bieden heldere uitleg over bestellen, betalen, verzenden, retourneren en garantie.
              </p>
            </div>

            <Card className="border-brand-orange/20">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Ze zijn opgesteld om transparantie te bieden en jouw rechten te beschermen bij elke aankoop.
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Lees de volledige voorwaarden om precies te weten waar je aan toe bent bij het bestellen bij SenseGlow.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                      <FileText className="h-6 w-6 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">1. Toepasselijkheid</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, bestellingen en overeenkomsten tussen SenseGlow en de klant. Door een bestelling te plaatsen, ga je akkoord met deze voorwaarden.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">2. Bestellingen & Betaling</h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Alle prijzen zijn inclusief BTW en exclusief eventuele verzendkosten (bij SenseGlow is verzending gratis)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Een overeenkomst komt tot stand na ontvangst van de orderbevestiging per e-mail</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Betaling geschiedt via de beschikbare betaalmethoden op onze website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>SenseGlow behoudt zich het recht voor om bestellingen te weigeren of te annuleren</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">3. Levering</h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Bestellingen worden binnen 24-48 uur verwerkt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Levertijd is 5-10 werkdagen binnen Nederland en België</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Verzending is altijd gratis binnen Nederland en België</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Het risico voor de producten gaat over op de klant bij fysieke ontvangst</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">4. Herroepingsrecht (30 dagen)</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Je hebt het recht om binnen 30 dagen na ontvangst van het product de overeenkomst te ontbinden, zonder opgave van redenen.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Het product moet ongebruikt en in originele staat zijn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Retourkosten zijn voor de klant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Terugbetaling vindt plaats binnen 14 dagen na ontvangst van de retourzending</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">5. Garantie</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    SenseGlow biedt 12 maanden garantie op fabricagefouten en defecten die niet het gevolg zijn van normaal gebruik.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Garantie dekt fabricagefouten en defecte onderdelen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Garantie dekt geen schade door val, stoot, water of onjuist gebruik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span>Voor garantieclaims neem je contact op via support@senseglow.nl</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">6. Aansprakelijkheid</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    SenseGlow is niet aansprakelijk voor indirecte schade, gevolgschade of bedrijfsschade die voortvloeit uit het gebruik van onze producten, tenzij er sprake is van opzet of grove schuld.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">7. Geschillen</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Op alle overeenkomsten tussen SenseGlow en de klant is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-brand-orange bg-gradient-to-br from-brand-orange/5 to-transparent">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Vragen over de voorwaarden?</h2>
                <p className="text-muted-foreground">
                  Neem gerust contact met ons op via <a href="mailto:support@senseglow.nl" className="text-brand-orange hover:underline font-semibold">support@senseglow.nl</a> als je vragen hebt over onze algemene voorwaarden.
                </p>
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

export default Terms;
