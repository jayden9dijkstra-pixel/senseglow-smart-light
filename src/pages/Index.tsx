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
      <header className="w-full bg-background">
        {/* Top bar with icons and logo */}
        <div className="container">
          <div className="flex h-32 items-center py-4 relative">
            {/* Mobile Layout */}
            <div className="flex md:hidden w-full items-center justify-between">
              {/* Left - Search */}
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
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
                  className="relative h-20 w-auto object-contain"
                />
              </button>
              
              {/* Right - Cart */}
              <CartDrawer />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full items-center justify-between">
              {/* Left - Search Icon */}
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
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
                  className="relative h-24 w-auto object-contain"
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
        
        {/* Bottom bar with navigation - editorial line separator */}
        <div className="border-t border-foreground/10 bg-background">
          <div className="container">
            <nav className="flex items-center justify-center gap-12 py-4">
              <a 
                href="#home" 
                className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-300"
              >
                HOME
              </a>
              <button
                onClick={() => {
                  if (products.length > 0) {
                    navigate(`/product/${products[0].node.handle}`);
                  }
                }}
                className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                PRODUCTEN
              </button>
              <a 
                href="#contact" 
                className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-300"
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

      {/* USP Banner */}
      <section className="border-y border-foreground/10 py-3 overflow-hidden relative bg-background">
        <div className="flex whitespace-nowrap animate-scroll">
          {[1, 2, 3].map((set) => (
            <div key={set} className="flex items-center gap-8 px-4">
              <span className="text-foreground/60 text-xs uppercase tracking-[0.2em] font-medium">✓ Gratis verzending</span>
              <span className="text-foreground/20">•</span>
              <span className="text-foreground/60 text-xs uppercase tracking-[0.2em] font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
              <span className="text-foreground/20">•</span>
              <span className="text-foreground/60 text-xs uppercase tracking-[0.2em] font-medium">✓ 30 dagen retourrecht</span>
              <span className="text-foreground/20">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Homepage Sections with curved transitions */}
      <HeroSection />
      
      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <div className="bg-background-secondary">
        <StorytellingSection />
      </div>
      
      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <ProblemSolutionSection />
      
      {/* Horizontal image break - visual pause */}
      <div className="border-t border-foreground/8" />
      
      <WarmGlowSection />
      
      {/* Curved transition to secondary */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <QuizIntroSection />
      
      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <SafetySection />
      
      <div className="border-t border-foreground/8" />
      
      <ReviewsTeaserSection />
      
      {/* Curved transition to final CTA */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <div className="bg-background-secondary">
        <FinalCTASection />
      </div>

      {/* Curved transition to products */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      {/* Products Section */}
      <section id="products" className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Onze Producten</h2>
              <p className="text-base text-muted-foreground">
                Kies de juiste maat voor jouw ruimte
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/8 rounded-xl overflow-hidden">
                {products.map((product) => (
                  <div key={product.node.id} className="bg-background p-8">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-left py-16">
                <p className="text-lg text-muted-foreground mb-2">Geen producten gevonden</p>
                <p className="text-sm text-muted-foreground">
                  Voeg producten toe via de Shopify Storefront API.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section with curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <div id="faq" className="bg-background-secondary">
        <FAQSection />
      </div>

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Footer with curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>
      
      <footer className="bg-background text-foreground">
        <div className="container py-14">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">KLANTENSERVICE</h3>
                <ul className="text-sm space-y-2 text-foreground/60">
                  <li><a href="/contact" className="hover:text-glow transition-colors duration-300">Contact</a></li>
                  <li><a href="/verzending" className="hover:text-glow transition-colors duration-300">Verzending</a></li>
                  <li><a href="/retourneren" className="hover:text-glow transition-colors duration-300">Retourneren</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">OVER ONS</h4>
                <ul className="text-sm space-y-2 text-foreground/60">
                  <li><a href="/over" className="hover:text-glow transition-colors duration-300">Over SenseGlow</a></li>
                  <li><a href="/duurzaamheid" className="hover:text-glow transition-colors duration-300">Duurzaamheid</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">JURIDISCH</h4>
                <ul className="text-sm space-y-2 text-foreground/60">
                  <li><a href="/privacy" className="hover:text-glow transition-colors duration-300">Privacybeleid</a></li>
                  <li><a href="/voorwaarden" className="hover:text-glow transition-colors duration-300">Algemene voorwaarden</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">VOLG ONS</h4>
                <p className="text-sm text-foreground/60">
                  Instagram | Facebook | Pinterest
                </p>
              </div>
            </div>
            <div className="text-left text-xs text-foreground/40 pt-10 border-t border-foreground/8">
              <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
};

export default Index;