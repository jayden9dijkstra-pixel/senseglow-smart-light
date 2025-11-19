import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { PageTransition } from "@/components/PageTransition";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import logoNew from "@/assets/logo-new.png";
import { useNavigate } from "react-router-dom";
import { ProductHeroSection } from "@/components/product/ProductHeroSection";
import { OutcomeSection } from "@/components/product/OutcomeSection";
import { ProblemSolutionProductSection } from "@/components/product/ProblemSolutionProductSection";
import { UseCaseSection } from "@/components/product/UseCaseSection";
import { BundlesSection } from "@/components/product/BundlesSection";
import { TechBenefitsSection } from "@/components/product/TechBenefitsSection";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { FinalProductCTA } from "@/components/product/FinalProductCTA";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(50);
        const found = products.find(p => p.node.handle === handle);
        setProduct(found || null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Product laden...</p>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-4">Product niet gevonden</p>
            <Button onClick={() => navigate("/")}>
              Terug naar home
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

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
                  href="/#home" 
                  className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-brand-orange transition-colors"
                >
                  HOME
                </a>
                <a 
                  href="/#products" 
                  className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-brand-orange transition-colors"
                >
                  PRODUCTEN
                </a>
                <a 
                  href="/#contact" 
                  className="text-sm uppercase tracking-wide font-medium text-foreground hover:text-brand-orange transition-colors"
                >
                  CONTACT
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* USP Banner - Scrolling */}
        <section className="bg-brand-orange py-3 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-scroll">
            {/* First set of items */}
            <div className="flex items-center gap-8 px-4">
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ Gratis verzending</span>
              <span className="text-white/60">•</span>
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
              <span className="text-white/60">•</span>
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ 30 dagen retourrecht</span>
              <span className="text-white/60">•</span>
            </div>
            
            {/* Duplicate for seamless loop */}
            <div className="flex items-center gap-8 px-4">
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ Gratis verzending</span>
              <span className="text-white/60">•</span>
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
              <span className="text-white/60">•</span>
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ 30 dagen retourrecht</span>
              <span className="text-white/60">•</span>
            </div>
            
            {/* Second duplicate for seamless loop */}
            <div className="flex items-center gap-8 px-4">
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ Gratis verzending</span>
              <span className="text-white/60">•</span>
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ Voor 23:00 besteld, vandaag verstuurd</span>
              <span className="text-white/60">•</span>
              <span className="text-white text-sm uppercase tracking-wide font-medium">✓ 30 dagen retourrecht</span>
              <span className="text-white/60">•</span>
            </div>
          </div>
        </section>

        {/* Product Sections */}
        <ProductHeroSection product={product} />
        <BundlesSection />
        <OutcomeSection />
        <ProblemSolutionProductSection />
        <UseCaseSection />
        <TechBenefitsSection />
        <ProductFAQSection />
        <ProductReviewsSection />
        <FinalProductCTA />

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

export default ProductDetail;
