import { DualImage } from "@/components/ui/DualImage";
import storytellingImage from "@/assets/storytelling-glow.png";

export const StorytellingSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background-secondary">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Image - Left side */}
            <div className="relative animate-fade-in-slow">
              <div className="aspect-square overflow-hidden rounded-3xl">
                <DualImage
                  srcLight={storytellingImage}
                  alt="SenseGlow LED licht in een warme woonruimte"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content - Right side */}
            <div className="space-y-8 md:text-right animate-fade-in-slow">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                Achter SenseGlow
              </p>

              <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
                Een huis hoort veilig en warm te voelen
              </h2>

              <div className="space-y-5 text-base leading-relaxed text-foreground/60">
                <p>
                  Niet pas nadat je een installateur hebt gebeld. Niet pas na een aannemer of een wand opengebroken voor bekabeling. SenseGlow is gestart vanuit één observatie: de slimste verlichting die online verkocht wordt, komt te zelden in Nederlandse huizen terecht. Te ingewikkeld, slecht vertaald, of simpelweg niet ontworpen voor de markt hier.
                </p>
                <p>
                  Onze rol is niet uitvinden — onze rol is selecteren. We kiezen lampen die in een Nederlands huis werken: zonder elektricien, zonder app-instellingen, zonder gedoe. Vijf producten, elk voor een ander probleem of moment. Geen catalogus van tweehonderd verschillende modellen waar je in verdwaalt.
                </p>
                <p className="text-foreground font-medium">
                  Vanuit Friesland brengen we ze naar jou, met Nederlandse klantenservice en 14 dagen bedenktijd. Veiligheid en sfeer in één lamp — dat is alles wat we doen.
                </p>
                <p className="text-sm text-foreground/50 italic pt-2">
                  — J. Dijkstra, Jayden Ecom
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
