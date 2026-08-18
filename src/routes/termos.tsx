import { createFileRoute } from "@tanstack/react-router";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/termos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: ({ loaderData }) => {
    const title = `Termos de uso | ${loaderData?.store.name ?? "Loja de veículos"}`;
    const description = "Condições de uso do site e das informações de estoque publicadas.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/termos" },
      ],
      links: [{ rel: "canonical", href: "/termos" }],
    };
  },
  component: TermosPage,
});

function TermosPage() {
  return (
    <SiteLayout>
      {(catalog) => (
        <article className="mx-auto max-w-3xl space-y-5 px-4 py-16 text-muted-foreground">
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">Termos de uso</h1>
          <p>
            Ao navegar neste site você concorda com estes termos. O conteúdo é fornecido por
            {" "}{catalog.store.name ?? "esta loja"} e tem caráter informativo.
          </p>
          <h2 className="pt-4 text-xl font-bold text-foreground">Informações de veículos</h2>
          <p>
            Preços, disponibilidade, opcionais e características podem ser alterados sem aviso prévio. Valores e
            condições devem ser confirmados diretamente com nossa equipe antes da negociação.
          </p>
          <h2 className="pt-4 text-xl font-bold text-foreground">Propriedade intelectual</h2>
          <p>
            Imagens, textos e marcas exibidos pertencem aos seus respectivos titulares e não podem ser reproduzidos sem
            autorização.
          </p>
          <h2 className="pt-4 text-xl font-bold text-foreground">Limitação de responsabilidade</h2>
          <p>
            Não nos responsabilizamos por eventuais indisponibilidades temporárias do site ou divergências decorrentes
            de atualização de estoque.
          </p>
        </article>
      )}
    </SiteLayout>
  );
}