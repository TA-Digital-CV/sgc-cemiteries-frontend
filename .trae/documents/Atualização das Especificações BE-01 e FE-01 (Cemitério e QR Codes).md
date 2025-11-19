## **Objetivo**
- Alinhar a documentação de backend (BE-01-Cemiterio.md) com a API local em `src/app/api` e os mocks em `src/app/api/mock-data.ts`.
- Definir o plano de implementação para o frontend (FE-01-Cemiterio.md) focado em QR Codes para plots, cobrindo geração, leitura/validação e associação.

## **Backend (BE-01-Cemiterio.md)**
### **Arquitetura e Switch Mock/Real**
- Introduzir o mecanismo oficial de switch:
  - `USE_REAL_BACKEND` (booleano) e `REAL_API_URL` em `src/app/api/config.ts`.
  - Padronizar todos os endpoints para usar `proxyFetch(req, path)` quando `USE_REAL_BACKEND=true`.
  - Remover a divergência de `IGRP_APP_MANAGER_API` nos endpoints e centralizar em `REAL_API_URL`.
- Documentar variáveis `.env`:
  - `USE_REAL_BACKEND=true|false`, `REAL_API_URL=https://.../api/v1`.

### **Mapa de Endpoints (Plots)**
- `GET /api/v1/plots` (paginado)
  - Params: `page`, `size`
  - Resposta: `{ data: Plot[], pageable: { page, size, totalElements, totalPages } }`
  - Mock: usa `pageable(plots)` em `mock-data.ts`
- `POST /api/v1/plots`
  - Body: `PlotFormData`
  - Resposta: `{ data: Plot }` (201)
  - Mock: cria id, datas e `occupationStatus="AVAILABLE"`
- `GET /api/v1/plots/{id}`
  - Resposta: `Plot` | `404 NOT_FOUND`
- `PUT /api/v1/plots/{id}`
  - Body: `Partial<PlotFormData>` (campos atualizáveis)
  - Resposta: `Plot` | `404 NOT_FOUND`
- `DELETE /api/v1/plots/{id}`
  - Regras: somente quando `occupationStatus="AVAILABLE"`
  - Resposta: `{ deleted: true } | 400 CANNOT_DELETE | 404 NOT_FOUND`
- `GET /api/v1/plots/search`
  - Params: `cemeteryId`, `blockId`, `sectionId`, `plotNumber`, `plotType`, `status`, `q`, `nearPoint`, `radius`, `availableOnly`, `plotTypes`, `minDimensions`
  - Resposta: `{ data: Plot[] }`
- `GET /api/v1/plots/{id}/qr-code`
  - Resposta: `{ plotId, qrCode } | 404 NOT_FOUND`
- `POST /api/v1/plots/bulk-qr-generation`
  - Body: `{ plotIds: string[] }`
  - Resposta: `{ data: Array<{ id, qrCode }> }`
- `POST /api/v1/plots/{id}/geolocation`
  - Body: `{ latitude: number, longitude: number }`
  - Resposta: `{ ...Plot, geoPoint, lastModifiedDate } | 404 NOT_FOUND`

### **Mapa de Endpoints (Cemitérios/Blocos/Seções)**
- Cemitérios:
  - `GET /api/v1/cemeteries` (lista/paginado)
  - `GET /api/v1/cemeteries/{id}` (detalhe)
  - Sub-recursos: `statistics`, `occupancy`, `map-data`, `heatmap-data`, `structure`, `capacity-projection`, `availability`
- Blocos: `GET /api/v1/cemetery-blocks`, `GET|PUT /api/v1/cemetery-blocks/{id}`
- Seções: `GET /api/v1/cemetery-sections`, `GET|PUT /api/v1/cemetery-sections/{id}`

### **Modelos e Validação**
- Referenciar tipos existentes:
  - `src/types/Plot.ts` → `Plot`, `PlotFormData`, `PlotDimensions`, `GeoPoint`, `PlotType`, `PlotStatus`.
  - `src/types/cemetery.ts` → `Cemetery`, `CemeteryBlock`, `CemeterySection` (padrões de campos e relacionamentos).
  - `src/types/QRCode.ts` → `QRCodeData`, `QRCodeBatchRequest/Response`, `QRCodeScanResult`.
- Especificar Zod de alto nível para payloads principais (exemplos):
  - PlotFormData: campos obrigatórios, ranges para `geoPoint`, `dimensions`, enums de `plotType` e `unit`.
  - Geolocation update: validação de latitude/longitude.
  - Bulk QR generation: `plotIds: string[]` não vazios.
- Códigos HTTP padronizados: 200/201/204, 400 (validation), 404 (not found), 500 (backend indisponível ou erro proxy).

### **Mock Data e Casos de Teste**
- Alinhar `mock-data.ts` com tipos e cenários reais:
  - `plots`: incluir exemplos com e sem `geoPoint`, com `qrCode`, dimensões variadas e `occupationStatus` diferentes.
  - `cemeteries/blocks/sections`: refletir relacionamentos e métricas.
- Casos de teste (via `src/app/api/tests/test.ps1` e README):
  - Sucesso: criação, atualização, busca, QR code, geolocalização.
  - Erros: 404 (id inexistente), 400 (delete com `occupationStatus!=AVAILABLE`), validação de query.
- Diretriz: mocks devem reproduzir forma da resposta real (`data`, `pageable/pagination`, `metadata` quando aplicável), e serem substituíveis pelo proxy sem alterar contratos.

## **Frontend (FE-01-Cemiterio.md)**
### **Interface e Componentes (QR Codes)**
- Geração:
  - Usar `QRCodeGenerator.tsx` com integração ao endpoint `POST /plots/bulk-qr-generation` e (opcional) `POST /plots/{id}/qr-code` caso seja disponibilizado; fallback atual deve ser removido quando API real estiver ativa.
  - Propagar opções (`size`, `format`, `errorCorrection`, `customColors`) alinhadas a `QRCodeOptions`.
- Leitura/Validação:
  - Usar `QRCodeScanner.tsx` com fluxo de upload/câmera; ao obter `code`, chamar `GET /plots/{id}` ou `GET /plots/{id}/qr-code` conforme formato do código.
  - Validar código e exibir feedback consistente com DS; mensagens de erro devem seguir a política de fallback explícita.
- Associação QR↔Plot:
  - Ao gerar QR, atualizar o `qrCode` do plot via `PUT /plots/{id}`.
  - Documentar visualização do QR no detalhe da sepultura e ações (download/compartilhar).

### **Fluxos Funcionais**
- Cadastro da associação QR-plot:
  - Form: selecionar `cemeteryId`/`plotId` → gerar QR → atualizar plot (`qrCode`) → confirmação.
- Consulta de plot via QR Code:
  - Scanner obtém `code` → resolve `plotId` (padrão `QR_{plotId}_{yyyy}` ou resposta do endpoint) → carrega detalhe do plot.
- Atualização de informações associadas:
  - Alterar dimensões, localização, notas → `PUT /plots/{id}` → manter `qrCode`.

### **Serviços e Hooks**
- Estender `PlotService` com métodos:
  - `getPlotQRCode(id)`, `generatePlotQRCode(id, options?)`, `generateBulkQRCodes(plotIds, options?)`.
  - Reaproveitar `proxyFetch` no backend; no frontend, usar a rota `/api/v1` para manter o switch.
- Atualizar `usePlot` (se necessário) com ações de QR (opcional, ou criar `useQRCode`).

### **UX/UI e Acessibilidade**
- Componentes IGRP: inputs, labels, cards, toasts; manter consistência visual.
- Estados: `loading`, `success`, `error`, com mensagens significativas.
- Responsividade: grids (`md:grid-cols-*`) nos formulários.

### **Alinhamento e Testes**
- Alinhar contratos com BE-01; utilizar tipos de `src/types/QRCode.ts` e `src/types/Plot.ts`.
- Testes de integração do fluxo: geração/associação, leitura/consulta, atualização.
- Remover fallbacks “simulados” quando `USE_REAL_BACKEND=true`; manter mensagens explícitas quando indisponível.

## **Entregáveis**
- BE-01-Cemiterio.md: seções de endpoints, contratos, validações, códigos de status, switch, mocks e cenários de teste.
- FE-01-Cemiterio.md: seções de interface e fluxos de QR, serviços/hooks, UX/UI, alinhamento com backend e testes.

## **Confirmação**
- Ao aprovar, aplico as atualizações nos dois documentos `.md`, padronizo o uso de `proxyFetch` nos endpoints que ainda usam `IGRP_APP_MANAGER_API` e ajusto os mocks quando necessário, sem alterar versões ou dependências.