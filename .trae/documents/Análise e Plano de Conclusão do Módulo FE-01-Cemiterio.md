## Estado Atual do Projeto
- Framework e arquitetura: Next.js App Router ativo com integração IGRP (imports e estilos em `src/app/layout.tsx:6-12`).
- Design System: Uso consistente do `@igrp/igrp-framework-react-design-system` em páginas e componentes (ex.: `src/components/cemeteries/CemeteryList.tsx:21`).
- Páginas principais: Rotas presentes para `cemeteries`, `maps`, `analytics`, `qr-codes-reports` (ex.: `src/app/(myapp)/(pages)/cemeteries/page.tsx`).
- Hooks:
  - `useCemetery`: implementado com CRUD e estatísticas (ex.: `src/hooks/useCemetery.ts:77-93`, `101-111`, `114-136`, `139-176`).
  - `usePlot`: implementado com CRUD, estatísticas e disponibilidade (ex.: `src/hooks/usePlot.ts:64-79`, `81-97`, `100-122`).
  - `useAnalytics`: interface pronta, porém sem integração real; usa fallback explícito (ex.: erro em `src/hooks/useAnalytics.ts:79,95,117,137,156,175`).
  - `useMap`: UI e API do hook prontas, mas dados são mock/placeholder (ex.: `src/hooks/useMap.ts:95-134`, `152-201`, `213-261`).
- Services:
  - `CemeteryService` e `PlotService` implementados com múltiplos métodos; baseados em `NEXT_PUBLIC_API_URL`.
  - Discrepâncias com BE: `getCemeteryStructures` usa `/structures` (ex.: `src/services/cemeteryService.ts:156-165`) enquanto BE define `/structure`; projeções em `/capacity-projections` (ex.: `src/services/cemeteryService.ts:180-191`) vs BE `/capacity-projection` com `projectionPeriod`; endpoints de estado de sepulturas (`/occupy`, `/available`, `/reserve`, `/cancel-reservation`) não estão no BE (ex.: `src/services/plotService.ts:375-443`).
- Componentes UI:
  - Listas e métricas: `CemeteryList` completo e aderente ao DS (ex.: tabela em `src/components/cemeteries/CemeteryList.tsx:285-414`).
  - Dashboard: `DashboardMetrics` consolidando métricas via hooks (ex.: `src/components/dashboard/DashboardMetrics.tsx:50-99`).
  - Mapas: `MapViewer` com controles e UI; visualização do mapa é placeholder (ex.: `src/components/maps/MapViewer.tsx:404-425`).
  - QR Codes: `QRCodeGenerator` e `QRCodeScanner` com UI e fallback de erro, sem backend (ex.: `src/components/qr-codes/QRCodeGenerator.tsx:51-55,66-72`; `src/components/qr-codes/QRCodeScanner.tsx:54-66`).
  - Relatórios: `ReportGenerator` com UI e agendamento; sem serviço (ex.: `src/components/reports/ReportGenerator.tsx:137-145`).
- Camadas ausentes vs plano: `repositories/` (não existe), `actions` de domínio (apenas `actions/igrp/*`), `app/api/v1` para cemitérios/plots/analytics (somente `auth` e `health`).
- Não funcional (do FE-01): React Query, Service Worker, WebSocket, rate limiting — ainda não presentes no `package.json` nem no código.

## Aderência a Requisitos
- Técnicos:
  - DS IGRP: aderente.
  - Next.js App Router: aderente.
  - Tipos TypeScript: abrangentes (diretórios `src/types`), ainda há pequenos desvios nos nomes/campos vs BE (ver seção de tipos).
  - Integração com backend: parcial; serviços apontam para endpoints divergentes.
- Negócio:
  - Dashboard com métricas básicas: parcial.
  - Gestão hierárquica: UI inicial (lista e páginas), sem árvore e CRUD completo por nível.
  - Mapa interativo: UI sem renderização real.
  - QR Codes: UI sem geração/validação.
  - Relatórios: UI sem geração/exports.

## Nível de Completude por Funcionalidade
- Dashboard e Analytics: 40% — UI e hooks prontos; falta dados reais e gráficos.
- Gestão de Cemitérios: 60% — lista/CRUD via hooks/services; ajustar endpoints e validações.
- Gestão Hierárquica (bloco/setor/sepultura): 35% — falta árvore, páginas dedicadas e validações.
- Mapeamento Interativo: 30% — UI de controles; falta engine de mapa e dados geoespaciais BE.
- QR Codes: 25% — UI; falta geração, validação e batch com BE.
- Relatórios/Exportações: 25% — UI; falta serviço de geração e arquivos.
- Infraestrutura não funcional (cache, SW, WS, throttling): 0% — pendente.

## Pontos Fortes
- Conformidade com DS IGRP e App Router.
- Hooks coesos para `cemetery` e `plot` com estados/erros padronizados.
- Estrutura de tipos rica e consistente no FE.
- Páginas e navegação principais já mapeadas.

## Oportunidades de Melhoria
- Alinhamento estrito dos serviços com BE-01 endpoints.
- Remover placeholders e mocks conforme regra "Real Data Only".
- Adicionar camada `repositories/` e `actions/` de domínio conforme plano.
- Implementar mapa real (Leaflet/MapboxGL) sob exceção documentada, mantendo UI DS.
- Introduzir React Query para cache/sincronização e estados (aprovando dependência).

## Gap Analysis Cruzada (FE-01 vs BE-01)
- Endpoints divergentes:
  - Estrutura: FE usa `/cemeteries/{id}/structures`; BE define `/cemeteries/{id}/structure`.
  - Projeções: FE usa `/capacity-projections?years=`; BE define `/capacity-projection?projectionPeriod=`.
  - Ocupação: BE expõe `/cemeteries/{id}/occupancy`; FE não consome ainda.
  - Heatmap: BE `/cemeteries/{id}/heatmap-data`; FE hook está preparado mas sem consumo.
  - Disponibilidade: BE `/cemeteries/{id}/availability`; FE possui em `PlotService` via `/plots/availability`.
  - Operações de estado de sepulturas (occupy/reserve): não documentadas em BE; revisar ou remover.
- Tipos:
  - FE usa `plotType: "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY"` (coerente com BE); FE-01 atualizado menciona `COLUMBARIUM` em alguns trechos — padronizar como `NICHE` conforme BE.
  - Campos adicionais do BE (ex.: `municipalityName`, contagens por nível) não estão nos tipos FE atuais; definir mapeadores/schemas opcionais.

## Plano Prioritário por Critérios
1) Alto impacto + baixa dependência
- Alinhar `CemeteryService` e `PlotService` aos endpoints BE (métricas, estrutura, heatmap, disponibilidade, projeções).
- Substituir mocks/fallbacks por chamadas reais em `useAnalytics` e `useMap`.
- Corrigir tipos e contratos (padronização de enums e campos).
2) Alto impacto + dependência média
- Implementar `repositories/` + `actions/` de domínio como camada de estabilidade.
- Introduzir React Query para cache e invalidação; manter sem novas libs até aprovação.
3) Impacto médio + maior complexidade
- Engine de mapa real (Leaflet/MapboxGL) com wrapper UI IGRP; camadas e marcadores consumindo BE.
- Sistema de QR Codes (geração, validação, batch) integrado ao BE.
- Relatórios (geração/exportação/agendamento) com serviços BE.
4) Não funcional
- Service Worker (offline crítico), WebSocket (atualizações), rate limiting no FE.

## Cronograma Realista
- Semana 1:
  - Corrigir serviços e contratos (cemetery/plot) e remover endpoints não suportados.
  - Adequar tipos e mapear respostas BE com Zod (validação runtime).
  - Ajustar `useAnalytics` e `useMap` para consumir BE (ocupancy, heatmap, statistics, projections).
- Semana 2:
  - Introduzir `repositories/` e `actions/` de domínio; migrar chamadas diretas.
  - Implementar árvore hierárquica (cemitério → bloco → setor → sepultura) e páginas dedicadas.
- Semana 3:
  - Engine de mapa real com camadas e marcadores; heatmap consumindo BE.
  - QR Codes: geração única e validação; depois batch.
- Semana 4:
  - Relatórios: geração e exportação (PDF/CSV/Excel) + agendamento básico.
  - React Query (se aprovado) e SW offline para rotas críticas; websockets para alertas.

## Validação de Tipos e Contratos
- Estratégia:
  - Zod schemas espelhando respostas BE (ocupancy, structure, heatmap, availability, projections) e parsers em `services/*`.
  - Mapeadores estritos: funções de normalização por endpoint (ex.: `formatCemeteryData` análogo ao FE-01).
  - Testes de contrato: chamar BE em ambiente de staging e validar com schemas (sem mocks, respeitando "Real Data Only").
- Discrepâncias e soluções:
  - `structure` vs `structures`: alinhar path e schema; permitir campos extras como opcionais.
  - `capacity-projection` parâmetros: renomear `years` → `projectionPeriod` e ajustar tipos.
  - Disponibilidade e ocupação: mover consumo para endpoints de `/cemeteries/{id}/availability` e `/occupancy`.

## Recomendações Técnicas
- Centralizar base da API e headers em `services/*`; remover `apiKey` local se não usado; usar sessão/autorização padrão IGRP.
- Evitar endpoints não documentados no BE; qualquer operação adicional deve ser proposta ao BE.
- Adotar fallback mínimo conforme regra 15: mensagens claras sem dados default.
- Preparar camadas para extensão futura (OCP): componentes stateless + hooks encapsulando lógica.

## Métricas de Qualidade e Completude (alvo)
- Cobertura de testes (quando aprovados): ≥80% para hooks/services.
- Performance: LCP < 2.5s; uso de lazy em mapas e gráficos.
- Acessibilidade: Lighthouse ≥90.
- Completude funcional por área: atingir ≥85% em 4 semanas (conforme cronograma).

## Critérios de Aceitação por Item
- Serviços alinhados ao BE: todos os métodos chamam endpoints BE e validam respostas com Zod; sem mocks; erros explícitos.
- Analytics: Painel exibe ocupação, tendências, heatmap e projeções com dados BE; sem placeholders.
- Mapa: Visualização com camadas, zoom e marcadores; dados GeoJSON/Simplify conforme BE; heatmap renderizado.
- QR Codes: Geração, validação e batch com resposta de progresso/download.
- Relatórios: Geração/exportação com filtros e agendamento; arquivos baixáveis.
- Hierarquia: Árvore navegável com CRUD por nível e breadcrumb.

## Próximos Passos
1. Aprovar este plano e a padronização de endpoints e tipos.
2. Autorizar, se necessário, dependências para Zod/React Query e engine de mapa.
3. Iniciar ajustes em Services e Hooks (Semana 1) e validar com BE em staging.
4. Agendar revisão cruzada técnica semanal e checkpoints de aceitação por área.
