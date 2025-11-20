# FE-01 — Auditoria de Estado e Plano de Ação

## Visão Geral do Estado Atual
- **Páginas (MyApp):**
  - Cemitérios: listagem, criação e edição presentes (responsivos, IGRP DS).
  - Blocos/Seções: create/edit implementados com validação Zod e DS.
  - Sepulturas (Plots): listagem, criação e edição com validação e toasts.
  - Analytics/Maps: métricas e mapas interativos com camadas e filtros.
  - QR Codes: páginas de geração (single/lote) e scanner com UI pronta.
- **Componentes (src/components):**
  - Forms reutilizáveis (`PlotForm`, `PlotFields`, `BlockFields`, `SectionFields`).
  - QR Codes (`QRCodeGenerator`, `QRCodeScanner`), Mapas (`MapViewer`, `MapLayers`).
- **Integração e Validação:**
  - Validação Zod nos principais forms.
  - API local com switch mock/real (`USE_REAL_BACKEND`, `REAL_API_URL`) e `proxyFetch`.
- **Qualidade/Lint:**
  - Pontos a corrigir: imports/variáveis não usados, `any` em páginas de seções, chaves por índice em listas, dependências faltantes em `useEffect`.

## Lista Priorizada de Ações
1. **QR Codes end-to-end**
   - Integrar geração e validação com `/api/v1/plots/{id}/qr-code` e `/api/v1/plots/bulk-qr-generation`.
   - Atualizar `qrCode` do plot via `PUT /api/v1/plots/{id}` após geração.
2. **Padronização de Proxy**
   - Migrar endpoints que usam `IGRP_APP_MANAGER_API` para `proxyFetch` com `REAL_API_URL`.
3. **Testes de Integração**
   - Cobrir fluxos de QR e geolocalização; cenários 404/400; formato `{ data, pageable }`.
4. **Qualidade/Lint/A11y**
   - Remover imports/vars não usados; minimizar `any`; corrigir keys; revisar deps `useEffect`; labels/foco em QR.
5. **Documentação e Checklists**
   - Formalizar checklists por feature e registrar dependências e riscos.

## Checklists por Feature
### Geração de QR Codes
- [ ] Serviço com métodos: `getPlotQRCode`, `generatePlotQRCode`, `generateBulkQRCodes`.
- [ ] UI com opções (`size`, `format`, `errorCorrection`, `customColors`).
- [ ] Associação: atualizar `qrCode` via `PUT` após geração.
- [ ] Toasts e estados `loading/error/success` consistentes.
- [ ] Testes de sucesso/erro; remover mocks após verificação.

### Scanner/Validação de QR
- [ ] Upload/câmera funcional com SDK quando disponível.
- [ ] Resolver `plotId` via padrão de código ou endpoint `GET /plots/{id}/qr-code`.
- [ ] Navegação para detalhe do plot; mensagens de erro claras.
- [ ] A11y (labels, foco, teclado); responsividade.
- [ ] Testes dos fluxos e fallback explícito.

### Associação QR ↔ Plot
- [ ] Atualização do campo `qrCode` preservando demais metadados.
- [ ] Auditoria mínima (timestamp, usuário) quando aplicável.
- [ ] Validação e feedback robustos; testes de persistência.

### Geolocalização de Plot
- [ ] Form/flow para atualizar `geoPoint`.
- [ ] Integração com `POST /plots/{id}/geolocation`.
- [ ] Validação de latitude/longitude; toasts de sucesso/erro.
- [ ] Testes com cenários válidos/invalidos.

### Padronização de Proxy/API
- [ ] Substituir `IGRP_APP_MANAGER_API` por `REAL_API_URL` via `proxyFetch`.
- [ ] Documentar `.env` (exemplos úteis) e validar comportamento quando ausente.
- [ ] Garantir `cache: "no-store"` no proxy.

### Qualidade/Lint/A11y
- [ ] Remover imports/variáveis não utilizados.
- [ ] Minimizar `any` (usar tipos dos módulos `types`).
- [ ] Keys estáveis em listas; deps completas em `useEffect`.
- [ ] A11y consistente (labels, foco, navegação por teclado).

## Dependências e Riscos
- **Dependências:** `REAL_API_URL` disponível; endpoints de QR e geolocalização ativos; SDK/câmera para scanner.
- **Riscos:** indisponibilidade do backend; divergências contratuais; ausência de primitivos DS para imagens (usar `<img>` nativo como exceção documentada).

## Critérios de Qualidade
- **Design System IGRP:** uso exclusivo, sem componentes externos conflitantes.
- **Validação/Erros:** Zod; mensagens claras; fallback explícito ("Error: …").
- **Acessibilidade:** labels e foco adequados; contraste; teclado.
- **Performance:** renderizações otimizadas; sem dados mock fixos em produção.
- **Segurança:** sem segredos hardcoded; sanitização de inputs; menor privilégio.
- **Testes:** cobrir fluxos críticos; incluir erros; remover testes provisórios após validação.
- **Código Limpo:** nomes claros; sem comentários mortos; SOLID e camadas.

## Fase 2 — Revisão de Entregáveis
- **Proxy padronizado:** rotas `plots`, `qr-code`, `geolocation`, `cemeteries` e sub-recursos (`availability`, `heatmap-data`, `map-data`, `occupancy`, `statistics`, `structure`) usam `proxyFetch` e `REAL_API_URL`.
- **QR Codes:** geração single/lote integrada no serviço e UI; associação via `PUT /plots/{id}`; scanner valida `plotId` ou padrão `QR_<plotId>_<yyyy>`.
- **Qualidade de código:** remoção de `any` em serviços/hooks principais, correção de `useEffect` deps, chaves estáveis em listas, `next/image` para prévias.
- **Lint:** verificação concluída sem erros bloqueantes; warnings remanescentes mapeados para fase 3.

## Fase 3 — Plano Detalhado
- **Objetivo:** consolidar testes de integração e qualidade, finalizar padronizações menores, e preparar base para operação estável com backend real.
- **Escopo:**
  - Testes de integração: QR (single/lote), geolocalização, mapas (ocupancy/heatmap/map-data).
  - Fechamento de warnings: tipar filtros (`MapFilters`, `AnalyticsFilters`), remover imports/estados não usados, estabilizar callbacks.
  - Métricas e monitoramento: tempo de resposta, taxa de sucesso/erro por endpoint, cobertura de testes.
  - Controles de qualidade: checklists por feature, gates de release e auditoria mínima de alterações.
- **Entregáveis:**
  - Bateria de testes executada e validada (scripts efêmeros em PowerShell durante desenvolvimento, sem persistência em produção).
  - Documento de auditoria atualizado com KPIs, checklists e lições aprendidas.
  - Relatório de transição comunicado às partes interessadas.

## Recursos e Alocação
- **Humanos:** 1 dev frontend (IGRP/Next), 1 dev backend (API v1), QA compartilhado.
- **Técnicos:** ambiente `dev` ativo em `http://localhost:3000`, `USE_REAL_BACKEND` e `REAL_API_URL` configurados quando aplicável.
- **Financeiros:** sem custo adicional nesta fase (uso de infraestrutura existente).

## Métricas e KPIs
- **Disponibilidade de API:** `>= 99%` em `dev` (monitoramento manual via scripts).
- **Tempo de resposta médio (p95):** `<= 500ms` para `GET /plots/{id}` e `GET /cemeteries/{id}`.
- **Taxa de sucesso:** `>= 98%` para geração de QR single/lote.
- **Cobertura de testes (integração alvo):** QR e geolocalização com cenários de sucesso/erro.
- **Qualidade de código:** zero erros de lint; warnings residuais classificados e endereçados.

## Controles de Qualidade
- **Checklists por feature:** QR geração, scanner, associação, geolocalização, mapas.
- **Gates de release:** lint sem erros, testes críticos executados, validação manual de fluxos chave.
- **Fallbacks:** mensagens explícitas no formato `Error: …`, sem simulações persistidas.

## Comunicação da Transição
- **Stakeholders:** time de frontend, backend/API, produto.
- **Canais:** registro em documento de auditoria, atualização em reuniões semanais e notas de release internas.
- **Conteúdo:** resumo das correções de Fase 2, plano e métricas da Fase 3, riscos e mitigação.

## Lições Aprendidas
- **Padronização de proxy:** centralizar chamadas reais melhora manutenção e alternância mock/real.
- **Tipagem e lint:** reduzir `any` e estabilizar hooks evita erros sutis em produção.
- **Testes efêmeros:** scripts PowerShell rápidos auxiliam validação sem poluir repositório.

