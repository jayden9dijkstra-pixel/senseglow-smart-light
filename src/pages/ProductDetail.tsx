import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
import { ThemeToggle } from "@/components/ThemeToggle";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProduct['node']['variants']['edges'][0]['node'] | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(50);
        const found = products.find(p => p.node.handle === handle);
        setProduct(found || null);
        if (found) {
          setSelectedVariant(found.node.variants.edges[0]?.node || null);
        }
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
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-xl text-muted-foreground">Product laden...</p>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-background">
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
        <header className="w-full bg-background">
          {/* Top bar with icons and logo */}
          <div className="container">
            <div className="flex h-40 items-center justify-between py-6 relative">
              {/* Left - Search Icon */}
              <Button variant="ghost" size="icon">
                <Search className="h-6 w-6" />
              </Button>
              
              {/* Center - Logo */}
              <button 
                onClick={() => navigate("/")}
                className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-90 transition-opacity duration-500"
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
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                <CartDrawer />
              </div>
            </div>
          </div>
          
          {/* Bottom bar with navigation - subtle separator */}
          <div className="border-t border-border/30 bg-background">
            <div className="container">
              <nav className="flex items-center justify-center gap-12 py-4">
                <a 
                  href="/#home" 
                  className="text-xs uppercase tracking-[0.2em] font-medium text-foreground/80 hover:text-glow transition-colors duration-500"
                >
                  HOME
                </a>
                <a 
                  href="/#products" 
                  className="text-xs uppercase tracking-[0.2em] font-medium text-foreground/80 hover:text-glow transition-colors duration-500"
                >
                  PRODUCTEN
                </a>
                <a 
                  href="/#contact" 
                  className="text-xs uppercase tracking-[0.2em] font-medium text-foreground/80 hover:text-glow transition-colors duration-500"
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

        {/* USP Banner - Scrolling with Charcoal */}
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

        {/* Product Sections */}
        <ProductHeroSection product={product} selectedVariant={selectedVariant} onVariantChange={setSelectedVariant} />
        <BundlesSection product={product} selectedVariant={selectedVariant || undefined} />
        <ProductReviewsSection />
        <OutcomeSection />
        <ProblemSolutionProductSection />
        <UseCaseSection />
        <TechBenefitsSection />
        <ProductFAQSection />
        <FinalProductCTA />

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

export default ProductDetail;
