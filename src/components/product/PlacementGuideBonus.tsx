import { BookOpen } from "lucide-react";
import { hasPlacementGuideBonus, PLACEMENT_GUIDE_BONUS, PLACEMENT_GUIDE_PATH } from "@/lib/placementGuide";

export function PlacementGuideBonus({ productHandle }: { productHandle: string }) {
  if (!hasPlacementGuideBonus(productHandle)) return null;
  return (
    <p className="flex items-start gap-2 text-sm text-foreground/80">
      <BookOpen aria-hidden className="mt-0.5 h-4 w-4 flex-none text-primary" />
      <a href={PLACEMENT_GUIDE_PATH} className="underline underline-offset-4 hover:text-foreground">
        {PLACEMENT_GUIDE_BONUS}
      </a>
    </p>
  );
}
