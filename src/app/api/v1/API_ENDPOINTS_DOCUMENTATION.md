# Documentação de Implementação - API SGC-Cemiteries v1

## Visão Geral

Este documento descreve detalhadamente todos os endpoints da API do Sistema de Gestão de Cemitérios (SGC), baseado na especificação Swagger. A API segue os princípios RESTful e utiliza autenticação Bearer Token.

**Base URL**: `http://localhost:9081/api/v1`  
**Autenticação**: Bearer Token (obrigatório em todos os endpoints)

---

## 📋 Índice por Módulos

1. [Enums](#1-enums)
2. [Cemitérios](#2-cemitérios)
3. [Blocos de Cemitério](#3-blocos-de-cemitério)
4. [Seções de Cemitério](#4-seções-de-cemitério)
5. [Lotes](#5-lotes)
6. [Concessões](#6-concessões)
7. [Tipos de Concessão](#7-tipos-de-concessão)
8. [Solicitações de Concessão](#8-solicitações-de-concessão)
9. [Transferências de Concessão](#9-transferências-de-concessão)
10. [Renovações de Concessão](#10-renovações-de-concessão)
11. [Ordens de Trabalho](#11-ordens-de-trabalho)
12. [Transferências Operacionais](#12-transferências-operacionais)
13. [Evidências de Transferência](#13-evidências-de-transferência)
14. [Sepultamentos](#14-sepultamentos)
15. [Evidências de Sepultamento](#15-evidências-de-sepultamento)
16. [Exumações](#16-exumações)
17. [Evidências de Exumação](#17-evidências-de-exumação)
18. [Agendamentos](#18-agendamentos)
19. [Equipes](#19-equipes)
20. [Funerárias](#20-funerárias)
21. [Tabelas de Taxas](#21-tabelas-de-taxas)
22. [Pagamentos](#22-pagamentos)
23. [Cálculos](#23-cálculos)
24. [Inadimplentes](#24-inadimplentes)
25. [Pessoas](#25-pessoas)
26. [Falecidos](#26-falecidos)

---

## 1. Enums

### 1.1 OccupationStatus
**Método**: GET  
**Path**: `/api/enums/OccupationStatus`  
**Descrição**: Retorna valores do enum OccupationStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com código e descrição do status de ocupação

### 1.2 PlotType
**Método**: GET  
**Path**: `/api/enums/PlotType`  
**Descrição**: Retorna valores do enum PlotType  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com tipos de lotes disponíveis

### 1.3 Status
**Método**: GET  
**Path**: `/api/enums/Status`  
**Descrição**: Retorna valores do enum Status  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status genéricos do sistema

### 1.4 ApprovalStatus
**Método**: GET  
**Path**: `/api/enums/ApprovalStatus`  
**Descrição**: Retorna valores do enum ApprovalStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de aprovação

### 1.5 Category
**Método**: GET  
**Path**: `/api/enums/Category`  
**Descrição**: Retorna valores do enum Category  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com categorias disponíveis

### 1.6 ConcessionStatus
**Método**: GET  
**Path**: `/api/enums/ConcessionStatus`  
**Descrição**: Retorna valores do enum ConcessionStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de concessão

### 1.7 DurationType
**Método**: GET  
**Path**: `/api/enums/DurationType`  
**Descrição**: Retorna valores do enum DurationType  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com tipos de duração

### 1.8 PaymentStatus
**Método**: GET  
**Path**: `/api/enums/PaymentStatus`  
**Descrição**: Retorna valores do enum PaymentStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de pagamento

### 1.9 RequestType
**Método**: GET  
**Path**: `/api/enums/RequestType`  
**Descrição**: Retorna valores do enum RequestType  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com tipos de solicitação

### 1.10 TransferReason
**Método**: GET  
**Path**: `/api/enums/TransferReason`  
**Descrição**: Retorna valores do enum TransferReason  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com motivos de transferência

### 1.11 WorkflowStatus
**Método**: GET  
**Path**: `/api/enums/WorkflowStatus`  
**Descrição**: Retorna valores do enum WorkflowStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de workflow

### 1.12 BurialStatus
**Método**: GET  
**Path**: `/api/enums/BurialStatus`  
**Descrição**: Retorna valores do enum BurialStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de sepultamento

### 1.13 ExhumationReason
**Método**: GET  
**Path**: `/api/enums/ExhumationReason`  
**Descrição**: Retorna valores do enum ExhumationReason  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com motivos de exumação

### 1.14 ExhumationStatus
**Método**: GET  
**Path**: `/api/enums/ExhumationStatus`  
**Descrição**: Retorna valores do enum ExhumationStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de exumação

### 1.15 ExhumationType
**Método**: GET  
**Path**: `/api/enums/ExhumationType`  
**Descrição**: Retorna valores do enum ExhumationType  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com tipos de exumação

### 1.16 OperationType
**Método**: GET  
**Path**: `/api/enums/OperationType`  
**Descrição**: Retorna valores do enum OperationType  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com tipos de operação

### 1.17 RemainsDestination
**Método**: GET  
**Path**: `/api/enums/RemainsDestination`  
**Descrição**: Retorna valores do enum RemainsDestination  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com destinos de restos mortais

### 1.18 SchedulePriority
**Método**: GET  
**Path**: `/api/enums/SchedulePriority`  
**Descrição**: Retorna valores do enum SchedulePriority  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com prioridades de agendamento

### 1.19 ScheduleStatus
**Método**: GET  
**Path**: `/api/enums/ScheduleStatus`  
**Descrição**: Retorna valores do enum ScheduleStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de agendamento

### 1.20 TransferStatus
**Método**: GET  
**Path**: `/api/enums/TransferStatus`  
**Descrição**: Retorna valores do enum TransferStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de transferência

### 1.21 WorkOrderStatus
**Método**: GET  
**Path**: `/api/enums/WorkOrderStatus`  
**Descrição**: Retorna valores do enum WorkOrderStatus  
**Tags**: iGRP Enums  
**Resposta**: Array de objetos com status de ordem de trabalho

---

## 2. Cemitérios

### 2.1 Listar Cemitérios
**Método**: GET  
**Path**: `/api/v1/cemeteries`  
**Tags**: Cemeterie  
**Descrição**: Lista todos os cemitérios  
**Parâmetros Query**:
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)
- `name` (string): Filtrar por nome (opcional)
- `municipalityId` (integer): Filtrar por município (opcional)

**Resposta**: Array de objetos Cemetery com paginação

### 2.2 Criar Cemitério
**Método**: POST  
**Path**: `/api/v1/cemeteries`  
**Tags**: Cemeterie  
**Descrição**: Cria novo cemitério  
**Body**:
```json
{
  "name": "string",
  "municipalityId": 0,
  "address": "string",
  "phone": "string",
  "email": "string",
  "capacity": 0,
  "occupiedPlots": 0,
  "status": "ACTIVE"
}
```

**Resposta**: Objeto Cemetery criado (HTTP 201)

### 2.3 Obter Cemitério
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}`  
**Tags**: Cemeterie  
**Descrição**: Obtém detalhes de um cemitério  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Objeto Cemetery completo

### 2.4 Atualizar Cemitério
**Método**: PUT  
**Path**: `/api/v1/cemeteries/{id}`  
**Tags**: Cemeterie  
**Descrição**: Atualiza cemitério  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Body**: Objeto Cemetery com campos a atualizar
**Resposta**: Objeto Cemetery atualizado

### 2.5 Remover Cemitério
**Método**: DELETE  
**Path**: `/api/v1/cemeteries/{id}`  
**Tags**: Cemeterie  
**Descrição**: Remove cemitério  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: HTTP 204 (No Content)

### 2.6 Estrutura do Cemitério
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/structure`  
**Tags**: Cemeterie  
**Descrição**: Obtém estrutura hierárquica do cemitério (blocos → seções → lotes)  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Objeto com estrutura hierárquica

### 2.7 Estatísticas do Cemitério
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/statistics`  
**Tags**: Cemeterie  
**Descrição**: Estatísticas detalhadas do cemitério  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Objeto com estatísticas (ocupação, disponibilidade, etc.)

### 2.8 Taxa de Ocupação
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/occupancy`  
**Tags**: Cemeterie  
**Descrição**: Taxa de ocupação do cemitério  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Objeto com taxa de ocupação e detalhes

### 2.9 Dados para Mapa
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/map-data`  
**Tags**: Cemeterie  
**Descrição**: Dados geoespaciais para renderização de mapas  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Array de objetos com coordenadas e informações geográficas

### 2.10 Dados de Heatmap
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/heatmap-data`  
**Tags**: Cemeterie  
**Descrição**: Dados para geração de heatmap de ocupação  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Array de objetos com densidade de ocupação por área

### 2.11 Projeção de Capacidade
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/capacity-projection`  
**Tags**: Cemeterie  
**Descrição**: Projeção de capacidade futura baseada em taxas atuais  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Resposta**: Objeto com projeções temporais

### 2.12 Disponibilidade
**Método**: GET  
**Path**: `/api/v1/cemeteries/{id}/availability`  
**Tags**: Cemeterie  
**Descrição**: Verifica disponibilidade de lotes em período específico  
**Parâmetros Path**:
- `id` (integer): ID do cemitério (obrigatório)

**Parâmetros Query**:
- `startDate` (string): Data inicial (formato ISO)
- `endDate` (string): Data final (formato ISO)
- `plotType` (string): Tipo de lote (opcional)

**Resposta**: Objeto com disponibilidade por período

---

## 3. Blocos de Cemitério

### 3.1 Listar Blocos
**Método**: GET  
**Path**: `/api/v1/cemetery-blocks`  
**Tags**: CemeteryBlock  
**Descrição**: Lista todos os blocos de cemitério  
**Parâmetros Query**:
- `cemeteryId` (integer): ID do cemitério (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos CemeteryBlock com paginação

### 3.2 Criar Bloco
**Método**: POST  
**Path**: `/api/v1/cemetery-blocks`  
**Tags**: CemeteryBlock  
**Descrição**: Cria novo bloco de cemitério  
**Body**:
```json
{
  "code": "string",
  "name": "string",
  "cemeteryId": 0,
  "description": "string",
  "status": "ACTIVE"
}
```

**Resposta**: Objeto CemeteryBlock criado (HTTP 201)

### 3.3 Obter Bloco
**Método**: GET  
**Path**: `/api/v1/cemetery-blocks/{id}`  
**Tags**: CemeteryBlock  
**Descrição**: Obtém detalhes de um bloco específico  
**Parâmetros Path**:
- `id` (integer): ID do bloco (obrigatório)

**Resposta**: Objeto CemeteryBlock completo

### 3.4 Atualizar Bloco
**Método**: PUT  
**Path**: `/api/v1/cemetery-blocks/{id}`  
**Tags**: CemeteryBlock  
**Descrição**: Atualiza bloco de cemitério  
**Parâmetros Path**:
- `id` (integer): ID do bloco (obrigatório)

**Body**: Objeto CemeteryBlock com campos a atualizar
**Resposta**: Objeto CemeteryBlock atualizado

---

## 4. Seções de Cemitério

### 4.1 Listar Seções
**Método**: GET  
**Path**: `/api/v1/cemetery-sections`  
**Tags**: CemeterySection  
**Descrição**: Lista todas as seções de cemitério  
**Parâmetros Query**:
- `blockId` (integer): ID do bloco (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos CemeterySection com paginação

### 4.2 Criar Seção
**Método**: POST  
**Path**: `/api/v1/cemetery-sections`  
**Tags**: CemeterySection  
**Descrição**: Cria nova seção de cemitério  
**Body**:
```json
{
  "code": "string",
  "name": "string",
  "blockId": 0,
  "description": "string",
  "status": "ACTIVE"
}
```

**Resposta**: Objeto CemeterySection criado (HTTP 201)

### 4.3 Obter Seção
**Método**: GET  
**Path**: `/api/v1/cemetery-sections/{id}`  
**Tags**: CemeterySection  
**Descrição**: Obtém detalhes de uma seção específica  
**Parâmetros Path**:
- `id` (integer): ID da seção (obrigatório)

**Resposta**: Objeto CemeterySection completo

### 4.4 Atualizar Seção
**Método**: PUT  
**Path**: `/api/v1/cemetery-sections/{id}`  
**Tags**: CemeterySection  
**Descrição**: Atualiza seção de cemitério  
**Parâmetros Path**:
- `id` (integer): ID da seção (obrigatório)

**Body**: Objeto CemeterySection com campos a atualizar
**Resposta**: Objeto CemeterySection atualizado

---

## 5. Lotes

### 5.1 Listar Lotes
**Método**: GET  
**Path**: `/api/v1/plots`  
**Tags**: Plot  
**Descrição**: Lista todos os lotes  
**Parâmetros Query**:
- `cemeteryId` (integer): ID do cemitério (opcional)
- `sectionId` (integer): ID da seção (opcional)
- `status` (string): Status do lote (opcional)
- `plotType` (string): Tipo de lote (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos Plot com paginação

### 5.2 Criar Lote
**Método**: POST  
**Path**: `/api/v1/plots`  
**Tags**: Plot  
**Descrição**: Cria novo lote  
**Body**:
```json
{
  "code": "string",
  "sectionId": 0,
  "plotType": "SINGLE",
  "capacity": 1,
  "status": "AVAILABLE",
  "coordinates": {
    "latitude": 0,
    "longitude": 0
  }
}
```

**Resposta**: Objeto Plot criado (HTTP 201)

### 5.3 Obter Lote
**Método**: GET  
**Path**: `/api/v1/plots/{id}`  
**Tags**: Plot  
**Descrição**: Obtém detalhes de um lote  
**Parâmetros Path**:
- `id` (integer): ID do lote (obrigatório)

**Resposta**: Objeto Plot completo com histórico de ocupação

### 5.4 Atualizar Lote
**Método**: PUT  
**Path**: `/api/v1/plots/{id}`  
**Tags**: Plot  
**Descrição**: Atualiza lote  
**Parâmetros Path**:
- `id` (integer): ID do lote (obrigatório)

**Body**: Objeto Plot com campos a atualizar
**Resposta**: Objeto Plot atualizado

### 5.5 Remover Lote
**Método**: DELETE  
**Path**: `/api/v1/plots/{id}`  
**Tags**: Plot  
**Descrição**: Remove lote  
**Parâmetros Path**:
- `id` (integer): ID do lote (obrigatório)

**Resposta**: HTTP 204 (No Content)

### 5.6 Atualizar Geolocalização
**Método**: POST  
**Path**: `/api/v1/plots/{id}/geolocation`  
**Tags**: Plot  
**Descrição**: Atualiza coordenadas geográficas do lote  
**Parâmetros Path**:
- `id` (integer): ID do lote (obrigatório)

**Body**:
```json
{
  "latitude": 0,
  "longitude": 0
}
```

**Resposta**: Objeto com coordenadas atualizadas

### 5.7 QR Code do Lote
**Método**: GET  
**Path**: `/api/v1/plots/{id}/qr-code`  
**Tags**: Plot  
**Descrição**: Obtém QR code do lote  
**Parâmetros Path**:
- `id` (integer): ID do lote (obrigatório)

**Resposta**: Imagem PNG do QR code (base64 ou URL)

### 5.8 Gerar QR Codes em Massa
**Método**: POST  
**Path**: `/api/v1/plots/bulk-qr-generation`  
**Tags**: Plot  
**Descrição**: Gera QR codes para múltiplos lotes  
**Body**:
```json
{
  "plotIds": [1, 2, 3],
  "format": "PNG",
  "size": "MEDIUM"
}
```

**Resposta**: Array de objetos com QR codes gerados

---

## 6. Concessões

### 6.1 Listar Concessões
**Método**: GET  
**Path**: `/api/v1/concessions`  
**Tags**: Concession  
**Descrição**: Lista todas as concessões  
**Parâmetros Query**:
- `personId` (integer): ID da pessoa titular (opcional)
- `plotId` (integer): ID do lote (opcional)
- `status` (string): Status da concessão (opcional)
- `expiringSoon` (boolean): Concessões vencendo em breve (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos Concession com paginação

### 6.2 Criar Concessão
**Método**: POST  
**Path**: `/api/v1/concessions`  
**Tags**: Concession  
**Descrição**: Cria nova concessão de lote  
**Body**:
```json
{
  "plotId": 0,
  "personId": 0,
  "concessionTypeId": 0,
  "startDate": "2024-01-01",
  "endDate": "2029-01-01",
  "value": 1000.00,
  "status": "ACTIVE"
}
```

**Resposta**: Objeto Concession criado (HTTP 201)

### 6.3 Obter Concessão
**Método**: GET  
**Path**: `/api/v1/concessions/{id}`  
**Tags**: Concession  
**Descrição**: Obtém detalhes de uma concessão  
**Parâmetros Path**:
- `id` (integer): ID da concessão (obrigatório)

**Resposta**: Objeto Concession completo com histórico

### 6.4 Atualizar Concessão
**Método**: PUT  
**Path**: `/api/v1/concessions/{id}`  
**Tags**: Concession  
**Descrição**: Atualiza concessão  
**Parâmetros Path**:
- `id` (integer): ID da concessão (obrigatório)

**Body**: Objeto Concession com campos a atualizar
**Resposta**: Objeto Concession atualizado

### 6.5 Transferir Concessão
**Método**: POST  
**Path**: `/api/v1/concessions/{id}/transfer`  
**Tags**: Concession  
**Descrição**: Transfere concessão para outra pessoa  
**Parâmetros Path**:
- `id` (integer): ID da concessão (obrigatório)

**Body**:
```json
{
  "newPersonId": 0,
  "transferReason": "SALE",
  "transferDate": "2024-01-01",
  "observation": "string"
}
```

**Resposta**: Objeto com detalhes da transferência

### 6.6 Renovar Concessão
**Método**: POST  
**Path**: `/api/v1/concessions/{id}/renew`  
**Tags**: Concession  
**Descrição**: Renova concessão vencida ou próxima ao vencimento  
**Parâmetros Path**:
- `id` (integer): ID da concessão (obrigatório)

**Body**:
```json
{
  "newEndDate": "2034-01-01",
  "renewalValue": 1200.00,
  "observation": "string"
}
```

**Resposta**: Objeto Concession renovado

### 6.7 Concessões Vencendo
**Método**: GET  
**Path**: `/api/v1/concessions/expiring`  
**Tags**: Concession  
**Descrição**: Lista concessões que vencem em período específico  
**Parâmetros Query**:
- `days` (integer): Dias para vencimento (padrão: 30)
- `cemeteryId` (integer): ID do cemitério (opcional)

**Resposta**: Array de objetos Concession próximos ao vencimento

---

## 7. Tipos de Concessão

### 7.1 Listar Tipos
**Método**: GET  
**Path**: `/api/v1/concession-types`  
**Tags**: ConcessionType  
**Descrição**: Lista todos os tipos de concessão  
**Parâmetros Query**:
- `active` (boolean): Apenas tipos ativos (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos ConcessionType com paginação

### 7.2 Criar Tipo
**Método**: POST  
**Path**: `/api/v1/concession-types`  
**Tags**: ConcessionType  
**Descrição**: Cria novo tipo de concessão  
**Body**:
```json
{
  "name": "string",
  "description": "string",
  "durationType": "PERPETUAL",
  "durationValue": 0,
  "baseValue": 1000.00,
  "status": "ACTIVE"
}
```

**Resposta**: Objeto ConcessionType criado (HTTP 201)

### 7.3 Obter Tipo
**Método**: GET  
**Path**: `/api/v1/concession-types/{id}`  
**Tags**: ConcessionType  
**Descrição**: Obtém detalhes de um tipo de concessão  
**Parâmetros Path**:
- `id` (integer): ID do tipo (obrigatório)

**Resposta**: Objeto ConcessionType completo

### 7.4 Atualizar Tipo
**Método**: PUT  
**Path**: `/api/v1/concession-types/{id}`  
**Tags**: ConcessionType  
**Descrição**: Atualiza tipo de concessão  
**Parâmetros Path**:
- `id` (integer): ID do tipo (obrigatório)

**Body**: Objeto ConcessionType com campos a atualizar
**Resposta**: Objeto ConcessionType atualizado

---

## 8. Solicitações de Concessão

### 8.1 Listar Solicitações
**Método**: GET  
**Path**: `/api/v1/concession-requests`  
**Tags**: ConcessionRequest  
**Descrição**: Lista todas as solicitações de concessão  
**Parâmetros Query**:
- `status` (string): Status da solicitação (opcional)
- `personId` (integer): ID da pessoa solicitante (opcional)
- `cemeteryId` (integer): ID do cemitério (opcional)
- `pending` (boolean): Apenas pendentes (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos ConcessionRequest com paginação

### 8.2 Criar Solicitação
**Método**: POST  
**Path**: `/api/v1/concession-requests`  
**Tags**: ConcessionRequest  
**Descrição**: Cria nova solicitação de concessão  
**Body**:
```json
{
  "personId": 0,
  "plotId": 0,
  "concessionTypeId": 0,
  "requestType": "NEW",
  "requestDate": "2024-01-01",
  "justification": "string",
  "priority": "NORMAL"
}
```

**Resposta**: Objeto ConcessionRequest criado (HTTP 201)

### 8.3 Obter Solicitação
**Método**: GET  
**Path**: `/api/v1/concession-requests/{id}`  
**Tags**: ConcessionRequest  
**Descrição**: Obtém detalhes de uma solicitação  
**Parâmetros Path**:
- `id` (integer): ID da solicitação (obrigatório)

**Resposta**: Objeto ConcessionRequest completo

### 8.4 Atualizar Solicitação
**Método**: PUT  
**Path**: `/api/v1/concession-requests/{id}`  
**Tags**: ConcessionRequest  
**Descrição**: Atualiza solicitação de concessão  
**Parâmetros Path**:
- `id` (integer): ID da solicitação (obrigatório)

**Body**: Objeto ConcessionRequest com campos a atualizar
**Resposta**: Objeto ConcessionRequest atualizado

### 8.5 Aprovar Solicitação
**Método**: PUT  
**Path**: `/api/v1/concession-requests/{id}/approve`  
**Tags**: ConcessionRequest  
**Descrição**: Aprova solicitação de concessão  
**Parâmetros Path**:
- `id` (integer): ID da solicitação (obrigatório)

**Body**:
```json
{
  "approvedBy": 0,
  "approvalDate": "2024-01-01",
  "approvalObservation": "string"
}
```

**Resposta**: Objeto ConcessionRequest aprovado

### 8.6 Rejeitar Solicitação
**Método**: PUT  
**Path**: `/api/v1/concession-requests/{id}/reject`  
**Tags**: ConcessionRequest  
**Descrição**: Rejeita solicitação de concessão  
**Parâmetros Path**:
- `id` (integer): ID da solicitação (obrigatório)

**Body**:
```json
{
  "rejectedBy": 0,
  "rejectionDate": "2024-01-01",
  "rejectionReason": "string"
}
```

**Resposta**: Objeto ConcessionRequest rejeitado

### 8.7 Solicitações Pendentes
**Método**: GET  
**Path**: `/api/v1/concession-requests/pending`  
**Tags**: ConcessionRequest  
**Descrição**: Lista apenas solicitações pendentes de aprovação  
**Parâmetros Query**:
- `cemeteryId` (integer): ID do cemitério (opcional)
- `priority` (string): Prioridade (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos ConcessionRequest pendentes

---

## 9. Transferências de Concessão

### 9.1 Listar Transferências
**Método**: GET  
**Path**: `/api/v1/concession-transfers`  
**Tags**: ConcessionTransfer  
**Descrição**: Lista todas as transferências de concessão  
**Parâmetros Query**:
- `concessionId` (integer): ID da concessão (opcional)
- `status` (string): Status da transferência (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos ConcessionTransfer com paginação

### 9.2 Criar Transferência
**Método**: POST  
**Path**: `/api/v1/concession-transfers`  
**Tags**: ConcessionTransfer  
**Descrição**: Cria nova solicitação de transferência  
**Body**:
```json
{
  "concessionId": 0,
  "currentPersonId": 0,
  "newPersonId": 0,
  "transferReason": "SALE",
  "transferDate": "2024-01-01",
  "observation": "string"
}
```

**Resposta**: Objeto ConcessionTransfer criado (HTTP 201)

### 9.3 Obter Transferência
**Método**: GET  
**Path**: `/api/v1/concession-transfers/{id}`  
**Tags**: ConcessionTransfer  
**Descrição**: Obtém detalhes de uma transferência  
**Parâmetros Path**:
- `id` (integer): ID da transferência (obrigatório)

**Resposta**: Objeto ConcessionTransfer completo

### 9.4 Atualizar Transferência
**Método**: PUT  
**Path**: `/api/v1/concession-transfers/{id}`  
**Tags**: ConcessionTransfer  
**Descrição**: Atualiza transferência de concessão  
**Parâmetros Path**:
- `id` (integer): ID da transferência (obrigatório)

**Body**: Objeto ConcessionTransfer com campos a atualizar
**Resposta**: Objeto ConcessionTransfer atualizado

### 9.5 Aprovar Transferência
**Método**: PUT  
**Path**: `/api/v1/concession-transfers/{id}/approve`  
**Tags**: ConcessionTransfer  
**Descrição**: Aprova transferência de concessão  
**Parâmetros Path**:
- `id` (integer): ID da transferência (obrigatório)

**Body**:
```json
{
  "approvedBy": 0,
  "approvalDate": "2024-01-01",
  "approvalObservation": "string"
}
```

**Resposta**: Objeto ConcessionTransfer aprovado

### 9.6 Rejeitar Transferência
**Método**: PUT  
**Path**: `/api/v1/concession-transfers/{id}/reject`  
**Tags**: ConcessionTransfer  
**Descrição**: Rejeita transferência de concessão  
**Parâmetros Path**:
- `id` (integer): ID da transferência (obrigatório)

**Body**:
```json
{
  "rejectedBy": 0,
  "rejectionDate": "2024-01-01",
  "rejectionReason": "string"
}
```

**Resposta**: Objeto ConcessionTransfer rejeitado

---

## 10. Renovações de Concessão

### 10.1 Listar Renovações
**Método**: GET  
**Path**: `/api/v1/concession-renewals`  
**Tags**: ConcessionRenewal  
**Descrição**: Lista todas as renovações de concessão  
**Parâmetros Query**:
- `concessionId` (integer): ID da concessão (opcional)
- `status` (string): Status da renovação (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos ConcessionRenewal com paginação

### 10.2 Criar Renovação
**Método**: POST  
**Path**: `/api/v1/concession-renewals`  
**Tags**: ConcessionRenewal  
**Descrição**: Cria nova solicitação de renovação  
**Body**:
```json
{
  "concessionId": 0,
  "newEndDate": "2034-01-01",
  "renewalValue": 1200.00,
  "renewalReason": "EXPIRATION",
  "observation": "string"
}
```

**Resposta**: Objeto ConcessionRenewal criado (HTTP 201)

### 10.3 Obter Renovação
**Método**: GET  
**Path**: `/api/v1/concession-renewals/{id}`  
**Tags**: ConcessionRenewal  
**Descrição**: Obtém detalhes de uma renovação  
**Parâmetros Path**:
- `id` (integer): ID da renovação (obrigatório)

**Resposta**: Objeto ConcessionRenewal completo

### 10.4 Atualizar Renovação
**Método**: PUT  
**Path**: `/api/v1/concession-renewals/{id}`  
**Tags**: ConcessionRenewal  
**Descrição**: Atualiza renovação de concessão  
**Parâmetros Path**:
- `id` (integer): ID da renovação (obrigatório)

**Body**: Objeto ConcessionRenewal com campos a atualizar
**Resposta**: Objeto ConcessionRenewal atualizado

### 10.5 Atualizar Status de Pagamento
**Método**: PUT  
**Path**: `/api/v1/concession-renewals/{id}/payment-status`  
**Tags**: ConcessionRenewal  
**Descrição**: Atualiza status de pagamento da renovação  
**Parâmetros Path**:
- `id` (integer): ID da renovação (obrigatório)

**Body**:
```json
{
  "paymentStatus": "PAID",
  "paymentDate": "2024-01-01",
  "paymentReference": "string"
}
```

**Resposta**: Objeto ConcessionRenewal com status atualizado

---

## 11. Ordens de Trabalho

### 11.1 Listar Ordens
**Método**: GET  
**Path**: `/api/v1/work-orders`  
**Tags**: WorkOrder  
**Descrição**: Lista todas as ordens de trabalho  
**Parâmetros Query**:
- `status` (string): Status da ordem (opcional)
- `priority` (string): Prioridade (opcional)
- `type` (string): Tipo de ordem (opcional)
- `teamId` (integer): ID da equipe (opcional)
- `scheduledDate` (string): Data agendada (opcional)
- `page` (integer): Número da página (opcional)
- `size` (integer): Tamanho da página (opcional)

**Resposta**: Array de objetos WorkOrder com paginação

### 11.2 Criar Ordem
**Método**: POST  
**Path**: `/api/v1/work-orders`  
**Tags**: WorkOrder  
**Descrição**: Cria nova ordem de trabalho  
**Body**:
```json
{
  "type": "BURIAL",
  "priority": "NORMAL",
  "description": "string",
  "scheduledDate": "2024-01-01T10:00:00Z",
  "plotId": 0,
  "teamId": 0,
  "estimatedDuration": 120
}
```

**Resposta**: Objeto WorkOrder criado (HTTP 201)

### 11.3 Obter Ordem
**Método**: GET  
**Path**: `/api/v1/work-orders/{id}`  
**Tags**: WorkOrder  
**Descrição**: Obtém detalhes de uma ordem de trabalho  
**Parâmetros Path**:
- `id` (integer): ID da ordem (obrigatório)

**Resposta**: Objeto WorkOrder completo

### 11.4 Atualizar Ordem
**Método**: PUT  
**Path**: `/api/v1/work-orders/{id}`  
**Tags**: WorkOrder  
**Descrição**: Atualiza ordem de trabalho  
**Parâmetros Path**:
- `id` (integer): ID da ordem (obrigatório)

**Body**: Objeto WorkOrder com campos a atualizar
**Resposta**: Objeto WorkOrder atualizado

### 11.5 Atribuir Equipe
**Método**: PUT  
**Path**: `/api/v1/work-orders/{id}/assign-team`  
**Tags**: WorkOrder  
**Descrição**: Atribui equipe à ordem de trabalho  
**Parâmetros Path**:
- `id` (integer): ID da ordem (obrigatório)

**Body**:
```json
{
  "teamId": 0,
  "assignmentDate": "2024-01-01T10:00:00Z",
  "observation": "string"
}
```

**Resposta**: Objeto WorkOrder com equipe atribuída

### 11.6 Iniciar Ordem
**Método**: POST  
**Path**: `/api/v1/work-orders/{id}/start`  
**Tags**: WorkOrder  
**Descrição**: Inicia execução da ordem de trabalho  
**Parâmetros Path**:
- `id` (integer): ID da ordem (obrigatório)

**Body**:
```json
{
  "startDate": "2024-01-01T10:00:00Z",
  "startedBy": 0,
  "observation": "string"
}
```

**Resposta**: Objeto WorkOrder com status atualizado

### 11.7 Completar Ordem
**Método**: POST  
**Path**: `/api/v1/work-orders/{id}/complete`  
**Tags**: WorkOrder  
**Descrição**: Completa ordem de trabalho  
**Parâmetros Path**:
- `id` (integer): ID da ordem (obrigatório)

**Body**:
```json
{
  "completionDate": "2024-01-01T12:00:00Z",
  "completedBy": 0,
  "completionObservation": "string",
  "actualDuration": 120
}
```

**Resposta**: Objeto WorkOrder completado

### 11.8 Adicionar Evidências
**Método**: POST  
**Path**: `/api/v1/work-orders/{id}/evidences`  
**Tags**: WorkOrder  
**Descrição**: Adiciona evidências à ordem de trabalho  
**Parâmetros Path**:
- `id` (integer): ID da ordem (obrigatório)

**Body** (multipart/form-data):
- `files`: Array de arquivos (imagens/documentos)
- `description`: Descrição das evidências
- `evidenceType`: Tipo de evidência

**Resposta**: Array de objetos WorkOrderEvidence

### 11.9 Ordens por Equipe
**Método**: GET  
**Path**: `/api/v1/work-orders/team/{teamId}`  
**Tags**: WorkOrder  
**Descrição**: Lista ordens de trabalho de uma equipe específica  
**Parâmetros Path**:
- `teamId` (integer): ID da equipe (obrigatório)

**Parâmetros Query**:
- `status` (string): Status das ordens (opcional)
- `date` (string): Data específica (opcional)

**Resposta**: Array de objetos WorkOrder da equipe

### 11.10 Ordens Pendentes
**Método**: GET  
**Path**: `/api/v1/work-orders/pending`  
**Tags**: WorkOrder  
**Descrição**: Lista ordens de trabalho pendentes  
**Parâmetros Query**:
- `priority` (string): Prioridade (opcional)
- `cemeteryId` (integer): ID do cemitério (opcional)

**Resposta**: Array de objetos WorkOrder pendentes

---

## Observações Finais

### Status HTTP Padrão
- **200**: Sucesso na operação
- **201**: Criado com sucesso
- **204**: Sem conteúdo (DELETE)
- **400**: Requisição inválida
- **401**: Não autorizado (token inválido ou expirado)
- **403**: Proibido (sem permissão)
- **404**: Recurso não encontrado
- **422**: Erro de validação
- **500**: Erro interno do servidor

### Headers Padrão
**Requisição**:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Resposta**:
```
Content-Type: application/json
X-Total-Count: {total}
X-Page-Size: {size}
X-Current-Page: {page}
```

### Paginação
Endpoints de listagem aceitam parâmetros:
- `page`: Número da página (começa em 0)
- `size`: Tamanho da página (máximo 100)
- `sort`: Campo para ordenação (opcional)
- `direction`: Direção da ordenação (ASC/DESC)

### Filtros Comuns
- `status`: Filtrar por status
- `createdAt`: Filtrar por data de criação
- `updatedAt`: Filtrar por data de atualização
- IDs relacionados (ex: `cemeteryId`, `plotId`, `personId`)

### Tratamento de Erros
Todos os erros retornam objeto padronizado:
```json
{
  "error": "ERROR_CODE",
  "message": "Mensagem descritiva do erro",
  "details": "Detalhes adicionais (opcional)",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Rate Limiting
A API implementa limitação de taxa por IP/token. Headers de resposta:
- `X-RateLimit-Limit`: Limite total
- `X-RateLimit-Remaining`: Requisições restantes
- `X-RateLimit-Reset`: Tempo até resetar (timestamp)

### Versionamento
A API utiliza versionamento no path (`/api/v1/`). Em caso de mudanças breaking changes, novo prefixo será criado (`/api/v2/`).