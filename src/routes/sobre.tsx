import { createFileRoute } from "@tanstack/react-router";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { SiteLayout } from "@/components/SiteLayout";
import { StoreContactInfo } from "@/components/StoreContactInfo";
import { EmptyState } from "@/components/states";

export const Route = createFileRoute("/sobre")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: ({ loaderData }) => {
    const title = `Sobre nós | ${loaderData?.store.name ?? "Loja de veículos"}`;
    const description =
      loaderData?.store.about?.slice(0, 155) ?? "Conheça nossa história, estrutura e forma de atendimento.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/sobre" },
      ],
      links: [{ rel: "canonical", href: "/sobre" }],
    };
  },
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      {(catalog) => (
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-highlight">Sobre</p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)]">{catalog.store.name ?? "Nossa loja"}</h1>
          {catalog.store.about ? (
            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
              {catalog.store.about}
            </p>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="Informações em breve"
                description="Esta loja ainda não publicou uma descrição institucional."
              />
            </div>
          )}

          <div className="surface-card mt-12 p-6">
            <h2 className="mb-5 text-lg font-bold">Atendimento</h2>
            <StoreContactInfo store={catalog.store} />
          </div>
        </div>
      )}
    </SiteLayout>
  );
}