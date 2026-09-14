import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PACK_OPTIONS } from "@/lib/bundleBuilder";

export function HomeBundlesSection() {
  return (
    <section className="w-full bg-background-secondary py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/40">
            Slim combineren
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">Meer sfeer, minder betalen</h2>
          <p className="mt-4 text-base text-foreground/60 md:text-lg">
            Stel je eigen bundel samen en kies per lamp de maat en kleur die je wilt. Hoe meer lampen, hoe hoger je korting.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PACK_OPTIONS.map((option) => (
            <div
              key={option.size}
              className="rounded-[10px] border border-foreground/10 bg-background p-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                -{Math.round(option.rate * 100)}%
              </span>
              <p className="mt-4 text-2xl font-bold text-foreground">{option.title}</p>
              <p className="mt-2 text-sm text-foreground/60">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            asChild
            className="h-12 rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/stel-je-bundel-samen">
              Stel je eigen bundel samen <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
