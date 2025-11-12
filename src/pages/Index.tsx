import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhySection } from "@/components/WhySection";
import { LifestyleSection } from "@/components/LifestyleSection";
import { FAQSection } from "@/components/FAQSection";
import { MobileMenu } from "@/components/MobileMenu";
import { DesktopMenu } from "@/components/DesktopMenu";
import { ScrollToTop } from "@/components/ScrollToTop";
import heroImage from "@/assets/hero-lifestyle.png";
import logo from "@/assets/logo.png";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts(50);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container">
          <div className="flex h-20 items-center justify-between">
            {/* Left - Menu Dropdown */}
            <div className="flex items-center gap-2">
              <DesktopMenu />
              <MobileMenu />
            </div>
            
            {/* Center - Logo */}
            <button 
              onClick={() => navigate("/")}
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Ga naar homepage"
            >
              <img 
                src={logo} 
                alt="SenseGlow Logo" 
                className="h-16 w-auto object-contain"
              />
            </button>
            
            {/* Right - Cart */}
            <div className="flex items-center">
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* USP Banner */}
      <section className="bg-foreground py-2.5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 text-background text-xs uppercase tracking-wide font-medium">
            <span>Gratis verzending</span>
            <span>Voor 23:00 besteld, vandaag verstuurd</span>
            <span>30 dagen retourrecht</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section id="home" className="bg-brand-orange py-12 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left - Product Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl mx-auto w-full max-w-sm md:max-w-none">
              <img 
                src={heroImage} 
                alt="SenseGlow LED lamp in actie"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right - Content */}
            <div className="bg-brand-orange-light rounded-3xl p-8 md:p-12 mx-auto w-full max-w-sm md:max-w-none">
              <div className="flex items-center justify-center md:justify-start gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-brand-orange text-xl">⭐</span>
                ))}
                <span className="ml-2 font-semibold text-foreground text-center md:text-left">Gebaseerd op 1000+ Reviews</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-brand-orange leading-tight text-center md:text-left">
                Automatisch licht. Precies wanneer jij het nodig hebt.
              </h2>
              
              <p className="text-base md:text-lg mb-6 text-foreground leading-relaxed text-center md:text-left">
                Onze slimme LED lamp met bewegings-sensor combineert <strong>veiligheid</strong> en <strong>design</strong> in één oplossing. 
                Zodra je beweegt, verschijnt er een <strong>warme gloed</strong> die je huis veiliger, rustiger en stijlvoller maakt.
              </p>
              
              <div className="flex justify-center md:justify-start">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-xl text-lg px-10 py-6 h-auto rounded-full font-semibold"
                >
                  Ontdek de SenseGlow nu!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SenseGlow */}
      <div id="waarom">
        <WhySection />
      </div>

      {/* Lifestyle & Reviews */}
      <LifestyleSection />

      {/* Products Section */}
      <section id="products" className="container py-20 bg-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Onze Producten</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kies de perfecte maat voor jouw ruimte
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">Geen producten gevonden</p>
            <p className="text-muted-foreground">
              Voeg producten toe via de Shopify Storefront API.
            </p>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <div id="faq" className="bg-muted/20">
        <FAQSection />
      </div>

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="border-t bg-foreground text-background">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-base mb-4 uppercase">KLANTENSERVICE</h3>
              <ul className="text-sm space-y-2 text-background/80">
                <li><a href="#" className="hover:text-background">Contact</a></li>
                <li><a href="#" className="hover:text-background">Verzending</a></li>
                <li><a href="#" className="hover:text-background">Retourneren</a></li>
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
  );
};

export default Index;
