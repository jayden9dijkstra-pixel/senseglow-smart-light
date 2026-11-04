import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { REVIEWS, SHOW_GOOGLE_REVIEWS_LINK, GOOGLE_REVIEWS_LINK_URL, reviewsFor, type Review } from "@/data/reviews";

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

/** 'Wat klanten zeggen'. Zonder echte reviews in src/data/reviews.ts rendert dit niets. */
export function CustomerReviews({ handle, reviews = REVIEWS, className = "" }: { handle?: string; reviews?: Review[]; className?: string }) {
  const list = reviewsFor(handle, reviews);
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="klanten-zeggen" className={`space-y-4 ${className}`}>
      <h2 id="klanten-zeggen" className="text-2xl font-semibold text-foreground">Wat klanten zeggen</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((r) => (
          <li key={`${r.name}-${r.date}-${r.product}`} className="space-y-2 rounded-2xl border border-foreground/10 p-4">
            <span className="flex" aria-label={`${r.stars} van 5 sterren`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} aria-hidden className={`h-5 w-5 ${i <= r.stars ? "fill-primary text-primary" : "text-foreground/30"}`} />
              ))}
            </span>
            <p className="text-base text-foreground">{r.text}</p>
            {r.photo && <img src={r.photo} alt={`Foto van ${r.name}`} className="max-h-60 rounded-xl object-cover" loading="lazy" />}
            <p className="text-base text-foreground/80">
              <span className="font-semibold text-foreground">{r.name}</span> · {dateLabel(r.date)} · {r.label}
            </p>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap gap-x-6 gap-y-2 text-base">
        <Link to="/reviews-beleid" className="text-primary underline underline-offset-4">Hoe wij reviews verzamelen</Link>
        {SHOW_GOOGLE_REVIEWS_LINK && GOOGLE_REVIEWS_LINK_URL && (
          <a href={GOOGLE_REVIEWS_LINK_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Bekijk onze Google-reviews</a>
        )}
      </p>
    </section>
  );
}
