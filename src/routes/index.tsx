import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Car, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { catalogQueryOptions, showPrices, visibleVehicles } from "@/lib/catalog-query";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero } from "@/components/Hero";
import { VehicleGrid } from "@/components/VehicleGrid";
import { EmptyState } from "@/components/states";
import { FinancingSection, TradeInSection, WarrantySection } from "@/components/InfoSections";
import { StoreContactInfo } from "@/components/StoreContactInfo";
import { StoreMap } from "@/components/StoreMap";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: ({ loaderData }) => {
    const s = loaderData?.store.site_settings ?? {};
    const title =
      s.seo_title ?? `${loaderData?.store.name ?? "Loja de veículos"} | Seminovos com procedência`;
    const description =
      s.seo_description ??
      s.hero_subtitle ??
      "Confira nosso estoque de veículos seminovos com procedência.";
    const image = s.hero_image_url ?? loaderData?.store.logo_url ?? null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image && image.startsWith("http")
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: "/" }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "AutoDealer",
                name: loaderData.store.name ?? undefined,
                telephone: loaderData.store.phone ?? undefined,
                email: loaderData.store.email ?? undefined,
                image: loaderData.store.logo_url ?? undefined,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: loaderData.store.address ?? undefined,
                  addressLocality: loaderData.store.city ?? undefined,
                  addressRegion: loaderData.store.state ?? undefined,
                },
                openingHours: loaderData.store.site_settings?.business_hours ?? undefined,
              }),
            },
          ]
        : [],
    };
  },
  component: Index,
});

const DIFERENCIAIS = [
  {
    icon: ShieldCheck,
    title: "Procedência garantida",
    text: "Veículos revisados e com histórico verificado.",
  },
  {
    icon: Award,
    title: "Atendimento consultivo",
    text: "Time especialista para ajudar na melhor escolha.",
  },
  {
    icon: Sparkles,
    title: "Seleção premium",
    text: "Estoque curado com padrão de qualidade elevado.",
  },
  { icon: Car, title: "Test drive", text: "Agende uma visita e conheça o carro de perto." },
];

function Index() {
  return (
    <SiteLayout>
      {(catalog) => {
        const vehicles = visibleVehicles(catalog);
        const prices = showPrices(catalog);
        const featured = vehicles.filter((v) => v.featured).slice(0, 6);
        const recent = [...vehicles]
          .sort(
            (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
          )
          .slice(0, 6);
        const s = catalog.store.site_settings ?? {};

        return (
          <>
            <Hero store={catalog.store} total={vehicles.length} />

            <section id="estoque-resumo" className="scroll-mt-24 border-b border-border">
              <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {DIFERENCIAIS.map(({ icon: Icon, title, text }, i) => (
                  <div
                    key={title}
                    className="border-b border-border p-8 last:border-b-0 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:border-l lg:first:border-l-0"
                  >
                    <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    <Icon className="mt-6 size-5" />
                    <h3 className="mt-4 font-display text-2xl leading-none">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {featured.length ? (
              <section id="destaques" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-8">
                <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <p className="eyebrow">Destaques</p>
                    <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)]">
                      Veículos em destaque
                    </h2>
                  </div>
                  <Link
                    to="/estoque"
                    className="hidden text-xs font-semibold uppercase tracking-widest underline underline-offset-8 hover:opacity-60 sm:block"
                  >
                    Ver estoque completo
                  </Link>
                </div>
                <VehicleGrid vehicles={featured} store={catalog.store} showPrice={prices} />
              </section>
            ) : null}

            {recent.length ? (
              <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
                <div className="mb-10 border-b border-border pb-6">
                  <p className="eyebrow">Novidades</p>
                  <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)]">
                    Adicionados recentemente
                  </h2>
                </div>
                <VehicleGrid vehicles={recent} store={catalog.store} showPrice={prices} />
              </section>
            ) : null}

            {!vehicles.length ? (
              <section className="mx-auto max-w-3xl px-4 pb-20">
                <EmptyState
                  title="Estoque em atualização"
                  description="Novos veículos serão publicados em breve. Fale conosco no WhatsApp."
                />
              </section>
            ) : null}

            {catalog.store.about ? (
              <section className="border-y border-border bg-secondary py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="eyebrow">Sobre nós</p>
                    <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)]">
                      {catalog.store.name}
                    </h2>
                  </div>
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {catalog.store.about}
                  </p>
                </div>
              </section>
            ) : null}

            <FinancingSection text={s.financing_text} enabled={s.show_financing_section} />
            <WarrantySection text={s.warranty_text} />
            <TradeInSection text={s.trade_in_text} />

            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <p className="eyebrow">Localização</p>
                  <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)]">
                    Venha nos visitar
                  </h2>
                  <div className="mt-6">
                    <StoreContactInfo store={catalog.store} />
                  </div>
                  {s.maps_url ? (
                    <a
                      href={s.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-85"
                    >
                      <MapPin className="size-4" /> Ver no mapa
                    </a>
                  ) : null}
                </div>
                <StoreMap store={catalog.store} className="flex min-h-[390px] flex-col" />
              </div>
            </section>
          </>
        );
      }}
    </SiteLayout>
  );
}
