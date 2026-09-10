import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-lifestyle.png?w=1920&format=webp";
import heroImageSrcSet from "@/assets/hero-lifestyle.png?w=768;1280;1920&format=webp&as=srcset";

export const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate("/producten");
  };

  return (
    <section className="relative isolate overflow-hidden hero-gradient">
      {/* Lifestyle achtergrond, subtiel */}
      <img
        src={heroImage}
        srcSet={heroImageSrcSet}
        sizes="100vw"
        alt="Warme sensorverlichting die aangaat in een donkere hal"
        loading="eager"
        {...{ fetchpriority: "high" }}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 hero-gradient-overlay" />

      <div className="container">
        <div className="max-w-3xl py-28 md:py-40 animate-fade-in-slow">
          <p className="text-[11px] uppercase tracking-[0.3em] text-hero-foreground/50 font-medium mb-6">
            SenseGlow, draadloze sensorverlichting
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-hero-foreground">
            Licht dat aangaat wanneer jij binnenkomt.
          </h1>

          <p className="mt-6 text-base md:text-lg leading-relaxed text-hero-foreground/70 max-w-xl">
            Draadloze sensor-verlichting voor kast, hal, tuin en werkplek. Geplaatst binnen 60 seconden, zonder boren of stopcontact.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <Button
              onClick={scrollToProducts}
              size="lg"
              className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.5)] transition-all duration-500 w-full sm:w-auto"
            >
              Bekijk de collectie
            </Button>

            <button
              onClick={() => navigate("/waarom-senseglow")}
              className="text-sm text-hero-foreground/80 underline underline-offset-4 hover:text-hero-foreground transition-colors duration-300 self-start sm:self-auto"
            >
              Waarom SenseGlow
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
