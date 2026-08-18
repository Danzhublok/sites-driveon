import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Clock3, Instagram, MapPin, MessageCircle } from "lucide-react";
import type { Store } from "@/lib/driveon-types";
import { instagramUrl, storeLocation, whatsappLink } from "@/lib/driveon-format";

export function Hero({ store, total }: { store: Store; total: number }) {
  const settings = store.site_settings ?? {};
  const wa = whatsappLink(
    store.phone,
    `Olá! Vim pelo site da ${store.name ?? "loja"} e gostaria de atendimento.`,
  );
  const instagram = instagramUrl(store.instagram);
  const location = storeLocation(store);

  return (
    <section className="relative isolate flex min-h-[720px] overflow-hidden border-b border-border bg-ink sm:min-h-[780px] lg:min-h-[840px]">
      {settings.hero_image_url ? (
        <img
          src={settings.hero_image_url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-50"
        />
      ) : null}

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,15,12,0.98)_0%,rgba(8,15,12,0.94)_42%,rgba(8,15,12,0.78)_72%,rgba(8,15,12,0.62)_100%)] max-md:bg-[rgba(8,15,12,0.84)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_25%,rgba(255,255,255,0.12),transparent_28%)]" />

      <div className="mx-auto flex w-full max-w-[1500px] items-center px-5 py-16 sm:px-8 lg:px-10 xl:px-14">
        <div className="w-full max-w-7xl animate-rise">
          <div className="flex flex-wrap items-center gap-5">
            {store.logo_url ? (
              <div className="flex min-h-16 min-w-20 items-center justify-center rounded-lg bg-white/95 p-3 shadow-2xl shadow-black/20">
                <img
                  src={store.logo_url}
                  alt={store.name ?? "Logo da loja"}
                  className="h-11 w-auto max-w-[180px] object-contain sm:h-14 sm:max-w-[230px]"
                />
              </div>
            ) : null}
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-brand sm:text-base before:h-px before:w-8 before:bg-brand">
              Estoque disponível
            </p>
          </div>

          <h1 className="mt-8 max-w-[1350px] text-balance font-sans text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.65)] normal-case sm:text-7xl lg:text-8xl xl:text-9xl">
            {settings.hero_title ?? "Encontre o carro certo para o seu próximo capítulo."}
          </h1>

          <div className="mt-9 max-w-4xl border-l-2 border-brand pl-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              {store.name ?? "Nossa loja"}
            </p>
            <p className="mt-3 text-xl font-medium leading-snug text-white/85 sm:text-2xl lg:text-3xl">
              {settings.hero_subtitle ??
                "Você sonha, a gente realiza. Carros com garantia e confiança."}
            </p>
          </div>

          {location || settings.business_hours ? (
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/70 sm:text-base">
              {location ? (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand" /> {location}
                </span>
              ) : null}
              {settings.business_hours ? (
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4 text-brand" /> {settings.business_hours}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand px-8 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5 sm:text-base"
              >
                <MessageCircle className="size-5" /> Falar com a loja
              </a>
            ) : null}

            {instagram ? (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black sm:text-base"
              >
                <Instagram className="size-5" /> Instagram
              </a>
            ) : null}

            <Link
              to="/estoque"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black sm:text-base"
            >
              Ver estoque <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-end gap-10 border-t border-white/15 pt-6 text-white">
            {total > 0 ? (
              <div>
                <p className="text-5xl font-semibold leading-none">
                  {String(total).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-white/55">
                  {total === 1 ? "veículo anunciado" : "veículos anunciados"}
                </p>
              </div>
            ) : null}
            <a
              href="#estoque-resumo"
              className="ml-auto hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white sm:flex"
            >
              Explorar veículos <ArrowDown className="size-4 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
