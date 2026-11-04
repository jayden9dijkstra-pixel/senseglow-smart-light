import { BatteryCharging, Hand, Magnet, Activity, Sun, StickyNote, Wrench } from "lucide-react";
import { howItWorksFor, type StepIcon } from "@/lib/howItWorks";

const ICONS: Record<StepIcon, typeof Sun> = {
  stick: StickyNote,
  usb: BatteryCharging,
  motion: Activity,
  touch: Hand,
  sun: Sun,
  screw: Wrench,
  magnet: Magnet,
};

/** 'Zo werkt het' in 3 stappen, per product. */
export function HowItWorksSteps({ handle }: { handle: string }) {
  const steps = howItWorksFor(handle);
  if (!steps) return null;
  return (
    <section aria-labelledby={`how-${handle}`} className="space-y-3">
      <h2 id={`how-${handle}`} className="text-xl font-semibold text-foreground">Zo werkt het</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <li key={s.title} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-base font-medium text-foreground">
                <span className="sr-only">Stap {i + 1}: </span>
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
