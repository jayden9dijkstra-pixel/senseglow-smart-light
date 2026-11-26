import { setUnitPrice } from "@/lib/setUnitPrice";
import { formatPrice } from "@/lib/price";

export function SetUnitPrice({ price, lamps }: { price: number | null; lamps: number }) {
  const unit = setUnitPrice(price, lamps);
  if (unit == null) return null;
  return <p className="text-sm text-muted-foreground" aria-live="polite">{formatPrice(unit)} per lamp · oplaadbaar, nooit meer batterijen</p>;
}