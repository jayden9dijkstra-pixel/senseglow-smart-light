import { useEffect, useMemo, useState } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface VariantPickerProps {
  product: ShopifyProduct;
  selectedVariant: ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null;
  onVariantChange: (variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]) => void;
}

export const VariantPicker = ({
  product,
  selectedVariant,
  onVariantChange,
}: VariantPickerProps) => {
  // Extract unique sizes and colors from variants
  // Handle both standard options (maat/size, kleur/color) and combined option values like "Silver-20cm TYPE-C"
  const { sizes, colors, variantMap } = useMemo(() => {
    const sizesSet = new Set<string>();
    const colorsSet = new Set<string>();
    const map = new Map<string, ShopifyProduct["node"]["variants"]["edges"][0]["node"]>();

    // Helper to parse combined option value like "Silver-20cm TYPE-C"
    const parseOptionValue = (value: string): { color: string; size: string } => {
      // Pattern: "Color-SizeCm TYPE-C" (e.g., "Silver-20cm TYPE-C", "Black-40cm TYPE-C")
      const colorSizeMatch = value.match(/^(Silver|Black|Zwart|Zilver|Wit|Goud)-(\d+)cm/i);
      if (colorSizeMatch) {
        const colorRaw = colorSizeMatch[1].toLowerCase();
        // Normalize color names to Dutch
        const colorMap: Record<string, string> = {
          'silver': 'Zilver',
          'black': 'Zwart',
          'zilver': 'Zilver',
          'zwart': 'Zwart',
          'wit': 'Wit',
          'goud': 'Goud',
        };
        return {
          color: colorMap[colorRaw] || colorSizeMatch[1],
          size: `${colorSizeMatch[2]}cm`,
        };
      }
      return { color: '', size: '' };
    };

    product.node.variants.edges.forEach((variant) => {
      let size = "";
      let color = "";

      variant.node.selectedOptions.forEach((option) => {
        const name = option.name.toLowerCase();
        const value = option.value;
        
        // Check for standard option names
        if (name === "maat" || name === "size" || name === "lengte") {
          size = value;
          sizesSet.add(value);
        } else if (name === "kleur" || name === "color" || name === "colour") {
          // Only add if it's a valid color (not a lamp type like "3 colors in one")
          if (!value.toLowerCase().includes("colors in one") && !value.toLowerCase().includes("lamp")) {
            color = value;
            colorsSet.add(value);
          }
        } else {
          // Try to parse combined option values like "Silver-20cm TYPE-C"
          const parsed = parseOptionValue(value);
          if (parsed.size && !size) {
            size = parsed.size;
            sizesSet.add(parsed.size);
          }
          if (parsed.color && !color) {
            color = parsed.color;
            colorsSet.add(parsed.color);
          }
        }
      });

      // Create a key for size-color combination
      const key = `${size}|${color}`;
      map.set(key, variant.node);
    });

    // Sort sizes by the numeric value
    const sortedSizes = Array.from(sizesSet).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.replace(/\D/g, "")) || 0;
      return numA - numB;
    });

    return {
      sizes: sortedSizes,
      colors: Array.from(colorsSet),
      variantMap: map,
    };
  }, [product]);

  // Helper to parse combined option value (same as in useMemo)
  const parseOptionValue = (value: string): { color: string; size: string } => {
    const colorSizeMatch = value.match(/^(Silver|Black|Zwart|Zilver|Wit|Goud)-(\d+)cm/i);
    if (colorSizeMatch) {
      const colorRaw = colorSizeMatch[1].toLowerCase();
      const colorMap: Record<string, string> = {
        'silver': 'Zilver',
        'black': 'Zwart',
        'zilver': 'Zilver',
        'zwart': 'Zwart',
        'wit': 'Wit',
        'goud': 'Goud',
      };
      return {
        color: colorMap[colorRaw] || colorSizeMatch[1],
        size: `${colorSizeMatch[2]}cm`,
      };
    }
    return { color: '', size: '' };
  };

  // Get current selected size and color
  const getCurrentSelection = () => {
    let currentSize = sizes[1] || sizes[0] || ""; // Default to 30cm (middle) if available
    let currentColor = colors[0] || "";

    if (selectedVariant) {
      selectedVariant.selectedOptions.forEach((option) => {
        const name = option.name.toLowerCase();
        const value = option.value;
        
        if (name === "maat" || name === "size" || name === "lengte") {
          currentSize = value;
        } else if (name === "kleur" || name === "color" || name === "colour") {
          currentColor = value;
        } else {
          // Try to parse combined option values
          const parsed = parseOptionValue(value);
          if (parsed.size) currentSize = parsed.size;
          if (parsed.color) currentColor = parsed.color;
        }
      });
    }

    return { currentSize, currentColor };
  };

  const { currentSize, currentColor } = getCurrentSelection();
  const [selectedSize, setSelectedSize] = useState(currentSize);
  const [selectedColor, setSelectedColor] = useState(currentColor);

  // Update local state when prop changes
  useEffect(() => {
    const { currentSize, currentColor } = getCurrentSelection();
    setSelectedSize(currentSize);
    setSelectedColor(currentColor);
  }, [selectedVariant]);

  // Find and select the variant based on size and color
  const selectVariant = (size: string, color: string) => {
    const key = `${size}|${color}`;
    const variant = variantMap.get(key);
    
    if (variant) {
      onVariantChange(variant);
    } else {
      // Fallback: find any variant with the matching size
      const fallbackKey = Array.from(variantMap.keys()).find((k) => k.startsWith(`${size}|`));
      if (fallbackKey) {
        const fallbackVariant = variantMap.get(fallbackKey);
        if (fallbackVariant) {
          onVariantChange(fallbackVariant);
          // Update color to match fallback
          const newColor = fallbackKey.split("|")[1];
          setSelectedColor(newColor);
        }
      }
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    selectVariant(size, selectedColor);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    selectVariant(selectedSize, color);
  };

  // Get color value for swatch
  const getColorValue = (colorName: string): string => {
    const name = colorName.toLowerCase();
    if (name.includes("zwart") || name.includes("black")) return "#1a1a1a";
    if (name.includes("zilver") || name.includes("silver")) return "#c0c0c0";
    if (name.includes("wit") || name.includes("white")) return "#f5f5f5";
    if (name.includes("goud") || name.includes("gold")) return "#d4af37";
    return "#666666";
  };

  // Determine if size is the "most chosen" (30cm)
  const isMostChosen = (size: string): boolean => {
    return size.includes("30");
  };

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground/60 uppercase tracking-[0.2em]">
              Lengte
            </label>
            <span className="text-xs text-foreground/40">
              Kies de lengte die past bij jouw ruimte
            </span>
          </div>

          <div className="flex gap-3">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              const mostChosen = isMostChosen(size);

              return (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={cn(
                    "relative flex-1 py-4 px-3 rounded-lg border transition-all duration-500 ease-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/50",
                    isSelected
                      ? "border-glow bg-glow/5 shadow-[0_0_20px_-5px_hsl(var(--glow)/0.3),inset_0_1px_0_0_hsl(var(--glow)/0.1)]"
                      : "border-foreground/10 bg-background hover:border-foreground/25 hover:bg-foreground/[0.02]"
                  )}
                >
                  {/* Most Chosen Badge */}
                  {mostChosen && (
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
                    {size}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-foreground/60 uppercase tracking-[0.2em]">
              Kleur
            </label>
            <span className="text-xs text-foreground/40 capitalize">
              {selectedColor}
            </span>
          </div>

          <div className="flex gap-4">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              const colorValue = getColorValue(color);
              const isLight = colorValue === "#f5f5f5" || colorValue === "#c0c0c0";

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                  aria-label={`Selecteer kleur ${color}`}
                >
                  {/* Swatch */}
                  <div
                    className={cn(
                      "relative w-10 h-10 rounded-full transition-all duration-500 ease-out",
                      "ring-offset-background ring-offset-2",
                      isSelected
                        ? "ring-2 ring-glow shadow-[0_0_15px_-3px_hsl(var(--glow)/0.5)]"
                        : "ring-1 ring-foreground/20 group-hover:ring-foreground/40"
                    )}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: colorValue }}
                    />
                    {/* Inner highlight for depth */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full",
                        isLight
                          ? "bg-gradient-to-br from-white/40 via-transparent to-black/10"
                          : "bg-gradient-to-br from-white/20 via-transparent to-black/20"
                      )}
                    />
                  </div>

                  {/* Label */}
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
      )}
    </div>
  );
};
