import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Shield, Eye } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { Search, User } from "lucide-react";
import logoNew from "@/assets/logo-new.png";

const Privacy = () => {
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
                Privacybeleid
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wij gaan zorgvuldig om met jouw persoonsgegevens.
              </p>
            </div>

            <Card className="border-brand-orange/20">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  SenseGlow gebruikt alleen de gegevens die nodig zijn om je bestelling veilig te verwerken, te verzenden en te ondersteunen.
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Je informatie wordt beschermd, veilig opgeslagen en nooit verkocht aan derden.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Veilig Opgeslagen</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Alle gegevens worden versleuteld en veilig bewaard volgens de hoogste beveiligingsstandaarden.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Beschermd</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We nemen strikte maatregelen om jouw persoonsgegevens te beschermen tegen ongeautoriseerde toegang.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <Eye className="h-8 w-8 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Transparant</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Je hebt altijd inzage in welke gegevens we van je bewaren en kunt deze aanpassen of verwijderen.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-brand-orange/20">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Welke gegevens verzamelen wij?</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Contactgegevens (naam, e-mailadres, telefoonnummer)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Bezorgadres</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Bestelgegevens en ordergeschiedenis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Betalingsinformatie (via beveiligde betalingsproviders)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Waarvoor gebruiken wij deze gegevens?</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Het verwerken en verzenden van je bestelling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Communicatie over je bestelling en klantenservice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Het verbeteren van onze dienstverlening</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Nieuwsbrieven (alleen met jouw toestemming)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Jouw rechten</h2>
                  <p className="text-muted-foreground mb-4">
                    Je hebt het recht om:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Inzage te vragen in je persoonsgegevens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Je gegevens te laten wijzigen of verwijderen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Bezwaar te maken tegen het gebruik van je gegevens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-1">•</span>
                      <span>Je toestemming in te trekken</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-brand-orange bg-gradient-to-br from-brand-orange/5 to-transparent">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Vragen over privacy?</h2>
                <p className="text-muted-foreground mb-4">
                  Bekijk ons volledige privacybeleid voor meer details over hoe wij jouw gegevens beschermen, of neem contact met ons op via <a href="mailto:support@senseglow.nl" className="text-brand-orange hover:underline font-semibold">support@senseglow.nl</a>
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

export default Privacy;
