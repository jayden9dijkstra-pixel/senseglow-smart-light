import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageTransition } from "@/components/PageTransition";
import { HeroSection } from "@/components/homepage/HeroSection";
import { StorytellingSection } from "@/components/homepage/StorytellingSection";
import { ProblemSolutionSection } from "@/components/homepage/ProblemSolutionSection";
import { WarmGlowSection } from "@/components/homepage/WarmGlowSection";
import { QuizIntroSection } from "@/components/homepage/QuizIntroSection";
import { SafetySection } from "@/components/homepage/SafetySection";
import { ReviewsTeaserSection } from "@/components/homepage/ReviewsTeaserSection";
import { FinalCTASection } from "@/components/homepage/FinalCTASection";
import { FAQSection } from "@/components/FAQSection";
import logoNew from "@/assets/logo-new.png";

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
    <PageTransition>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b shadow-lg bg-gradient-to-r from-white via-brand-orange/5 to-white">
        {/* Top bar with icons and logo */}
        <div className="container">
          <div className="flex h-40 items-center justify-between py-6">
            {/* Left - Search Icon */}
            <Button variant="ghost" size="icon">
              <Search className="h-6 w-6" />
            </Button>
            
            {/* Center - Logo with gradient background */}
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
            
            {/* Right - Account & Cart */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
              <CartDrawer />
            </div>
          </div>
        </div>
        
        {/* Bottom bar with navigation */}
        <div className="border-t bg-white">
          <div className="container">
            <nav className="flex items-center justify-center gap-8 py-4">
              <a 
                href="#home" 
                className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-brand-orange transition-colors"
              >
                HOME
              </a>
              <button
                onClick={() => {
                  if (products.length > 0) {
                    navigate(`/product/${products[0].node.handle}`);
                  }
                }}
                className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-brand-orange transition-colors cursor-pointer bg-transparent border-none"
              >
                PRODUCTEN
              </button>
              <a 
                href="#contact" 
                className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-brand-orange transition-colors"
              >
                CONTACT
              </a>
            </nav>
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

      {/* New Homepage Sections */}
      <HeroSection />
      <StorytellingSection />
      <ProblemSolutionSection />
      <WarmGlowSection />
      <QuizIntroSection />
      <SafetySection />
      <ReviewsTeaserSection />
      <FinalCTASection />

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
    </PageTransition>
  );
};

export default Index;
