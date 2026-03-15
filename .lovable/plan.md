

## Plan: Apple-Inspired Glassmorphism + Verbeterde Kleurbalans

### Concept

**Light mode** wordt een glasachtige, lumineuze ervaring — denk Apple.com: zuiver wit met subtiele transparantie, frosted glass cards, en warme amber gloed als accent. 

**Dark mode** gaat van #161616 (te donker) naar een lichter grijs (~#1C1C1E / #2C2C2E richting) zodat de amber lamp-gloed in foto's beter contrasteert en de site minder "zwart gat" aanvoelt.

### Kleurwijzigingen

**Light mode (nieuw — glasachtig wit):**
| Token | Oud | Nieuw | Doel |
|---|---|---|---|
| `--background` | `100 5% 89%` (#E2E4E1 grijs) | `0 0% 99%` (#FCFCFC puur wit) | Apple-clean basis |
| `--background-secondary` | `100 5% 87%` | `0 0% 96%` (#F5F5F7 Apple grijs) | Subtiele sectie-afwisseling |
| `--card` | zelfde als bg | `0 0% 100% / 0.7` | Frosted glass effect |
| `--secondary` | `100 5% 85%` | `0 0% 96%` | Lichtere secondary |
| `--muted` | `100 5% 82%` | `0 0% 94%` | Zachter muted |
| `--border` | `0 0% 17% / 0.15` | `0 0% 0% / 0.06` | Subtielere borders (Apple-stijl) |

**Dark mode (nieuw — lichter grijs):**
| Token | Oud | Nieuw | Doel |
|---|---|---|---|
| `--background` | `0 0% 9%` (#161616) | `0 0% 14%` (~#242424) | Lichter zodat gloed opvalt |
| `--background-secondary` | `0 0% 11%` | `0 0% 17%` (~#2C2C2C) | Meer contrast tussen secties |
| `--card` | `0 0% 9%` | `0 0% 16%` | Cards zichtbaarder |
| `--secondary` | `0 0% 13%` | `0 0% 19%` | Verhoogd |
| `--muted` | `0 0% 15%` | `0 0% 21%` | Verhoogd |

### Glassmorphism CSS

Nieuwe utility classes toevoegen in `index.css`:

```css
.glass {
  background: hsl(var(--card));
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid hsl(var(--border));
}

.glass-strong {
  background: hsl(0 0% 100% / 0.85);
  backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid hsl(0 0% 100% / 0.3);
}

.dark .glass-strong {
  background: hsl(0 0% 100% / 0.05);
  border: 1px solid hsl(0 0% 100% / 0.08);
}
```

### Amber Glow Versterking

De `--glow` variabelen krijgen meer zichtbaarheid in dark mode met een lichtere amber:
- Dark mode `--glow-light`: van `33 52% 70%` naar `33 60% 75%` (meer zichtbaar op lichter grijs)

### Componenten die Glass krijgen

- **SiteHeader** — `backdrop-filter: blur(20px)` met semi-transparante achtergrond
- **ProductCard** — glass card met subtiele border
- **BundlesSection cards** — frosted glass effect
- **CartDrawer** — glass panel

### Bestanden

| Bestand | Wijziging |
|---|---|
| `src/index.css` | Alle CSS variabelen updaten + glass utilities toevoegen |
| `src/components/layout/SiteHeader.tsx` | Glass header met backdrop-blur |
| `src/components/ProductCard.tsx` | Glass card styling |
| `src/components/CartDrawer.tsx` | Glass panel |
| `src/components/product/BundlesSection.tsx` | Glass cards |
| `tailwind.config.ts` | Glass-gerelateerde kleuren/utilities indien nodig |

