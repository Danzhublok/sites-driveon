import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { instagramUrl, whatsappLink } from "@/lib/driveon-format";
import { SiteLayout } from "@/components/SiteLayout";
import { StoreContactInfo } from "@/components/StoreContactInfo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StoreMap } from "@/components/StoreMap";

export const Route = createFileRoute("/contato")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: ({ loaderData }) => {
    const title = `Contato | ${loaderData?.store.name ?? "Loja de veículos"}`;
    const description =
      "Fale com nossa equipe: telefone, WhatsApp, e-mail, endereço e horários de atendimento.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/contato" },
      ],
      links: [{ rel: "canonical", href: "/contato" }],
    };
  },
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <SiteLayout>
      {(catalog) => {
        const s = catalog.store.site_settings ?? {};
        const wa = whatsappLink(catalog.store.phone, "Olá! Gostaria de falar com um consultor.");
        const socials = [
          { href: instagramUrl(catalog.store.instagram), Icon: Instagram, label: "Instagram" },
          { href: s.facebook ?? null, Icon: Facebook, label: "Facebook" },
          { href: s.youtube ?? null, Icon: Youtube, label: "YouTube" },
          { href: s.tiktok ?? null, Icon: Music2, label: "TikTok" },
        ].filter((i) => Boolean(i.href));

        return (
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-highlight">Contato</p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)]">Fale com a gente</h1>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="surface-card space-y-6 p-6">
                <StoreContactInfo store={catalog.store} />
                <WhatsAppButton href={wa} label="Chamar no WhatsApp" />
                {socials.length ? (
                  <div className="flex gap-3 border-t border-border pt-5">
                    {socials.map(({ href, Icon, label }) => (
                      <a
                        key={label}
                        href={href as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex size-10 items-center justify-center border border-input hover:bg-accent"
                      >
                        <Icon className="size-4" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <StoreMap
                store={catalog.store}
                className="surface-card flex min-h-[420px] flex-col"
              />
            </div>
          </div>
        );
      }}
    </SiteLayout>
  );
}
