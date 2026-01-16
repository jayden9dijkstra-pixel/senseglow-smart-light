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
          <p className="text-base text-muted-foreground">Product laden...</p>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-left">
            <p className="text-base text-muted-foreground mb-4">Product niet gevonden</p>
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
            <div className="flex h-32 items-center justify-between py-4 relative">
              {/* Left - Search Icon */}
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
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
                  className="relative h-24 w-auto object-contain"
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
          
          {/* Bottom bar with navigation - editorial line separator */}
          <div className="border-t border-foreground/10 bg-background">
            <div className="container">
              <nav className="flex items-center justify-center gap-12 py-4">
                <a 
                  href="/#home" 
                  className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-500"
                >
                  HOME
                </a>
                <a 
                  href="/#products" 
                  className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-500"
                >
                  PRODUCTEN
                </a>
                <a 
                  href="/#contact" 
                  className="text-xs uppercase tracking-[0.25em] font-medium text-foreground/70 hover:text-glow transition-colors duration-500"
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

        {/* Product Sections with editorial line separators */}
        <ProductHeroSection product={product} selectedVariant={selectedVariant} onVariantChange={setSelectedVariant} />
        <div className="border-t border-foreground/10" />
        <BundlesSection product={product} selectedVariant={selectedVariant || undefined} />
        <div className="border-t border-foreground/10" />
        <ProductReviewsSection />
        <div className="border-t border-foreground/10" />
        <OutcomeSection />
        <div className="border-t border-foreground/10" />
        <ProblemSolutionProductSection />
        <div className="border-t border-foreground/10" />
        <UseCaseSection />
        <div className="border-t border-foreground/10" />
        <TechBenefitsSection />
        <div className="border-t border-foreground/10" />
        <ProductFAQSection />
        <div className="border-t border-foreground/10" />
        <FinalProductCTA />

        {/* Footer */}
        <footer className="border-t border-foreground/10 bg-background text-foreground">
          <div className="container py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
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
            <div className="text-left text-xs text-foreground/40 pt-8 border-t border-foreground/10">
              <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;