import type { Store, Vehicle } from "@/lib/driveon-types";
import { VehicleCard } from "./VehicleCard";

export function VehicleGrid({
  vehicles,
  store,
  showPrice,
}: {
  vehicles: Vehicle[];
  store: Store;
  showPrice: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} store={store} showPrice={showPrice} />
      ))}
    </div>
  );
}
