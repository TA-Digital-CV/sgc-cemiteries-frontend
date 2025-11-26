# BE-02-Concessao - Módulo Backend de Gestão de Concessões

## Índice de Navegação

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funcionalidades Principais](#2-funcionalidades-principais)
3. [Modelo de Dados](#3-modelo-de-dados)
4. [Estrutura de Dados (DDL)](#4-estrutura-de-dados-ddl)
5. [APIs e Endpoints](#5-apis-e-endpoints)
6. [Integrações](#6-integrações)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Requisitos Não Funcionais](#8-requisitos-não-funcionais)
9. [Configurações e Monitoramento](#9-configurações-e-monitoramento)

## 1. Visão Geral do Módulo

O módulo BE-02-Concessao é responsável pela gestão completa do ciclo de vida das concessões cemiteriais, incluindo solicitações, renovações, transferências e expirações automáticas.

**Tecnologia Base:** IGRP 3.0 Spring Backend\
**Base de Dados:** PostgreSQL 16\
**Arquitetura:** Microserviço independente (Concessions Service)\
**Mensageria:** RabbitMQ para notificações assíncronas

## 2. Funcionalidades Principais

### 2.1 Gestão de Tipos de Concessão

* Suporte a concessões temporárias e perpétuas

* Regras de negócio configuráveis por município

* Cálculo automático de prazos e vencimentos

* Gestão de diferentes categorias (individual, familiar, coletiva)

### 2.2 Fluxo de Solicitações

* Processamento digital de pedidos de concessão

* Validação automática de documentos

* Workflow configurável de aprovação

* Atribuição automática de sepulturas disponíveis

### 2.3 Gestão de Prazos e Renovações

* Monitoramento automático de vencimentos

* Notificações assíncronas via RabbitMQ

* Processamento de renovações online

* Gestão de exumações por fim de prazo

### 2.4 Transferências de Titularidade

* Validação de documentação para transferência

* Workflow de aprovação de transferências

* Histórico completo de mudanças de titularidade

* Integração com Registo Civil para validação

## 3. Modelo de Dados

### 3.1 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    t_concessions ||--|| t_concession_renewals : has
    t_concessions ||--|| t_concession_transfers : involves
    t_concessions ||--|| t_concession_requests : generates
    t_concession_types ||--|| t_concessions : defines
    t_plots ||--|| t_concessions : grants
    t_persons ||--|| t_concessions : holds
    t_municipalities ||--|| t_concession_types : configures

    t_concession_types {
        uuid id PK "Identificador único do tipo de concessão"
        uuid municipality_id FK "Referência ao município"
        varchar name "Nome do tipo de concessão"
        varchar category "Categoria: INDIVIDUAL, FAMILY, COLLECTIVE"
        varchar duration_type "Tipo de duração: TEMPORARY, PERPETUAL"
        integer duration_years "Duração em anos (null para perpétua)"
        decimal base_fee "Taxa base da concessão"
        boolean renewable "Se pode ser renovada"
        json required_documents "Documentos obrigatórios (JSON)"
        varchar status "Status: ACTIVE, INACTIVE"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_concessions {
        uuid id PK "Identificador único da concessão"
        uuid plot_id FK "Referência à sepultura"
        uuid holder_id FK "Referência ao titular"
        uuid concession_type_id FK "Referência ao tipo de concessão"
        varchar concession_number "Número único da concessão"
        date start_date "Data de início da concessão"
        date expiry_date "Data de vencimento"
        varchar status "Status: ACTIVE, EXPIRED, CANCELLED, SUSPENDED"
        decimal amount_paid "Valor pago pela concessão"
        json payment_history "Histórico de pagamentos (JSON)"
        text notes "Observações adicionais"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
        uuid last_modified_by "Usuário que atualizou"
    }

    t_concession_requests {
        uuid id PK "Identificador único da solicitação"
        varchar request_type "Tipo: NEW_CONCESSION, RENEWAL, TRANSFER"
        uuid requester_id FK "Referência ao solicitante"
        uuid plot_id FK "Referência à sepultura (opcional)"
        uuid concession_id FK "Referência à concessão (para renovação/transferência)"
        varchar workflow_status "Status: PENDING, APPROVED, REJECTED, CANCELLED"
        json attached_documents "Documentos anexados (JSON)"
        date request_date "Data da solicitação"
        uuid approver_id FK "Referência ao aprovador"
        date approval_date "Data de aprovação"
        text approval_notes "Observações da aprovação"
        text rejection_reason "Motivo da rejeição"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_concession_renewals {
        uuid id PK "Identificador único da renovação"
        uuid concession_id FK "Referência à concessão"
        date previous_expiry_date "Data de vencimento anterior"
        date new_expiry_date "Nova data de vencimento"
        decimal renewal_fee "Taxa de renovação"
        varchar payment_status "Status: PENDING, PAID, OVERDUE"
        uuid payment_id FK "Referência ao pagamento"
        date renewal_date "Data da renovação"
        text notes "Observações da renovação"
        timestamp created_date "Data de criação"
        uuid created_by "Usuário que processou"
    }

    t_concession_transfers {
        uuid id PK "Identificador único da transferência"
        uuid concession_id FK "Referência à concessão"
        uuid previous_holder_id FK "Titular anterior"
        uuid new_holder_id FK "Novo titular"
        varchar transfer_reason "Motivo: INHERITANCE, SALE, DONATION, OTHER"
        json required_documents "Documentos apresentados (JSON)"
        varchar approval_status "Status: PENDING, APPROVED, REJECTED"
        uuid approver_id FK "Referência ao aprovador"
        date transfer_date "Data da transferência"
        decimal transfer_fee "Taxa de transferência"
        text notes "Observações da transferência"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_persons {
        uuid id PK "Identificador único da pessoa"
        varchar full_name "Nome completo"
        varchar document_number "Número do documento (CPF/BI)"
        varchar document_type "Tipo: CPF, BI, PASSPORT"
        varchar email "Email de contato"
        varchar phone "Telefone de contato"
        text address "Endereço completo"
        date birth_date "Data de nascimento"
        date death_date "Data de óbito (se aplicável)"
        varchar status "Status: ALIVE, DECEASED"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }
```

### 3.2 Legendas do Diagrama

* **PK**: Chave Primária (Primary Key)

* **FK**: Chave Estrangeira (Foreign Key)

* **json**: Tipo de dados JSON para estruturas flexíveis

* **uuid**: Identificador único universal

* **varchar**: Texto de tamanho variável

* **decimal**: Número decimal para valores monetários

* **timestamp**: Data e hora com fuso horário

## 4. Estrutura de Dados (DDL)

### 4.1 Tabela de Tipos de Concessão

```sql
-- Criação da tabela de tipos de concessão
CREATE TABLE t_concession_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('INDIVIDUAL', 'FAMILY', 'COLLECTIVE')),
    duration_type VARCHAR(20) NOT NULL CHECK (duration_type IN ('TEMPORARY', 'PERPETUAL')),
    duration_years INTEGER,
    base_fee DECIMAL(10,2) NOT NULL,
    renewable BOOLEAN DEFAULT true,
    required_documents JSONB,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_concession_type_municipality FOREIGN KEY (municipality_id) REFERENCES t_municipalities(id),
    CONSTRAINT chk_duration_years CHECK (
        (duration_type = 'PERPETUAL' AND duration_years IS NULL) OR
        (duration_type = 'TEMPORARY' AND duration_years > 0)
    )
);

-- Índices
CREATE INDEX idx_concession_types_municipality ON t_concession_types(municipality_id);
CREATE INDEX idx_concession_types_status ON t_concession_types(status);
CREATE INDEX idx_concession_types_category ON t_concession_types(category);
```

### 4.2 Tabela Principal de Concessões

```sql
-- Criação da tabela principal de concessões
CREATE TABLE t_concessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID NOT NULL,
    holder_id UUID NOT NULL,
    concession_type_id UUID NOT NULL,
    concession_number VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED')),
    amount_paid DECIMAL(10,2),
    payment_history JSONB,
    notes TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    last_modified_by UUID,
    CONSTRAINT fk_concession_plot FOREIGN KEY (plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_concession_holder FOREIGN KEY (holder_id) REFERENCES t_persons(id),
    CONSTRAINT fk_concession_type FOREIGN KEY (concession_type_id) REFERENCES t_concession_types(id),
    CONSTRAINT uk_concession_plot UNIQUE (plot_id) -- Uma sepultura pode ter apenas uma concessão ativa
);

-- Índices
CREATE INDEX idx_concessions_plot ON t_concessions(plot_id);
CREATE INDEX idx_concessions_holder ON t_concessions(holder_id);
CREATE INDEX idx_concessions_type ON t_concessions(concession_type_id);
CREATE INDEX idx_concessions_status ON t_concessions(status);
CREATE INDEX idx_concessions_expiry ON t_concessions(expiry_date);
CREATE INDEX idx_concessions_number ON t_concessions(concession_number);
```

### 4.3 Tabela de Solicitações

```sql
-- Criação da tabela de solicitações
CREATE TABLE t_concession_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('NEW_CONCESSION', 'RENEWAL', 'TRANSFER')),
    requester_id UUID NOT NULL,
    plot_id UUID,
    concession_id UUID,
    workflow_status VARCHAR(20) DEFAULT 'PENDING' CHECK (workflow_status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    attached_documents JSONB,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    approver_id UUID,
    approval_date DATE,
    approval_notes TEXT,
    rejection_reason TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_request_requester FOREIGN KEY (requester_id) REFERENCES t_persons(id),
    CONSTRAINT fk_request_plot FOREIGN KEY (plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_request_concession FOREIGN KEY (concession_id) REFERENCES t_concessions(id),
    CONSTRAINT fk_request_approver FOREIGN KEY (approver_id) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_requests_type ON t_concession_requests(request_type);
CREATE INDEX idx_requests_status ON t_concession_requests(workflow_status);
CREATE INDEX idx_requests_requester ON t_concession_requests(requester_id);
CREATE INDEX idx_requests_date ON t_concession_requests(request_date);
CREATE INDEX idx_requests_approver ON t_concession_requests(approver_id);
```

### 4.4 Tabela de Renovações

```sql
-- Criação da tabela de renovações
CREATE TABLE t_concession_renewals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concession_id UUID NOT NULL,
    previous_expiry_date DATE NOT NULL,
    new_expiry_date DATE NOT NULL,
    renewal_fee DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'OVERDUE')),
    payment_id UUID,
    renewal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_renewal_concession FOREIGN KEY (concession_id) REFERENCES t_concessions(id),
    CONSTRAINT fk_renewal_payment FOREIGN KEY (payment_id) REFERENCES t_payments(id),
    CONSTRAINT fk_renewal_creator FOREIGN KEY (created_by) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_renewals_concession ON t_concession_renewals(concession_id);
CREATE INDEX idx_renewals_payment_status ON t_concession_renewals(payment_status);
CREATE INDEX idx_renewals_date ON t_concession_renewals(renewal_date);
```

### 4.5 Tabela de Transferências

```sql
-- Criação da tabela de transferências
CREATE TABLE t_concession_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concession_id UUID NOT NULL,
    previous_holder_id UUID NOT NULL,
    new_holder_id UUID NOT NULL,
    transfer_reason VARCHAR(20) NOT NULL CHECK (transfer_reason IN ('INHERITANCE', 'SALE', 'DONATION', 'OTHER')),
    required_documents JSONB,
    approval_status VARCHAR(20) DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approver_id UUID,
    transfer_date DATE,
    transfer_fee DECIMAL(10,2),
    notes TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_transfer_concession FOREIGN KEY (concession_id) REFERENCES t_concessions(id),
    CONSTRAINT fk_transfer_previous_holder FOREIGN KEY (previous_holder_id) REFERENCES t_persons(id),
    CONSTRAINT fk_transfer_new_holder FOREIGN KEY (new_holder_id) REFERENCES t_persons(id),
    CONSTRAINT fk_transfer_approver FOREIGN KEY (approver_id) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_transfers_concession ON t_concession_transfers(concession_id);
CREATE INDEX idx_transfers_status ON t_concession_transfers(approval_status);
CREATE INDEX idx_transfers_previous_holder ON t_concession_transfers(previous_holder_id);
CREATE INDEX idx_transfers_new_holder ON t_concession_transfers(new_holder_id);
CREATE INDEX idx_transfers_date ON t_concession_transfers(transfer_date);
```

## 5. APIs e Endpoints

### 5.1 Gestão de Concessões

#### 5.1.1 Listar Concessões com Filtros

**Endpoint:** `GET /api/v1/concessions`

**Descrição:** Retorna lista paginada de concessões com filtros avançados para busca e análise.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `municipalityId` (UUID, opcional): Filtrar por município

* `holderId` (UUID, opcional): Filtrar por titular

* `plotId` (UUID, opcional): Filtrar por sepultura

* `concessionTypeId` (UUID, opcional): Filtrar por tipo de concessão

* `status` (string, opcional): ACTIVE, EXPIRED, CANCELLED, SUSPENDED

* `expiryDateFrom` (date, opcional): Data de vencimento inicial

* `expiryDateTo` (date, opcional): Data de vencimento final

* `concessionNumber` (string, opcional): Busca parcial por número

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 20, máx: 100): Itens por página

* `sort` (string, padrão: concessionNumber,asc): Ordenação

**Códigos de Status:**

* 200: Sucesso

* 400: Parâmetros inválidos

* 401: Não autenticado

* 403: Sem permissão

* 500: Erro interno

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/concessions?municipalityId=123e4567-e89b-12d3-a456-426614174000&status=ACTIVE&expiryDateFrom=2024-01-01&page=0&size=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "concessionNumber": "CON-2024-001",
      "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
      "plotNumber": "A1-001",
      "cemeteryName": "Cemitério Municipal da Praia",
      "holderId": "bb0e8400-e29b-41d4-a716-446655440005",
      "holderName": "João Silva Santos",
      "concessionTypeId": "cc0e8400-e29b-41d4-a716-446655440006",
      "concessionTypeName": "Concessão Familiar Temporária",
      "startDate": "2024-01-15",
      "expiryDate": "2034-01-15",
      "status": "ACTIVE",
      "amountPaid": 5000.00,
      "daysUntilExpiry": 3653,
      "isRenewable": true,
      "createdDate": "2024-01-15T10:30:00Z",
      "lastModifiedDate": "2024-01-15T10:30:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1
  },
  "summary": {
    "totalActive": 1847,
    "totalExpiring30Days": 23,
    "totalExpired": 156,
    "averageDaysUntilExpiry": 1825
  }
}
```

#### 5.1.2 Criar Nova Concessão

**Endpoint:** `POST /api/v1/concessions`

**Descrição:** Cria uma nova concessão cemiterial após validação de disponibilidade e documentação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_CREATE`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Sepultura deve estar disponível

* Titular deve ser pessoa válida

* Tipo de concessão deve estar ativo

* Documentação obrigatória deve estar completa

* Pagamento deve estar confirmado

**Regras de Negócio:**

* Sepultura é automaticamente marcada como ocupada

* Número de concessão é gerado automaticamente

* Data de vencimento calculada baseada no tipo

* Notificação automática enviada ao titular

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/concessions" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
    "holderId": "bb0e8400-e29b-41d4-a716-446655440005",
    "concessionTypeId": "cc0e8400-e29b-41d4-a716-446655440006",
    "startDate": "2024-01-20",
    "amountPaid": 5000.00,
    "paymentReference": "PAY-2024-001",
    "notes": "Concessão familiar para 4 pessoas",
    "documents": [
      {
        "type": "DEATH_CERTIFICATE",
        "documentId": "doc-123456",
        "verified": true
      },
      {
        "type": "ID_CARD",
        "documentId": "doc-123457",
        "verified": true
      }
    ]
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "dd0e8400-e29b-41d4-a716-446655440007",
  "concessionNumber": "CON-2024-002",
  "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
  "plotNumber": "A1-001",
  "holderId": "bb0e8400-e29b-41d4-a716-446655440005",
  "holderName": "João Silva Santos",
  "concessionTypeId": "cc0e8400-e29b-41d4-a716-446655440006",
  "concessionTypeName": "Concessão Familiar Temporária",
  "startDate": "2024-01-20",
  "expiryDate": "2034-01-20",
  "status": "ACTIVE",
  "amountPaid": 5000.00,
  "paymentReference": "PAY-2024-001",
  "daysUntilExpiry": 3653,
  "isRenewable": true,
  "notes": "Concessão familiar para 4 pessoas",
  "createdDate": "2024-01-20T15:30:00Z",
  "createdBy": "user123"
}
```

#### 5.1.3 Obter Concessão Específica

**Endpoint:** `GET /api/v1/concessions/{id}`

**Descrição:** Retorna detalhes completos de uma concessão específica incluindo histórico de pagamentos.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_READ`

**Rate Limiting:** 200 requests/minuto

**Parâmetros Path:**

* `id` (UUID, obrigatório): Identificador da concessão

**Parâmetros Query:**

* `includeHistory` (boolean, padrão: false): Incluir histórico completo

* `includeDocuments` (boolean, padrão: false): Incluir lista de documentos

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000?includeHistory=true&includeDocuments=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "concessionNumber": "CON-2024-001",
  "plot": {
    "id": "aa0e8400-e29b-41d4-a716-446655440004",
    "plotNumber": "A1-001",
    "plotType": "GROUND",
    "cemetery": {
      "id": "cemetery-001",
      "name": "Cemitério Municipal da Praia",
      "municipality": "Praia"
    },
    "location": {
      "blockName": "Bloco A",
      "sectionName": "Secção A1",
      "coordinates": {
        "latitude": 14.9176,
        "longitude": -23.5091
      }
    }
  },
  "holder": {
    "id": "bb0e8400-e29b-41d4-a716-446655440005",
    "name": "João Silva Santos",
    "documentNumber": "123456789",
    "email": "joao.santos@email.cv",
    "phone": "+238 555-0123",
    "address": "Rua da Paz, 123, Praia"
  },
  "concessionType": {
    "id": "cc0e8400-e29b-41d4-a716-446655440006",
    "name": "Concessão Familiar Temporária",
    "category": "FAMILY",
    "durationType": "TEMPORARY",
    "durationYears": 10,
    "renewable": true,
    "baseFee": 5000.00
  },
  "startDate": "2024-01-15",
  "expiryDate": "2034-01-15",
  "status": "ACTIVE",
  "amountPaid": 5000.00,
  "daysUntilExpiry": 3653,
  "paymentHistory": [
    {
      "date": "2024-01-15",
      "amount": 5000.00,
      "reference": "PAY-2024-001",
      "type": "INITIAL_PAYMENT",
      "status": "CONFIRMED"
    }
  ],
  "documents": [
    {
      "id": "doc-123456",
      "type": "DEATH_CERTIFICATE",
      "name": "Certidão de Óbito - Maria Santos",
      "uploadDate": "2024-01-14T14:30:00Z",
      "verified": true,
      "verifiedBy": "admin",
      "verifiedDate": "2024-01-14T16:00:00Z"
    }
  ],
  "renewalHistory": [],
  "transferHistory": [],
  "notes": "Concessão familiar para 4 pessoas",
  "createdDate": "2024-01-15T10:30:00Z",
  "lastModifiedDate": "2024-01-15T10:30:00Z",
  "createdBy": "user123"
}
```

#### 5.1.4 Atualizar Concessão

**Endpoint:** `PUT /api/v1/concessions/{id}`

**Descrição:** Atualiza dados de uma concessão existente (campos limitados por segurança).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_UPDATE`

**Rate Limiting:** 30 requests/minuto

**Campos Atualizáveis:**

* `notes`: Observações

* `status`: Status (apenas transições válidas)

* Dados de contato do titular (via integração)

**Regras de Negócio:**

* Não é possível alterar datas de início/vencimento diretamente

* Alteração de status requer validação de workflow

* Mudanças críticas geram log de auditoria

**Exemplo de Request:**

```bash
curl -X PUT "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Concessão familiar para 4 pessoas - Atualizado com nova documentação",
    "status": "ACTIVE"
  }'
```

#### 5.1.5 Cancelar Concessão

**Endpoint:** `DELETE /api/v1/concessions/{id}`

**Descrição:** Cancela uma concessão e libera a sepultura (soft delete com workflow).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_DELETE`

**Rate Limiting:** 10 requests/minuto

**Parâmetros Query:**

* `reason` (string, obrigatório): Motivo do cancelamento

* `refundAmount` (decimal, opcional): Valor a ser reembolsado

* `confirm` (boolean, obrigatório): Confirmação da operação

**Regras de Negócio:**

* Sepultura é marcada como disponível

* Processo de reembolso é iniciado se aplicável

* Notificação automática enviada ao titular

* Operação é irreversível

**Exemplo de Request:**

```bash
curl -X DELETE "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000?reason=Solicitação do titular&refundAmount=2500.00&confirm=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 5.1.6 Histórico Completo da Concessão

**Endpoint:** `GET /api/v1/concessions/{id}/history`

**Descrição:** Retorna histórico completo de todas as operações realizadas na concessão.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_READ`, `AUDIT_READ`

**Rate Limiting:** 50 requests/minuto

**Parâmetros Query:**

* `eventType` (string, opcional): CREATION, RENEWAL, TRANSFER, PAYMENT, STATUS\_CHANGE

* `dateFrom` (date, opcional): Data inicial do período

* `dateTo` (date, opcional): Data final do período

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 20): Itens por página

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000/history?eventType=PAYMENT&dateFrom=2024-01-01" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "concessionId": "550e8400-e29b-41d4-a716-446655440000",
  "concessionNumber": "CON-2024-001",
  "events": [
    {
      "id": "event-001",
      "eventType": "CREATION",
      "timestamp": "2024-01-15T10:30:00Z",
      "userId": "user123",
      "userName": "Admin Sistema",
      "description": "Concessão criada",
      "details": {
        "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
        "holderId": "bb0e8400-e29b-41d4-a716-446655440005",
        "amount": 5000.00
      }
    },
    {
      "id": "event-002",
      "eventType": "PAYMENT",
      "timestamp": "2024-01-15T10:35:00Z",
      "userId": "system",
      "userName": "Sistema Automático",
      "description": "Pagamento confirmado",
      "details": {
        "paymentReference": "PAY-2024-001",
        "amount": 5000.00,
        "method": "BANK_TRANSFER"
      }
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

### 5.2 Tipos de Concessão

#### 5.2.1 Listar Tipos de Concessão

**Endpoint:** `GET /api/v1/concession-types`

**Descrição:** Retorna lista de tipos de concessão disponíveis com filtros.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_TYPES_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `municipalityId` (UUID, opcional): Filtrar por município

* `category` (string, opcional): INDIVIDUAL, FAMILY, COLLECTIVE

* `durationType` (string, opcional): TEMPORARY, PERPETUAL

* `status` (string, opcional): ACTIVE, INACTIVE

* `renewable` (boolean, opcional): Filtrar por renovável

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 20): Itens por página

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/concession-types?municipalityId=123e4567-e89b-12d3-a456-426614174000&status=ACTIVE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440006",
      "municipalityId": "123e4567-e89b-12d3-a456-426614174000",
      "municipalityName": "Praia",
      "name": "Concessão Familiar Temporária",
      "category": "FAMILY",
      "durationType": "TEMPORARY",
      "durationYears": 10,
      "baseFee": 5000.00,
      "renewable": true,
      "maxRenewals": 2,
      "requiredDocuments": [
        "DEATH_CERTIFICATE",
        "ID_CARD",
        "FAMILY_CERTIFICATE"
      ],
      "status": "ACTIVE",
      "description": "Concessão para sepultamento familiar com prazo de 10 anos",
      "createdDate": "2024-01-01T00:00:00Z",
      "lastModifiedDate": "2024-01-01T00:00:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 5.2.2 Criar Novo Tipo

**Endpoint:** `POST /api/v1/concession-types`

**Descrição:** Cria um novo tipo de concessão para um município.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_TYPES_CREATE`

**Rate Limiting:** 10 requests/minuto

**Validações:**

* Nome único por município

* Taxa base deve ser > 0

* Duração deve ser válida para o tipo

* Documentos obrigatórios devem existir no sistema

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/concession-types" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "municipalityId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Concessão Individual Perpétua",
    "category": "INDIVIDUAL",
    "durationType": "PERPETUAL",
    "baseFee": 15000.00,
    "renewable": false,
    "requiredDocuments": [
      "DEATH_CERTIFICATE",
      "ID_CARD"
    ],
    "description": "Concessão individual com caráter perpétuo",
    "maxOccupants": 1
  }'
```

#### 5.2.3 Atualizar Tipo

**Endpoint:** `PUT /api/v1/concession-types/{id}`

**Descrição:** Atualiza configurações de um tipo de concessão existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_TYPES_UPDATE`

**Rate Limiting:** 20 requests/minuto

**Regras de Negócio:**

* Alterações não afetam concessões já criadas

* Mudanças de preço requerem aprovação especial

* Desativação impede criação de novas concessões

#### 5.2.4 Tipos por Município

**Endpoint:** `GET /api/v1/concession-types/by-municipality/{municipalityId}`

**Descrição:** Retorna todos os tipos de concessão disponíveis para um município específico.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_TYPES_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Path:**

* `municipalityId` (UUID, obrigatório): Identificador do município

**Parâmetros Query:**

* `activeOnly` (boolean, padrão: true): Apenas tipos ativos

* `includeDetails` (boolean, padrão: false): Incluir detalhes completos

### 5.3 Solicitações e Workflow

#### 5.3.1 Criar Nova Solicitação

**Endpoint:** `POST /api/v1/concession-requests`

**Descrição:** Cria uma nova solicitação de concessão iniciando o workflow de aprovação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_REQUESTS_CREATE`

**Rate Limiting:** 30 requests/minuto

**Validações:**

* Solicitante deve ser pessoa válida

* Tipo de concessão deve estar ativo

* Sepultura deve estar disponível (se especificada)

* Documentação mínima deve estar presente

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/concession-requests" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "requesterId": "bb0e8400-e29b-41d4-a716-446655440005",
    "concessionTypeId": "cc0e8400-e29b-41d4-a716-446655440006",
    "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
    "deceasedName": "Maria Santos Silva",
    "deceasedDocumentNumber": "987654321",
    "deathDate": "2024-01-10",
    "requestNotes": "Solicitação urgente para sepultamento",
    "preferredBurialDate": "2024-01-22",
    "documents": [
      {
        "type": "DEATH_CERTIFICATE",
        "fileName": "certidao_obito_maria.pdf",
        "base64Content": "JVBERi0xLjQKJcOkw7zDtsO..."
      }
    ]
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "req-001",
  "requestNumber": "REQ-2024-001",
  "requesterId": "bb0e8400-e29b-41d4-a716-446655440005",
  "requesterName": "João Silva Santos",
  "concessionTypeId": "cc0e8400-e29b-41d4-a716-446655440006",
  "concessionTypeName": "Concessão Familiar Temporária",
  "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
  "plotNumber": "A1-001",
  "deceasedName": "Maria Santos Silva",
  "deathDate": "2024-01-10",
  "preferredBurialDate": "2024-01-22",
  "status": "PENDING_REVIEW",
  "priority": "NORMAL",
  "estimatedProcessingTime": "2-3 dias úteis",
  "nextApprover": {
    "userId": "approver-001",
    "name": "Gestor Municipal",
    "role": "CEMETERY_MANAGER"
  },
  "requiredDocuments": [
    {
      "type": "DEATH_CERTIFICATE",
      "status": "UPLOADED",
      "verified": false
    },
    {
      "type": "ID_CARD",
      "status": "MISSING",
      "verified": false
    }
  ],
  "createdDate": "2024-01-20T15:30:00Z",
  "lastModifiedDate": "2024-01-20T15:30:00Z"
}
```

#### 5.3.2 Listar Solicitações com Filtros

**Endpoint:** `GET /api/v1/concession-requests`

**Descrição:** Retorna lista paginada de solicitações com filtros para gestão.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_REQUESTS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `status` (string, opcional): PENDING\_REVIEW, PENDING\_DOCUMENTS, APPROVED, REJECTED

* `requesterId` (UUID, opcional): Filtrar por solicitante

* `assignedTo` (UUID, opcional): Filtrar por responsável

* `priority` (string, opcional): LOW, NORMAL, HIGH, URGENT

* `createdFrom` (date, opcional): Data de criação inicial

* `createdTo` (date, opcional): Data de criação final

* `municipalityId` (UUID, opcional): Filtrar por município

#### 5.3.3 Aprovar Solicitação

**Endpoint:** `PUT /api/v1/concession-requests/{id}/approve`

**Descrição:** Aprova uma solicitação de concessão e cria a concessão automaticamente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_REQUESTS_APPROVE`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Usuário deve ter autoridade para aprovar

* Documentação deve estar completa e verificada

* Sepultura deve estar disponível

* Pagamento deve estar confirmado

**Exemplo de Request:**

```bash
curl -X PUT "https://api.sgc.gov.cv/api/v1/concession-requests/req-001/approve" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "approvalNotes": "Documentação completa e validada. Aprovado para concessão.",
    "concessionStartDate": "2024-01-22",
    "paymentReference": "PAY-2024-002",
    "amountPaid": 5000.00
  }'
```

**Exemplo de Response (200):**

```json
{
  "requestId": "req-001",
  "requestNumber": "REQ-2024-001",
  "status": "APPROVED",
  "approvedBy": "approver-001",
  "approvedDate": "2024-01-21T14:30:00Z",
  "approvalNotes": "Documentação completa e validada. Aprovado para concessão.",
  "concession": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "concessionNumber": "CON-2024-003",
    "startDate": "2024-01-22",
    "expiryDate": "2034-01-22",
    "status": "ACTIVE"
  },
  "notifications": {
    "requesterNotified": true,
    "emailSent": true,
    "smsSent": true
  }
}
```

#### 5.3.4 Rejeitar Solicitação

**Endpoint:** `PUT /api/v1/concession-requests/{id}/reject`

**Descrição:** Rejeita uma solicitação de concessão com motivo detalhado.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_REQUESTS_APPROVE`

**Rate Limiting:** 20 requests/minuto

**Parâmetros Obrigatórios:**

* `rejectionReason` (string): Motivo da rejeição

* `rejectionNotes` (string, opcional): Observações adicionais

* `canResubmit` (boolean): Se pode reenviar após correções

#### 5.3.5 Solicitações Pendentes

**Endpoint:** `GET /api/v1/concession-requests/pending`

**Descrição:** Retorna solicitações pendentes de aprovação para o usuário atual.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_REQUESTS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `priority` (string, opcional): Filtrar por prioridade

* `overdue` (boolean, opcional): Apenas solicitações em atraso

* `assignedToMe` (boolean, padrão: true): Apenas atribuídas ao usuário

#### 5.3.6 Upload de Documentos

**Endpoint:** `POST /api/v1/concession-requests/{id}/documents`

**Descrição:** Faz upload de documentos adicionais para uma solicitação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSION_REQUESTS_UPDATE`

**Rate Limiting:** 50 requests/minuto

**Validações:**

* Arquivo deve ser PDF, JPG ou PNG

* Tamanho máximo: 10MB por arquivo

* Máximo 20 arquivos por solicitação

* Tipos de documento devem ser válidos

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/concession-requests/req-001/documents" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: multipart/form-data" \
  -F "documents=@certidao_nascimento.pdf" \
  -F "documentType=BIRTH_CERTIFICATE" \
  -F "description=Certidão de nascimento do solicitante"
```

### 5.4 Renovações

#### 5.4.1 Processar Renovação

**Endpoint:** `POST /api/v1/concessions/{id}/renew`

**Descrição:** Processa renovação de uma concessão temporária existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_RENEW`

**Rate Limiting:** 30 requests/minuto

**Validações:**

* Concessão deve ser renovável

* Não pode ter excedido limite de renovações

* Deve estar dentro do período de renovação

* Pagamento deve estar confirmado

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000/renew" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "renewalPeriodYears": 10,
    "amountPaid": 3000.00,
    "paymentReference": "PAY-REN-2024-001",
    "renewalNotes": "Renovação solicitada pela família",
    "documents": [
      {
        "type": "PAYMENT_RECEIPT",
        "fileName": "comprovante_renovacao.pdf",
        "base64Content": "JVBERi0xLjQKJcOkw7zDtsO..."
      }
    ]
  }'
```

**Exemplo de Response (200):**

```json
{
  "renewalId": "ren-001",
  "concessionId": "550e8400-e29b-41d4-a716-446655440000",
  "concessionNumber": "CON-2024-001",
  "previousExpiryDate": "2034-01-15",
  "newExpiryDate": "2044-01-15",
  "renewalPeriodYears": 10,
  "amountPaid": 3000.00,
  "paymentReference": "PAY-REN-2024-001",
  "renewalNumber": 1,
  "maxRenewalsAllowed": 2,
  "remainingRenewals": 1,
  "status": "COMPLETED",
  "processedDate": "2024-01-20T16:00:00Z",
  "processedBy": "user123",
  "notifications": {
    "holderNotified": true,
    "emailSent": true,
    "certificateGenerated": true
  }
}
```

#### 5.4.2 Concessões Próximas ao Vencimento

**Endpoint:** `GET /api/v1/concessions/expiring`

**Descrição:** Retorna concessões que estão próximas ao vencimento para notificação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_READ`

**Rate Limiting:** 50 requests/minuto

**Parâmetros Query:**

* `daysUntilExpiry` (int, padrão: 90): Dias até vencimento

* `municipalityId` (UUID, opcional): Filtrar por município

* `notificationSent` (boolean, opcional): Filtrar por notificação enviada

* `renewable` (boolean, opcional): Apenas renováveis

#### 5.4.3 Renovação em Lote

**Endpoint:** `POST /api/v1/concession-renewals/batch`

**Descrição:** Processa múltiplas renovações simultaneamente (operação administrativa).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_RENEW`, `BULK_OPERATIONS`

**Rate Limiting:** 5 requests/minuto

**Validações:**

* Máximo 50 concessões por lote

* Todas devem ser renováveis

* Pagamentos devem estar confirmados

#### 5.4.4 Relatório de Renovações

**Endpoint:** `GET /api/v1/concession-renewals/report`

**Descrição:** Gera relatório estatístico de renovações por período.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_READ`, `REPORTS_READ`

**Rate Limiting:** 20 requests/minuto

#### 5.4.5 Atualizar Status de Pagamento

**Endpoint:** `PUT /api/v1/concession-renewals/{id}/payment-status`

**Descrição:** Atualiza status de pagamento de uma renovação pendente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_RENEW`, `PAYMENTS_UPDATE`

**Rate Limiting:** 50 requests/minuto

### 5.5 Transferências

#### 5.5.1 Iniciar Transferência

**Endpoint:** `POST /api/v1/concessions/{id}/transfer`

**Descrição:** Inicia processo de transferência de titularidade de uma concessão.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_TRANSFER`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Concessão deve estar ativa

* Novo titular deve ser pessoa válida

* Documentação de transferência deve estar completa

* Taxa de transferência deve estar paga

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000/transfer" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "newHolderId": "ee0e8400-e29b-41d4-a716-446655440008",
    "transferReason": "INHERITANCE",
    "transferFee": 500.00,
    "paymentReference": "PAY-TRANS-2024-001",
    "transferNotes": "Transferência por herança familiar",
    "documents": [
      {
        "type": "INHERITANCE_CERTIFICATE",
        "fileName": "certidao_heranca.pdf",
        "base64Content": "JVBERi0xLjQKJcOkw7zDtsO..."
      },
      {
        "type": "ID_CARD_NEW_HOLDER",
        "fileName": "bi_novo_titular.pdf",
        "base64Content": "JVBERi0xLjQKJcOkw7zDtsO..."
      }
    ]
  }'
```

**Exemplo de Response (201):**

```json
{
  "transferId": "trans-001",
  "transferNumber": "TRANS-2024-001",
  "concessionId": "550e8400-e29b-41d4-a716-446655440000",
  "concessionNumber": "CON-2024-001",
  "previousHolder": {
    "id": "bb0e8400-e29b-41d4-a716-446655440005",
    "name": "João Silva Santos"
  },
  "newHolder": {
    "id": "ee0e8400-e29b-41d4-a716-446655440008",
    "name": "Maria Silva Santos"
  },
  "transferReason": "INHERITANCE",
  "transferFee": 500.00,
  "paymentReference": "PAY-TRANS-2024-001",
  "approvalStatus": "PENDING_REVIEW",
  "estimatedApprovalTime": "5-7 dias úteis",
  "nextApprover": {
    "userId": "approver-002",
    "name": "Supervisor Legal",
    "role": "LEGAL_SUPERVISOR"
  },
  "requiredDocuments": [
    {
      "type": "INHERITANCE_CERTIFICATE",
      "status": "UPLOADED",
      "verified": false
    },
    {
      "type": "ID_CARD_NEW_HOLDER",
      "status": "UPLOADED",
      "verified": false
    }
  ],
  "createdDate": "2024-01-20T17:00:00Z",
  "lastModifiedDate": "2024-01-20T17:00:00Z"
}
```

#### 5.5.2 Listar Transferências

**Endpoint:** `GET /api/v1/concession-transfers`

**Descrição:** Retorna lista paginada de transferências com filtros.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_TRANSFER_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.5.3 Aprovar Transferência

**Endpoint:** `PUT /api/v1/concession-transfers/{id}/approve`

**Descrição:** Aprova uma transferência de titularidade pendente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_TRANSFER_APPROVE`

**Rate Limiting:** 20 requests/minuto

#### 5.5.4 Rejeitar Transferência

**Endpoint:** `PUT /api/v1/concession-transfers/{id}/reject`

**Descrição:** Rejeita uma transferência de titularidade com motivo.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_TRANSFER_APPROVE`

**Rate Limiting:** 20 requests/minuto

#### 5.5.5 Transferências Pendentes

**Endpoint:** `GET /api/v1/concession-transfers/pending`

**Descrição:** Retorna transferências pendentes de aprovação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_TRANSFER_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.5.6 Histórico de Titulares

**Endpoint:** `GET /api/v1/concessions/{id}/holders-history`

**Descrição:** Retorna histórico completo de todos os titulares de uma concessão.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CONCESSIONS_READ`, `AUDIT_READ`

**Rate Limiting:** 50 requests/minuto

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/concessions/550e8400-e29b-41d4-a716-446655440000/holders-history" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "concessionId": "550e8400-e29b-41d4-a716-446655440000",
  "concessionNumber": "CON-2024-001",
  "currentHolder": {
    "id": "ee0e8400-e29b-41d4-a716-446655440008",
    "name": "Maria Silva Santos",
    "documentNumber": "987654321",
    "startDate": "2024-01-20",
    "transferReason": "INHERITANCE"
  },
  "previousHolders": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440005",
      "name": "João Silva Santos",
      "documentNumber": "123456789",
      "startDate": "2024-01-15",
      "endDate": "2024-01-20",
      "transferReason": "ORIGINAL_HOLDER",
      "transferredTo": "Maria Silva Santos"
    }
  ],
  "totalTransfers": 1,
  "lastTransferDate": "2024-01-20T17:30:00Z"
}
```

## 6. Integrações

### 6.1 Integrações Internas (RabbitMQ)

* **BE-01-Cemiterio**: Validação de disponibilidade de sepulturas

* **BE-04-Financeiro**: Cálculo e cobrança de taxas

* **BE-03-Operacao**: Coordenação de exumações automáticas

* **Notification Service**: Envio de notificações automáticas

### 6.2 Integrações Externas

* **Registo Civil (RNI+SNIAC)**: Validação de certidões de óbito

* **RabbitMQ**: Mensageria para notificações assíncronas

* **Payment Gateway**: Validação de pagamentos

* **Porton di Nôs Ilhas**: Autenticação unificada (SSO)

* **Document Storage**: Armazenamento de documentos anexados

### 6.3 Eventos e Notificações

* **Expiry Notifications**: Notificações de vencimento (90, 60, 30 dias)

* **Approval Notifications**: Notificações de aprovação/rejeição

* **Transfer Notifications**: Confirmações de transferência

* **Payment Reminders**: Lembretes de pagamento pendente

## 7. Regras de Negócio

### 7.1 Validações de Concessão

* Verificação de disponibilidade da sepultura

* Validação de documentação obrigatória por tipo

* Controle de limites por titular (configurável por município)

* Verificação de inadimplência anterior

* Validação de capacidade legal do solicitante

### 7.2 Cálculo de Prazos e Vencimentos

* Prazos configuráveis por tipo de concessão

* Cálculo automático de data de vencimento

* Consideração de feriados municipais

* Prorrogações automáticas em casos específicos

* Alertas automáticos de vencimento próximo

### 7.3 Workflow de Aprovação

* Níveis de aprovação configuráveis por tipo e valor

* Delegação de autoridade por perfil de usuário

* Aprovação automática para casos padrão

* Escalação automática por tempo de pendência

* Auditoria completa do processo de aprovação

## 8. Requisitos Não Funcionais

### 8.1 Performance

* Processamento de até 10.000 verificações de vencimento/dia

* Tempo de resposta < 2 segundos para consultas

* Batch processing para operações em massa

* Cache distribuído (Redis) para regras de negócio

* Otimização de consultas com índices apropriados

### 8.2 Segurança

* Auditoria completa de todas as operações críticas

* Controle de acesso granular (RBAC)

* Criptografia AES-256 para dados sensíveis

* Logs imutáveis para compliance

* Validação de entrada para prevenir ataques

### 8.3 Confiabilidade

* Transações ACID para operações críticas

* Retry automático para falhas de integração

* Backup incremental de dados de concessão

* Monitoramento de SLA de notificações

* Recuperação automática de falhas

## 9. Configurações e Monitoramento

### 9.1 Parâmetros Configuráveis por Município

* Tipos de concessão disponíveis

* Prazos padrão por tipo de concessão

* Valores de taxas e emolumentos

* Documentação obrigatória por tipo

* Regras de aprovação e workflow

### 9.2 Configurações de Notificação

* Canais de notificação (SMS, email, push)

* Templates de mensagens personalizáveis

* Frequência e timing de lembretes

* Horários permitidos para envio

* Configuração de retry para falhas

### 9.3 Métricas de Monitoramento

* Tempo médio de processamento de solicitações

* Taxa de renovações automáticas vs manuais

* Percentual de exumações por vencimento

* Volume de transferências por período

* Taxa de sucesso de notificações

* SLA de aprovação por tipo de solicitação

