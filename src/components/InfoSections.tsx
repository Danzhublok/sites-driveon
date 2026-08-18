import { BadgeCheck, Landmark, Repeat2 } from "lucide-react";

function InfoSection({
  id,
  icon,
  eyebrow,
  title,
  text,
  tone = "default",
}: {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  tone?: "default" | "ink";
}) {
  return (
    <section
      id={id}
      className={
        tone === "ink"
          ? "border-y border-border bg-ink py-20 text-ink-foreground"
          : "border-b border-border py-20"
      }
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="mb-6 flex size-11 items-center justify-center border border-current">{icon}</div>
          <p className={tone === "ink" ? "eyebrow text-ink-foreground/60" : "eyebrow"}>{eyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)]">{title}</h2>
        </div>
        <p
          className={
            tone === "ink"
              ? "whitespace-pre-line self-center text-base leading-relaxed text-ink-foreground/75"
              : "whitespace-pre-line self-center text-base leading-relaxed text-muted-foreground"
          }
        >
          {text}
        </p>
      </div>
    </section>
  );
}

export function FinancingSection({ text, enabled }: { text?: string | null | undefined; enabled?: boolean | null | undefined }) {
  if (enabled === false || !text) return null;
  return (
    <InfoSection
      id="financiamento"
      icon={<Landmark className="size-6" />}
      eyebrow="Financiamento"
      title="Financiamento facilitado"
      text={text}
      tone="ink"
    />
  );
}

export function WarrantySection({ text }: { text?: string | null | undefined }) {
  if (!text) return null;
  return (
    <InfoSection
      id="garantia"
      icon={<BadgeCheck className="size-6" />}
      eyebrow="Garantia e procedência"
      title="Veículos com procedência"
      text={text}
    />
  );
}

export function TradeInSection({ text }: { text?: string | null | undefined }) {
  if (!text) return null;
  return (
    <InfoSection
      id="troca"
      icon={<Repeat2 className="size-6" />}
      eyebrow="Troca"
      title="Aceitamos seu veículo na troca"
      text={text}
    />
  );
}