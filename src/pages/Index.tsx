import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2, Search } from "lucide-react";
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
import { ThemeToggle } from "@/components/ThemeToggle";
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
      <header className="w-full border-b shadow-sm bg-background">
        {/* Top bar with icons and logo */}
        <div className="container">
          <div className="flex h-40 items-center py-6 relative">
            {/* Mobile Layout */}
            <div className="flex md:hidden w-full items-center justify-between">
              {/* Left - Search */}
              <Button variant="ghost" size="icon">
                <Search className="h-6 w-6" />
              </Button>
              
              {/* Center - Logo */}
              <button 
                onClick={() => navigate("/")}
                className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                aria-label="Ga naar homepage"
              >
                <img 
                  src={logoNew} 
                  alt="SenseGlow Logo" 
                  className="relative h-28 w-auto object-contain"
                />
              </button>
              
              {/* Right - Cart */}
              <CartDrawer />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full items-center justify-between">
              {/* Left - Search Icon */}
              <Button variant="ghost" size="icon">
                <Search className="h-6 w-6" />
              </Button>
              
              {/* Center - Logo */}
              <button 
                onClick={() => navigate("/")}
                className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                aria-label="Ga naar homepage"
              >
                <img 
                  src={logoNew} 
                  alt="SenseGlow Logo" 
                  className="relative h-32 w-auto object-contain"
                />
              </button>
              
              {/* Right - Theme Toggle & Cart */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <CartDrawer />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar with navigation */}
        <div className="border-t bg-background">
          <div className="container">
            <nav className="flex items-center justify-center gap-8 py-4">
              <a 
                href="#home" 
                className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-glow transition-colors duration-300"
              >
                HOME
              </a>
              <button
                onClick={() => {
                  if (products.length > 0) {
                    navigate(`/product/${products[0].node.handle}`);
                  }
                }}
                className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-glow transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                PRODUCTEN
              </button>
              <a 
                href="#contact" 
                className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-glow transition-colors duration-300"
              >
                CONTACT
              </a>
              {/* Mobile Theme Toggle */}
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* USP Banner - Scrolling with Amber */}
      <section className="bg-secondary py-3 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-scroll">
          {/* First set of items */}
          <div className="flex items-center gap-8 px-4">
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ Gratis verzending</span>
            <span className="text-secondary-foreground/40">•</span>
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
            <span className="text-secondary-foreground/40">•</span>
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ 30 dagen retourrecht</span>
            <span className="text-secondary-foreground/40">•</span>
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-8 px-4">
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ Gratis verzending</span>
            <span className="text-secondary-foreground/40">•</span>
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
            <span className="text-secondary-foreground/40">•</span>
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ 30 dagen retourrecht</span>
            <span className="text-secondary-foreground/40">•</span>
          </div>
          
          {/* Second duplicate for seamless loop */}
          <div className="flex items-center gap-8 px-4">
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ Gratis verzending</span>
            <span className="text-secondary-foreground/40">•</span>
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
            <span className="text-secondary-foreground/40">•</span>
            <span className="text-secondary-foreground text-sm uppercase tracking-wide font-medium">✓ 30 dagen retourrecht</span>
            <span className="text-secondary-foreground/40">•</span>
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
            Kies de juiste maat voor jouw ruimte
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-glow" />
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
      <div id="faq" className="bg-background-secondary">
        <FAQSection />
      </div>

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="border-t bg-secondary text-secondary-foreground">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-base mb-4 uppercase">KLANTENSERVICE</h3>
              <ul className="text-sm space-y-2 text-secondary-foreground/80">
                <li><a href="/contact" className="hover:text-glow transition-colors duration-300">Contact</a></li>
                <li><a href="/verzending" className="hover:text-glow transition-colors duration-300">Verzending</a></li>
                <li><a href="/retourneren" className="hover:text-glow transition-colors duration-300">Retourneren</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4 uppercase">OVER ONS</h4>
              <ul className="text-sm space-y-2 text-secondary-foreground/80">
                <li><a href="/over" className="hover:text-glow transition-colors duration-300">Over SenseGlow</a></li>
                <li><a href="/duurzaamheid" className="hover:text-glow transition-colors duration-300">Duurzaamheid</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4 uppercase">JURIDISCH</h4>
              <ul className="text-sm space-y-2 text-secondary-foreground/80">
                <li><a href="/privacy" className="hover:text-glow transition-colors duration-300">Privacybeleid</a></li>
                <li><a href="/voorwaarden" className="hover:text-glow transition-colors duration-300">Algemene voorwaarden</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4 uppercase">VOLG ONS</h4>
              <p className="text-sm text-secondary-foreground/80">
                Instagram | Facebook | Pinterest
              </p>
            </div>
          </div>
          <div className="text-center text-xs text-secondary-foreground/60 pt-8 border-t border-secondary-foreground/20">
            <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
};

export default Index;
