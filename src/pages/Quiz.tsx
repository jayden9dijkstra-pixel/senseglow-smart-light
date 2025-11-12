import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { PageTransition } from "@/components/PageTransition";

const questions = [
  {
    question: "Waar wil je de lamp gebruiken?",
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
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    // Determine size based on room size
    let size = "20cm";
    if (answers.includes("large")) size = "40cm";
    else if (answers.includes("small")) size = "20cm";
    else if (answers.includes("medium")) size = "40cm";
    
    // Determine color based on preferences
    let color = "Zwart";
    if (answers.includes("design")) color = "Zilver";
    
    return { size, color };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
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

        <div className="container py-16 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Jouw perfecte SenseGlow</h1>
            <p className="text-xl text-muted-foreground">
              Op basis van jouw antwoorden raden wij aan:
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-br from-background to-accent/10 border-2 border-glow/20">
            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-glow/10 rounded-full mb-6">
                <span className="text-3xl font-bold text-glow">{recommendation.size} - {recommendation.color}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Motion Sensor LED Light
              </h2>
              <p className="text-muted-foreground mb-2">
                <strong>Maat:</strong> {recommendation.size}
              </p>
              <p className="text-muted-foreground mb-8">
                <strong>Kleur:</strong> {recommendation.color}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate(productUrl)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-glow/20 transition-all hover:shadow-glow/40"
                >
                  Bekijk product
                </Button>
                <Button onClick={resetQuiz} variant="outline">
                  Opnieuw doen
                </Button>
              </div>
            </div>
          </Card>
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
            {questions[currentQuestion].options.map((option) => (
              <Card
                key={option.value}
                className="p-6 cursor-pointer hover:border-glow hover:shadow-lg hover:shadow-glow/10 transition-all"
                onClick={() => handleAnswer(option.value)}
              >
                <p className="text-lg font-medium">{option.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Quiz;
