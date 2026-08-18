import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { loadCatalog } = await import("@/lib/driveon.server");

        let vehicleUrls: string[] = [];
        try {
          const catalog = await loadCatalog();
          const showReserved = catalog.store.site_settings?.show_reserved_vehicles !== false;
          vehicleUrls = catalog.vehicles
            .filter((v) => showReserved || (v.status ?? "available").toLowerCase() !== "reserved")
            .map((v) => `${origin}/veiculo/${v.id}`);
        } catch {
          vehicleUrls = [];
        }

        const staticUrls = ["/", "/estoque", "/sobre", "/contato", "/politica-de-privacidade", "/termos"].map(
          (p) => `${origin}${p}`,
        );

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...vehicleUrls]
  .map((loc) => `  <url><loc>${loc}</loc></url>`)
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=60" },
        });
      },
    },
  },
});
