import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, ArrowLeft, Check, Battery, Zap, Moon, Lightbulb, Truck, CreditCard, Search, User, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { DesktopMenu } from "@/components/DesktopMenu";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import productDetail1 from "@/assets/product-detail-1.png";
import productDetail2 from "@/assets/product-detail-2.png";
import productDetail3 from "@/assets/product-detail-3.png";
import productDetail4 from "@/assets/product-detail-4.png";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bundleQuantity, setBundleQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  // Find variant based on color and size
  const findVariant = (color: string, size: string) => {
    if (!product) return null;
    return product.node.variants.edges.find(({ node: v }) => {
      const hasColor = v.selectedOptions.some(opt => 
        (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'kleur' || opt.name.toLowerCase() === 'variant') && 
        opt.value.toLowerCase() === color.toLowerCase()
      );
      const hasSize = v.selectedOptions.some(opt => 
        (opt.name.toLowerCase() !== 'color' && opt.name.toLowerCase() !== 'kleur' && opt.name.toLowerCase() !== 'variant') && 
        opt.value.toLowerCase().includes(size.toLowerCase())
      );
      return hasColor && hasSize;
    })?.node;
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(50);
        const found = products.find(p => p.node.handle === handle);
        if (found) {
          setProduct(found);
          
          // Check if URL params exist (from quiz)
          const urlSize = searchParams.get('size');
          const urlColor = searchParams.get('color');
          
          const firstVariant = found.node.variants.edges[0]?.node;
          setSelectedVariant(firstVariant);
          
          // Set initial color and size from URL params or first variant
          if (firstVariant) {
            const colorOpt = firstVariant.selectedOptions.find(opt => 
              opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'kleur' || opt.name.toLowerCase() === 'variant'
            );
            const sizeOpt = firstVariant.selectedOptions.find(opt => 
              opt.name.toLowerCase() !== 'color' && opt.name.toLowerCase() !== 'kleur' && opt.name.toLowerCase() !== 'variant'
            );
            
            // Use URL params if available, otherwise use first variant
            if (urlColor) {
              setSelectedColor(urlColor);
            } else if (colorOpt) {
              setSelectedColor(colorOpt.value);
            }
            
            if (urlSize) {
              setSelectedSize(urlSize);
            } else if (sizeOpt) {
              // Extract just the size number
              const sizeMatch = sizeOpt.value.match(/\d+/);
              if (sizeMatch) setSelectedSize(sizeMatch[0] + 'cm');
            }
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle, searchParams]);

  // Update variant when color or size changes
  useEffect(() => {
    if (selectedColor && selectedSize && product) {
      const variant = findVariant(selectedColor, selectedSize);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [selectedColor, selectedSize, product]);

  // Debug: Log product options
  useEffect(() => {
    if (product) {
      console.log('🎨 Product options:', product.node.options);
      console.log('🎨 Product variants:', product.node.variants.edges.map(e => ({
        title: e.node.title,
        options: e.node.selectedOptions
      })));
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: bundleQuantity,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success('Toegevoegd aan winkelmandje', {
      description: `${bundleQuantity}x ${product.node.title} is toegevoegd.`,
    });
  };

  // Calculate bundle pricing
  const basePrice = parseFloat(selectedVariant?.price?.amount || product?.node.priceRange.minVariantPrice.amount || "0");
  const bundles = [
    { qty: 1, discount: 0, label: "1 Stuk", tag: "" },
    { qty: 2, discount: 0.25, label: "2 Stuks", tag: "25% Korting!" },
    { qty: 4, discount: 0.33, label: "4 Stuks", tag: "33% Korting! Meest gekozen!" }
  ];
  
  const selectedBundle = bundles.find(b => b.qty === bundleQuantity) || bundles[0];
  const originalBundlePrice = basePrice * bundleQuantity;
  const discountedBundlePrice = originalBundlePrice * (1 - selectedBundle.discount);
  const hasDiscount = selectedBundle.discount > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Product niet gevonden</p>
        <div className="text-center mt-4">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.price || product.node.priceRange.minVariantPrice;
  const imageUrl = product.node.images?.edges?.[0]?.node?.url;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        {/* Top bar with icons and logo */}
        <div className="container">
          <div className="flex h-24 items-center justify-between">
            {/* Left - Search Icon */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Center - Logo */}
            <button 
              onClick={() => navigate("/")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Ga naar homepage"
            >
              <img 
                src={logo} 
                alt="SenseGlow Logo" 
                className="h-16 w-auto object-contain"
              />
            </button>
            
            {/* Right - Account & Cart */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <CartDrawer />
            </div>
          </div>
        </div>
        
        {/* Bottom bar with navigation */}
        <div className="border-t bg-white">
          <div className="container">
            <nav className="flex items-center justify-center gap-8 py-3">
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

      {/* Product Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar overzicht
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
            {/* Product Images */}
            <div className="flex gap-4 sticky top-32 self-start">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 w-20">
                {product.node.images.edges.map(({ node: image }, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square bg-muted/30 rounded-md overflow-hidden cursor-pointer border-2 transition-all hover:border-brand-orange flex items-center justify-center ${
                      selectedImageIndex === idx ? 'border-brand-orange ring-2 ring-brand-orange ring-offset-2' : 'border-transparent'
                    }`}
                  >
                    <img src={image.url} alt={image.altText || `Productafbeelding ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div 
                className="flex-1 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center min-h-[500px] cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => setLightboxOpen(true)}
              >
                {product.node.images.edges[selectedImageIndex] && (
                  <img
                    src={product.node.images.edges[selectedImageIndex].node.url}
                    alt={product.node.images.edges[selectedImageIndex].node.altText || product.node.title}
                    className="max-w-full max-h-full object-contain animate-fade-in"
                  />
                )}
              </div>
              
              {/* Lightbox Modal */}
              <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
                  <div className="relative w-full h-[95vh] flex items-center justify-center">
                    {/* Close button */}
                    <button
                      onClick={() => setLightboxOpen(false)}
                      className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Previous button */}
                    {product.node.images.edges.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex((prev) => 
                            prev === 0 ? product.node.images.edges.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <ChevronLeft className="w-8 h-8 text-white" />
                      </button>
                    )}
                    
                    {/* Image */}
                    <img
                      src={product.node.images.edges[selectedImageIndex].node.url}
                      alt={product.node.images.edges[selectedImageIndex].node.altText || product.node.title}
                      className="max-w-full max-h-full object-contain"
                    />
                    
                    {/* Next button */}
                    {product.node.images.edges.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex((prev) => 
                            prev === product.node.images.edges.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <ChevronRight className="w-8 h-8 text-white" />
                      </button>
                    )}
                    
                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                      {selectedImageIndex + 1} / {product.node.images.edges.length}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.node.title}</h1>
                
                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-brand-orange text-lg">★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.7/5</span>
                  <span className="text-sm text-muted-foreground">Beoordeeld</span>
                </div>

                {/* Trust Icons with Images */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-brand-orange" />
                    </div>
                    <span className="text-sm font-medium">Gratis verzending aan huis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-brand-orange" />
                    </div>
                    <span className="text-sm">Voor 23:00 besteld, <strong>vandaag verstuurd</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-brand-orange" />
                    </div>
                    <span className="text-sm">Veilig betalen met <strong>iDEAL & Bancontact</strong></span>
                  </div>
                </div>
              </div>

              {/* Color and Size Selection - Side by Side */}
              <div className="grid grid-cols-2 gap-6">
                {/* Size Selection */}
                {product.node.options.some(opt => opt.name.toLowerCase() !== 'color' && opt.name.toLowerCase() !== 'kleur' && opt.name.toLowerCase() !== 'variant') && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wide">Maat</label>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        // Get unique sizes from all variants
                        const sizes = new Set<string>();
                        product.node.variants.edges.forEach(({ node: v }) => {
                          v.selectedOptions.forEach(opt => {
                            if (opt.name.toLowerCase() !== 'color' && opt.name.toLowerCase() !== 'kleur' && opt.name.toLowerCase() !== 'variant') {
                              // Extract size number
                              const sizeMatch = opt.value.match(/(\d+)\s*cm/i);
                              if (sizeMatch) {
                                sizes.add(sizeMatch[1] + 'cm');
                              }
                            }
                          });
                        });
                        
                        return Array.from(sizes).sort((a, b) => {
                          const numA = parseInt(a);
                          const numB = parseInt(b);
                          return numA - numB;
                        }).map((sizeValue) => {
                          const isSelected = selectedSize === sizeValue;
                          
                          return (
                            <Button
                              key={sizeValue}
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => setSelectedSize(sizeValue)}
                              className={`px-6 ${isSelected ? 'bg-foreground text-background hover:bg-foreground/90' : 'hover:border-foreground'}`}
                            >
                              {sizeValue}
                            </Button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.node.options.some(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'kleur' || opt.name.toLowerCase() === 'variant') && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wide">
                      Kleur - {selectedColor.toUpperCase()}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const colorOption = product.node.options.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'kleur' || opt.name.toLowerCase() === 'variant');
                        if (!colorOption) return null;
                        
                        // Get unique colors
                        const uniqueColors = Array.from(new Set(colorOption.values.map(v => {
                          // Extract just the color name (remove size info)
                          return v.split('-')[0].trim();
                        })));
                        
                        return uniqueColors.map((colorValue) => {
                          const isSelected = selectedColor.toLowerCase() === colorValue.toLowerCase();
                          
                          const colorMap: Record<string, string> = {
                            'silver': 'bg-gray-300',
                            'zilver': 'bg-gray-300',
                            'grey': 'bg-gray-500',
                            'grijs': 'bg-gray-500',
                            'gray': 'bg-gray-500',
                            'black': 'bg-black',
                            'zwart': 'bg-black',
                            'white': 'bg-white',
                            'wit': 'bg-white',
                          };
                          
                          const colorClass = colorMap[colorValue.toLowerCase()] || 'bg-gray-400';
                          
                          return (
                            <button
                              key={colorValue}
                              onClick={() => setSelectedColor(colorValue)}
                              className={`w-14 h-14 rounded-md border-2 transition-all ${
                                isSelected ? 'border-foreground ring-2 ring-foreground ring-offset-2' : 'border-muted hover:border-muted-foreground'
                              } ${colorClass} ${colorClass === 'bg-white' ? 'shadow-sm' : ''}`}
                              title={colorValue}
                            >
                              <span className="sr-only">{colorValue}</span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Bundle Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-wide">Tijdelijke aanbieding!</label>
                </div>
                <div className="space-y-2">
                  {bundles.map((bundle) => {
                    const isSelected = bundleQuantity === bundle.qty;
                    const bundlePrice = basePrice * bundle.qty * (1 - bundle.discount);
                    const originalPrice = basePrice * bundle.qty;
                    
                    return (
                      <button
                        key={bundle.qty}
                        onClick={() => setBundleQuantity(bundle.qty)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected 
                            ? 'border-brand-orange bg-brand-orange/5' 
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-brand-orange' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <div className="w-3 h-3 rounded-full bg-brand-orange" />}
                            </div>
                            <span className="font-bold text-base">{bundle.label}</span>
                          </div>
                          {bundle.tag && (
                            <Badge className="bg-brand-orange text-white text-xs">
                              {bundle.tag}
                            </Badge>
                          )}
                        </div>
                        <div className="ml-8">
                          <div className="text-xs text-muted-foreground mb-1">Incl. Gratis verzending</div>
                          <div className="flex items-baseline gap-2">
                            {bundle.discount > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                €{originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-xl font-bold text-foreground">
                              €{bundlePrice.toFixed(2)}
                            </span>
                          </div>
                          {bundle.discount > 0 && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Bespaar €{(originalPrice - bundlePrice).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold text-base py-7 uppercase tracking-wide"
                disabled={!selectedVariant?.availableForSale}
              >
                {selectedVariant?.availableForSale ? 'VOEG TOE AAN WINKELWAGEN' : 'UITVERKOCHT'}
              </Button>

              {/* Money Back Guarantee */}
              <Accordion type="single" collapsible className="border rounded-lg">
                <AccordionItem value="guarantee" className="border-none">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <span className="font-bold uppercase text-sm tracking-wide">NIET TEVREDEN = GELD TERUG</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We staan 100% achter onze producten. Niet tevreden? Stuur het binnen 30 dagen retour en ontvang je geld terug. Geen vragen gesteld.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Description */}
              <div className="pt-4 border-t">
                <h3 className="font-bold text-xl mb-3 uppercase">Bespaar moeite en energie zonder gedoe met schakelaars</h3>
                <p className="text-foreground leading-relaxed">
                  {product.node.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Icons Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <Battery className="w-12 h-12 mx-auto mb-4 text-brand-orange" />
              <h3 className="font-semibold mb-2">Tot 60 dagen batterijduur</h3>
              <p className="text-sm text-muted-foreground">Altijd klaar voor gebruik</p>
            </Card>
            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-brand-orange" />
              <h3 className="font-semibold mb-2">Installatie in seconden</h3>
              <p className="text-sm text-muted-foreground">Magnetisch of met plakstrip</p>
            </Card>
            <Card className="p-6 text-center">
              <Moon className="w-12 h-12 mx-auto mb-4 text-brand-orange" />
              <h3 className="font-semibold mb-2">Slimme sensor</h3>
              <p className="text-sm text-muted-foreground">Reageert alleen in het donker</p>
            </Card>
            <Card className="p-6 text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-brand-orange" />
              <h3 className="font-semibold mb-2">Warm designlicht</h3>
              <p className="text-sm text-muted-foreground">Stijlvol en energiezuinig</p>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8">
            Geen kabels. Geen zorgen. Alleen licht dat weet wanneer jij het nodig hebt.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Waarom SenseGlow™ ontstond</h2>
            <p className="text-lg text-muted-foreground">
              De meeste mensen beseffen pas hoe onpraktisch hun verlichting is
              tot ze midden in de nacht struikelen over iets kleins.
            </p>
            <p className="text-lg">
              SenseGlow™ werd ontworpen voor dát moment.
              Wanneer je ogen nog halfdicht zijn, maar je huis al reageert.
            </p>
            <p className="text-xl font-semibold text-brand-orange">
              Licht dat denkt. Design dat rust brengt.
            </p>
          </div>
        </div>
      </section>

      {/* Contrast Block */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Zonder vs. Met SenseGlow™</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-destructive">Zonder SenseGlow™</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Donkere gangen, struikelen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Felle lamp verstoort slaap</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Installatiestress met kabels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Energieverspilling</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 border-brand-orange">
              <h3 className="font-semibold mb-4 text-brand-orange">Met SenseGlow™</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Zachte gloed die je begeleidt</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Warme rustgevende toon</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Magnetisch in 10 sec geplaatst</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Slimme sensor die stroom bespaart</span>
                </li>
              </ul>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8">
            SenseGlow™ – slimme eenvoud voor wie rust wil, niet complexiteit.
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Wat anderen zeggen</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                text: "Eindelijk een lamp die aanvoelt alsof mijn huis met me meebeweegt.",
                author: "Sarah M."
              },
              {
                text: "Mijn kinderen vinden het magisch – ik vind het vooral veilig.",
                author: "Peter D."
              },
              {
                text: "Zo simpel, zo mooi. Nooit meer in het donker.",
                author: "Lisa K."
              }
            ].map((review, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="mb-4 italic">"{review.text}"</p>
                <p className="text-sm font-semibold">— {review.author}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8">
            2.000+ tevreden klanten wereldwijd.
          </p>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Technische specificaties</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Batterijduur", value: "Tot 60 dagen" },
              { label: "Sensorbereik", value: "3–5 m" },
              { label: "Oplaadtijd", value: "2 uur (USB-C)" },
              { label: "Lichtkleur", value: "2800 K – 4000 K" },
              { label: "Materiaal", value: "Aluminium + ABS" },
              { label: "Garantie", value: "2 jaar" }
            ].map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-background rounded-lg">
                <span className="font-semibold">{spec.label}:</span>
                <span className="text-muted-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8">
            Ontworpen voor dagelijks gebruik. Gebouwd om lang mee te gaan.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Veelgestelde vragen</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Hoe lang gaat de batterij mee?</AccordionTrigger>
              <AccordionContent>
                Tot 60 dagen bij normaal gebruik. De slimme sensor zorgt ervoor dat de lamp alleen aangaat wanneer nodig, wat de batterijduur maximaliseert.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Moet ik boren?</AccordionTrigger>
              <AccordionContent>
                Nee, absoluut niet! SenseGlow™ kan magnetisch of met een plakstrip worden bevestigd – binnen seconden klaar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Werkt hij overdag?</AccordionTrigger>
              <AccordionContent>
                De lamp werkt alleen bij schemer of in het donker, wat energiebesparend is en voorkomt dat hij overdag onnodig aangaat.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Wat is de garantie?</AccordionTrigger>
              <AccordionContent>
                SenseGlow™ komt met 2 jaar standaardgarantie. Wij staan achter de kwaliteit van onze producten.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-b from-brand-orange/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar voor een huis dat met je meebeweegt?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            SenseGlow™ is dé upgrade die comfort en veiligheid combineert.
          </p>
          <Button size="lg" onClick={handleAddToCart} className="text-lg px-8">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Voeg toe aan winkelmandje
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
