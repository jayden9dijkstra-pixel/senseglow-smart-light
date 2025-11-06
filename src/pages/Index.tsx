import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2 } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Light That Moves With Your Life
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Smart motion sensor LED lights for safety, design & comfort
          </p>
          <a href="#products">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-semibold transition-colors">
              Shop Now
            </button>
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Collection</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium motion sensor lights designed for modern living
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No products found</p>
            <p className="text-muted-foreground">
              Products will appear here once they are available via the Shopify Storefront API.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 SenseGlow™. All rights reserved.</p>
            <p className="text-sm">Smart lighting for modern homes</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
