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
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-32 items-center justify-center relative py-2">
          <button 
            onClick={() => navigate("/")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Ga naar homepage"
          >
            <img 
              src={logo} 
              alt="SenseGlow Logo" 
              className="h-28 w-auto object-contain"
            />
          </button>
          <div className="absolute right-0">
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* USP Banner */}
      <section className="bg-brand-orange py-3">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 text-white text-sm font-medium">
            <span>✓ Gratis Verzending</span>
            <span>✓ 30 dagen bedenktijd</span>
            <span>✓ Veilig Betalen</span>
            <span>✓ Altijd Gratis Verzending</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-brand-orange py-12 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left - Product Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
              <img 
                src={heroImage} 
                alt="SenseGlow LED lamp in actie"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right - Content */}
            <div className="bg-brand-orange-light rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-brand-orange text-xl">⭐</span>
                ))}
                <span className="ml-2 font-semibold text-foreground">Gebaseerd op 1000+ Reviews</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-orange leading-tight">
                Automatisch licht. Precies wanneer jij het nodig hebt.
              </h2>
              
              <p className="text-lg mb-6 text-foreground leading-relaxed">
                Onze slimme LED lamp met bewegings-sensor combineert <strong>veiligheid</strong> en <strong>design</strong> in één oplossing. 
                Zodra je beweegt, verschijnt er een <strong>warme gloed</strong> die je huis veiliger, rustiger en stijlvoller maakt.
              </p>
              
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
