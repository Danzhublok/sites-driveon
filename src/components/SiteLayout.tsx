import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Catalog } from "@/lib/driveon-types";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { whatsappLink } from "@/lib/driveon-format";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./WhatsAppButton";
import { ApiErrorState, LoadingSkeleton } from "./states";

export function useCatalog() {
  return useQuery(catalogQueryOptions);
}

export function SiteLayout({ children }: { children: (catalog: Catalog) => ReactNode }) {
  const { data, isPending, isError, refetch } = useCatalog();

  useEffect(() => {
    const logoUrl = data?.store.logo_url?.trim();
    const storeName = data?.store.name?.trim();

    if (storeName) {
      if (!document.title || document.title === "Lovable App") document.title = storeName;

      const setNamedMeta = (name: string, content: string) => {
        let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      setNamedMeta("application-name", storeName);
      setNamedMeta("apple-mobile-web-app-title", storeName);
    }

    if (!logoUrl) return;

    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.removeAttribute("type");
    favicon.href = logoUrl;

    let appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = logoUrl;
  }, [data?.store.logo_url, data?.store.name]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <ApiErrorState onRetry={() => void refetch()} />
      </div>
    );
  }

  const wa = whatsappLink(
    data.store.phone,
    `Olá! Vim pelo site da ${data.store.name ?? "loja"} e gostaria de mais informações.`,
  );
  const settings = data.store.site_settings;
  const themeStyle = {
    ...(settings?.primary_color
      ? { "--brand": settings.primary_color, "--primary": settings.primary_color }
      : {}),
    ...(settings?.secondary_color ? { "--secondary": settings.secondary_color } : {}),
    ...(settings?.accent_color
      ? { "--highlight": settings.accent_color, "--accent": settings.accent_color }
      : {}),
  } as CSSProperties;

  return (
    <div className="flex min-h-screen flex-col" style={themeStyle}>
      <Header store={data.store} />
      <main className="flex-1">{children(data)}</main>
      <Footer store={data.store} />
      <FloatingWhatsApp href={wa} />
    </div>
  );
}
