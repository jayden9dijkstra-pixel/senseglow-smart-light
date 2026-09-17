# Plan: Verwissel twee homepage-afbeeldingen

## Doel
Op de homepage staan twee tekstblokken met naast zich een afbeelding:
1. **Achter SenseGlow** — "Een huis hoort veilig en warm te voelen" (StorytellingSection)
2. **Lichtadvies** — "Niet zeker welk product?" (QuizIntroSection)

De huidige afbeeldingen (een sfeerfoto en een telefoon-mockup) worden vervangen door de twee zojuist aangeleverde sfeerfoto's van de Ambient-lichtbalk. Alle tekst, vertalingen, knoppen en links blijven ongewijzigd.

## Aanlevering
- `ambient_square_07.png` — vierkant (1024×1024), keuken met onderkast-verlichting
- `ambient_landscape_02.png` — liggend (1920×1072), badkamer met spiegelkast-verlichting

## Toewijzing
- **StorytellingSection** ← vierkante keukenfoto (`ambient_square_07.png`). Het blok heeft al een `aspect-square`-kader, dus de vierkante foto past zonder lay-outwijziging.
- **QuizIntroSection** ← liggende badkamerfoto (`ambient_landscape_02.png`). Het huidige kader is een smalle staande telefoon-foto (`max-w-xs`); dat wordt een liggend kader (afgerond, `aspect-[16/9]`, `object-cover`) zodat de foto er netjes uitziet.

## Uitvoering
1. **CDN-asset-pointers maken** voor beide uploads met `lovable-assets create` (geen binaire bestanden in de repo):
   - `src/assets/ambient-storytelling.jpg` (van `ambient_square_07.png`)
   - `src/assets/ambient-quiz.jpg` (van `ambient_landscape_02.png`)
2. **`src/components/homepage/StorytellingSection.tsx`** — vervang de `storytellingImage`-import door de pointer van de vierkante keukenfoto; behoud het `aspect-square`-kader en `object-cover`; pas de `alt`-tekst aan (bijv. "SenseGlow lichtbalk onder keukenkasten").
3. **`src/components/homepage/QuizIntroSection.tsx`** — vervang de `quizSmartphone`/`srcSet`-imports door de pointer van de liggende badkamerfoto; wijzig het kader van `max-w-xs` (staand) naar een afgerond `aspect-[16/9]`-kader met `object-cover`; pas de `alt`-tekst aan (bijv. "SenseGlow lichtbalk onder spiegelkast in badkamer"). Behoud de rechterkolom-tekst en de knop "Start mijn lichtadvies" exact.
4. **Vertalingen**: de `alt`-teksten zijn puur beschrijvend; geen i18n-sleutels nodig (huidige alt-teksten staan ook inline).
5. **Typecheck + build** (`bunx tsgo --noEmit && bun run build`).
6. **Browsercontrole** (Playwright, desktop + mobiel 390px): beide blokken laden zonder lay-outbreuk, geen console-fouten, afbeeldingen scherp en passend.

## Wat niet verandert
- Alle tekst, koppen, knoppen, links, vertalingen, paginaroute, styling-tokens en de rest van de homepage.
- De quiz-zelf (`/quiz`) blijft ongewijzigd; alleen de intro-afbeelding op de homepage wisselt.

## Risico / controle
- De liggende foto in het QuizIntro-blok krijgt minder verticale ruimte dan de oude staande telefoonfoto; op mobiel blijft het een kolom boven de tekst — visueel gecontroleerd in de browsercontrole.
