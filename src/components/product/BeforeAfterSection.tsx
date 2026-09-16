import { X, Check } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import type { BeforeAfterPair } from "@/lib/beforeAfterImages";

interface BeforeAfterRow {
  before: string;
  after: string;
}

interface BeforeAfterSectionProps {
  headline?: string;
  beforeLabel?: string;
  afterLabel?: string;
  rows?: BeforeAfterRow[];
  imagePair?: BeforeAfterPair;
}

const defaultRows: BeforeAfterRow[] = [
  { before: "Lichtknopje zoeken in het donker", after: "Licht gaat automatisch aan" },
  { before: "Partner wordt wakker door fel licht", after: "Iedereen blijft slapen" },
  { before: "Boren, kabels trekken", after: "Magneet erop, klaar" },
];

export const BeforeAfterSection = ({
  headline = "Voor / Na",
  beforeLabel = "Zonder SenseGlow",
  afterLabel = "Met SenseGlow",
  rows = defaultRows,
  imagePair,
}: BeforeAfterSectionProps) => {
  return (
    <section className="w-full overflow-hidden bg-background-secondary py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Het verschil</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground">
              {headline}
            </h2>
          </div>

          {imagePair && (
            <div className="mb-10 md:mb-14">
              <BeforeAfterSlider
                beforeSrc={imagePair.off}
                afterSrc={imagePair.on}
                alt={imagePair.alt}
                className="aspect-[4/3] md:aspect-[16/10]"
              />
              <p className="mt-3 text-center text-xs text-foreground/50">
                Sleep de schuif om het verschil te zien
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Before column */}
            <div className="rounded-sm border border-border bg-background p-6 md:p-8">
              <h3 className="text-sm font-medium text-foreground/60 mb-5 uppercase tracking-wider">
                {beforeLabel}
              </h3>
              <ul className="space-y-4">
                {rows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="w-4 h-4 mt-1 text-foreground/30 flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground/70 leading-relaxed">
                      {row.before}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After column */}
            <div className="rounded-sm border border-accent/40 bg-accent/5 p-6 md:p-8">
              <h3 className="text-sm font-medium text-accent mb-5 uppercase tracking-wider">
                {afterLabel}
              </h3>
              <ul className="space-y-4">
                {rows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground leading-relaxed">
                      {row.after}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
