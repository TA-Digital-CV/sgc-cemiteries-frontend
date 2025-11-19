## Visão Geral
- Implementar gestão estrita da hierarquia Cemitério → Blocos → Seções → Lotes em todas as operações (criar, editar, consultar, excluir), alinhada aos documentos BE-01-Cemiterio e FE-01-Cemiterio.
- Utilizar os endpoints já disponíveis em `src/app/api/v1` (mock/real via env) e os serviços/hook existentes para manter consistência com o Design System IGRP.
- Não criar novos arquivos sem autorização. As mudanças serão feitas diretamente nos arquivos existentes.

## Estado Atual Mapeado
- APIs mock já presentes (ex.: `src/app/api/v1/plots/route.ts`, `src/app/api/v1/cemeteries/[id]/structure/route.ts`, `src/app/api/v1/cemetery-blocks/route.ts`, `src/app/api/v1/cemetery-sections/route.ts`). Alternância via `USE_REAL_BACKEND` e `REAL_API_URL` em `src/app/api/config.ts`.
- UI e hooks existentes cobrem grande parte do fluxo:
  - Cemitérios: lista (`src/app/(myapp)/(pages)/cemeteries/page.tsx`), novo (`src/app/(myapp)/(pages)/cemeteries/new/page.tsx`), detalhe (`src/app/(myapp)/(pages)/cemeteries/[id]/page.tsx`). Formulário em `src/components/cemeteries/CemeteryForm.tsx:172`.
  - Blocos/Seções: páginas dedicadas com seleção hierárquica (`src/app/(myapp)/(pages)/blocks/page.tsx`, `src/app/(myapp)/(pages)/sections/page.tsx`).
  - Lotes: lista/criação/busca (`src/app/(myapp)/(pages)/plots/page.tsx`, `create/page.tsx`, `search/page.tsx`).
  - Serviços/Hooks: `src/services/cemeteryService.ts`, `src/hooks/useCemetery.ts`; `src/services/plotService.ts`, `src/hooks/usePlot.ts`.

## Alinhamento de APIs e Services
- Normalizar `PlotService` para usar base `.../api/v1` e formatos de resposta documentados (como já feito em `CemeteryService`), mantendo compatibilidade com mocks (campos `data/pageable`).
- Garantir que todos os métodos dos serviços usem os endpoints definidos em BE-01 (cemeteries, cemetery-blocks, cemetery-sections, plots, statistics, structure, occupancy, capacity-projection, heatmap, availability).
- Padronizar tratamento de erros e envelopes (`{ data, pageable }`) nos services para evitar divergências entre mock e backend real.

## Validações de Hierarquia (Frontend)
- Impedir criação de Seções sem Bloco e de Lotes sem Seção via UI (já em prática) e reforçar estados desabilitados e validações:
  - `blocks/page.tsx`: seleção obrigatória de cemitério antes de criar/editar bloco.
  - `sections/page.tsx`: seleção obrigatória de cemitério e bloco antes de criar/editar seção.
  - `plots/page.tsx` e `plots/create/page.tsx`: exigir cemitério, bloco e seção antes de criar/editar lote.
- Validar regras de negócio-chave em UI (capacidade > 0; não reduzir abaixo do ocupado; status INACTIVE impede certas criações), com mensagens claras em português.

## CRUD Completo por Nível
- Cemitérios: criar/editar/excluir (soft delete) já cobertos por `useCemetery` e páginas.
- Blocos e Seções: criar/editar. Para exclusão, aplicar estratégia de soft delete via atualização de `status` para `INACTIVE` (conforme BE-01) até existirem endpoints DELETE; ocultar ações quando houver lotes ocupados.
- Lotes: criar/editar/excluir; operações de reserva/ocupação/ disponibilidade via `usePlot` (já expostas, completar UI com formulários mínimos para os dados exigidos).

## Permissões (RBAC)
- Adicionar verificação de permissões no frontend para ocultar/desabilitar ações conforme papéis (CEMETERY_READ/WRITE/DELETE, PLOTS_READ/WRITE/DELETE, ANALYTICS_READ etc.).
- Implementar checagem simples nos componentes de página (sem criar arquivos novos): 
  - Ex.: antes de renderizar botões “Criar”, “Editar”, “Excluir”, validar papéis do usuário (via contexto de autenticação já existente/variáveis de ambiente).

## Histórico de Alterações
- Exibir `createdDate/lastModifiedDate` e, quando disponível, `createdBy/lastModifiedBy` nas telas de detalhe (já parcialmente em `cemeteries/[id]/page.tsx`).
- Registrar feedback de sucesso/erro em operações com toasts IGRP (já em `CemeteryForm.tsx:147-166`).

## UI Hierárquica e Navegação
- No detalhe do cemitério (`cemeteries/[id]/page.tsx`), incluir visão hierárquica (lista de blocos → seções) usando componentes já existentes (DataTable IGRP), sem criar novos componentes.
- Na lista de lotes, reforçar filtros por cemitério/bloco/seção e navegação entre níveis (breadcrumbs e links contextuais).

## Georreferenciamento e QR Codes
- Integrar/consumir endpoints de geolocalização e QR code conforme BE-01/FE-01:
  - `POST /api/v1/plots/{id}/geolocation`, `GET /api/v1/plots/{id}/qr-code`, `POST /api/v1/plots/bulk-qr-generation`.
- Adicionar ações de QR e geolocalização na UI de lotes, mantendo IGRP DS.

## Testes e Verificação
- Verificar a fluidez da hierarquia navegando pelas páginas já existentes.
- Checar validações de negócio nos formulários e desabilitar ações quando pré-condições não forem atendidas.
- Testar com `USE_REAL_BACKEND=false` (mock) e `USE_REAL_BACKEND=true` com `REAL_API_URL` apontando para o backend real.

## Arquivos a Editar (sem criar novos)
- `src/services/plotService.ts`: base URL, envelopes de resposta e métodos que apontem exatamente para os endpoints BE-01.
- `src/app/(myapp)/(pages)/blocks/page.tsx`, `sections/page.tsx`, `plots/page.tsx`, `plots/create/page.tsx`: reforçar validações e estados desabilitados; inserir controles de permissão nas ações.
- `src/app/(myapp)/(pages)/cemeteries/[id]/page.tsx`: incluir visão hierárquica (blocos → seções) usando DataTables existentes.
- `src/components/cemeteries/CemeteryForm.tsx`: manter e reforçar validações conforme FE-01/BE-01.

## Entrega
- Após aprovação, aplico as alterações nos arquivos acima, valido toda navegação e operações, e deixo o sistema consistente com os documentos BE-01 e FE-01, sem criação de novos arquivos e seguindo o Design System IGRP.