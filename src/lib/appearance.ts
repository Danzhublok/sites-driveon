export type Appearance = {
  mode: "light" | "dark";
  accent: string;
  fonts: string;
  radius: string;
};

export const ACCENTS: { id: string; label: string; color: string; foreground: string }[] = [
  { id: "ink", label: "Tinta", color: "#1a1a1a", foreground: "#f7f5f0" },
  { id: "ember", label: "Ember", color: "#e85d3a", foreground: "#ffffff" },
  { id: "emerald", label: "Esmeralda", color: "#0d7a5f", foreground: "#ffffff" },
  { id: "navy", label: "Navy", color: "#1e3a5f", foreground: "#ffffff" },
  { id: "gold", label: "Ouro", color: "#c9a84c", foreground: "#141414" },
];

export const FONT_SETS: { id: string; label: string; display: string; sans: string }[] = [
  { id: "bebas", label: "Bebas / Barlow", display: '"Bebas Neue"', sans: '"Barlow"' },
  { id: "grotesk", label: "Space Grotesk / DM Sans", display: '"Space Grotesk"', sans: '"DM Sans"' },
  { id: "sora", label: "Sora / Manrope", display: '"Sora"', sans: '"Manrope"' },
];

export const RADII: { id: string; label: string; value: string }[] = [
  { id: "sharp", label: "Reto", value: "0rem" },
  { id: "soft", label: "Suave", value: "0.25rem" },
  { id: "round", label: "Arredondado", value: "0.875rem" },
];

export const DEFAULT_APPEARANCE: Appearance = { mode: "light", accent: "ink", fonts: "bebas", radius: "soft" };

const KEY = "driveon-appearance";
const FALLBACK_DISPLAY = "ui-sans-serif, system-ui, sans-serif";

export function loadAppearance(): Appearance {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const legacy = window.localStorage.getItem("driveon-theme");
      return legacy === "dark" ? { ...DEFAULT_APPEARANCE, mode: "dark" } : DEFAULT_APPEARANCE;
    }
    return { ...DEFAULT_APPEARANCE, ...(JSON.parse(raw) as Partial<Appearance>) };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function saveAppearance(a: Appearance) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* ignore */
  }
}

export function applyAppearance(a: Appearance) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", a.mode === "dark");

  const accent = ACCENTS.find((x) => x.id === a.accent) ?? ACCENTS[0]!;
  const fonts = FONT_SETS.find((x) => x.id === a.fonts) ?? FONT_SETS[0]!;
  const radius = RADII.find((x) => x.id === a.radius) ?? RADII[1]!;

  if (a.accent === "ink") {
    root.style.removeProperty("--brand");
    root.style.removeProperty("--brand-foreground");
    root.style.removeProperty("--highlight");
    root.style.removeProperty("--highlight-foreground");
  } else {
    root.style.setProperty("--brand", accent.color);
    root.style.setProperty("--brand-foreground", accent.foreground);
    root.style.setProperty("--highlight", accent.color);
    root.style.setProperty("--highlight-foreground", accent.foreground);
  }

  root.style.setProperty("--font-display-family", `${fonts.display}, ${FALLBACK_DISPLAY}`);
  root.style.setProperty("--font-sans-family", `${fonts.sans}, ${FALLBACK_DISPLAY}`);
  root.style.setProperty("--radius", radius.value);
}
