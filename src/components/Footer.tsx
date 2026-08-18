import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import type { Store } from "@/lib/driveon-types";
import { formatPhone, instagramUrl, storeLocation } from "@/lib/driveon-format";
import { DriveonBrand } from "./DriveonBrand";

export function Footer({ store }: { store: Store }) {
  const s = store.site_settings ?? {};
  const socials = [
    { href: instagramUrl(store.instagram), Icon: Instagram, label: "Instagram" },
    { href: s.facebook ?? null, Icon: Facebook, label: "Facebook" },
    { href: s.youtube ?? null, Icon: Youtube, label: "YouTube" },
    { href: s.tiktok ?? null, Icon: Music2, label: "TikTok" },
  ].filter((item) => Boolean(item.href));

  const location = storeLocation(store);

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name ?? "Logo"}
              className="h-14 w-auto max-w-[220px] object-contain object-left"
            />
          ) : (
            <span className="font-display text-3xl">{store.name}</span>
          )}
          {store.about ? (
            <p className="line-clamp-4 text-sm leading-relaxed text-ink-foreground/60">
              {store.about}
            </p>
          ) : null}
        </div>

        <div>
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-ink-foreground/50">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/75">
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/estoque">Estoque</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre</Link>
            </li>
            <li>
              <Link to="/contato">Contato</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-ink-foreground/50">
            Contato
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/75">
            {formatPhone(store.phone) ? <li>{formatPhone(store.phone)}</li> : null}
            {store.email ? <li>{store.email}</li> : null}
            {store.address ? <li>{store.address}</li> : null}
            {location ? <li>{location}</li> : null}
            {s.business_hours ? <li>{s.business_hours}</li> : null}
          </ul>
        </div>

        <div>
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-ink-foreground/50">
            Legal
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/75">
            <li>
              <Link to="/politica-de-privacidade">Política de privacidade</Link>
            </li>
            <li>
              <Link to="/termos">Termos de uso</Link>
            </li>
          </ul>
          {socials.length ? (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center border border-ink-foreground/20 transition-colors hover:bg-ink-foreground hover:text-ink"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-7 text-center text-xs text-ink-foreground/60 sm:px-8 md:flex-row md:text-left">
          <DriveonBrand />
          <div>
            {s.footer_text ? <p>{s.footer_text}</p> : null}
            <p className="mt-1">
              © {new Date().getFullYear()} {store.name ?? ""}. Todos os direitos reservados.
            </p>
          </div>
          <a
            href="https://driveon.danixzz-2by.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold uppercase tracking-widest transition-colors hover:text-ink-foreground"
          >
            Site desenvolvido com DRIVEON
          </a>
        </div>
      </div>
    </footer>
  );
}
