import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Store } from "@/lib/driveon-types";
import { formatPhone, normalizePhone, storeLocation } from "@/lib/driveon-format";

export function BusinessHours({ hours }: { hours?: string | null | undefined }) {
  if (!hours) return null;
  return (
    <div className="flex items-start gap-3">
      <Clock className="mt-0.5 size-5 text-brand" />
      <div>
        <p className="text-sm font-semibold">Horário de atendimento</p>
        <p className="text-sm text-muted-foreground">{hours}</p>
      </div>
    </div>
  );
}

export function StoreContactInfo({ store }: { store: Store }) {
  const location = storeLocation(store);
  const phone = formatPhone(store.phone);
  const waNumber = normalizePhone(store.phone);

  return (
    <div className="space-y-5">
      {phone ? (
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 size-5 text-brand" />
          <div>
            <p className="text-sm font-semibold">Telefone</p>
            <a
              href={waNumber ? `tel:+${waNumber}` : `tel:${store.phone}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {phone}
            </a>
          </div>
        </div>
      ) : null}

      {store.email ? (
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 text-brand" />
          <div>
            <p className="text-sm font-semibold">E-mail</p>
            <a href={`mailto:${store.email}`} className="text-sm text-muted-foreground hover:text-foreground">
              {store.email}
            </a>
          </div>
        </div>
      ) : null}

      {store.address || location ? (
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-5 text-brand" />
          <div>
            <p className="text-sm font-semibold">Endereço</p>
            {store.address ? <p className="text-sm text-muted-foreground">{store.address}</p> : null}
            {location ? <p className="text-sm text-muted-foreground">{location}</p> : null}
          </div>
        </div>
      ) : null}

      <BusinessHours hours={store.site_settings?.business_hours} />
    </div>
  );
}