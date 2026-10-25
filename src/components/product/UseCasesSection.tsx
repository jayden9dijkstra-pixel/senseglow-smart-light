import { MapPin } from "lucide-react";
import { USE_CASES, USE_CASE_HEADING } from "@/lib/angles";

/** 'Waar gebruik je hem?': alle toepassingen, één zin per toepassing. */
export function UseCasesSection({ handle }: { handle: string }) {
  const items = USE_CASES[handle];
  if (!items?.length) return null;
  return (
    <section className="w-full overflow-hidden bg-background py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <h2 className="mb-8 text-2xl md:text-3xl font-bold text-foreground">{USE_CASE_HEADING}</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((line) => {
            const [place, ...rest] = line.split(": ");
            return (
              <li key={line} className="flex gap-3 rounded-2xl border border-foreground/10 p-5">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="text-base leading-relaxed text-foreground/80">
                  <span className="font-semibold text-foreground">{place}</span>
                  {rest.length ? `: ${rest.join(": ")}` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
