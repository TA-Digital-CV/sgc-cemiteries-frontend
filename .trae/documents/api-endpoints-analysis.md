# Análise Completa de Endpoints da API SGC-Cemiteries

## Visão Geral
Este documento contém a análise completa de todos os endpoints da API do Sistema de Gestão de Cemitérios, extraída do arquivo Swagger localizado em `docs/sgc-swagger.json`.

## Módulos da API

### 1. Enums (iGRP Enums)
Endpoints para consulta de valores de enumeração do sistema.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/enums/OccupationStatus` | Retorna valores do enum OccupationStatus |
| GET | `/api/enums/PlotType` | Retorna valores do enum PlotType |
| GET | `/api/enums/Status` | Retorna valores do enum Status |
| GET | `/api/enums/ApprovalStatus` | Retorna valores do enum ApprovalStatus |
| GET | `/api/enums/Category` | Retorna valores do enum Category |
| GET | `/api/enums/ConcessionStatus` | Retorna valores do enum ConcessionStatus |
| GET | `/api/enums/DurationType` | Retorna valores do enum DurationType |
| GET | `/api/enums/PaymentStatus` | Retorna valores do enum PaymentStatus |
| GET | `/api/enums/RequestType` | Retorna valores do enum RequestType |
| GET | `/api/enums/TransferReason` | Retorna valores do enum TransferReason |
| GET | `/api/enums/WorkflowStatus` | Retorna valores do enum WorkflowStatus |
| GET | `/api/enums/BurialStatus` | Retorna valores do enum BurialStatus |
| GET | `/api/enums/ExhumationReason` | Retorna valores do enum ExhumationReason |
| GET | `/api/enums/ExhumationStatus` | Retorna valores do enum ExhumationStatus |
| GET | `/api/enums/ExhumationType` | Retorna valores do enum ExhumationType |
| GET | `/api/enums/OperationType` | Retorna valores do enum OperationType |
| GET | `/api/enums/RemainsDestination` | Retorna valores do enum RemainsDestination |
| GET | `/api/enums/SchedulePriority` | Retorna valores do enum SchedulePriority |
| GET | `/api/enums/ScheduleStatus` | Retorna valores do enum ScheduleStatus |
| GET | `/api/enums/TransferStatus` | Retorna valores do enum TransferStatus |
| GET | `/api/enums/WorkOrderStatus` | Retorna valores do enum WorkOrderStatus |

### 2. Cemitérios (Cemeterie)
Gestão de cemitérios e suas informações.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/cemeteries` | Cemeterie | Lista todos os cemitérios |
| POST | `/api/v1/cemeteries` | Cemeterie | Cria novo cemitério |
| GET | `/api/v1/cemeteries/{id}` | Cemeterie | Obtém detalhes de um cemitério |
| PUT | `/api/v1/cemeteries/{id}` | Cemeterie | Atualiza cemitério |
| DELETE | `/api/v1/cemeteries/{id}` | Cemeterie | Remove cemitério |
| GET | `/api/v1/cemeteries/{id}/structure` | Cemeterie | Obtém estrutura do cemitério |
| GET | `/api/v1/cemeteries/{id}/statistics` | Cemeterie | Estatísticas do cemitério |
| GET | `/api/v1/cemeteries/{id}/occupancy` | Cemeterie | Taxa de ocupação |
| GET | `/api/v1/cemeteries/{id}/map-data` | Cemeterie | Dados para mapa |
| GET | `/api/v1/cemeteries/{id}/heatmap-data` | Cemeterie | Dados de heatmap |
| GET | `/api/v1/cemeteries/{id}/capacity-projection` | Cemeterie | Projeção de capacidade |
| GET | `/api/v1/cemeteries/{id}/availability` | Cemeterie | Verifica disponibilidade |

### 3. Blocos de Cemitério (CemeteryBlock)
Gestão de blocos dentro dos cemitérios.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/cemetery-blocks` | CemeteryBlock | Lista blocos |
| POST | `/api/v1/cemetery-blocks` | CemeteryBlock | Cria novo bloco |
| GET | `/api/v1/cemetery-blocks/{id}` | CemeteryBlock | Obtém bloco específico |
| PUT | `/api/v1/cemetery-blocks/{id}` | CemeteryBlock | Atualiza bloco |

### 4. Seções de Cemitério (CemeterySection)
Gestão de seções dentro dos blocos.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/cemetery-sections` | CemeterySection | Lista seções |
| POST | `/api/v1/cemetery-sections` | CemeterySection | Cria nova seção |
| GET | `/api/v1/cemetery-sections/{id}` | CemeterySection | Obtém seção específica |
| PUT | `/api/v1/cemetery-sections/{id}` | CemeterySection | Atualiza seção |

### 5. Lotes (Plot)
Gestão de lotes (jazigos) do cemitério.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/plots` | Plot | Lista todos os lotes |
| POST | `/api/v1/plots` | Plot | Cria novo lote |
| GET | `/api/v1/plots/{id}` | Plot | Obtém detalhes do lote |
| PUT | `/api/v1/plots/{id}` | Plot | Atualiza lote |
| DELETE | `/api/v1/plots/{id}` | Plot | Remove lote |
| POST | `/api/v1/plots/{id}/geolocation` | Plot | Atualiza geolocalização |
| GET | `/api/v1/plots/{id}/qr-code` | Plot | Obtém QR code do lote |
| POST | `/api/v1/plots/bulk-qr-generation` | Plot | Gera QR codes em massa |

### 6. Concessões (Concession)
Gestão de concessões de lotes.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/concessions` | Concession | Lista concessões |
| POST | `/api/v1/concessions` | Concession | Cria nova concessão |
| GET | `/api/v1/concessions/{id}` | Concession | Obtém concessão |
| PUT | `/api/v1/concessions/{id}` | Concession | Atualiza concessão |
| POST | `/api/v1/concessions/{id}/transfer` | Concession | Transfere concessão |
| POST | `/api/v1/concessions/{id}/renew` | Concession | Renova concessão |
| GET | `/api/v1/concessions/expiring` | Concession | Lista concessões vencendo |

### 7. Tipos de Concessão (ConcessionType)
Gestão de tipos de concessão.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/concession-types` | ConcessionType | Lista tipos de concessão |
| POST | `/api/v1/concession-types` | ConcessionType | Cria novo tipo |
| GET | `/api/v1/concession-types/{id}` | ConcessionType | Obtém tipo específico |
| PUT | `/api/v1/concession-types/{id}` | ConcessionType | Atualiza tipo |

### 8. Solicitações de Concessão (ConcessionRequest)
Gestão de solicitações de concessão.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/concession-requests` | ConcessionRequest | Lista solicitações |
| POST | `/api/v1/concession-requests` | ConcessionRequest | Cria nova solicitação |
| GET | `/api/v1/concession-requests/{id}` | ConcessionRequest | Obtém solicitação |
| PUT | `/api/v1/concession-requests/{id}` | ConcessionRequest | Atualiza solicitação |
| PUT | `/api/v1/concession-requests/{id}/approve` | ConcessionRequest | Aprova solicitação |
| PUT | `/api/v1/concession-requests/{id}/reject` | ConcessionRequest | Rejeita solicitação |
| GET | `/api/v1/concession-requests/pending` | ConcessionRequest | Lista solicitações pendentes |

### 9. Transferências de Concessão (ConcessionTransfer)
Gestão de transferências de concessão.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/concession-transfers` | ConcessionTransfer | Lista transferências |
| POST | `/api/v1/concession-transfers` | ConcessionTransfer | Cria nova transferência |
| GET | `/api/v1/concession-transfers/{id}` | ConcessionTransfer | Obtém transferência |
| PUT | `/api/v1/concession-transfers/{id}` | ConcessionTransfer | Atualiza transferência |
| PUT | `/api/v1/concession-transfers/{id}/approve` | ConcessionTransfer | Aprova transferência |
| PUT | `/api/v1/concession-transfers/{id}/reject` | ConcessionTransfer | Rejeita transferência |

### 10. Renovações de Concessão (ConcessionRenewal)
Gestão de renovações de concessão.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/concession-renewals` | ConcessionRenewal | Lista renovações |
| POST | `/api/v1/concession-renewals` | ConcessionRenewal | Cria nova renovação |
| GET | `/api/v1/concession-renewals/{id}` | ConcessionRenewal | Obtém renovação |
| PUT | `/api/v1/concession-renewals/{id}` | ConcessionRenewal | Atualiza renovação |
| PUT | `/api/v1/concession-renewals/{id}/payment-status` | ConcessionRenewal | Atualiza status de pagamento |

### 11. Ordens de Trabalho (WorkOrder)
Gestão de ordens de trabalho.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/work-orders` | WorkOrder | Lista ordens de trabalho |
| POST | `/api/v1/work-orders` | WorkOrder | Cria nova ordem |
| GET | `/api/v1/work-orders/{id}` | WorkOrder | Obtém ordem específica |
| PUT | `/api/v1/work-orders/{id}` | WorkOrder | Atualiza ordem |
| PUT | `/api/v1/work-orders/{id}/assign-team` | WorkOrder | Atribui equipe |
| POST | `/api/v1/work-orders/{id}/start` | WorkOrder | Inicia ordem |
| POST | `/api/v1/work-orders/{id}/complete` | WorkOrder | Completa ordem |
| POST | `/api/v1/work-orders/{id}/evidences` | WorkOrder | Adiciona evidências |
| GET | `/api/v1/work-orders/team/{teamId}` | WorkOrder | Ordens por equipe |
| GET | `/api/v1/work-orders/pending` | WorkOrder | Ordens pendentes |

### 12. Transferências Operacionais (Transfer)
Gestão de transferências operacionais.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/transfers` | Transfer | Lista transferências |
| POST | `/api/v1/transfers` | Transfer | Cria nova transferência |
| GET | `/api/v1/transfers/{id}` | Transfer | Obtém transferência |
| PUT | `/api/v1/transfers/{id}` | Transfer | Atualiza transferência |
| PUT | `/api/v1/transfers/{id}/approve` | Transfer | Aprova transferência |
| POST | `/api/v1/transfers/{id}/execute` | Transfer | Executa transferência |
| POST | `/api/v1/transfers/inter-cemetery` | Transfer | Transferência entre cemitérios |

### 13. Evidências de Transferência (TransferEvidence)
Gestão de evidências de transferência.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/transfer-evidences` | TransferEvidence | Lista evidências |
| POST | `/api/v1/transfer-evidences` | TransferEvidence | Cria nova evidência |
| GET | `/api/v1/transfer-evidences/{id}` | TransferEvidence | Obtém evidência |
| PUT | `/api/v1/transfer-evidences/{id}` | TransferEvidence | Atualiza evidência |
| DELETE | `/api/v1/transfer-evidences/{id}` | TransferEvidence | Remove evidência |
| GET | `/api/v1/transfer-evidences/{transferId}` | TransferEvidence | Evidências por transferência |

### 14. Sepultamentos (Burial)
Gestão de sepultamentos.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/burials` | Burial | Lista sepultamentos |
| POST | `/api/v1/burials` | Burial | Cria novo sepultamento |
| GET | `/api/v1/burials/{id}` | Burial | Obtém sepultamento |
| PUT | `/api/v1/burials/{id}` | Burial | Atualiza sepultamento |
| POST | `/api/v1/burials/{id}/complete` | Burial | Completa sepultamento |

### 15. Evidências de Sepultamento (BurialEvidence)
Gestão de evidências de sepultamento.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/burial-evidences` | BurialEvidence | Lista evidências |
| POST | `/api/v1/burial-evidences` | BurialEvidence | Cria nova evidência |
| GET | `/api/v1/burial-evidences/{id}` | BurialEvidence | Obtém evidência |
| PUT | `/api/v1/burial-evidences/{id}` | BurialEvidence | Atualiza evidência |
| DELETE | `/api/v1/burial-evidences/{id}` | BurialEvidence | Remove evidência |
| GET | `/api/v1/burial-evidences/{burialId}` | BurialEvidence | Evidências por sepultamento |

### 16. Exumações (Exhumation)
Gestão de exumações.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/exhumations` | Exhumation | Lista exumações |
| POST | `/api/v1/exhumations` | Exhumation | Cria nova exumação |
| GET | `/api/v1/exhumations/{id}` | Exhumation | Obtém exumação |
| PUT | `/api/v1/exhumations/{id}` | Exhumation | Atualiza exumação |
| DELETE | `/api/v1/exhumations/{id}` | Exhumation | Remove exumação |
| POST | `/api/v1/exhumations/{id}/execute` | Exhumation | Executa exumação |
| POST | `/api/v1/exhumations/automatic` | Exhumation | Cria exumação automática |

### 17. Evidências de Exumação (ExhumationEvidence)
Gestão de evidências de exumação.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/exhumation-evidences` | ExhumationEvidence | Lista evidências |
| POST | `/api/v1/exhumation-evidences` | ExhumationEvidence | Cria nova evidência |
| GET | `/api/v1/exhumation-evidences/{id}` | ExhumationEvidence | Obtém evidência |
| PUT | `/api/v1/exhumation-evidences/{id}` | ExhumationEvidence | Atualiza evidência |
| DELETE | `/api/v1/exhumation-evidences/{id}` | ExhumationEvidence | Remove evidência |
| GET | `/api/v1/exhumation-evidences/{exhumationId}` | ExhumationEvidence | Evidências por exumação |

### 18. Agendamentos (Schedule)
Gestão de agendamentos.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/schedules` | Schedule | Lista agendamentos |
| POST | `/api/v1/schedules` | Schedule | Cria novo agendamento |
| GET | `/api/v1/schedules/{id}` | Schedule | Obtém agendamento |
| PUT | `/api/v1/schedules/{id}` | Schedule | Atualiza agendamento |
| PUT | `/api/v1/schedules/{id}/assign-team` | Schedule | Atribui equipe |
| POST | `/api/v1/schedules/{id}/cancel` | Schedule | Cancela agendamento |
| GET | `/api/v1/schedules/conflicts` | Schedule | Verifica conflitos |
| GET | `/api/v1/schedules/availability` | Schedule | Verifica disponibilidade |

### 19. Equipes (Team)
Gestão de equipes operacionais.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/teams` | Team | Lista equipes |
| POST | `/api/v1/teams` | Team | Cria nova equipe |
| GET | `/api/v1/teams/{id}` | Team | Obtém equipe |
| PUT | `/api/v1/teams/{id}` | Team | Atualiza equipe |
| GET | `/api/v1/teams/{id}/availability` | Team | Verifica disponibilidade |

### 20. Funerárias (FuneralHome)
Gestão de funerárias.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/funeral-homes` | FuneralHome | Lista funerárias |
| POST | `/api/v1/funeral-homes` | FuneralHome | Cria nova funerária |
| GET | `/api/v1/funeral-homes/{id}` | FuneralHome | Obtém funerária |
| PUT | `/api/v1/funeral-homes/{id}` | FuneralHome | Atualiza funerária |

### 21. Tabelas de Taxas (FeeTable)
Gestão de tabelas de taxas.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/fee-tables` | FeeTable | Lista tabelas de taxas |
| POST | `/api/v1/fee-tables` | FeeTable | Cria nova tabela |
| GET | `/api/v1/fee-tables/{id}` | FeeTable | Obtém tabela |
| PUT | `/api/v1/fee-tables/{id}` | FeeTable | Atualiza tabela |
| POST | `/api/v1/fee-tables/{id}/activate` | FeeTable | Ativa tabela |
| POST | `/api/v1/fee-tables/{id}/deactivate` | FeeTable | Desativa tabela |
| GET | `/api/v1/fee-tables/municipality/{municipalityId}` | FeeTable | Tabelas por município |
| GET | `/api/v1/fee-tables/history` | FeeTable | Histórico de tabelas |

### 22. Pagamentos (Payment)
Gestão de pagamentos.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| POST | `/api/v1/payments/process` | Payment | Processa pagamento |
| PUT | `/api/v1/payments/{id}/reconcile` | Payment | Reconcilia pagamento |

### 23. Guias de Pagamento (PaymentGuide)
Gestão de guias de pagamento.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| POST | `/api/v1/payment-guides` | Payment | Cria guia de pagamento |
| GET | `/api/v1/payment-guides/{id}` | Payment | Obtém guia |
| POST | `/api/v1/payment-guides/{id}/regenerate` | Payment | Regenera guia |
| GET | `/api/v1/payment-guides/{id}/payments` | Payment | Pagamentos da guia |
| GET | `/api/v1/payment-guides/{id}/barcode` | Payment | Código de barras |

### 24. Cálculos (Calculation)
Gestão de cálculos de taxas.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/calculations` | Calculation | Lista cálculos |
| POST | `/api/v1/calculations` | Calculation | Cria novo cálculo |
| GET | `/api/v1/calculations/{id}` | Calculation | Obtém cálculo |
| PUT | `/api/v1/calculations/{id}` | Calculation | Atualiza cálculo |
| POST | `/api/v1/calculations/{id}/recalculate` | Calculation | Recalcula |
| POST | `/api/v1/calculations/{id}/apply-interest` | Calculation | Aplica juros |
| POST | `/api/v1/calculations/{id}/apply-discount` | Calculation | Aplica desconto |
| POST | `/api/v1/calculations/confirm` | Calculation | Confirma cálculo |
| GET | `/api/v1/calculations/reference/{type}/{id}` | Calculation | Cálculos por referência |

### 25. Inadimplentes (Defaulter)
Gestão de inadimplência.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/defaulters` | Defaulter | Lista inadimplentes |
| POST | `/api/v1/defaulters/bulk-notice` | Defaulter | Envio em massa de notificações |
| GET | `/api/v1/defaulters/{id}/installment` | Defaulter | Parcelas do inadimplente |
| PUT | `/api/v1/defaulters/{id}/installment` | Defaulter | Atualiza parcela |
| GET | `/api/v1/defaulters/{id}/collection-stage` | Defaulter | Etapa de cobrança |
| PUT | `/api/v1/defaulters/{id}/collection-stage` | Defaulter | Atualiza etapa |
| POST | `/api/v1/defaulters/{id}/negotiate` | Defaulter | Negocia dívida |
| POST | `/api/v1/defaulters/{id}/contact` | Defaulter | Registra contato |
| GET | `/api/v1/defaulters/report` | Defaulter | Relatório de inadimplência |

### 26. Pessoas (Person)
Gestão de pessoas (titulares, responsáveis, etc.).

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/persons` | Person | Lista pessoas |
| POST | `/api/v1/persons` | Person | Cria nova pessoa |
| GET | `/api/v1/persons/{id}` | Person | Obtém pessoa |
| PUT | `/api/v1/persons/{id}` | Person | Atualiza pessoa |

### 27. Falecidos (Deceased)
Gestão de registros de falecidos.

| Método | Endpoint | Tags | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/deceased` | Deceased | Lista falecidos |
| POST | `/api/v1/deceased` | Deceased | Cria novo registro |
| GET | `/api/v1/deceased/{id}` | Deceased | Obtém falecido |
| PUT | `/api/v1/deceased/{id}` | Deceased | Atualiza registro |

## Estatísticas da API

### Distribuição por Método HTTP:
- **GET**: 78 endpoints (58%)
- **POST**: 42 endpoints (31%)
- **PUT**: 27 endpoints (20%)
- **DELETE**: 4 endpoints (3%)

### Distribuição por Tags/Módulos:
1. **iGRP Enums** - 21 endpoints
2. **Cemeterie** - 12 endpoints
3. **WorkOrder** - 9 endpoints
4. **Plot** - 8 endpoints
5. **Concession** - 7 endpoints
6. **Transfer** - 7 endpoints
7. **Schedule** - 7 endpoints
8. **FeeTable** - 7 endpoints
9. **Calculation** - 7 endpoints
10. **ConcessionRequest** - 6 endpoints
11. **Exhumation** - 6 endpoints
12. **Defaulter** - 6 endpoints
13. **CemeteryBlock** - 4 endpoints
14. **CemeterySection** - 4 endpoints
15. **ConcessionType** - 4 endpoints
16. **ConcessionTransfer** - 6 endpoints
17. **ConcessionRenewal** - 5 endpoints
18. **TransferEvidence** - 6 endpoints
19. **Burial** - 5 endpoints
20. **BurialEvidence** - 5 endpoints
21. **ExhumationEvidence** - 6 endpoints
22. **Team** - 5 endpoints
23. **FuneralHome** - 4 endpoints
24. **Payment** - 2 endpoints
25. **Person** - 4 endpoints
26. **Deceased** - 4 endpoints

### Status HTTP Comuns:
- **200**: Sucesso na operação
- **201**: Criado com sucesso
- **204**: Sem conteúdo
- **400**: Requisição inválida
- **401**: Não autorizado
- **403**: Proibido
- **404**: Não encontrado
- **500**: Erro interno do servidor

## Observações Importantes:

1. **Autenticação**: Todos os endpoints requerem autenticação Bearer Token
2. **Versionamento**: API utiliza versionamento no path (v1)
3. **Padrão RESTful**: Segue padrões RESTful com operações CRUD completas
4. **Paginação**: Vários endpoints de listagem suportam paginação via parâmetros de query
5. **Filtros**: Muitos endpoints aceitam filtros específicos via query parameters
6. **Relacionamentos**: Endpoints incluem relacionamentos entre entidades (ex: cemitério → bloco → seção → lote)
7. **Workflow**: Vários endpoints para gerenciamento de workflow (aprovar, rejeitar, executar, etc.)

## Próximos Passos Sugeridos:

1. Criar tipos TypeScript para os principais schemas
2. Documentar parâmetros de query específicos para cada endpoint
3. Criar exemplos de request/response para endpoints críticos
4. Implementar client SDK para facilitar integração
5. Criar documentação interativa com Swagger UI