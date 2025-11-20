## **Visão Geral do Estado Atual**
- **Estrutura de Páginas (MyApp):**
  - Cemitérios: listagem, criação/edição presentes (`/cemeteries`, `/cemeteries/[id]/edit`).
  - Blocos/Seções: create/edit pages implementadas e alinhadas ao padrão IGRP (`blocks`, `sections`).
  - Sepulturas (Plots): listagem (`plots/page.tsx`), criação (`plots/create/page.tsx`) e edição (`plots/[plotId]/edit/page.tsx`).
  - Analytics/Maps: páginas existentes e funcionais (métricas, mapas, camadas e filtros).
  - QR Codes: páginas dedicadas para geração e lote (`qr-codes/generate`, `qr-codes/batch`).
- **Componentes (src/components):**
  - Forms reutilizáveis (`PlotForm.tsx`, `PlotFields.tsx`, `BlockFields.tsx`, `SectionFields.tsx`).
  - QR Codes (`QRCodeGenerator.tsx`, `QRCodeScanner.tsx`) com UI e fluxos de ação base; scanner com upload/câmera e feedback (fallback explícito).
  - Mapas (`MapViewer.tsx`, `MapLayers.tsx`) com controle de camadas e busca.
  - Dashboard/Relatórios implementados com IGRP DS.
- **Integração e Validação:**
  - Uso consistente de IGRP DS nos formulários e layouts.
  - Validação com Zod em forms críticos (`PlotForm.tsx:60–93`, `CemeteryForm.tsx:61–94`).
  - Hooks de dados: `usePlot.ts` cobre CRUD, estatísticas, disponibilidade; `useCemetery` análogo.
  - API local com switch mock/real (`src/app/api/config.ts:1–27`) e mocks (`mock-data.ts`).
- **Observações de Qualidade:**
  - Lint reporta problemas pontuais (imports não usados, `any`, dependencies em `useEffect`, keys por índice). Parte já tratada nos novos arquivos; pendências em páginas de seções/blocks.

## **Mapeamento das Funcionalidades Existentes**
- **Plots Create/Edit:**
  - Create usa `PlotForm` + DS + validação e toasts (`src/app/(myapp)/(pages)/cemeteries/[id]/plots/create/page.tsx:20, 87–98`).
  - Edit inclui upload de imagens com associação a `metadata.photos` e confirmação de descarte (`src/app/(myapp)/(pages)/cemeteries/[id]/plots/[plotId]/edit/page.tsx:172–217, 136–143`).
- **Lista de Plots:** filtros e ações básicas, integração com `usePlot` (`src/app/(myapp)/(pages)/plots/page.tsx:33–84, 278–298`).
- **QR Codes UI:**
  - Geração: `src/components/qr-codes/QRCodeGenerator.tsx` (UI completa, gera lote/single com fallback de indisponibilidade).
  - Scanner: `src/components/qr-codes/QRCodeScanner.tsx` (upload/câmera, resultado, histórico local, fallback explícito).
- **API de QR Codes:**
  - `GET /plots/{id}/qr-code` (`src/app/api/v1/plots/[id]/qr-code/route.ts:1–46`).
  - Lote: `POST /plots/bulk-qr-generation` (`src/app/api/v1/plots/bulk-qr-generation/route.ts:1–16`).
- **Geolocalização:** `POST /plots/{id}/geolocation` (`src/app/api/v1/plots/[id]/geolocation/route.ts:1–68`).
- **Mapas:** `MapViewer` com camadas e busca (`src/components/maps/MapViewer.tsx:84–111, 131–141`).

## **Pendências e Bugs**
- **QR Codes Integração:**
  - Geração/validação não conectadas ao serviço; apenas feedback de erro em UI (precisa integrar com `/api/v1/plots/...`).
  - Associação QR↔Plot deve atualizar `qrCode` via `PUT /plots/{id}`.
- **Consistência de Proxy:**
  - Alguns endpoints usam `IGRP_APP_MANAGER_API` diretamente; padronizar com `proxyFetch` + `REAL_API_URL`.
- **Lint/Qualidade:**
  - Unused imports/vars em `sections/[sectionId]/edit/page.tsx`; `any` na mesma página.
  - Chaves por índice persistem em alguns componentes; já corrigido na página de edição de plot.
  - Dependências `useEffect` faltantes em algumas páginas (ex.: `blocks/page.tsx`).
- **Acessibilidade/UX:**
  - Scanner/câmera simulados; quando disponível backend/SDK, substituir simulação.
  - Imagens usando `<img>` nativo por falta de primitivo DS; manter como exceção documentada.
- **Testes:**
  - Cobertura limitada de integração (fluxos QR, geolocalização, erros 404/400).
- **Configuração:**
  - `.env` vazio; documentar uso de `USE_REAL_BACKEND`, `REAL_API_URL`.

## **Plano de Ação Priorizado**
- **Fase 1 — QR Codes end-to-end (Alta prioridade):**
  - Implementar métodos em `PlotService`: `getPlotQRCode(id)`, `generatePlotQRCode(id, options?)`, `generateBulkQRCodes(plotIds, options?)` consumindo `/api/v1`.
  - Integrar `QRCodeGenerator` e `QRCodeScanner` aos endpoints reais/mock e atualizar `qrCode` do plot via `PUT`.
  - Fluxos: cadastro QR↔Plot, consulta via scan, atualização sem perder QR.
- **Fase 2 — Padronização Proxy (Alta):**
  - Migrar endpoints com `IGRP_APP_MANAGER_API` para `proxyFetch` + `REAL_API_URL`.
  - Documentar `.env` e validar fallback quando variável ausente.
- **Fase 3 — Testes (Média):**
  - Adicionar testes de integração de QR e geolocalização; cenários 404/400; verificar formato `{ data, pageable }`.
- **Fase 4 — Qualidade/Lint (Média):**
  - Remover imports/vars não usados; minimizar `any`; corrigir keys; revisar `useEffect` deps.
  - A11y: labels e foco nos fluxos de QR; mensagens consistentes.
- **Fase 5 — Documentação/Checklist (Média):**
  - Criar documento de acompanhamento em `.trae/documents/FE-01-Cemiterio-auditoria-estado.md` com checklists por feature.
  - Registrar dependências e riscos.

## **Documento e Checklists (a criar após aprovação)**
- **Estrutura do Documento:**
  - Estado atual por módulo (Cemitérios, Blocos, Seções, Plots, QR, Maps).
  - Checklists por feature:
    - Geração QR: endpoints, serviços, UI, toasts, testes, a11y.
    - Scanner: leitura, validação, navegação, erros, testes.
    - Associação QR↔Plot: atualização via `PUT`, persistência, auditoria.
    - Geolocalização: form, API, validação, feedback.
  - Dependências externas: `REAL_API_URL`, SDK de câmera/scan.
  - Riscos: indisponibilidade do backend, divergência de contratos, falta de primitivo DS para imagens.

## **Critérios de Qualidade**
- **Design System IGRP:** uso exclusivo dos componentes (exceções documentadas).
- **Validação e Erros:** Zod; mensagens claras; fallback explícito (formato “Error: …”).
- **Acessibilidade:** labels, foco, navegação por teclado; contraste.
- **Performance:** renderizações otimizadas; evitar re-renders; sem data mock fixa em produção.
- **Segurança:** sem segredos hardcoded; sanitização de inputs; princípio do menor privilégio.
- **Testes:** cobrir fluxos críticos; incluir casos de erro; remover testes provisórios após verificação.
- **Código Limpo:** nomes claros; sem comentários mortos; manter padrões SOLID.

## **Confirmação**
- Ao aprovar, crio o documento de auditoria e executo as Fases 1–5 na ordem priorizada, alinhando QR Codes e proxy, adicionando testes, resolvendo lint e formalizando checklists com riscos e dependências.