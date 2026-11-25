import { SGMonogram } from "@/components/brand/SGMonogram";

/** Enige toegestane logo: het SG-monogram. De oude tegelversie bestaat niet meer. */
export function BrandLogo({ className = "h-9 w-auto", inverted = false }: { className?: string; inverted?: boolean }) {
  return <SGMonogram className={className} inverted={inverted} />;
}
