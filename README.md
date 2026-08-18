# DriveOn Auto Showcase

Crie um site automotivo completo, moderno, premium e responsivo para uma loja de veículos.

ARQUITETURA OBRIGATÓRIA

Este site não deve possuir painel administrativo, login administrativo, banco próprio de veículos ou página de configurações.

Todo o estoque, informações da empresa, contatos, aparência, textos, redes sociais e configurações do site serão administrados exclusivamente pelo painel DRIVEON.

O site deve apenas consumir e apresentar os dados recebidos pela API DRIVEON.

API DRIVEON

Endpoint:

https://knlizobqalygwidmvjpx.supabase.co/functions/v1/catalog-api

A autenticação deve usar:

X-Driveon-Token: TOKEN_DA_LOJA

Nunca coloque o token diretamente no JavaScript entregue ao navegador.

Crie uma Supabase Edge Function chamada `driveon-catalog-proxy` ou uma rota server-side equivalente.

Cadastre o token como secret:

DRIVEON_CATALOG_TOKEN

Exemplo da requisição server-side:

const response = await fetch(
  "https://knlizobqalygwidmvjpx.supabase.co/functions/v1/catalog-api",
  {
    headers: {
      "X-Driveon-Token": Deno.env.get("DRIVEON_CATALOG_TOKEN")!
    }
  }
);

if (!response.ok) {
  throw new Error("Não foi possível carregar os dados da DRIVEON");
}

const data = await response.json();

O frontend deve consultar somente a função proxy, nunca diretamente a API com o token.

RESPOSTA DA API

A API retorna:

{
  "store": {
    "id": "uuid",
    "name": "Nome da loja",
    "phone": "11999999999",
    "email": "contato@loja.com",
    "city": "São Paulo",
    "state": "SP",
    "address": "Endereço completo",
    "instagram": "@loja",
    "about": "Descrição da loja",
    "logo_url": "https://...",
    "website_url": "https://...",
    "site_settings": {
      "facebook": "https://facebook.com/loja",
      "youtube": "https://youtube.com/@loja",
      "tiktok": "https://tiktok.com/@loja",
      "maps_url": "https://maps.google.com/...",
      "business_hours": "Segunda a sexta, 8h às 18h",
      "hero_title": "Encontre seu próximo carro",
      "hero_subtitle": "Qualidade, procedência e atendimento",
      "hero_image_url": "https://...",
      "primary_color": "#16a34a",
      "secondary_color": "#111827",
      "accent_color": "#f59e0b",
      "footer_text": "Texto do rodapé",
      "seo_title": "Título para o Google",
      "seo_description": "Descrição para buscadores",
      "financing_text": "Informações de financiamento",
      "warranty_text": "Informações de garantia",
      "trade_in_text": "Informações sobre troca",
      "show_prices": true,
      "show_reserved_vehicles": true,
      "show_financing_section": true,
      "show_testimonials": true
    }
  },
  "vehicles": [
    {
      "id": "uuid",
      "brand": "Toyota",
      "model": "Corolla",
      "version": "XEi",
      "year": 2024,
      "km": 18000,
      "transmission": "Automático",
      "fuel": "Flex",
      "color": "Prata",
      "price": 139900,
      "description": "Descrição completa",
      "photos": ["https://..."],
      "featured": true,
      "status": "available",
      "created_at": "2026-08-18T00:00:00Z"
    }
  ],
  "updated_at": "2026-08-18T00:00:00Z"
}

REGRAS DE DADOS

- Não criar tabela local de veículos.
- Não criar tabela local de configurações.
- Não criar área administrativa.
- Não permitir edição de veículos ou dados da loja neste site.
- Todas as informações devem vir da API DRIVEON.
- Nunca mostrar veículos vendidos.
- Mostrar reservados somente quando `store.site_settings.show_reserved_vehicles` for true.
- Mostrar valores somente quando `store.site_settings.show_prices` for true.
- Não inventar dados ausentes.
- Ocultar seções sem conteúdo.
- Atualizar automaticamente quando os dados forem alterados na DRIVEON.
- Usar cache server-side de no máximo 60 segundos.
- Criar tratamento de carregamento, erro e tentativa novamente.

IDENTIDADE VISUAL

Use dinamicamente:

- `site_settings.primary_color` como cor principal.
- `site_settings.secondary_color` como cor secundária.
- `site_settings.accent_color` como destaque.
- `store.logo_url` como logo.
- `site_settings.hero_image_url` como imagem principal.
- `site_settings.hero_title` como título principal.
- `site_settings.hero_subtitle` como subtítulo.

Aplique as cores usando variáveis CSS.

Se alguma cor não vier preenchida, use:

--primary: #16a34a;
--secondary: #111827;
--accent: #f59e0b;

PÁGINA INICIAL

Criar uma homepage completa com:

- Cabeçalho fixo
- Logo da loja
- Menu responsivo
- Botão de WhatsApp
- Banner principal
- Busca rápida de veículos
- Veículos em destaque
- Veículos adicionados recentemente
- Seção sobre a loja
- Diferenciais
- Financiamento
- Garantia e procedência
- Aceitamos veículo na troca
- Localização
- Horários
- Redes sociais
- Rodapé completo
- Botão flutuante de WhatsApp

Mostrar financiamento somente quando:

site_settings.show_financing_section === true

Usar:

- `site_settings.financing_text`
- `site_settings.warranty_text`
- `site_settings.trade_in_text`
- `site_settings.footer_text`

ESTOQUE

Criar a rota `/estoque`.

Incluir:

- Busca por marca, modelo e versão
- Filtro por marca
- Filtro por preço
- Filtro por ano
- Filtro por quilometragem
- Filtro por câmbio
- Filtro por combustível
- Filtro por status
- Ordenação por preço
- Ordenação por ano
- Ordenação por quilometragem
- Ordenação pelos mais recentes
- Contagem de resultados
- Cards responsivos
- Paginação ou carregamento progressivo
- Skeleton de carregamento
- Estado vazio
- Botão para limpar filtros

CARD DO VEÍCULO

Mostrar:

- Foto principal
- Marca
- Modelo
- Versão
- Ano
- Quilometragem
- Câmbio
- Combustível
- Preço, quando autorizado
- Selo “Reservado”
- Botão “Ver detalhes”
- Botão de WhatsApp

DETALHES DO VEÍCULO

Criar a rota `/veiculo/:id`.

Incluir:

- Galeria completa
- Modal de fotos
- Marca, modelo e versão
- Preço
- Ano
- Quilometragem
- Câmbio
- Combustível
- Cor
- Descrição
- Status
- Botão de WhatsApp
- Formulário visual de interesse
- Compartilhamento
- Veículos relacionados
- SEO dinâmico

Mensagem do WhatsApp:

Olá! Tenho interesse no [MARCA] [MODELO] [VERSÃO], ano [ANO], anunciado por [PREÇO]. Link: [URL]

CONTATOS

Use exclusivamente:

- `store.phone`
- `store.email`
- `store.address`
- `store.city`
- `store.state`
- `store.instagram`
- `site_settings.facebook`
- `site_settings.youtube`
- `site_settings.tiktok`
- `site_settings.maps_url`
- `site_settings.business_hours`

Normalizar o telefone antes de criar o link:

https://wa.me/NUMERO

Aceitar Instagram como `@usuario` ou URL completa.

PÁGINAS

Criar:

- `/`
- `/estoque`
- `/veiculo/:id`
- `/sobre`
- `/contato`
- `/politica-de-privacidade`
- `/termos`
- Página 404

A página Sobre deve usar `store.about`.

A página Contato deve mostrar todos os contatos, mapa, endereço e horários recebidos pela API.

SEO

Usar:

- `site_settings.seo_title`
- `site_settings.seo_description`
- `store.logo_url`
- `site_settings.hero_image_url`

Criar:

- Metadados dinâmicos
- Open Graph
- Sitemap
- robots.txt
- LocalBusiness structured data
- Vehicle structured data
- URLs amigáveis
- Canonical URL
- Compartilhamento de veículos

DESIGN

Quero um visual automotivo premium:

- Moderno e confiável
- Excelente no celular
- Fotos grandes
- Tipografia forte
- Cards elegantes
- Animações discretas
- Navegação rápida
- Contraste acessível
- Tema claro sofisticado
- Opção de tema escuro
- Botões claros de conversão
- Sem aparência de template genérico

COMPONENTES

Criar componentes reutilizáveis:

- Header
- Footer
- Hero
- WhatsAppButton
- VehicleCard
- VehicleGrid
- VehicleFilters
- VehicleGallery
- StoreContactInfo
- BusinessHours
- FinancingSection
- WarrantySection
- TradeInSection
- LoadingSkeleton
- EmptyState
- ApiErrorState

DESEMPENHO E SEGURANÇA

- Lazy loading de imagens
- Imagem padrão quando o veículo não possuir foto
- Evitar layout shift
- Formatar moeda em Real brasileiro
- Formatar quilometragem no padrão brasileiro
- Nunca expor o token
- Nunca usar service role no frontend
- Não registrar o token em logs
- Fazer validação da resposta da API
- Criar timeout para requisições
- Criar estado de erro amigável
- Não utilizar dados fictícios depois de conectar a API

ENTREGA

Implemente o projeto completo e funcional.

Não crie painel administrativo neste projeto.

Todas as alterações de conteúdo serão feitas no menu Configurações da DRIVEON.

Ao finalizar, informe exatamente onde cadastrar o secret `DRIVEON_CATALOG_TOKEN`.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2a54d632-0ece-4565-8c36-2db2409db32e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
