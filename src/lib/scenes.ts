/**
 * Scènefoto's per landingspagina, vastgelegd op de Shopify alt-tekst.
 * Een landingspagina linkt door met ?scene=..., zodat de productpagina
 * dezelfde foto als eerste toont als de advertentie en de landingspagina.
 */
import { PRODUCT_HANDLE, STEP_PRODUCT_HANDLE, LANTERN_PRODUCT_HANDLE } from "./productConfig";

export type Scene = "trap" | "gang" | "kast" | "keuken" | "buiten";

export const SCENE_ALTS: Record<Scene, Record<string, string>> = {
  trap: {
    [STEP_PRODUCT_HANDLE]: "SenseGlow Wall Lamp zwart langs de trap",
    [PRODUCT_HANDLE]: "SenseGlow Ambient Motion Bar zwart aan de muur boven de trap, licht op de traptreden",
  },
  gang: { [PRODUCT_HANDLE]: "SenseGlow Ambient Motion Bar zwart in de gang, licht op de vloer" },
  kast: { [PRODUCT_HANDLE]: "SenseGlow Ambient Motion Bar zilver in de kledingkast" },
  keuken: { [PRODUCT_HANDLE]: "SenseGlow Ambient Motion Bar zilver onder keukenkastje" },
  buiten: { [LANTERN_PRODUCT_HANDLE]: "SenseGlow Solar Lantern zwart brandt bij schemering" },
};

export const isScene = (s: string | null | undefined): s is Scene => !!s && s in SCENE_ALTS;

/** Alt-tekst van de scènefoto voor dit product, of null. */
export const sceneAlt = (scene: string | null | undefined, handle: string): string | null =>
  isScene(scene) ? SCENE_ALTS[scene][handle] ?? null : null;

const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

/** Zet de foto met deze alt-tekst vooraan; zonder treffer blijft de volgorde gelijk. */
export function withSceneFirst<T extends { altText: string | null }>(images: T[], alt: string | null): T[] {
  if (!alt) return images;
  const i = images.findIndex((img) => norm(img.altText) === norm(alt));
  if (i <= 0) return images;
  return [images[i], ...images.slice(0, i), ...images.slice(i + 1)];
}
