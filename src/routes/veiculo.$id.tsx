import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Fuel, Gauge, Palette, Settings2, Share2 } from "lucide-react";
import { catalogQueryOptions, showPrices, visibleVehicles } from "@/lib/catalog-query";
import {
  formatCurrency,
  formatKm,
  isReserved,
  vehicleTitle,
  vehicleWhatsappMessage,
  whatsappLink,
} from "@/lib/driveon-format";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleGallery } from "@/components/VehicleGallery";
import { VehicleGrid } from "@/components/VehicleGrid";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { EmptyState } from "@/components/states";

export const Route = createFileRoute("/veiculo/$id")({
  loader: async ({ context, params }) => {
    const catalog = await context.queryClient.ensureQueryData(catalogQueryOptions);
    const vehicle = catalog.vehicles.find((v) => v.id === params.id);
    if (!vehicle) throw notFound();
    return { store: catalog.store, vehicle };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Veículo não encontrado" }, { name: "robots", content: "noindex" }] };
    }
    const { vehicle, store } = loaderData;
    const title = `${vehicleTitle(vehicle)}${vehicle.year ? ` ${vehicle.year}` : ""} | ${store.name ?? "Estoque"}`;
    const description =
      vehicle.description ??
      `${vehicleTitle(vehicle)} ${vehicle.year ?? ""} ${formatKm(vehicle.km) ?? ""} à venda.`.trim();
    const image = vehicle.photos?.[0];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/veiculo/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image && image.startsWith("http")
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/veiculo/${params.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: vehicleTitle(vehicle),
            brand: vehicle.brand ?? undefined,
            model: vehicle.model ?? undefined,
            vehicleModelDate: vehicle.year ?? undefined,
            color: vehicle.color ?? undefined,
            fuelType: vehicle.fuel ?? undefined,
            vehicleTransmission: vehicle.transmission ?? undefined,
            mileageFromOdometer: vehicle.km ? { "@type": "QuantitativeValue", value: vehicle.km, unitCode: "KMT" } : undefined,
            image: vehicle.photos ?? undefined,
            offers:
              store.site_settings?.show_prices !== false && vehicle.price
                ? { "@type": "Offer", price: vehicle.price, priceCurrency: "BRL" }
                : undefined,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <EmptyState
        title="Veículo não encontrado"
        description="Este veículo pode ter sido vendido ou removido do estoque."
        action={
          <Link to="/estoque" search={{}} className="mt-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background">
            Ver estoque
          </Link>
        }
      />
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <EmptyState title="Não foi possível carregar o veículo" description="Tente novamente em instantes." />
    </div>
  ),
  component: VehiclePage,
});

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="surface-card flex items-center gap-3 p-4">
      <span className="text-brand">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function VehiclePage() {
  const { id } = Route.useParams();
  const [url, setUrl] = useState(`/veiculo/${id}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, [id]);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        /* usuário cancelou */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SiteLayout>
      {(catalog) => {
        const vehicle = catalog.vehicles.find((v) => v.id === id);
        const prices = showPrices(catalog);
        if (!vehicle) {
          return (
            <div className="mx-auto max-w-2xl px-4 py-24">
              <EmptyState title="Veículo não encontrado" description="Confira outras opções no estoque." />
            </div>
          );
        }
        const title = vehicleTitle(vehicle);
        const price = prices ? formatCurrency(vehicle.price) : null;
        const wa = whatsappLink(catalog.store.phone, vehicleWhatsappMessage(vehicle, prices, url));
        const related = visibleVehicles(catalog)
          .filter((v) => v.id !== vehicle.id && (v.brand === vehicle.brand || v.fuel === vehicle.fuel))
          .slice(0, 3);

        return (
          <div className="mx-auto max-w-7xl px-4 py-10">
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Início</Link>
              <span className="px-2">/</span>
              <Link to="/estoque" search={{}} className="hover:text-foreground">Estoque</Link>
              <span className="px-2">/</span>
              <span className="text-foreground">{title}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <VehicleGallery photos={vehicle.photos ?? []} title={title} />

              <div className="space-y-6">
                <div>
                  {isReserved(vehicle) ? (
                    <span className="mb-3 inline-block bg-highlight px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-highlight-foreground">
                      Reservado
                    </span>
                  ) : null}
                  <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)]">{title}</h1>
                  {price ? (
                    <p className="mt-3 font-display text-5xl">{price}</p>
                  ) : (
                    <p className="mt-3 text-lg font-semibold text-muted-foreground">Consulte o valor</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {vehicle.year ? <Spec icon={<Calendar className="size-5" />} label="Ano" value={String(vehicle.year)} /> : null}
                  {formatKm(vehicle.km) ? <Spec icon={<Gauge className="size-5" />} label="KM" value={formatKm(vehicle.km)!} /> : null}
                  {vehicle.transmission ? <Spec icon={<Settings2 className="size-5" />} label="Câmbio" value={vehicle.transmission} /> : null}
                  {vehicle.fuel ? <Spec icon={<Fuel className="size-5" />} label="Combustível" value={vehicle.fuel} /> : null}
                  {vehicle.color ? <Spec icon={<Palette className="size-5" />} label="Cor" value={vehicle.color} /> : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <WhatsAppButton href={wa} label="Tenho interesse" className="flex-1" />
                  <button
                    type="button"
                    onClick={() => void share()}
                    className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                  >
                    <Share2 className="size-4" /> {copied ? "Link copiado" : "Compartilhar"}
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (wa) window.open(wa, "_blank", "noopener");
                  }}
                  className="surface-card space-y-3 p-5"
                >
                  <h2 className="text-sm font-bold uppercase tracking-widest">Tenho interesse</h2>
                  <input required placeholder="Seu nome" className="h-11 w-full rounded-none border border-input bg-background px-3 text-sm outline-none focus:border-brand" />
                  <input required placeholder="Seu telefone" className="h-11 w-full rounded-none border border-input bg-background px-3 text-sm outline-none focus:border-brand" />
                  <textarea placeholder="Mensagem (opcional)" rows={3} className="w-full rounded-none border border-input bg-background p-3 text-sm outline-none focus:border-brand" />
                  <button type="submit" className="w-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background">
                    Enviar pelo WhatsApp
                  </button>
                </form>
              </div>
            </div>

            {vehicle.description ? (
              <section className="mt-14 max-w-3xl">
                <h2 className="font-display text-3xl">Sobre este veículo</h2>
                <p className="mt-4 whitespace-pre-line text-muted-foreground">{vehicle.description}</p>
              </section>
            ) : null}

            {related.length ? (
              <section className="mt-16">
                <h2 className="mb-6 font-display text-3xl">Veículos relacionados</h2>
                <VehicleGrid vehicles={related} store={catalog.store} showPrice={prices} />
              </section>
            ) : null}
          </div>
        );
      }}
    </SiteLayout>
  );
}
