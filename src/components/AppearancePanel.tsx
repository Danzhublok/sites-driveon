import { useEffect, useState } from "react";
import { Moon, Sun, SlidersHorizontal, X } from "lucide-react";
import {
  ACCENTS,
  FONT_SETS,
  RADII,
  DEFAULT_APPEARANCE,
  applyAppearance,
  loadAppearance,
  saveAppearance,
  type Appearance,
} from "@/lib/appearance";

export function AppearancePanel() {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initial = loadAppearance();
    setAppearance(initial);
    applyAppearance(initial);
  }, []);

  const update = (patch: Partial<Appearance>) => {
    const next = { ...appearance, ...patch };
    setAppearance(next);
    applyAppearance(next);
    saveAppearance(next);
  };

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );

  const chip = (active: boolean) =>
    `border px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
      active ? "border-foreground bg-foreground text-background" : "border-input hover:bg-accent"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => update({ mode: appearance.mode === "dark" ? "light" : "dark" })}
        aria-label="Alternar tema"
        className="inline-flex size-10 shrink-0 items-center justify-center border border-input transition-colors hover:bg-accent"
      >
        {appearance.mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Personalizar aparência"
        className="inline-flex size-10 shrink-0 items-center justify-center border border-input transition-colors hover:bg-accent"
      >
        <SlidersHorizontal className="size-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <aside className="relative z-10 flex h-full w-full max-w-sm flex-col gap-7 overflow-y-auto border-l border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Aparência</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar painel"
                className="inline-flex size-9 items-center justify-center border border-input hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>

            <Row label="Modo">
              {(["light", "dark"] as const).map((m) => (
                <button key={m} type="button" onClick={() => update({ mode: m })} className={chip(appearance.mode === m)}>
                  {m === "light" ? "Claro" : "Escuro"}
                </button>
              ))}
            </Row>

            <Row label="Cor de destaque">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => update({ accent: a.id })}
                  aria-label={a.label}
                  className={`size-9 border-2 transition-transform ${
                    appearance.accent === a.id ? "border-foreground scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: a.color }}
                />
              ))}
            </Row>

            <Row label="Tipografia">
              {FONT_SETS.map((f) => (
                <button key={f.id} type="button" onClick={() => update({ fonts: f.id })} className={chip(appearance.fonts === f.id)}>
                  {f.label}
                </button>
              ))}
            </Row>

            <Row label="Cantos">
              {RADII.map((r) => (
                <button key={r.id} type="button" onClick={() => update({ radius: r.id })} className={chip(appearance.radius === r.id)}>
                  {r.label}
                </button>
              ))}
            </Row>

            <button
              type="button"
              onClick={() => update(DEFAULT_APPEARANCE)}
              className="mt-auto border border-input px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-accent"
            >
              Restaurar padrão
            </button>
          </aside>
        </div>
      ) : null}
    </>
  );
}
