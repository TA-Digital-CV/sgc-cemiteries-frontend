This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

docker build -f docker/development/Dockerfile -t my-igrp-template:latest .
docker run -d --name my-igrp-template -p 3000:3000 --restart unless-stopped --env-file .env.docker my-igrp-template:latest

## Arquitetura e Padrões

- Design System: usar `@igrp/igrp-framework-react-design-system` como base de UI.
- Layout: raiz com `IGRPRootLayout` e seção `(myapp)` com `IGRPContent`.
- Camadas: Components (UI), Hooks, Actions, Services, Repositories, Types.
- SOLID e Clean Code: componentes coesos, sem lógica de negócio na UI, tipagem forte.
- TypeScript: evitar `any`; preferir `unknown` com refinamento; chaves estáveis em listas.

## Critérios de Qualidade

- Consistência visual com IGRP; sem componentes de terceiros conflitantes.
- Nomenclatura: PascalCase para componentes, camelCase para arquivos TS utilitários.
- Separação de responsabilidades entre hooks, services e repositories.
- Análise estática (Biome) sem erros; avisos progressivamente reduzidos.
- Efeitos: dependências estáveis via `useCallback` quando necessário.

## Registro de Mudanças

- Adicionado `src/app/(myapp)/layout.tsx` com navegação do módulo e `IGRPContent`.
- Ajustadas tipagens em `src/types/Analytics.ts` (`any` → `unknown`).
- Melhoradas chaves de listas em diversos componentes (Analytics, Dashboard, Maps, Reports).
- Refatorado `useEffect` em `AnalyticsDashboard` para dependências estáveis.

## Validação

- Servidor de desenvolvimento: `pnpm dev` (Turbopack); preview disponível em `http://localhost:3002/`.
- Linter: `pnpm lint --max-diagnostics 200`; acompanhar erros remanescentes e corrigir iterativamente.

## Manutenção Futura

- Planejar migração gradual de componentes UI locais para o design system IGRP.
- Introduzir testes unitários com aprovação, focando lógica de negócio em hooks/services.
- Documentar decisões arquiteturais complexas em arquivos de documentação dedicados.
