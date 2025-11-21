## Visão Geral
- Objetivo: finalizar a API real em `src/app/api/v1` conforme `API_ENDPOINTS_DOCUMENTATION.md` e `docs/sgc-swagger.json`, padronizando autenticação, validação, erros, logs e testes.
- Base real: usar `REAL_API_URL` e `USE_REAL_BACKEND` para alternar entre proxy real e mocks.
- Autenticação: propagar Bearer Token do NextAuth para o backend.
- Erros: resposta padronizada (error, message, details, timestamp) e status adequados.
- Validação: usar `zod` (já presente no projeto) para validar bodies e queries.

## Premissas
- Endpoints de Enums estão sob `/api/enums/*` no Swagger; serão implementados em `src/app/api/enums/*` para aderir ao contrato, mantendo v1 para os demais.
- Para todos os demais endpoints, criar/ajustar rotas em `src/app/api/v1/*` seguindo o roteamento de arquivo do Next.js.
- Não remover lógica mock; apenas garantir que quando `USE_REAL_BACKEND=true` sempre proxy para o backend.

## Infraestrutura Comum
1. Autenticação no proxy
   - Adicionar leitura do token via `getAccessToken()` em `src/lib/auth-helpers.ts:5-18`.
   - Incluir `Authorization: Bearer <accessToken>` em todas as chamadas do proxy.
   - Em ausência de token quando requerido: retornar 401 com objeto de erro padronizado.
   - Referência do proxy atual: `src/app/api/config.ts:9-27`.
2. Padronização de erros
   - Criar helper reutilizável (no próprio `config.ts`) para `errorResponse(code, message, status, details?)` retornando shape padronizado.
   - Garantir uso consistente em todos os handlers, substituindo retornos ad-hoc.
3. Logging
   - Logs mínimos com `console.error` em falhas e `console.debug` em proxys, sem expor segredos.
   - Incluir `X-Request-ID` no proxy (gerar se ausente) para correlação entre frontend e backend.
4. Validação com `zod`
   - Validar payloads `POST/PUT` e queries críticas (`page`, `size`, IDs, etc.).
   - Exemplo: schemas para `cemeteries`, `plots`, `work-orders`, `concessions` e afins, alinhados ao Swagger.

## Padrões a Seguir (conforme código atual)
- Reuso do `proxyFetch` (`src/app/api/config.ts:9-27`).
- Handlers `GET/POST/PUT/DELETE` no estilo de `cemeteries` (`src/app/api/v1/cemeteries/route.ts:8-25`, `31-48`) e `plots` (`src/app/api/v1/plots/route.ts:8-17`, `23-38`).
- Uso de `NextRequest` quando for necessário `nextUrl` (`src/app/api/v1/cemeteries/[id]/route.ts:13-20`, `110-133`).

## Mapa de Implementação de Endpoints
A seguir, os grupos de endpoints que serão criados/ajustados como proxy ao backend, com validação e erros padronizados. Onde já existem, apenas alinhar ao padrão acima.

1) Enums (novo, fora do v1)
- `src/app/api/enums/*/route.ts` para cada enum listado no Swagger (OccupationStatus, PlotType, Status, etc.).
- Método: `GET` → proxy simples.

2) Cemitérios (já existem, revisar)
- Revisar `GET/POST` de `cemeteries` e `GET/PUT/DELETE` de `cemeteries/{id}` para usar proxy autêntico sempre que `USE_REAL_BACKEND` (hoje há mistura com `IGRP_APP_MANAGER_API`).
- Sub-rotas já presentes: `structure`, `statistics`, `occupancy`, `map-data`, `capacity-projection`, `heatmap-data`, `availability`. Manter mocks e adicionar proxy real onde ausente.

3) Blocos e Seções (parcialmente presentes)
- `cemetery-blocks`: `POST`, `GET`, `PUT`, `GET {id}`.
- `cemetery-sections`: `POST`, `GET`, `PUT`, `GET {id}`.
- Unificar uso do `proxyFetch` e validações de payload (zod) para criação/atualização.

4) Lotes (plots) (presentes, ampliar)
- `plots`: `GET`, `POST` (já), `PUT/DELETE {id}` (já), `geolocation`, `qr-code`, `bulk-qr-generation`, `search`, `statistics` (presentes).
- Adicionar validação zod para `POST`, `PUT`, `geolocation` e filtros de `search`.

5) Concessões e Tipos
- `concessions`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `DELETE {id}`, `transfer`, `renew`, `expiring`.
- `concession-types`: `GET`, `POST`, `GET {id}`, `PUT {id}`.

6) Solicitações/Transferências/Renovações de Concessão
- `concession-requests`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `approve`, `reject`, `pending`.
- `concession-transfers`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `approve`, `reject`.
- `concession-renewals`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `payment-status`.

7) Ordens de Trabalho
- `work-orders`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `start`, `complete`, `evidences` (multipart), `team/{teamId}`, `pending`.
- Validação: tipos, prioridade, datas e relacionamentos com `plotId/teamId`.

8) Transferências Operacionais
- `transfers`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `approve`, `execute`, tipos especiais (`inter-cemetery`), evidências (`transfer-evidences` [list, create, {id}, {transferId}]).

9) Agendamentos e Equipes
- `schedules`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `cancel`, `assign-team`, `conflicts`, `availability`.
- `teams`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `availability`.

10) Pessoas, Funerárias
- `persons`: `GET`, `POST`, `GET {id}`, `PUT {id}`.
- `funeral-homes`: `GET`, `POST`, `GET {id}`, `PUT {id}`.

11) Tabelas de Taxas e Pagamentos
- `fee-tables`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `activate`, `deactivate`.
- `payments/process`.
- `payment-guides`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `payments`, `barcode`, `regenerate`.

12) Cálculos
- `calculations`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `confirm`, `apply-interest`, `apply-discount`, `recalculate`.

13) Sepultamentos e Exumações
- `burials`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `complete`, `evidences`.
- `exhumations`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `destination`, `execute`, `evidences`.

14) Inadimplentes
- `defaulters`: `GET`, `POST`, `GET {id}`, `PUT {id}`, `bulk-notice`, `negotiate`, `contact`, `installment`, `collection-stage`.

## Validação e Tratamento de Erros
- Queries: normalizar `page`, `size`, `sort`, `direction` e filtros comuns; retornar 400 com erro padronizado quando inválidos.
- Bodies: zod schemas por entidade, retornando 422 em validação com mensagens claras.
- Erros do backend: repassar status, padronizar shape, adicionar `timestamp`.

## Segurança
- Sem segredos em logs; headers sensíveis removidos dos logs.
- Sanitizar entradas de texto (trim, limites de tamanho) quando aplicável.

## Testes
- Unitários (Vitest): importar handlers e chamar com `new Request(URL, { method, body })`, cobrindo sucesso, validação e erros.
- Integração: testar proxy real com `USE_REAL_BACKEND=true` (ambiente de dev), cobrindo `Authorization` e encaminhamento de headers.
- Cobertura: mínimo 80% nos novos arquivos de rotas.

## Validação de Ambiente
- Variáveis: `USE_REAL_BACKEND`, `REAL_API_URL`, `NEXTAUTH_SECRET`, Keycloak (`KEYCLOAK_*`) já usadas por auth.
- Middleware atual não intercepta `/api/*` (`src/middleware.ts:45-47`), então autenticação será só no proxy/handlers.

## Referências de Código
- Proxy comum: `src/app/api/config.ts:9-27`.
- Exemplo de lista com paginação: `src/app/api/v1/cemeteries/route.ts:8-25`.
- Exemplo de criação com fallback mock: `src/app/api/v1/plots/route.ts:23-38`.
- Exemplo de uso de `NextRequest` e path params: `src/app/api/v1/cemeteries/[id]/route.ts:13-20, 110-133`.
- Acesso ao token: `src/lib/auth-helpers.ts:5-18`.

## Entregáveis
- Novas rotas adicionadas conforme mapa acima, com validação e erros padronizados.
- Proxy autenticado e padronização de erros/logs.
- Suite de testes unitários e de integração.
- Verificação de aderência ao Swagger e documentação mantida.

Confirma prosseguir com a implementação seguindo este plano?