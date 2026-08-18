import { Link } from "@tanstack/react-router";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import type { Store, Vehicle } from "@/lib/driveon-types";
import {
  formatCurrency,
  formatKm,
  isReserved,
  vehiclePhoto,
  vehicleTitle,
  vehicleWhatsappMessage,
  whatsappLink,
} from "@/lib/driveon-format";
import { WhatsAppButton } from "./WhatsAppButton";

export function VehicleCard({
  vehicle,
  store,
  showPrice,
}: {
  vehicle: Vehicle;
  store: Store;
  showPrice: boolean;
}) {
  const title = vehicleTitle(vehicle);
  const price = showPrice ? formatCurrency(vehicle.price) : null;
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/veiculo/${vehicle.id}`
      : `/veiculo/${vehicle.id}`;
  const wa = whatsappLink(store.phone, vehicleWhatsappMessage(vehicle, showPrice, url));

  return (
    <article className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground">
      <Link
        to="/veiculo/$id"
        params={{ id: vehicle.id }}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary sm:aspect-[4/3]"
      >
        <img
          src={vehiclePhoto(vehicle)}
          alt={title}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isReserved(vehicle) ? (
          <span className="absolute left-0 top-4 bg-highlight px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-highlight-foreground">
            Reservado
          </span>
        ) : null}
        {vehicle.featured ? (
          <span className="absolute right-0 top-4 bg-ink px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-foreground">
            Destaque
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-2xl leading-none">
            {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "Veículo"}
          </h3>
          {vehicle.version ? (
            <p className="mt-1 text-sm text-muted-foreground">{vehicle.version}</p>
          ) : null}
        </div>

        <ul className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs uppercase tracking-wider text-muted-foreground">
          {vehicle.year ? (
            <li className="flex items-center gap-1.5">
              <Calendar className="size-3.5" /> {vehicle.year}
            </li>
          ) : null}
          {formatKm(vehicle.km) ? (
            <li className="flex items-center gap-1.5">
              <Gauge className="size-3.5" /> {formatKm(vehicle.km)}
            </li>
          ) : null}
          {vehicle.transmission ? (
            <li className="flex items-center gap-1.5">
              <Settings2 className="size-3.5" /> {vehicle.transmission}
            </li>
          ) : null}
          {vehicle.fuel ? (
            <li className="flex items-center gap-1.5">
              <Fuel className="size-3.5" /> {vehicle.fuel}
            </li>
          ) : null}
        </ul>

        <div className="mt-auto space-y-3 border-t border-border pt-4">
          {price ? (
            <p className="font-display text-3xl leading-none">{price}</p>
          ) : (
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Consulte o valor
            </p>
          )}
          <div className="grid gap-2 min-[420px]:grid-cols-2 sm:grid-cols-1 2xl:grid-cols-2">
            <Link
              to="/veiculo/$id"
              params={{ id: vehicle.id }}
              className="border border-foreground px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
            >
              Ver detalhes
            </Link>
            <WhatsAppButton href={wa} size="sm" label="WhatsApp" className="w-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
