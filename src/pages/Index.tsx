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
  return <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Architectural Header */}
        <header className="w-full bg-background">
          <div className="container">
            <div className="flex h-24 md:h-28 items-center relative">
              {/* Mobile Layout */}
              <div className="flex md:hidden w-full items-center justify-between">
                <ThemeToggle />
                
                <button onClick={() => navigate("/")} className="absolute left-1/2 -translate-x-1/2 cursor-pointer" aria-label="Ga naar homepage">
                  <img src={logoNew} alt="SenseGlow Logo" className="h-16 w-auto object-contain opacity-90" />
                </button>
                
                <CartDrawer />
              </div>

              {/* Desktop Layout - Architectural spacing */}
              <div className="hidden md:flex w-full items-center justify-between">
                {/* Left - Navigation */}
                <nav className="flex items-center gap-10">
                  <a href="/" className="text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500">
                    Home
                  </a>
                  <button onClick={() => {
                  if (products.length > 0) {
                    navigate(`/product/${products[0].node.handle}`);
                  }
                }} className="text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500 cursor-pointer bg-transparent border-none">
                    Producten
                  </button>
                  <a href="/contact" className="text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500">
                </a>
                </nav>
                
                {/* Center - Logo */}
                <button onClick={() => navigate("/")} className="absolute left-1/2 -translate-x-1/2 cursor-pointer" aria-label="Ga naar homepage">
                  <img src={logoNew} alt="SenseGlow Logo" className="h-20 w-auto object-contain opacity-90" />
                </button>
                
                {/* Right - Utilities (subtle) */}
                <div className="flex items-center gap-6">
                  <ThemeToggle />
                  <CartDrawer />
                </div>
              </div>
            </div>
          </div>
          
          {/* Thin editorial separator line */}
          <div className="border-b border-foreground/8" />
        </header>

        {/* Mobile Navigation - Below header */}
        <div className="md:hidden border-b border-foreground/8 bg-background">
          <div className="container">
            <nav className="flex items-center justify-center gap-8 py-3">
              <a href="/" className="text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500">
                Home
              </a>
              <button onClick={() => {
              if (products.length > 0) {
                navigate(`/product/${products[0].node.handle}`);
              }
            }} className="text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500 cursor-pointer bg-transparent border-none">
                Producten
              </button>
              <a href="/contact" className="text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/50 hover:text-glow transition-colors duration-500">
                Contact
              </a>
            </nav>
          </div>
        </div>

        {/* Hero Section with overlap into next */}
        <HeroSection />
        
        {/* Soft curved transition into Storytelling */}
        <div className="relative h-16 md:h-24 -mt-8 md:-mt-12">
          <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <div className="bg-background-secondary relative z-10">
          <StorytellingSection />
        </div>
        
        {/* Curved transition back */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <ProblemSolutionSection />
        
        {/* Editorial line separator */}
        <div className="container">
          <div className="max-w-6xl mx-auto border-t border-foreground/6" />
        </div>
        
        <WarmGlowSection />
        
        {/* Curved transition to secondary */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <div className="bg-background-secondary">
          <QuizIntroSection />
        </div>
        
        {/* Curved transition back */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <SafetySection />
        
        {/* Editorial line separator */}
        <div className="container">
          <div className="max-w-6xl mx-auto border-t border-foreground/6" />
        </div>
        
        <ReviewsTeaserSection />
        
        {/* Curved transition to final CTA */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <div className="bg-background-secondary">
          <FinalCTASection />
        </div>

        {/* Curved transition to products */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
        </div>

        {/* Products Section */}
        <section id="products" className="py-24 md:py-32 bg-background">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
                  Collectie
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Onze Producten</h2>
                <p className="text-base text-foreground/60 max-w-md">
                  Kies de juiste maat voor jouw ruimte
                </p>
              </div>

              {loading ? <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
                </div> : products.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/6 overflow-hidden">
                  {products.map(product => <div key={product.node.id} className="bg-background p-10">
                      <ProductCard product={product} />
                    </div>)}
                </div> : <div className="py-20">
                  <p className="text-foreground/60 mb-2">Geen producten gevonden</p>
                  <p className="text-sm text-foreground/40">
                    Voeg producten toe via de Shopify Storefront API.
                  </p>
                </div>}
            </div>
          </div>
        </section>

        {/* FAQ Section with curved transition */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <div id="faq" className="bg-background-secondary">
          <FAQSection />
        </div>

        {/* Scroll to Top */}
        <ScrollToTop />

        {/* Footer with curved transition */}
        <div className="relative h-16 md:h-24">
          <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
        </div>
        
        <footer className="bg-background text-foreground">
          <div className="container py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Klantenservice</h3>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/contact" className="text-foreground/50 hover:text-glow transition-colors duration-500">Contact</a></li>
                    <li><a href="/verzending" className="text-foreground/50 hover:text-glow transition-colors duration-500">Verzending</a></li>
                    <li><a href="/retourneren" className="text-foreground/50 hover:text-glow transition-colors duration-500">Retourneren</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Over ons</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/over" className="text-foreground/50 hover:text-glow transition-colors duration-500">Over SenseGlow</a></li>
                    <li><a href="/duurzaamheid" className="text-foreground/50 hover:text-glow transition-colors duration-500">Duurzaamheid</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Juridisch</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/privacy" className="text-foreground/50 hover:text-glow transition-colors duration-500">Privacybeleid</a></li>
                    <li><a href="/voorwaarden" className="text-foreground/50 hover:text-glow transition-colors duration-500">Algemene voorwaarden</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-6 text-foreground/70">Volg ons</h4>
                  <p className="text-sm text-foreground/50">
                    Instagram · Facebook · Pinterest
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-foreground/30 pt-12 border-t border-foreground/6">
                <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>;
};
export default Index;