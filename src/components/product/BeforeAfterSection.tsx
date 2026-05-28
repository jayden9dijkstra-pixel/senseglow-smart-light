import { X, Check } from "lucide-react";

interface BeforeAfterRow {
  before: string;
  after: string;
}

interface BeforeAfterSectionProps {
  headline?: string;
  beforeLabel?: string;
  afterLabel?: string;
  rows?: BeforeAfterRow[];
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
}: BeforeAfterSectionProps) => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
              Het verschil
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Before column */}
            <div className="rounded-2xl border border-foreground/8 bg-background-secondary/40 p-6 md:p-8">
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
            <div className="rounded-2xl border border-glow/30 bg-glow/5 p-6 md:p-8 shadow-[0_0_40px_-15px_hsl(var(--glow)/0.4)]">
              <h3 className="text-sm font-medium text-glow mb-5 uppercase tracking-wider">
                {afterLabel}
              </h3>
              <ul className="space-y-4">
                {rows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-1 text-glow flex-shrink-0" />
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
