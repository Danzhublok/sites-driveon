import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { Store } from "@/lib/driveon-types";
import { whatsappLink } from "@/lib/driveon-format";
import { WhatsAppButton } from "./WhatsAppButton";
import { AppearancePanel } from "./AppearancePanel";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/estoque", label: "Estoque" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header({ store }: { store: Store }) {
  const [open, setOpen] = useState(false);
  const wa = whatsappLink(
    store.phone,
    `Olá! Vim pelo site da ${store.name ?? "loja"} e gostaria de mais informações.`,
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="mx-auto grid min-h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={`Início — ${store.name ?? "Loja"}`}
        >
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name ?? "Logo"}
              className="h-12 w-auto max-w-[180px] object-contain object-left sm:h-14 sm:max-w-[200px] md:max-w-[170px] lg:max-w-[210px] xl:max-w-[230px]"
            />
          ) : (
            <span className="font-display text-2xl">{store.name ?? "Loja"}</span>
          )}
        </Link>

        <nav className="hidden items-center justify-center gap-4 md:flex lg:gap-8">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground underline underline-offset-8" }}
              activeOptions={{ exact: item.to === "/" }}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <AppearancePanel />
          <div className="hidden lg:block">
            <WhatsAppButton href={wa} size="sm" label="Falar agora" />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="inline-flex size-10 shrink-0 items-center justify-center border border-input md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
            <WhatsAppButton href={wa} className="mt-2" />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
