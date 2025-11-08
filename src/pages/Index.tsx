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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">SenseGlow™</h1>
          </div>
          <CartDrawer />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--glow)/0.15)_0%,_transparent_65%)]" />
        
        <div className="relative z-10 text-center px-4 py-20">
          <div className="inline-block px-4 py-2 bg-glow/10 rounded-full mb-6 animate-pulse">
            <span className="text-sm font-medium text-glow">Premium LED-verlichting met bewegingssensor</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Licht dat meegaat
            <br />
            <span className="text-glow">met je leven</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Veiligheid, gemak en design — automatisch
          </p>
          
          <Button
            onClick={() => navigate("/quiz")}
            size="lg"
            className="bg-glow hover:bg-glow/90 text-white shadow-2xl shadow-glow/30 hover:shadow-glow/50 transition-all text-lg px-8 py-6 h-auto"
          >
            Ontdek jouw ideale SenseGlow
          </Button>
        </div>
      </section>

      {/* Why SenseGlow */}
      <WhySection />

      {/* Lifestyle & Reviews */}
      <LifestyleSection />

      {/* Products Section */}
      <section id="products" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Onze Collectie</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kies de perfecte maat voor jouw ruimte
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-glow" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">Geen producten gevonden</p>
            <p className="text-muted-foreground">
              Producten worden binnenkort toegevoegd via de Shopify Storefront API.
            </p>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SenseGlow™</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium LED-bewegingssensorlampen voor moderne woningen
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Email: info@senseglow.nl
                <br />
                Tel: +31 20 123 4567
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Volg ons</h4>
              <p className="text-sm text-muted-foreground">
                Instagram | Facebook | Pinterest
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>© 2025 SenseGlow™. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
