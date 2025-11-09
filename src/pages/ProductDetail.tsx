import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, ArrowLeft, Check, Battery, Zap, Moon, Lightbulb } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import logo from "@/assets/logo.png";
import productDetail1 from "@/assets/product-detail-1.png";
import productDetail2 from "@/assets/product-detail-2.png";
import productDetail3 from "@/assets/product-detail-3.png";
import productDetail4 from "@/assets/product-detail-4.png";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(50);
        const found = products.find(p => p.node.handle === handle);
        if (found) {
          setProduct(found);
          setSelectedVariant(found.node.variants.edges[0]?.node);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success('Toegevoegd aan winkelmandje', {
      description: `${product.node.title} is toegevoegd.`,
    });
  };

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
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="SenseGlow" className="h-8" />
            </Link>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-brand-orange/5 to-background">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar overzicht
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary/20 rounded-lg overflow-hidden">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={product.node.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[productDetail1, productDetail2, productDetail3, productDetail4].map((img, idx) => (
                  <div key={idx} className="aspect-square bg-secondary/20 rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                    <img src={img} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.node.title}</h1>
                <p className="text-lg text-muted-foreground">
                  Slim Licht. Warm Welkom.
                </p>
              </div>

              <div className="text-3xl font-bold text-brand-orange">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </div>

              {/* Variant Selection */}
              {product.node.variants.edges.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kies je variant:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.node.variants.edges.map(({ node: variant }) => (
                      <Button
                        key={variant.id}
                        variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                        onClick={() => setSelectedVariant(variant)}
                        className="justify-start"
                      >
                        {variant.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Aantal:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full"
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {selectedVariant?.availableForSale ? 'Voeg toe aan winkelmandje' : 'Uitverkocht'}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Gratis verzending</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">2 jaar garantie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">30 dagen retour</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Veilig betalen</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {product.node.description}
              </p>
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
