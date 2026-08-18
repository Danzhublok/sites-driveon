import { createFileRoute } from "@tanstack/react-router";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/politica-de-privacidade")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: ({ loaderData }) => {
    const title = `Política de privacidade | ${loaderData?.store.name ?? "Loja de veículos"}`;
    const description = "Saiba como tratamos os dados pessoais coletados neste site.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/politica-de-privacidade" },
      ],
      links: [{ rel: "canonical", href: "/politica-de-privacidade" }],
    };
  },
  component: PoliticaPage,
});

function PoliticaPage() {
  return (
    <SiteLayout>
      {(catalog) => (
        <article className="mx-auto max-w-3xl space-y-5 px-4 py-16 text-muted-foreground">
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">Política de privacidade</h1>
          <p>
            Este site é operado por {catalog.store.name ?? "esta loja"} e apresenta informações de estoque e contato.
            Respeitamos sua privacidade e tratamos dados pessoais conforme a LGPD (Lei nº 13.709/2018).
          </p>
          <h2 className="pt-4 text-xl font-bold text-foreground">Dados coletados</h2>
          <p>
            Coletamos apenas os dados que você informa voluntariamente ao entrar em contato, como nome, telefone e
            mensagem, com a finalidade exclusiva de responder à sua solicitação sobre veículos.
          </p>
          <h2 className="pt-4 text-xl font-bold text-foreground">Uso das informações</h2>
          <p>
            Os dados são utilizados para atendimento comercial e não são vendidos a terceiros. Podemos utilizar
            ferramentas de mensuração de audiência para melhorar a experiência de navegação.
          </p>
          <h2 className="pt-4 text-xl font-bold text-foreground">Seus direitos</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelos canais de contato
            informados neste site.
          </p>
        </article>
      )}
    </SiteLayout>
  );
}