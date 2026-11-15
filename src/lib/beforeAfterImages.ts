/**
 * Voor-en-na beelden per product: dezelfde ruimte met de lamp uit en aan.
 */
import ambientOff from "@/assets/ba/ambient-off.jpg";
import ambientOn from "@/assets/ba/ambient-on.jpg";
import waveOff from "@/assets/ba/wave-off.jpg";
import waveOn from "@/assets/ba/wave-on.jpg";
import flexOff from "@/assets/ba/flex-off.jpg";
import flexOn from "@/assets/ba/flex-on.jpg";
import lanternOff from "@/assets/ba/lantern-off.jpg";
import lanternOn from "@/assets/ba/lantern-on.jpg";

export interface BeforeAfterPair {
  off: string;
  on: string;
  alt: string;
}

// Realistische trapfoto's (15 nov 2026), zelfde scène met lampen uit en aan; gehost in Shopify Files.
const SHOPIFY_FILES = "https://cdn.shopify.com/s/files/1/0964/9497/7322/files";
const wallOff = `${SHOPIFY_FILES}/senseglow-wall-lamp-trap-uit.png?width=1200`;
const wallOn = `${SHOPIFY_FILES}/senseglow-wall-lamp-trap-aan.png?width=1200`;

const PAIRS: Record<string, BeforeAfterPair> = {
  senseglow_ambient_motion_bar: {
    off: ambientOff,
    on: ambientOn,
    alt: "SenseGlow Ambient Motion Bar met de lamp uit en aan",
  },
  senseglow_wave: {
    off: waveOff,
    on: waveOn,
    alt: "SenseGlow Wave in de keuken met de lamp uit en aan",
  },
  senseglow_wall_lamp: {
    off: wallOff,
    on: wallOn,
    alt: "SenseGlow Wall Lamp op de trap met de lampen uit en aan",
  },
  senseglow_flex: {
    off: flexOff,
    on: flexOn,
    alt: "SenseGlow Flex boven het bureau met de lamp uit en aan",
  },
  senseglow_solar_lantern: {
    off: lanternOff,
    on: lanternOn,
    alt: "SenseGlow Solar Lantern aan de gevel met de lamp uit en aan",
  },
};

export const getBeforeAfterPair = (handle: string): BeforeAfterPair | undefined => PAIRS[handle];
