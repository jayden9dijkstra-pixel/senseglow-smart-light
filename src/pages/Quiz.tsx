import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

// ─── Quiz structure ────────────────────────────────────────────────────────────

type StepId = "Q1" | "Q2" | "Q3a" | "Q3b" | "Q3c";

type Option = {
  label: string;
  // Either go to next step, or finish with a result key
  next?: StepId;
  result?: ResultKey;
};

type Step = {
  id: StepId;
  question: string;
  options: Option[];
};

type ResultKey =
  | "solar"
  | "flex"
  | "walllamp4"
  | "walllamp8"
  | "wave30"
  | "wave50"
  | "ambientSingle"
  | "ambient3"
  | "ambient4";

const steps: Record<StepId, Step> = {
  Q1: {
    id: "Q1",
    question: "Waar wil je het licht?",
    options: [
      { label: "Binnen, in huis", next: "Q2" },
      { label: "Buiten (voordeur/tuin)", result: "solar" },
      { label: "Op mijn bureau", result: "flex" },
    ],
  },
  Q2: {
    id: "Q2",
    question: "Wat is je doel?",
    options: [
      { label: "Veilig de trap op", next: "Q3a" },
      { label: "Sfeer in keuken/wonen", next: "Q3b" },
      { label: "Niet zoeken in het donker", next: "Q3c" },
    ],
  },
  Q3a: {
    id: "Q3a",
    question: "Hoe lang is je trap?",
    options: [
      { label: "8-12 treden", result: "walllamp4" },
      { label: "13+ treden of meerdere", result: "walllamp8" },
    ],
  },
  Q3b: {
    id: "Q3b",
    question: "Welke ruimte?",
    options: [
      { label: "Kleinere plek (bureau, kort werkblad)", result: "wave30" },
      { label: "Lange keuken of woonkamer", result: "wave50" },
    ],
  },
  Q3c: {
    id: "Q3c",
    question: "Hoeveel ruimtes wil je verlichten?",
    options: [
      { label: "Eén plek", result: "ambientSingle" },
      { label: "2-3 ruimtes", result: "ambient3" },
      { label: "Hele huis", result: "ambient4" },
    ],
  },
};

// ─── Results ───────────────────────────────────────────────────────────────────

const results: Record<ResultKey, { title: string; copy: string; url: string }> = {
  solar: {
    title: "SenseGlow Solar Lantern™",
    copy: "Voor jou: de SenseGlow Solar Lantern™. Buitenverlichting zonder kabels, zonder elektriciteitsrekening. Twee schroeven en klaar.",
    url: "/product/senseglow_solar_lantern",
  },
  flex: {
    title: "SenseGlow Flex™",
    copy: "Voor jou: de SenseGlow Flex™. Touch-dimbare bureaulamp die zich aanpast aan je studie-ritme. Magnetisch — verhuist mee naar elke volgende kamer.",
    url: "/product/senseglow_flex",
  },
  walllamp4: {
    title: "SenseGlow Wall Lamp™ — 4-delige set",
    copy: "Voor jou: de SenseGlow Wall Lamp™ 4-delige set. Genoeg voor een korte trap of gang. Zelfklevend, geen boren, geen elektricien.",
    url: "/product/senseglow_wall_lamp?set=4",
  },
  walllamp8: {
    title: "SenseGlow Wall Lamp™ — 8-delige set",
    copy: "Voor jou: de SenseGlow Wall Lamp™ 8-delige set. Voor langere trappen of meerdere ruimtes tegelijk. Hele huis veilig in tien minuten.",
    url: "/product/senseglow_wall_lamp?set=8",
  },
  wave30: {
    title: "SenseGlow Wave™ 30cm",
    copy: "Voor jou: de SenseGlow Wave™ 30cm. Compact genoeg voor onder een kast of achter een bureau. Drie lichtmodi, golf-effect bij beweging.",
    url: "/product/senseglow_wave?size=30",
  },
  wave50: {
    title: "SenseGlow Wave™ 50cm",
    copy: "Voor jou: de SenseGlow Wave™ 50cm. De lange versie — voor keukens en woonkamers waar je meer dekking wilt.",
    url: "/product/senseglow_wave?size=50",
  },
  ambientSingle: {
    title: "SenseGlow Ambient Motion Bar™ 30cm",
    copy: "Voor jou: de SenseGlow Ambient Motion Bar™ 30cm. De maat die 9 van de 10 klanten kiezen. Begin met één — hij is verslavend.",
    url: "/product/senseglow_ambient_motion_bar?size=30",
  },
  ambient3: {
    title: "SenseGlow Ambient Motion Bar™ 30cm — 3-pack",
    copy: "Voor jou: de SenseGlow Ambient Motion Bar™ 30cm — 3-pack. Voor gang, slaapkamer en badkamer. 12% korting tov los.",
    url: "/product/senseglow_ambient_motion_bar?size=30&bundle=3",
  },
  ambient4: {
    title: "SenseGlow Ambient Motion Bar™ 30cm — 4-pack",
    copy: "Voor jou: de SenseGlow Ambient Motion Bar™ 30cm — 4-pack. Voor het hele huis. 15% korting tov los.",
    url: "/product/senseglow_ambient_motion_bar?size=30&bundle=4",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const Quiz = () => {
  const navigate = useNavigate();
  const [stack, setStack] = useState<StepId[]>(["Q1"]);
  const [resultKey, setResultKey] = useState<ResultKey | null>(null);

  const currentStep = steps[stack[stack.length - 1]];
  const stepNumber = stack.length;
  const totalSteps = 3;

  const handleChoose = (opt: Option) => {
    if (opt.result) {
      setResultKey(opt.result);
    } else if (opt.next) {
      setStack([...stack, opt.next]);
    }
  };

  const handleBack = () => {
    if (resultKey) {
      setResultKey(null);
    } else if (stack.length > 1) {
      setStack(stack.slice(0, -1));
    }
  };

  const reset = () => {
    setStack(["Q1"]);
    setResultKey(null);
  };

  // ─── Result screen ─────────────────────────────────────────────────────────
  if (resultKey) {
    const r = results[resultKey];

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
            <div className="text-center mb-10 animate-fade-in-slow">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
                Jouw match
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {r.title}
              </h1>
            </div>

            <Card className="p-8 border border-glow/30 bg-background animate-fade-in-slow">
              <p className="text-base text-foreground/70 leading-relaxed mb-8">
                {r.copy}
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate(r.url)}
                  size="lg"
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
                >
                  Bekijk dit product
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Opnieuw beginnen
                </Button>
              </div>
            </Card>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/producten")}
                className="text-sm text-foreground/60 hover:text-glow underline-offset-4 hover:underline transition-colors"
              >
                Niet de juiste match? Bekijk alle producten →
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ─── Question screen ───────────────────────────────────────────────────────
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
          {/* Progress */}
          <div className="mb-10">
            <div className="flex gap-2 mb-3">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                    idx < stepNumber ? "bg-glow" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-foreground/50 tracking-wide">
              Vraag {Math.min(stepNumber, totalSteps)} van {totalSteps}
            </p>
          </div>

          <div key={currentStep.id} className="animate-fade-in-slow">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground leading-tight">
              {currentStep.question}
            </h1>

            <div className="grid gap-3">
              {currentStep.options.map((option) => (
                <Card
                  key={option.label}
                  onClick={() => handleChoose(option)}
                  className="p-6 cursor-pointer border border-foreground/10 hover:border-glow hover:bg-glow/5 hover:-translate-y-0.5 transition-all duration-300 min-h-[64px] flex items-center"
                >
                  <p className="text-base font-medium text-foreground">{option.label}</p>
                </Card>
              ))}
            </div>

            {stack.length > 1 && (
              <button
                onClick={handleBack}
                className="mt-8 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-glow transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Vorige vraag
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Quiz;
