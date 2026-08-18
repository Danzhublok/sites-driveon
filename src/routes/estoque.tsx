import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { catalogQueryOptions, showPrices, visibleVehicles } from "@/lib/catalog-query";
import type { Vehicle } from "@/lib/driveon-types";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleGrid } from "@/components/VehicleGrid";
import { EMPTY_FILTERS, VehicleFilters, type Filters } from "@/components/VehicleFilters";
import { EmptyState } from "@/components/states";

export const Route = createFileRoute("/estoque")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search["q"] === "string" && search["q"] ? { q: search["q"] as string } : {},
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: ({ loaderData }) => {
    const title = `Estoque de veículos | ${loaderData?.store.name ?? "Loja"}`;
    const description =
      "Confira todos os veículos disponíveis, com filtros por marca, ano, preço e quilometragem.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/estoque" },
      ],
      links: [{ rel: "canonical", href: "/estoque" }],
    };
  },
  component: EstoquePage,
});

const PAGE_SIZE = 9;

function uniq(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

function applyFilters(vehicles: Vehicle[], f: Filters): Vehicle[] {
  const term = f.q.trim().toLowerCase();
  const list = vehicles.filter((v) => {
    if (term) {
      const haystack = [v.brand, v.model, v.version].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (f.brand && v.brand !== f.brand) return false;
    if (f.transmission && v.transmission !== f.transmission) return false;
    if (f.fuel && v.fuel !== f.fuel) return false;
    if (f.status && (v.status ?? "available").toLowerCase() !== f.status) return false;
    if (f.minPrice && (v.price ?? 0) < Number(f.minPrice)) return false;
    if (f.maxPrice && (v.price ?? Number.MAX_SAFE_INTEGER) > Number(f.maxPrice)) return false;
    if (f.minYear && (v.year ?? 0) < Number(f.minYear)) return false;
    if (f.maxKm && (v.km ?? 0) > Number(f.maxKm)) return false;
    return true;
  });

  const sorted = [...list];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case "year-desc":
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      break;
    case "year-asc":
      sorted.sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity));
      break;
    case "km-asc":
      sorted.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
      break;
    default:
      sorted.sort(
        (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
      );
  }
  return sorted;
}

function EstoquePage() {
  const { q } = Route.useSearch();
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, q: q ?? "" });
  const [visible, setVisible] = useState(PAGE_SIZE);

  const patch = (p: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...p }));
    setVisible(PAGE_SIZE);
  };

  return (
    <SiteLayout>
      {(catalog) => {
        const all = visibleVehicles(catalog);
        const prices = showPrices(catalog);
        const result = applyFilters(all, filters);
        const showReserved = catalog.store.site_settings?.show_reserved_vehicles !== false;

        return (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
            <header className="mb-7 sm:mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-highlight">Estoque</p>
              <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)]">
                Veículos disponíveis
              </h1>
            </header>

            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <VehicleFilters
                  filters={filters}
                  onChange={patch}
                  onClear={() => {
                    setFilters(EMPTY_FILTERS);
                    setVisible(PAGE_SIZE);
                  }}
                  brands={uniq(all.map((v) => v.brand))}
                  transmissions={uniq(all.map((v) => v.transmission))}
                  fuels={uniq(all.map((v) => v.fuel))}
                  showStatusFilter={showReserved}
                  showPrices={prices}
                  resultCount={result.length}
                />
              </aside>

              <div className="min-w-0 space-y-8">
                {result.length ? (
                  <>
                    <VehicleGrid
                      vehicles={result.slice(0, visible)}
                      store={catalog.store}
                      showPrice={prices}
                    />
                    {visible < result.length ? (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setVisible((v) => v + PAGE_SIZE)}
                          className="w-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background sm:w-auto"
                        >
                          Carregar mais veículos
                        </button>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <EmptyState
                    action={
                      <button
                        type="button"
                        onClick={() => setFilters(EMPTY_FILTERS)}
                        className="mt-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background"
                      >
                        Limpar filtros
                      </button>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </SiteLayout>
  );
}
