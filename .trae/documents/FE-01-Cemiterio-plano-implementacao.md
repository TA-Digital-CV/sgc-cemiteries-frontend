**Plano de Implementação Frontend (SGC – Next.js + IGRP)**

* Baseia-se nos documentos de PRD, TOGAF e FE-01, respeitando integralmente o design system `@igrp/igrp-framework-react-design-system`, SOLID, Clean Code e TypeScript rigoroso.

* Considera a estrutura atual do repositório com App Router, middleware, autenticação iGRP/NextAuth e grupos de rotas `(/auth)`, `(/igrp)` e `(/myapp)`.

**Análise dos Requisitos**

* Funcionais

  * Cadastro hierárquico de cemitério: cemitérios, blocos, seções e sepulturas (CRUD completo).

  * Georreferenciamento e mapas: visualização de estruturas, heatmaps de ocupação e ferramentas de navegação.

  * Busca avançada de sepulturas por filtros e proximidade.

  * Estatísticas e projeções: ocupação, disponibilidade, projeções de capacidade.

  * QR Codes: geração única e em lote, visualização e download.

  * Portal operacional com dashboards, relatórios e notificações.

  * Autenticação SSO (iGRP), RBAC por permissões: `CEMETERY_READ/WRITE/DELETE`, `PLOTS_READ/WRITE/DELETE`, `ANALYTICS_READ`, `PROJECTIONS_READ`, `REPORTS_EXPORT`.

* Não-Funcionais

  * Performance: respostas <2s em 90% das consultas; code-splitting, lazy loading de mapas e listas.

  * Escalabilidade e disponibilidade: microserviços, Kubernetes; frontend escalável com cache e paginação server-side.

  * Segurança: Zero Trust, MFA para dados sensíveis, TLS 1.3; sem secrets hardcoded; RBAC rigoroso via middleware.

  * Acessibilidade: WCAG 2.1 AA; navegação por teclado, alto contraste, labels e ARIA.

  * Usabilidade: mobile-first, PWA para equipas operacionais com suporte offline crítico.

* Módulos e Funcionalidades

  * Cemetery Layout (FE-01): gestão de estruturas e mapas; validações de integridade e capacidade.

  * Concessions: ciclo de concessões, prazos e notificações (frontend integra via APIs).

  * Operations: agendamento e registo de operações (frontend integra via APIs).

  * Finance & Payments: integração de pagamentos (frontend abre fluxos e consome status).

  * Analytics: dashboards, heatmaps e projeções.

  * QR Codes: gestão e geração.

* Casos de Uso (Gestão de Cemitérios)

  * Criar/editar desativar cemitério; validar coordenadas; calcular ocupação.

  * Criar/editar blocos/seções; respeitar capacidade e vínculos hierárquicos.

  * Cadastrar sepultura com validações: código único, coordenadas dentro dos limites, capacidade disponível.

  * Visualizar mapa agregado; aplicar filtros e drill-down por níveis.

  * Buscar sepulturas; executar ações rápidas (QR, detalhes, edição).

  * Consultar estatísticas por período; gerar relatórios; exportar.

**Estrutura de Pastas e Componentes**

* Padrões e nomenclatura

  * Usar somente `@igrp/igrp-framework-react-design-system` e `@igrp/framework-next-ui` para UI.

  * Componentes pequenos e focados; lógica em hooks; sem duplicação de componentes do design system.

* Proposta de organização (sem criar arquivos agora; blueprint para implementação)

  * `src/app/(myapp)/(pages)/...` — rotas do módulo FE-01.

  * `src/components/cemetery/` — containers e componentes de UI (IGRP) para FE-01:

    * `CemeteryList`, `CemeteryCard`, `CemeteryMapContainer`, `HierarchyTree`, `PlotFormContainer`, `SearchFilter`, `DataTable`, `StatsDashboard`, `NotificationCenter`.

  * `src/hooks/cemetery/` — lógica de estado:

    * `useCemetery`, `useMap`, `usePlotForm`, `useHierarchy`, `useSearchFilters`.

  * `src/actions/` — server actions Next.js:

    * `cemeteryActions`, `plotActions`, `analyticsActions`, `qrCodeActions`.

  * `src/services/` — regras de negócio do frontend:

    * `cemeteryService`, `plotService`, `analyticsService`, `qrCodeService`.

  * `src/repositories/` — acesso a dados (REST):

    * `cemeteryRepository`, `plotRepository`, `analyticsRepository`, `qrCodeRepository`.

  * `src/types/` — tipos compartilhados:

    * `Cemetery.ts`, `Plot.ts`, `Common.ts` (de acordo com FE-01).

* Componentes reutilizáveis

  * Reaproveitar `Card`, `Button`, `Input`, `Select`, `Modal`, `Table`, `Breadcrumb`, `Tabs`, `Typography` do design system.

  * Wrapper de mapas e QR Codes como exceções documentadas (apenas renderizador externo; UI IGRP).

**Rotas e Navegação**

* Local `src/app/(myapp)/(pages)/` (grupo “myapp” sem alterar a URL; “pages” só para organizar).

* Rotas privadas (autenticadas) por padrão; públicas apenas `/login` e endpoints estritamente necessários (já tratados em `(auth)` e `middleware`).

* Mapeamento de rotas em App Router

  * `page.tsx`              → `/` (Dashboard principal)

  * `cemeteries/page.tsx`   → `/cemeteries`

  * `cemeteries/[id]/page.tsx` → `/cemeteries/[id]`

  * `cemeteries/[id]/edit/page.tsx` → `/cemeteries/[id]/edit`

  * `cemeteries/create/page.tsx` → `/cemeteries/create`

  * `cemeteries/[id]/blocks/page.tsx` → `/cemeteries/[id]/blocks`

  * `cemeteries/[id]/blocks/[blockId]/page.tsx` → `/cemeteries/[id]/blocks/[blockId]`

  * `cemeteries/[id]/blocks/[blockId]/edit/page.tsx` → `/cemeteries/[id]/blocks/[blockId]/edit`

  * `cemeteries/[id]/blocks/create/page.tsx` → `/cemeteries/[id]/blocks/create`

  * `cemeteries/[id]/sections/page.tsx` → `/cemeteries/[id]/sections`

  * `cemeteries/[id]/sections/[sectionId]/page.tsx` → `/cemeteries/[id]/sections/[sectionId]`

  * `cemeteries/[id]/sections/[sectionId]/edit/page.tsx` → `/cemeteries/[id]/sections/[sectionId]/edit`

  * `cemeteries/[id]/sections/create/page.tsx` → `/cemeteries/[id]/sections/create`

  * `plots/page.tsx`        → `/plots`

  * `plots/[id]/page.tsx`   → `/plots/[id]`

  * `plots/[id]/edit/page.tsx` → `/plots/[id]/edit`

  * `plots/create/page.tsx` → `/plots/create`

  * `plots/search/page.tsx` → `/plots/search`

  * `analytics/page.tsx`    → `/analytics`

  * `analytics/occupancy/page.tsx` → `/analytics/occupancy`

  * `analytics/projections/page.tsx` → `/analytics/projections`

  * `analytics/heatmap/page.tsx` → `/analytics/heatmap`

  * `qr-codes/page.tsx`     → `/qr-codes`

  * `qr-codes/generate/page.tsx` → `/qr-codes/generate`

  * `qr-codes/batch/page.tsx` → `/qr-codes/batch`

  * `map/page.tsx`          → `/map`

  * `reports/page.tsx`      → `/reports`

  * `settings/page.tsx`     → `/settings`

* Navegação e lazy loading

  * App Router já faz code splitting; usar `dynamic()` e `import()` para widgets pesados (mapa, data-table, gráficos).

  * Breadcrumbs e sidebar vindos da configuração IGRP (`src/igrp.template.config.ts`); atualizar menus após criação das páginas.

* Público x privado

  * `middleware.ts`: garantir que `isPublicPath` permita `/login` e bloqueie as novas rotas sem sessão.

  * Em cada página crítica, validar permissões do utilizador (RBAC) antes de exibir ações de escrita/remoção.

**Implementação das Páginas Principais**

* Dashboard `/`

  * UI: `StatsDashboard`, widgets de ocupação, heatmap resumido, atividade recente.

  * Hooks: `useCemetery` (métricas agregadas), `useMap` (mini-heatmap).

  * Ações: `analyticsActions.getSummary()`.

  * Erros: mensagens claras; fallback apenas “Error: \[descrição]”.

* Lista de Cemitérios `/cemeteries`

  * UI: `SearchFilter`, `DataTable`, `CemeteryCard`.

  * Hooks: `useCemetery` com paginação server-side.

  * Ações: `fetchCemeteriesAction`.

  * Validações: filtros consistentes; status e ordenação.

* Detalhes de Cemitério `/cemeteries/[id]`

  * UI: `CemeteryMapContainer`, painéis de estatísticas, atalhos para blocos, seções e relatórios.

  * Hooks: `useMap`, `useCemetery` (estatísticas e estrutura).

  * Ações: `fetchCemeteryByIdAction`, `getCemeteryStatsAction`.

  * Validações: id válido; mensagens para “No data available” se não houver dados.

* Gestão de Blocos/Seções `/cemeteries/[id]/blocks|sections [...]`

  * UI: `HierarchyTree`, `DataTable`, formulários IGRP.

  * Hooks: `useHierarchy`.

  * Ações/Services/Repositories: `cemeteryService` / `cemeteryRepository`.

  * Regras: capacidade mínima/máxima; não reduzir abaixo do ocupado.

* Gestão de Sepulturas `/plots [...]`

  * UI: Lista, mapa, ações rápidas; `PlotFormContainer` multi-step.

  * Hooks: `usePlotForm` com validações (código único; coordenadas dentro dos limites; capacidade).

  * Ações: `submitPlotAction`, `validatePlotPositionAction`.

* Analytics `/analytics [...]`

  * UI: gráficos (IGRP DS) e heatmaps; filtros por período/nível.

  * Hooks: `useCemetery` + `useMap`.

  * Ações: `analyticsActions.getOccupancy()`, `getProjections()`, `getHeatmap()`.

* QR Codes `/qr-codes [...]`

  * UI: gerador, batch, preview e download.

  * Hooks: `useQrCode`.

  * Ações: `qrCodeActions.generateSingle()` e `generateBatch()`.

  * Exceção: biblioteca de QR apenas como renderização; UI IGRP.

* Map Geral `/map`

  * UI: `CemeteryMapContainer` full-screen com camadas e ferramentas.

  * Hooks: `useMap` com filtros avançados e bounds.

**Integração e Erros**

* Configuração de API

  * Base: `https://api.sgc.gov.cv/api/v1/` em `process.env`.

  * Repositórios fazem `fetch` com `Bearer` token (NextAuth/iGRP), validação de `response.ok`, parse JSON.

* TOGAF e microserviços

  * Cemetery Layout: endpoints `/cemeteries`, `/structure`, `/map-data`.

  * Plots: `/plots`, `/plots/search`, `/plots/{id}/geolocation`.

  * Analytics: `/occupancy`, `/capacity-projection`, `/heatmap-data`, `/availability`.

  * QR Codes: `/plots/{id}/qr-code`, `/plots/bulk-qr-generation`.

* Tratamento de erros e estados

  * Estados `loading`, `error`, `empty`, `offline`.

  * Retentar falhas temporárias quando aplicável; nunca mascarar erros com dados padrão.

  * Mensagens localizadas e consistentes; logs mínimos no cliente.

* WebSocket e offline

  * Considerar canal real-time para ocupação; cache de tiles essenciais para mapas; PWA somente com aprovação.

**Testes (sem novas dependências até autorização)**

* Estratégia

  * Unit tests: hooks (`useCemetery`, `usePlotForm`, `useMap`) e services/repositories (transformações e validações).

  * Integração: rotas principais renderizam com dados reais de um ambiente de staging; sem mocks.

  * E2E: planejar com Playwright/Jest apenas mediante aprovação.

* Windows PowerShell

  * `npm run dev`

  * `npm run build`

  * `npm run start`

  * `npm run format`

  * `npm run lint`

* Cobertura

  * Testar cenários de erro, validações de coordenadas e capacidade, RBAC nas ações de escrita, paginação e filtros.

**Validação e Qualidade**

* Conformidade com `project_rules.md`

  * Uso exclusivo do design system IGRP; sem componentes duplicados ou terceiros.

  * SOLID: containers stateless; lógica em hooks; serviços e repositórios separados.

  * Clean Code: nomes claros, arquivos curtos, documentação objetiva.

  * TypeScript: estrito; `any` só com justificativa e comentário no topo.

* Revisão e CI

  * Revisão de código por PR; checklist de acessibilidade, responsividade, segurança e performance.

  * Formatação e lint: `biome format`, `biome check`.

* Acessibilidade e Responsividade

  * WCAG 2.1 AA: ARIA, labels, foco visível, alto contraste.

  * Layout responsivo com breakpoints e grids IGRP; navegação por teclado.

**Roadmap de Entrega**

* Fase 1 (MVP – 1-4 meses)

  * Páginas: `/`, `/cemeteries`, `/cemeteries/[id]`, `/plots`, `/plots/create`, `/analytics/occupancy`, `/qr-codes/generate`, `/map`.

  * Integrações: `/cemeteries`, `/plots`, `/occupancy`, `/map-data`, `/qr-code`.

  * Validações: coordenadas, capacidade, códigos únicos; RBAC básico.

* Fase 2 (Operações Avançadas – 5-8 meses)

  * Páginas: blocos/seções completas, `/analytics/projections`, `/analytics/heatmap`, batch QR.

  * Funcionalidades: PWA, offline crítico, notificações automáticas, operações de campo.

* Fase 3 (Otimização e Integração Total – 9-12 meses)

  * Dashboards executivos; relatórios avançados; integrações externas; auditoria e BI.

**Critérios de Aceitação**

* Rotas e navegação funcionam com sessão iGRP; RBAC aplicado.

* Páginas renderizam apenas com componentes IGRP; exceções aprovadas.

* Validações de negócio aplicadas (capacidade, coordenadas, unicidade).

* Tempo de resposta dentro das metas; listas paginadas server-side.

* Acessibilidade verificada; responsividade consistente.

**Riscos e Exceções**

* Mapas e QR Codes: usar apenas como renderizadores externos; UI de controle via IGRP; reversão caso indisponíveis.

* Dados reais: ambiente de staging obrigatório para testes; sem mock data; se API indisponível, mostrar “No data available”.

**Próximos Passos (sem criar arquivos agora)**

* Definir quais páginas iniciar na Fase 1 e autorizar criação dos diretórios em `src/app/(myapp)/(pages)`.

* Autorizar atualização do `middleware.ts` para reforçar `isPublicPath` e lista de rotas privadas.

* Autorizar inclusão de itens de menu via `src/igrp.template.config.ts` apontando para as novas rotas.

* Confirmar ambiente de staging e variáveis `process.env` para integrar APIs reais.

## Execução da Fase 1 (MVP)

### Objetivos

- Materializar as rotas e páginas essenciais do módulo FE-01.
- Integrar chamadas reais à API via `process.env.NEXT_PUBLIC_API_URL`.
- Garantir SOLID, Clean Code, TypeScript estrito, segurança e acessibilidade.

### Arquivos a criar (solicitação de autorização)

- `src/app/(myapp)/(pages)/page.tsx` → Dashboard inicial (`/`).
- `src/app/(myapp)/(pages)/cemeteries/page.tsx` → Lista paginada de cemitérios.
- `src/app/(myapp)/(pages)/cemeteries/[id]/page.tsx` → Detalhes e estatísticas.
- `src/app/(myapp)/(pages)/plots/page.tsx` → Lista de sepulturas.
- `src/app/(myapp)/(pages)/plots/create/page.tsx` → Criação de sepultura.
- `src/app/(myapp)/(pages)/analytics/occupancy/page.tsx` → Ocupação por período.
- `src/app/(myapp)/(pages)/qr-codes/generate/page.tsx` → Gerador simples de QR.
- `src/app/(myapp)/(pages)/map/page.tsx` → Mapa geral.
- `src/hooks/cemetery/useCemetery.ts` → Lógica de listagem e seleção.
- `src/hooks/cemetery/usePlotForm.ts` → Lógica e validação de formulário de sepultura.
- `src/hooks/map/useMap.ts` → Estado e filtros de mapa.
- `src/actions/cemeteryActions.ts` → Ponte UI ↔ serviços.
- `src/services/cemeteryService.ts` → Regras e transformação de dados.
- `src/repositories/cemeteryRepository.ts` → Acesso REST a cemitérios.
- (opcional, conforme padrão) `src/types/Cemetery.ts`, `src/types/Plot.ts`.

Observação: criação condicionada à autorização explícita. Sem autorização, manter apenas blueprint/documentação.

### Blueprint de Rotas

- `page.tsx` → `/`
- `cemeteries/page.tsx` → `/cemeteries`
- `cemeteries/[id]/page.tsx` → `/cemeteries/[id]`
- `plots/page.tsx` → `/plots`
- `plots/create/page.tsx` → `/plots/create`
- `analytics/occupancy/page.tsx` → `/analytics/occupancy`
- `qr-codes/generate/page.tsx` → `/qr-codes/generate`
- `map/page.tsx` → `/map`

### Código de referência (comentários de função em inglês)

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/cemetery/useCemetery.ts
// Purpose: Manage cemetery list lifecycle (fetch, select) with server pagination
// Security: No hardcoded secrets; read base URL from env
// Performance: Avoid heavy re-renders; paginate; memoize where applicable
// Accessibility: Expose error/loading states for screen readers via consuming components

import { useCallback, useEffect, useState } from "react";

export interface Cemetery {
  id: string;
  municipalityId: string;
  name: string;
  address: string;
  maxCapacity: number;
  currentOccupancy: number;
  occupancyRate: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

/**
 * useCemetery
 * Fetches cemeteries and handles selection with explicit error handling.
 */
export function useCemetery() {
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const fetchCemeteries = useCallback(async (page = 0, size = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cemeteries?page=${page}&size=${size}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      setCemeteries((json?.content ?? json?.data ?? []) as Cemetery[]);
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => { void fetchCemeteries(0, 10); }, [fetchCemeteries]);

  return { cemeteries, isLoading, error, fetchCemeteries };
}
```

```typescript
// src/app/(myapp)/(pages)/cemeteries/page.tsx
// Purpose: Render paginated cemetery list using IGRP Design System components
// Notes: Stateless container; delegates data lifecycle to useCemetery

import { Table, Typography, Input, Button } from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";
import { useCemetery } from "@/hooks/cemetery/useCemetery";

export default function CemeteriesPage() {
  const { cemeteries, isLoading, error, fetchCemeteries } = useCemetery();
  const [query, setQuery] = useState("");

  /**
   * handleSearch
   * Triggers server-side filters (to be wired) and reloads list.
   */
  const handleSearch = () => { void fetchCemeteries(0, 10); };

  return (
    <div>
      <Typography.H2>Cemeteries</Typography.H2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input placeholder="Search by name or code" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {isLoading && <Typography.P>Loading...</Typography.P>}
      {error && <Typography.P role="alert">Error: {error}</Typography.P>}
      {!isLoading && !error && (
        <Table aria-label="Cemeteries table">
          <Table.Header>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Municipality</Table.Cell>
              <Table.Cell>Capacity</Table.Cell>
              <Table.Cell>Occupancy</Table.Cell>
              <Table.Cell>Status</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cemeteries.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>{c.name}</Table.Cell>
                <Table.Cell>{c.municipalityId}</Table.Cell>
                <Table.Cell>{c.maxCapacity}</Table.Cell>
                <Table.Cell>{c.currentOccupancy}</Table.Cell>
                <Table.Cell>{c.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
```

### Testes e Validação

- Meta de cobertura: 80%+ em hooks e serviços desta fase.
- Dados reais de staging; sem mocks, exceto para validações puras.
- Scripts (Windows PowerShell): `npm run format`, `npm run lint`, `npm run build`.

### Conformidade

- IGRP DS exclusivamente na UI; SOLID; Clean Code; TypeScript estrito.
- Sem secrets hardcoded; `process.env` para base da API.
- Acessibilidade com ARIA e mensagens `role="alert"`.

### Próximo passo (dependente de autorização)

- Autorizar criação dos arquivos listados em “Arquivos a criar”.
- Após criação: atualizar `src/middleware.ts` para garantir rotas privadas; adicionar menus em `src/igrp.template.config.ts`.
- Executar build e validar em staging; abrir pré-visualização se aplicável.
