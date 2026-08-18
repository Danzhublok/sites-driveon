import { useState } from "react";
import { LoaderCircle, MapPin } from "lucide-react";
import type { Store } from "@/lib/driveon-types";
import { storeLocation } from "@/lib/driveon-format";

function embedSrc(store: Store): string | null {
  const raw = store.site_settings?.maps_url?.trim();
  if (raw && /google\.[a-z.]+\/maps\/embed/i.test(raw)) return raw;
  if (raw) {
    const coords = raw.match(/(?:@|query=|q=)(-?\d+(?:\.\d+)?)[,%2C]+\s*(-?\d+(?:\.\d+)?)/i);
    if (coords) return `https://www.google.com/maps?q=${coords[1]},${coords[2]}&z=16&output=embed`;
    const place = raw.match(/\/maps\/(?:place|search)\/([^/?#]+)/);
    if (place)
      return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(place[1]).replace(/\+/g, " "))}&z=16&output=embed`;
  }
  const query = [store.name, store.address, storeLocation(store)].filter(Boolean).join(", ");
  if (!query) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

export function StoreMap({ store, className = "" }: { store: Store; className?: string }) {
  const src = embedSrc(store);
  const link = store.site_settings?.maps_url ?? null;
  const [loading, setLoading] = useState(true);

  if (!src) return null;

  return (
    <div className={`overflow-hidden border border-border bg-secondary ${className}`}>
      <div className="relative min-h-[320px] flex-1">
        {loading ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-secondary"
            aria-live="polite"
          >
            <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
            <span className="sr-only">Carregando mapa</span>
          </div>
        ) : null}
        <iframe
          title={`Localização de ${store.name ?? "nossa loja"}`}
          src={src}
          loading="lazy"
          onLoad={() => setLoading(false)}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <a
        href={link ?? src.replace("&output=embed", "")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-t border-border bg-background px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-accent"
      >
        <MapPin className="size-4" /> Abrir no Google Maps
      </a>
    </div>
  );
}
