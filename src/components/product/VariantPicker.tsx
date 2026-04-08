import { useEffect, useMemo, useState } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface VariantPickerProps {
  product: ShopifyProduct;
  selectedVariant: ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null;
  onVariantChange: (variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]) => void;
}

// ─── Parsing helpers ───────────────────────────────────

type ProductType = "standard" | "arc";

interface ParsedDimensions {
  size: string;
  color: string;
  wattage: string;
  lightColor: string;
}

function detectProductType(
  options: Array<{ name: string; value: string }>
): ProductType {
  if (options.some((o) => o.name.toLowerCase() === "uitstraalkleur")) return "arc";
  return "standard";
}

function parseDimensions(
  selectedOptions: Array<{ name: string; value: string }>,
  type: ProductType
): ParsedDimensions {
  const d: ParsedDimensions = { size: "", color: "", wattage: "", lightColor: "" };

  if (type === "arc") {
    for (const opt of selectedOptions) {
      const name = opt.name.toLowerCase();
      const value = opt.value;

      if (name === "uitstraalkleur") {
        const match = value.match(/^(Black|White)\s+(\d+W)/i);
        if (match) {
          d.color = normalizeColor(match[1]);
          d.wattage = match[2];
        }
      } else if (name === "kleur" || name === "color") {
        d.lightColor = value.toLowerCase().includes("warm") ? "Warm licht" : "Koud licht";
      }
    }
    return d;
  }

  // Standard: size + color from various option patterns
  for (const opt of selectedOptions) {
    const name = opt.name.toLowerCase();
    const value = opt.value;

    if (name === "maat" || name === "size" || name === "lengte") {
      d.size = value;
    } else if (name === "kleur" || name === "color" || name === "colour") {
      if (!value.toLowerCase().includes("colors in one") && !value.toLowerCase().includes("lamp")) {
        d.color = normalizeColor(value);
      }
    } else {
      // Parse combined: "Silver 20cm Type-C"
      const colorSizeMatch = value.match(/^(Silver|Black|Zwart|Zilver|Wit|White|Goud|Gold)[\s\-]+(\d+)cm/i);
      if (colorSizeMatch) {
        if (!d.color) d.color = normalizeColor(colorSizeMatch[1]);
        if (!d.size) d.size = `${colorSizeMatch[2]}cm`;
      }
    }
  }
  return d;
}

function normalizeColor(raw: string): string {
  const map: Record<string, string> = {
    silver: "Zilver", black: "Zwart", zilver: "Zilver", zwart: "Zwart",
    wit: "Wit", white: "Wit", goud: "Goud", gold: "Goud",
  };
  return map[raw.toLowerCase()] || raw;
}

function getColorHex(name: string): string {
  const n = name.toLowerCase();
  if (n === "zwart" || n === "black") return "#1a1a1a";
  if (n === "zilver" || n === "silver") return "#c0c0c0";
  if (n === "wit" || n === "white") return "#f5f5f5";
  if (n === "goud" || n === "gold") return "#d4af37";
  return "#666666";
}

// ─── Component ─────────────────────────────────────────

export const VariantPicker = ({
  product,
  selectedVariant,
  onVariantChange,
}: VariantPickerProps) => {
  const productType = useMemo(() => {
    const firstOpts = product.node.variants.edges[0]?.node.selectedOptions || [];
    return detectProductType(firstOpts);
  }, [product]);

  // Build dimension sets + variant map
  const { sizes, colors, wattages, lightColors, variantMap } = useMemo(() => {
    const sizesSet = new Set<string>();
    const colorsSet = new Set<string>();
    const wattagesSet = new Set<string>();
    const lightColorsSet = new Set<string>();
    const map = new Map<string, ShopifyProduct["node"]["variants"]["edges"][0]["node"]>();

    product.node.variants.edges.forEach((variant) => {
      const d = parseDimensions(variant.node.selectedOptions, productType);

      if (d.size) sizesSet.add(d.size);
      if (d.color) colorsSet.add(d.color);
      if (d.wattage) wattagesSet.add(d.wattage);
      if (d.lightColor) lightColorsSet.add(d.lightColor);

      const key =
        productType === "arc"
          ? `${d.wattage}|${d.color}|${d.lightColor}`
          : `${d.size}|${d.color}`;
      map.set(key, variant.node);
    });

    const sortNum = (a: string, b: string) => {
      const na = parseInt(a.replace(/\D/g, "")) || 0;
      const nb = parseInt(b.replace(/\D/g, "")) || 0;
      return na - nb;
    };

    return {
      sizes: Array.from(sizesSet).sort(sortNum),
      colors: Array.from(colorsSet),
      wattages: Array.from(wattagesSet).sort(sortNum),
      lightColors: Array.from(lightColorsSet),
      variantMap: map,
    };
  }, [product, productType]);

  // Current selection state
  const getInitial = () => {
    if (!selectedVariant) {
      if (productType === "arc") {
        return {
          size: "",
          color: colors[0] || "",
          wattage: wattages.length > 2 ? wattages[2] : wattages[0] || "", // default 6W
          lightColor: lightColors[0] || "",
        };
      }
      return {
        size: sizes[1] || sizes[0] || "",
        color: colors[0] || "",
        wattage: "",
        lightColor: "",
      };
    }
    return parseDimensions(selectedVariant.selectedOptions, productType);
  };

  const initial = getInitial();
  const [selectedSize, setSelectedSize] = useState(initial.size);
  const [selectedColor, setSelectedColor] = useState(initial.color);
  const [selectedWattage, setSelectedWattage] = useState(initial.wattage);
  const [selectedLightColor, setSelectedLightColor] = useState(initial.lightColor);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync from prop on first render
  useEffect(() => {
    if (!isInitialized && selectedVariant) {
      const d = parseDimensions(selectedVariant.selectedOptions, productType);
      if (d.size) setSelectedSize(d.size);
      if (d.color) setSelectedColor(d.color);
      if (d.wattage) setSelectedWattage(d.wattage);
      if (d.lightColor) setSelectedLightColor(d.lightColor);
      setIsInitialized(true);
    }
  }, [selectedVariant, isInitialized, productType]);

  // Find variant by key
  const findVariant = (
    size: string,
    color: string,
    wattage: string,
    lightColor: string
  ) => {
    const key =
      productType === "arc"
        ? `${wattage}|${color}|${lightColor}`
        : `${size}|${color}`;
    return variantMap.get(key) || null;
  };

  const trySelect = (
    size: string,
    color: string,
    wattage: string,
    lightColor: string
  ) => {
    let variant = findVariant(size, color, wattage, lightColor);
    if (variant) {
      onVariantChange(variant);
      return true;
    }
    // Try alternative color name
    const altMap: Record<string, string> = {
      Zilver: "Silver", Zwart: "Black", Silver: "Zilver", Black: "Zwart",
      Wit: "White", White: "Wit",
    };
    if (altMap[color]) {
      variant = findVariant(size, altMap[color], wattage, lightColor);
      if (variant) {
        onVariantChange(variant);
        return true;
      }
    }
    return false;
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (!trySelect(size, selectedColor, selectedWattage, selectedLightColor)) {
      // Fallback: find first variant with this size
      const fallback = Array.from(variantMap.entries()).find(([k]) =>
        k.startsWith(`${size}|`)
      );
      if (fallback) {
        const [, v] = fallback;
        const d = parseDimensions(v.selectedOptions, productType);
        setSelectedColor(d.color);
        onVariantChange(v);
      }
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!trySelect(selectedSize, color, selectedWattage, selectedLightColor)) {
      // For Arc: try with current wattage + any available lightColor
      if (productType === "arc") {
        for (const lc of lightColors) {
          if (trySelect("", color, selectedWattage, lc)) {
            setSelectedLightColor(lc);
            return;
          }
        }
        // Try with any available wattage
        for (const w of wattages) {
          if (trySelect("", color, w, selectedLightColor)) {
            setSelectedWattage(w);
            return;
          }
        }
      }
    }
  };

  const handleWattageChange = (wattage: string) => {
    setSelectedWattage(wattage);
    if (!trySelect("", selectedColor, wattage, selectedLightColor)) {
      // Try other color
      for (const c of colors) {
        if (trySelect("", c, wattage, selectedLightColor)) {
          setSelectedColor(c);
          return;
        }
      }
    }
  };

  const handleLightColorChange = (lc: string) => {
    setSelectedLightColor(lc);
    trySelect(selectedSize, selectedColor, selectedWattage, lc);
  };

  // ─── Render helpers ────────────────────────────────────

  const PillPicker = ({
    label,
    hint,
    values,
    selected,
    onChange,
    highlightValue,
  }: {
    label: string;
    hint?: string;
    values: string[];
    selected: string;
    onChange: (v: string) => void;
    highlightValue?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground/60 uppercase tracking-[0.2em]">
          {label}
        </label>
        {hint && <span className="text-xs text-foreground/40">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-3">
        {values.map((v) => {
          const isSelected = selected === v;
          const isHighlight = v === highlightValue;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              className={cn(
                "relative flex-1 min-w-[60px] py-4 px-3 rounded-lg border transition-all duration-500 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/50",
                isSelected
                  ? "border-glow bg-glow/5 shadow-[0_0_20px_-5px_hsl(var(--glow)/0.3),inset_0_1px_0_0_hsl(var(--glow)/0.1)]"
                  : "border-foreground/10 bg-background hover:border-foreground/25 hover:bg-foreground/[0.02]"
              )}
            >
              {isHighlight && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-glow bg-background border border-glow/30 rounded-full whitespace-nowrap">
                  Meest gekozen
                </span>
              )}
              <span
                className={cn(
                  "block text-sm font-medium transition-colors duration-300",
                  isSelected ? "text-foreground" : "text-foreground/70"
                )}
              >
                {v}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const SwatchPicker = ({
    label,
    values,
    selected,
    onChange,
  }: {
    label: string;
    values: string[];
    selected: string;
    onChange: (v: string) => void;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-foreground/60 uppercase tracking-[0.2em]">
          {label}
        </label>
        <span className="text-xs text-foreground/40 capitalize">{selected}</span>
      </div>
      <div className="flex gap-4">
        {values.map((color) => {
          const isSelected = selected === color;
          const hex = getColorHex(color);
          const isLight = hex === "#f5f5f5" || hex === "#c0c0c0";
          return (
            <button
              key={color}
              onClick={() => onChange(color)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
              aria-label={`Selecteer kleur ${color}`}
            >
              <div
                className={cn(
                  "relative w-10 h-10 rounded-full transition-all duration-500 ease-out",
                  "ring-offset-background ring-offset-2",
                  isSelected
                    ? "ring-2 ring-glow shadow-[0_0_15px_-3px_hsl(var(--glow)/0.5)]"
                    : "ring-1 ring-foreground/20 group-hover:ring-foreground/40"
                )}
                style={{ backgroundColor: hex }}
              >
                {isLight && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/10" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider transition-colors duration-300",
                  isSelected ? "text-foreground/80" : "text-foreground/40"
                )}
              >
                {color}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────

  if (productType === "arc") {
    return (
      <div className="space-y-6">
        {wattages.length > 1 && (
          <PillPicker
            label="Vermogen"
            hint="Kies het vermogen dat past bij je ruimte"
            values={wattages}
            selected={selectedWattage}
            onChange={handleWattageChange}
            highlightValue="6W"
          />
        )}
        {colors.length > 1 && (
          <SwatchPicker
            label="Kleur"
            values={colors}
            selected={selectedColor}
            onChange={handleColorChange}
          />
        )}
        {lightColors.length > 1 && (
          <PillPicker
            label="Lichtkleur"
            hint="Warm = sfeervol • Koud = strak"
            values={lightColors}
            selected={selectedLightColor}
            onChange={handleLightColorChange}
          />
        )}
      </div>
    );
  }

  // Standard product (size + color)
  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <PillPicker
          label="Lengte"
          hint="Kies de lengte die past bij jouw ruimte"
          values={sizes}
          selected={selectedSize}
          onChange={handleSizeChange}
          highlightValue={sizes.find((s) => s.includes("30"))}
        />
      )}
      {colors.length > 1 && (
        <SwatchPicker
          label="Kleur"
          values={colors}
          selected={selectedColor}
          onChange={handleColorChange}
        />
      )}
    </div>
  );
};
