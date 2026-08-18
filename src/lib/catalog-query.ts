import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "./driveon.functions";
import type { Catalog, Vehicle } from "./driveon-types";

export const catalogQueryOptions = queryOptions({
  queryKey: ["driveon-catalog"],
  queryFn: () => getCatalog(),
  staleTime: 60_000,
  refetchInterval: 60_000,
  retry: 1,
});

export function visibleVehicles(catalog: Catalog): Vehicle[] {
  const showReserved = catalog.store.site_settings?.show_reserved_vehicles !== false;
  return catalog.vehicles.filter((v) => {
    const status = (v.status ?? "available").toLowerCase();
    if (status === "sold") return false;
    if (status === "reserved" && !showReserved) return false;
    return true;
  });
}

export function showPrices(catalog: Catalog): boolean {
  return catalog.store.site_settings?.show_prices !== false;
}