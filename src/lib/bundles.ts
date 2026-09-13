export type BundleDefinition = {
  id: string;
  name: string;
  tagline: string;
  handles: string[];
  rate: number;
  code: string;
  packSize: 2 | 3 | 4;
};

export const BUNDLES: BundleDefinition[] = [
  {
    id: "kast",
    name: "Kast Starter",
    tagline: "Warm licht voor kast en keukenblad.",
    handles: ["senseglow_wave", "senseglow_ambient_motion_bar"],
    rate: 0.1,
    code: "SG-KAST",
    packSize: 2,
  },
  {
    id: "hal",
    name: "Hal Starter",
    tagline: "Rustig licht voor hal, trap en overloop.",
    handles: ["senseglow_ambient_motion_bar", "senseglow_wall_lamp"],
    rate: 0.08,
    code: "SG-HAL",
    packSize: 2,
  },
  {
    id: "wholehome",
    name: "Whole Home",
    tagline: "Alle vijf lampen voor binnen en buiten.",
    handles: [
      "senseglow_wave",
      "senseglow_ambient_motion_bar",
      "senseglow_wall_lamp",
      "senseglow_solar_lantern",
      "senseglow_flex",
    ],
    rate: 0.08,
    code: "SG-WHOLEHOME",
    packSize: 4,
  },
];

export const formatBundlePrice = (value: number) =>
  `€${value.toFixed(2).replace(".", ",")}`;