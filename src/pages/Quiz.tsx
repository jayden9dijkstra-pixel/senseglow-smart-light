import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { PageTransition } from "@/components/PageTransition";

const questions = [
  {
    question: "Waar wil je de lamp gebruiken? (meerdere opties mogelijk)",
    multiSelect: true,
    options: [
      { text: "Gang of trappenhuizen", value: "hallway" },
      { text: "Slaapkamer", value: "bedroom" },
      { text: "Badkamer of toilet", value: "bathroom" },
      { text: "Keuken", value: "kitchen" },
    ],
  },
  {
    question: "Hoe groot is de ruimte?",
    options: [
      { text: "Klein (< 5m²)", value: "small" },
      { text: "Gemiddeld (5-15m²)", value: "medium" },
      { text: "Groot (> 15m²)", value: "large" },
    ],
  },
  {
    question: "Wat is het belangrijkste voor jou?",
    options: [
      { text: "Veiligheid en oriëntatie", value: "safety" },
      { text: "Sfeer en design", value: "design" },
      { text: "Energie besparen", value: "energy" },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [productHandle, setProductHandle] = useState<string>("");

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts(1);
      if (products.length > 0) {
        setProductHandle(products[0].node.handle);
      }
    };
    loadProduct();
  }, []);

  const handleAnswer = (value: string) => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.multiSelect) {
      // Toggle selection for multi-select
      const newLocations = selectedLocations.includes(value)
        ? selectedLocations.filter(v => v !== value)
        : [...selectedLocations, value];
      setSelectedLocations(newLocations);
    } else {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const locationCount = selectedLocations.length;
    
    // Determine size based on room size
    let size = "20cm";
    if (answers.includes("large")) size = "40cm";
    else if (answers.includes("small")) size = "20cm";
    else if (answers.includes("medium")) size = "40cm";
    
    // Determine color based on preferences
    let color = "Zwart";
    if (answers.includes("design")) color = "Zilver";
    
    // Bundle pricing based on size
    const bundlePricing = {
      "20cm": {
        two: { price: "66.95", originalPrice: "69.90", discount: "5%" },
        three: { price: "94.95", originalPrice: "104.85", discount: "10%" },
        five: { price: "149.95", originalPrice: "174.75", discount: "15%" }
      },
      "40cm": {
        two: { price: "99.95", originalPrice: "109.90", discount: "10%" },
        three: { price: "139.95", originalPrice: "164.85", discount: "15%" },
        five: { price: "219.95", originalPrice: "274.75", discount: "20%" }
      }
    };
    
    const pricing = bundlePricing[size as "20cm" | "40cm"];
    
    // Determine bundle based on number of locations
    let bundle = null;
    if (locationCount === 2) {
      bundle = {
        name: "Night Safety Pack",
        quantity: 2,
        price: pricing.two.price,
        originalPrice: pricing.two.originalPrice,
        discount: pricing.two.discount,
        ideal: "Ideaal voor " + selectedLocations.map(loc => {
          if (loc === "hallway") return "gang/trap";
          if (loc === "bedroom") return "slaapkamer";
          if (loc === "bathroom") return "badkamer";
          if (loc === "kitchen") return "keuken";
          return loc;
        }).slice(0, 2).join(" + ")
      };
    } else if (locationCount === 3) {
      bundle = {
        name: "Home Glow Pack",
        quantity: 3,
        price: pricing.three.price,
        originalPrice: pricing.three.originalPrice,
        discount: pricing.three.discount,
        badge: "Meest gekozen",
        ideal: "Perfect voor trap + gang + slaapkamer"
      };
    } else if (locationCount >= 4) {
      bundle = {
        name: "Whole Home Security Pack",
        quantity: 5,
        price: pricing.five.price,
        originalPrice: pricing.five.originalPrice,
        discount: pricing.five.discount,
        badge: "Meest voordelig",
        ideal: "Complete woning bescherming"
      };
    }
    
    return { size, color, bundle, locationCount };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedLocations([]);
    setShowResult(false);
  };

  if (showResult) {
    const recommendation = getRecommendation();
    const productUrl = `/product/${productHandle}?size=${recommendation.size}&color=${recommendation.color}`;
    
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg font-semibold">SenseGlow™</span>
            </button>
          </div>
        </header>

        <div className="container py-16 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Jouw perfecte SenseGlow</h1>
            <p className="text-xl text-muted-foreground">
              Op basis van jouw antwoorden raden wij aan:
            </p>
          </div>

          {recommendation.bundle ? (
            <Card className="p-8 bg-gradient-to-br from-background to-brand-orange/10 border-2 border-brand-orange/30 mb-6">
              <div className="text-center space-y-6">
                {recommendation.bundle.badge && (
                  <div className="inline-block px-4 py-2 bg-brand-orange/20 rounded-full">
                    <span className="text-sm font-semibold text-brand-orange">{recommendation.bundle.badge}</span>
                  </div>
                )}
                
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{recommendation.bundle.name}</h2>
                  <p className="text-lg text-muted-foreground">{recommendation.bundle.ideal}</p>
                </div>

                <div className="py-6 border-y border-border">
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-5xl font-bold text-foreground">€{recommendation.bundle.price}</span>
                    <span className="text-xl text-muted-foreground line-through">€{recommendation.bundle.originalPrice}</span>
                  </div>
                  <div className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full">
                    <span className="text-sm font-semibold text-brand-orange">Bespaar {recommendation.bundle.discount}</span>
                  </div>
                </div>

                <div className="text-left space-y-3 bg-background/50 rounded-lg p-6">
                  <p className="font-semibold text-foreground">✓ {recommendation.bundle.quantity}x SenseGlow™ LED strip</p>
                  <p className="text-sm text-muted-foreground">
                    Perfect voor de {recommendation.locationCount} ruimtes die je hebt geselecteerd
                  </p>
                  <p className="text-sm text-muted-foreground">• Gratis verzending</p>
                  <p className="text-sm text-muted-foreground">• 30 dagen retourrecht</p>
                  <p className="text-sm text-muted-foreground">• Aanbevolen: {recommendation.size} - {recommendation.color}</p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={() => navigate(productUrl)}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Bekijk {recommendation.bundle.name}
                  </Button>
                  
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Opnieuw beginnen
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-gradient-to-br from-background to-accent/10 border-2 border-glow/20">
              <div className="text-center">
                <div className="inline-block px-6 py-3 bg-glow/10 rounded-full mb-6">
                  <p className="text-2xl font-bold text-glow">
                    SenseGlow™ {recommendation.size} - {recommendation.color}
                  </p>
                </div>
                
                <p className="text-muted-foreground mb-8">
                  Deze configuratie past perfect bij jouw wensen.
                </p>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => navigate(productUrl)}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Bekijk dit product
                  </Button>
                  
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Opnieuw beginnen
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">SenseGlow™</span>
          </button>
        </div>
      </header>

      <div className="container py-16 max-w-2xl">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  idx <= currentQuestion ? "bg-glow" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Vraag {currentQuestion + 1} van {questions.length}
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">
            {questions[currentQuestion].question}
          </h1>
        <div className="grid gap-4">
            {questions[currentQuestion].options.map((option) => {
              const isSelected = questions[currentQuestion].multiSelect && selectedLocations.includes(option.value);
              return (
                <Card
                  key={option.value}
                  className={`p-6 cursor-pointer transition-all ${
                    isSelected 
                      ? "border-primary border-2 bg-primary/10" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <p className="text-lg font-medium">{option.text}</p>
                </Card>
              );
            })}
          </div>
          
          {questions[currentQuestion].multiSelect && selectedLocations.length > 0 && (
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Ga verder ({selectedLocations.length} geselecteerd)
            </Button>
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Quiz;
