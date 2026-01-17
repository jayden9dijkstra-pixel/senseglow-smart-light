import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Clock, Globe } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { Search, User } from "lucide-react";
import logoNew from "@/assets/logo-new.png";
const Contact = () => {
  const navigate = useNavigate();
  return <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header - same as homepage */}
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
                
                <button onClick={() => navigate("/")} className="flex-1 flex justify-center relative cursor-pointer hover:scale-105 transition-transform duration-300" aria-label="Ga naar homepage">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-transparent rounded-2xl blur-xl"></div>
                  <img src={logoNew} alt="SenseGlow Logo" className="relative h-28 w-auto object-contain drop-shadow-lg" />
                </button>
                
                <CartDrawer />
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex w-full items-center justify-between">
                <Button variant="ghost" size="icon">
                  <Search className="h-6 w-6" />
                </Button>
                
                <button onClick={() => navigate("/")} className="relative cursor-pointer hover:scale-105 transition-transform duration-300" aria-label="Ga naar homepage">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-transparent rounded-2xl blur-xl"></div>
                  <img src={logoNew} alt="SenseGlow Logo" className="relative h-32 w-auto object-contain drop-shadow-lg" />
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
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar home
          </Button>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-orange to-brand-orange/70 bg-clip-text text-transparent">
                Contact & Support
              </h1>
              <p className="text-lg text-muted-foreground">
                Bij SenseGlow staat klanttevredenheid centraal. Ons supportteam helpt je graag met al je vragen over bestellingen, garantie of technische ondersteuning.
              </p>
            </div>

            <Card className="border-brand-orange/20">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <Mail className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">E-mail</h3>
                    <a href="mailto:support@senseglow.nl" className="text-brand-orange hover:underline">support@senseglow.shop</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <Clock className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Reactietijd</h3>
                    <p className="text-muted-foreground">Binnen 24 uur (ma–vr)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <Globe className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Taal</h3>
                    <p className="text-muted-foreground">Nederlands & Engels</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Vermeld je ordernummer voor een snelle afhandeling.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Veelgestelde vragen</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Hoe snel wordt mijn bestelling verzonden?</h3>
                    <p className="text-muted-foreground">Binnen 24–48 uur verwerkt. Levertijd 5–10 werkdagen.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Moet ik verzendkosten betalen?</h3>
                    <p className="text-muted-foreground">Nee. Bij SenseGlow is verzending altijd gratis.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Krijg ik een Track & Trace?</h3>
                    <p className="text-muted-foreground">Ja, automatisch na verwerking van je bestelling.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Mijn lamp werkt niet goed. Wat kan ik doen?</h3>
                    <p className="text-muted-foreground">Neem contact met ons op met een korte video. Je valt onder onze 1 jaar garantie.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Kan ik retourneren?</h3>
                    <p className="text-muted-foreground">Ja, binnen 30 dagen, mits het product ongebruikt is.</p>
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
    </PageTransition>;
};
export default Contact;