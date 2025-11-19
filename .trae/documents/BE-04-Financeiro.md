# BE-04-Financeiro - Módulo Backend de Gestão Financeira

## Índice de Navegação

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funcionalidades Principais](#2-funcionalidades-principais)
3. [Modelo de Dados](#3-modelo-de-dados)
4. [DDL - Data Definition Language](#4-ddl---data-definition-language)
5. [APIs e Endpoints](#5-apis-e-endpoints)
6. [Integrações](#6-integrações)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Requisitos Não Funcionais](#8-requisitos-não-funcionais)
9. [Configurações e Monitoramento](#9-configurações-e-monitoramento)

## 1. Visão Geral do Módulo

O módulo BE-04-Financeiro é responsável pela gestão completa dos aspectos financeiros do sistema cemiterial, incluindo cálculo de taxas, processamento de pagamentos, reconciliação e controle de inadimplência.

**Tecnologia Base:** IGRP 3.0 Spring Backend\
**Base de Dados:** PostgreSQL 16\
**Arquitetura:** Microserviço independente (Finance & Payments Service)\
**Integração:** Plataformas de pagamento municipais e sistemas bancários

## 2. Funcionalidades Principais

### 2.1 Gestão de Tabelas de Taxas

* Configuração de emolumentos por tipo de serviço

* Tabelas diferenciadas por município

* Versionamento de tabelas com histórico

* Aplicação automática de reajustes

### 2.2 Cálculo Automático de Taxas

* Motor de cálculo baseado em regras configuráveis

* Aplicação de descontos e isenções

* Cálculo de juros e multas por atraso

* Simulação de valores antes da confirmação

### 2.3 Processamento de Pagamentos

* Integração com múltiplas plataformas de pagamento

* Suporte a pagamentos online e presenciais

* Processamento de pagamentos parcelados

* Reconciliação automática de transações

### 2.4 Controle de Inadimplência

* Monitoramento automático de vencimentos

* Geração de cobranças e lembretes

* Controle de negociações e parcelamentos

* Relatórios de inadimplência por período

## 3. Modelo de Dados

### 3.1 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    t_fee_tables ||--o{ t_fee_calculations : applies
    t_payment_guides ||--o{ t_payments : generates
    t_fee_calculations ||--|| t_payment_guides : creates
    t_concessions ||--o{ t_fee_calculations : triggers
    t_operations ||--o{ t_fee_calculations : triggers
    t_defaulters ||--o{ t_payment_negotiations : manages
    t_payment_negotiations ||--o{ t_installment_plans : creates
    t_installment_plans ||--o{ t_installment_payments : contains
    t_payments ||--o{ t_payment_reconciliations : reconciles
    t_municipalities ||--o{ t_fee_tables : defines

    t_fee_tables {
        uuid id PK "Identificador único da tabela de taxas"
        uuid municipality_id FK "Referência ao município"
        varchar service_type "Tipo de serviço: CONCESSION, BURIAL, EXHUMATION, TRANSFER"
        varchar category "Categoria: STANDARD, PREMIUM, SOCIAL"
        decimal base_value "Valor base da taxa"
        decimal additional_percentage "Percentual adicional"
        date effective_date "Data de vigência"
        date end_date "Data de fim da vigência"
        varchar status "Status: ACTIVE, INACTIVE, DRAFT"
        json calculation_rules "Regras de cálculo (JSON)"
        json discount_rules "Regras de desconto (JSON)"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
        uuid last_modified_by "Usuário que atualizou"
    }

    t_fee_calculations {
        uuid id PK "Identificador único do cálculo"
        uuid fee_table_id FK "Referência à tabela de taxas"
        varchar reference_type "Tipo: CONCESSION, OPERATION"
        uuid reference_id FK "ID da referência (concessão/operação)"
        decimal base_amount "Valor base calculado"
        decimal discount_amount "Valor do desconto"
        decimal additional_fees "Taxas adicionais"
        decimal interest_amount "Valor dos juros"
        decimal penalty_amount "Valor da multa"
        decimal total_amount "Valor total calculado"
        date calculation_date "Data do cálculo"
        date due_date "Data de vencimento"
        varchar status "Status: DRAFT, CONFIRMED, PAID, OVERDUE"
        json calculation_details "Detalhes do cálculo (JSON)"
        text notes "Observações"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_payment_guides {
        uuid id PK "Identificador único da guia"
        varchar guide_number "Número da guia de pagamento"
        uuid fee_calculation_id FK "Referência ao cálculo de taxa"
        decimal original_amount "Valor original"
        decimal current_amount "Valor atual (com juros/multa)"
        date issue_date "Data de emissão"
        date due_date "Data de vencimento"
        date expiry_date "Data de expiração"
        varchar payment_method "Método: ONLINE, BANK_SLIP, CASH, CARD"
        varchar status "Status: PENDING, PAID, EXPIRED, CANCELLED"
        varchar barcode "Código de barras"
        varchar pix_code "Código TOKEN"
        json payment_instructions "Instruções de pagamento (JSON)"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_payments {
        uuid id PK "Identificador único do pagamento"
        uuid payment_guide_id FK "Referência à guia de pagamento"
        decimal paid_amount "Valor pago"
        date payment_date "Data do pagamento"
        varchar payment_method "Método: ONLINE, BANK_SLIP, CASH, CARD, TOKEN"
        varchar transaction_id "ID da transação externa"
        varchar authorization_code "Código de autorização"
        varchar payment_gateway "Gateway: MUNICIPAL, BANK, TOKEN"
        varchar reconciliation_status "Status: PENDING, RECONCILED, DIVERGENT"
        json payment_details "Detalhes do pagamento (JSON)"
        text notes "Observações"
        timestamp processed_at "Data de processamento"
        timestamp created_date "Data de criação"
        uuid created_by "Usuário que criou"
    }

    t_defaulters {
        uuid id PK "Identificador único da inadimplência"
        uuid fee_calculation_id FK "Referência ao cálculo em atraso"
        uuid debtor_id FK "Referência ao devedor"
        decimal original_debt "Dívida original"
        decimal current_debt "Dívida atual (com juros/multa)"
        date overdue_since "Em atraso desde"
        integer days_overdue "Dias em atraso"
        varchar status "Status: ACTIVE, NEGOTIATING, SETTLED, WRITTEN_OFF"
        varchar collection_stage "Estágio: NOTICE, REMINDER, LEGAL"
        date last_contact "Data do último contato"
        json contact_history "Histórico de contatos (JSON)"
        text notes "Observações"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_payment_negotiations {
        uuid id PK "Identificador único da negociação"
        uuid defaulter_id FK "Referência à inadimplência"
        decimal original_amount "Valor original da dívida"
        decimal negotiated_amount "Valor negociado"
        decimal discount_amount "Valor do desconto concedido"
        varchar negotiation_type "Tipo: DISCOUNT, INSTALLMENT, SETTLEMENT"
        date negotiation_date "Data da negociação"
        date agreement_date "Data do acordo"
        varchar status "Status: PROPOSED, ACCEPTED, REJECTED, COMPLETED"
        uuid negotiator_id FK "Responsável pela negociação"
        json terms_conditions "Termos e condições (JSON)"
        text notes "Observações"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_installment_plans {
        uuid id PK "Identificador único do parcelamento"
        uuid payment_negotiation_id FK "Referência à negociação"
        decimal total_amount "Valor total parcelado"
        integer number_of_installments "Número de parcelas"
        decimal installment_amount "Valor da parcela"
        date first_due_date "Data de vencimento da primeira parcela"
        varchar frequency "Frequência: MONTHLY, BIMONTHLY, QUARTERLY"
        decimal interest_rate "Taxa de juros"
        varchar status "Status: ACTIVE, COMPLETED, DEFAULTED, CANCELLED"
        json installment_schedule "Cronograma de parcelas (JSON)"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_installment_payments {
        uuid id PK "Identificador único do pagamento de parcela"
        uuid installment_plan_id FK "Referência ao parcelamento"
        integer installment_number "Número da parcela"
        decimal installment_amount "Valor da parcela"
        date due_date "Data de vencimento"
        date payment_date "Data do pagamento"
        decimal paid_amount "Valor pago"
        varchar status "Status: PENDING, PAID, OVERDUE, CANCELLED"
        varchar payment_method "Método de pagamento"
        varchar transaction_id "ID da transação"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_payment_reconciliations {
        uuid id PK "Identificador único da reconciliação"
        uuid payment_id FK "Referência ao pagamento"
        varchar external_transaction_id "ID da transação externa"
        decimal external_amount "Valor na fonte externa"
        date external_date "Data na fonte externa"
        varchar reconciliation_type "Tipo: AUTOMATIC, MANUAL"
        varchar status "Status: MATCHED, DIVERGENT, UNMATCHED"
        json divergence_details "Detalhes das divergências (JSON)"
        uuid reconciled_by "Usuário que reconciliou"
        timestamp reconciled_at "Data da reconciliação"
        timestamp created_date "Data de criação"
    }

    t_municipalities {
        uuid id PK "Identificador único do município"
        varchar municipality_name "Nome do município"
        varchar state_code "Código do estado"
        varchar tax_id "CNPJ do município"
        json financial_settings "Configurações financeiras (JSON)"
        varchar status "Status: ACTIVE, INACTIVE"
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

* **date**: Data (sem hora)

* **timestamp**: Data e hora com fuso horário

* **integer**: Número inteiro

## 4. Estrutura de Dados (DDL)

### 4.1 Tabela de Tabelas de Taxas

```sql
-- Criação da tabela de tabelas de taxas
CREATE TABLE t_fee_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('CONCESSION', 'BURIAL', 'EXHUMATION', 'TRANSFER')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('STANDARD', 'PREMIUM', 'SOCIAL')),
    base_value DECIMAL(10,2) NOT NULL,
    additional_percentage DECIMAL(5,2) DEFAULT 0,
    effective_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT')),
    calculation_rules JSONB,
    discount_rules JSONB,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    last_modified_by UUID,
    CONSTRAINT fk_fee_table_municipality FOREIGN KEY (municipality_id) REFERENCES t_municipalities(id),
    CONSTRAINT fk_fee_table_created_by FOREIGN KEY (created_by) REFERENCES t_users(id),
    CONSTRAINT uk_fee_table_unique UNIQUE (municipality_id, service_type, category, effective_date)
);

-- Índices
CREATE INDEX idx_fee_tables_municipality ON t_fee_tables(municipality_id);
CREATE INDEX idx_fee_tables_service_type ON t_fee_tables(service_type);
CREATE INDEX idx_fee_tables_effective_date ON t_fee_tables(effective_date);
CREATE INDEX idx_fee_tables_status ON t_fee_tables(status);
```

### 4.2 Tabela de Cálculos de Taxas

```sql
-- Criação da tabela de cálculos de taxas
CREATE TABLE t_fee_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_table_id UUID NOT NULL,
    reference_type VARCHAR(20) NOT NULL CHECK (reference_type IN ('CONCESSION', 'OPERATION')),
    reference_id UUID NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    additional_fees DECIMAL(10,2) DEFAULT 0,
    interest_amount DECIMAL(10,2) DEFAULT 0,
    penalty_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    calculation_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(15) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CONFIRMED', 'PAID', 'OVERDUE')),
    calculation_details JSONB,
    notes TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_fee_calculation_table FOREIGN KEY (fee_table_id) REFERENCES t_fee_tables(id),
    CONSTRAINT fk_fee_calculation_created_by FOREIGN KEY (created_by) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_fee_calculations_reference ON t_fee_calculations(reference_type, reference_id);
CREATE INDEX idx_fee_calculations_status ON t_fee_calculations(status);
CREATE INDEX idx_fee_calculations_due_date ON t_fee_calculations(due_date);
CREATE INDEX idx_fee_calculations_calculation_date ON t_fee_calculations(calculation_date);
```

### 4.3 Tabela de Guias de Pagamento

```sql
-- Criação da tabela de guias de pagamento
CREATE TABLE t_payment_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_number VARCHAR(50) UNIQUE NOT NULL,
    fee_calculation_id UUID NOT NULL,
    original_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    expiry_date DATE,
    payment_method VARCHAR(20) CHECK (payment_method IN ('ONLINE', 'BANK_SLIP', 'CASH', 'CARD')),
    status VARCHAR(15) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED')),
    barcode VARCHAR(100),
    pix_code VARCHAR(200),
    payment_instructions JSONB,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_payment_guide_calculation FOREIGN KEY (fee_calculation_id) REFERENCES t_fee_calculations(id),
    CONSTRAINT fk_payment_guide_created_by FOREIGN KEY (created_by) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_payment_guides_guide_number ON t_payment_guides(guide_number);
CREATE INDEX idx_payment_guides_status ON t_payment_guides(status);
CREATE INDEX idx_payment_guides_due_date ON t_payment_guides(due_date);
CREATE INDEX idx_payment_guides_calculation ON t_payment_guides(fee_calculation_id);
```

### 4.4 Tabela de Pagamentos

```sql
-- Criação da tabela de pagamentos
CREATE TABLE t_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_guide_id UUID NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('ONLINE', 'BANK_SLIP', 'CASH', 'CARD', 'TOKEN')),
    transaction_id VARCHAR(100),
    authorization_code VARCHAR(50),
    payment_gateway VARCHAR(20) CHECK (payment_gateway IN ('MUNICIPAL', 'BANK', 'TOKEN')),
    reconciliation_status VARCHAR(15) DEFAULT 'PENDING' CHECK (reconciliation_status IN ('PENDING', 'RECONCILED', 'DIVERGENT')),
    payment_details JSONB,
    notes TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_payment_guide FOREIGN KEY (payment_guide_id) REFERENCES t_payment_guides(id),
    CONSTRAINT fk_payment_created_by FOREIGN KEY (created_by) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_payments_guide ON t_payments(payment_guide_id);
CREATE INDEX idx_payments_date ON t_payments(payment_date);
CREATE INDEX idx_payments_method ON t_payments(payment_method);
CREATE INDEX idx_payments_transaction ON t_payments(transaction_id);
CREATE INDEX idx_payments_reconciliation ON t_payments(reconciliation_status);
```

### 4.5 Tabela de Inadimplentes

```sql
-- Criação da tabela de inadimplentes
CREATE TABLE t_defaulters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_calculation_id UUID NOT NULL,
    debtor_id UUID NOT NULL,
    original_debt DECIMAL(10,2) NOT NULL,
    current_debt DECIMAL(10,2) NOT NULL,
    overdue_since DATE NOT NULL,
    days_overdue INTEGER GENERATED ALWAYS AS (CURRENT_DATE - overdue_since) STORED,
    status VARCHAR(15) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'NEGOTIATING', 'SETTLED', 'WRITTEN_OFF')),
    collection_stage VARCHAR(15) CHECK (collection_stage IN ('NOTICE', 'REMINDER', 'LEGAL')),
    last_contact DATE,
    contact_history JSONB,
    notes TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_defaulter_calculation FOREIGN KEY (fee_calculation_id) REFERENCES t_fee_calculations(id),
    CONSTRAINT fk_defaulter_debtor FOREIGN KEY (debtor_id) REFERENCES t_users(id),
    CONSTRAINT fk_defaulter_created_by FOREIGN KEY (created_by) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_defaulters_debtor ON t_defaulters(debtor_id);
CREATE INDEX idx_defaulters_status ON t_defaulters(status);
CREATE INDEX idx_defaulters_overdue_since ON t_defaulters(overdue_since);
CREATE INDEX idx_defaulters_collection_stage ON t_defaulters(collection_stage);
```

## 5. APIs e Endpoints

### 5.1 Gestão de Tabelas de Taxas

#### 5.1.1 Listar Tabelas Vigentes

**Endpoint:** `GET /api/v1/fee-tables`

**Descrição:** Retorna lista paginada de tabelas de taxas vigentes com filtros avançados para gestão financeira.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `municipalityId` (UUID, opcional): Filtrar por município

* `serviceType` (string, opcional): CONCESSION, BURIAL, EXHUMATION, TRANSFER

* `category` (string, opcional): STANDARD, PREMIUM, SOCIAL

* `status` (string, opcional): ACTIVE, INACTIVE, DRAFT

* `effectiveDate` (date, opcional): Data de vigência

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 20, máx: 100): Itens por página

* `sort` (string, padrão: effectiveDate,desc): Ordenação

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/fee-tables?municipalityId=municipality-001&serviceType=CONCESSION&status=ACTIVE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "fee-table-001",
      "municipalityId": "municipality-001",
      "municipalityName": "Praia",
      "serviceType": "CONCESSION",
      "category": "STANDARD",
      "baseValue": 2500.00,
      "additionalPercentage": 10.0,
      "effectiveDate": "2024-01-01",
      "endDate": null,
      "status": "ACTIVE",
      "calculationRules": {
        "minimumValue": 1000.00,
        "maximumValue": 50000.00,
        "proportionalCalculation": true,
        "roundingRule": "ROUND_UP"
      },
      "discountRules": {
        "seniorDiscount": 20.0,
        "socialDiscount": 50.0,
        "earlyPaymentDiscount": 5.0
      },
      "createdDate": "2023-12-15T10:00:00Z",
      "lastModifiedDate": "2024-01-01T08:00:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  },
  "summary": {
    "totalActive": 25,
    "totalInactive": 8,
    "totalDraft": 3,
    "lastUpdate": "2024-01-01T08:00:00Z"
  }
}
```

#### 5.1.2 Criar Nova Tabela

**Endpoint:** `POST /api/v1/fee-tables`

**Descrição:** Cria uma nova tabela de taxas com validação de regras de negócio e versionamento automático.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_CREATE`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Município deve estar ativo

* Não pode haver sobreposição de datas para mesmo serviço/categoria

* Valores devem estar dentro dos limites municipais

* Regras de cálculo devem ser válidas

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/fee-tables" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "municipalityId": "municipality-001",
    "serviceType": "BURIAL",
    "category": "STANDARD",
    "baseValue": 1500.00,
    "additionalPercentage": 5.0,
    "effectiveDate": "2024-02-01",
    "calculationRules": {
      "minimumValue": 500.00,
      "maximumValue": 10000.00,
      "proportionalCalculation": false,
      "roundingRule": "ROUND_NEAREST",
      "weekendSurcharge": 20.0,
      "holidaySurcharge": 30.0
    },
    "discountRules": {
      "seniorDiscount": 15.0,
      "socialDiscount": 40.0,
      "earlyPaymentDiscount": 3.0,
      "familyMemberDiscount": 10.0
    },
    "notes": "Nova tabela para serviços de inumação com ajustes para 2024"
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "fee-table-002",
  "municipalityId": "municipality-001",
  "serviceType": "BURIAL",
  "category": "STANDARD",
  "baseValue": 1500.00,
  "additionalPercentage": 5.0,
  "effectiveDate": "2024-02-01",
  "endDate": null,
  "status": "DRAFT",
  "version": 1,
  "calculationRules": {
    "minimumValue": 500.00,
    "maximumValue": 10000.00,
    "proportionalCalculation": false,
    "roundingRule": "ROUND_NEAREST",
    "weekendSurcharge": 20.0,
    "holidaySurcharge": 30.0
  },
  "discountRules": {
    "seniorDiscount": 15.0,
    "socialDiscount": 40.0,
    "earlyPaymentDiscount": 3.0,
    "familyMemberDiscount": 10.0
  },
  "validationStatus": {
    "isValid": true,
    "warnings": [
      "Tabela criada em status DRAFT - necessária ativação manual"
    ]
  },
  "createdDate": "2024-01-22T15:30:00Z",
  "createdBy": "user123"
}
```

#### 5.1.3 Atualizar Tabela

**Endpoint:** `PUT /api/v1/fee-tables/{id}`

**Descrição:** Atualiza uma tabela de taxas existente com versionamento automático.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_UPDATE`

**Rate Limiting:** 30 requests/minuto

#### 5.1.4 Histórico de Alterações

**Endpoint:** `GET /api/v1/fee-tables/history`

**Descrição:** Retorna histórico completo de alterações em tabelas de taxas.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.1.5 Tabelas por Município

**Endpoint:** `GET /api/v1/fee-tables/municipality/{municipalityId}`

**Descrição:** Retorna todas as tabelas de taxas de um município específico.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.1.6 Ativar Tabela

**Endpoint:** `POST /api/v1/fee-tables/{id}/activate`

**Descrição:** Ativa uma tabela de taxas após validação completa.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_ACTIVATE`

**Rate Limiting:** 10 requests/minuto

#### 5.1.7 Desativar Tabela

**Endpoint:** `POST /api/v1/fee-tables/{id}/deactivate`

**Descrição:** Desativa uma tabela de taxas com data de fim automática.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `FEE_TABLES_DEACTIVATE`

**Rate Limiting:** 10 requests/minuto

### 5.2 Cálculo de Taxas

#### 5.2.1 Simular Cálculo de Taxa

**Endpoint:** `POST /api/v1/calculations/simulate`

**Descrição:** Simula o cálculo de taxa sem persistir dados, permitindo visualização prévia dos valores.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_SIMULATE`

**Rate Limiting:** 200 requests/minuto

**Validações:**

* Referência deve existir e estar ativa

* Tabela de taxas deve estar vigente

* Parâmetros de cálculo devem ser válidos

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/calculations/simulate" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "referenceType": "CONCESSION",
    "referenceId": "concession-001",
    "serviceType": "CONCESSION",
    "category": "STANDARD",
    "municipalityId": "municipality-001",
    "calculationDate": "2024-01-25",
    "parameters": {
      "concessionPeriod": 5,
      "plotType": "STANDARD",
      "hasSpecialRequirements": false
    },
    "discounts": [
      {
        "type": "SENIOR_DISCOUNT",
        "percentage": 20.0,
        "reason": "Beneficiário idoso com mais de 65 anos"
      }
    ]
  }'
```

**Exemplo de Response (200):**

```json
{
  "simulationId": "sim-001",
  "referenceType": "CONCESSION",
  "referenceId": "concession-001",
  "appliedFeeTable": {
    "id": "fee-table-001",
    "version": 1,
    "effectiveDate": "2024-01-01"
  },
  "calculationBreakdown": {
    "baseAmount": 2500.00,
    "additionalFees": 250.00,
    "subtotal": 2750.00,
    "discounts": [
      {
        "type": "SENIOR_DISCOUNT",
        "amount": 550.00,
        "percentage": 20.0
      }
    ],
    "totalDiscounts": 550.00,
    "netAmount": 2200.00,
    "taxes": 0.00,
    "finalAmount": 2200.00
  },
  "paymentOptions": {
    "singlePayment": {
      "amount": 2200.00,
      "dueDate": "2024-02-25",
      "earlyPaymentDiscount": 110.00
    },
    "installments": [
      {
        "installments": 3,
        "installmentAmount": 766.67,
        "totalAmount": 2300.00,
        "interestRate": 2.0
      },
      {
        "installments": 6,
        "installmentAmount": 400.00,
        "totalAmount": 2400.00,
        "interestRate": 4.0
      }
    ]
  },
  "validUntil": "2024-01-25T23:59:59Z",
  "calculationDate": "2024-01-22T16:00:00Z"
}
```

#### 5.2.2 Confirmar Cálculo

**Endpoint:** `POST /api/v1/calculations/confirm`

**Descrição:** Confirma e persiste um cálculo de taxa, gerando guia de pagamento.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_CONFIRM`

**Rate Limiting:** 100 requests/minuto

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/calculations/confirm" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "simulationId": "sim-001",
    "paymentOption": "SINGLE_PAYMENT",
    "dueDate": "2024-02-25",
    "notes": "Cálculo confirmado para concessão perpétua",
    "contactInfo": {
      "email": "joao.santos@email.cv",
      "phone": "+238 555-0123"
    }
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "calculation-001",
  "calculationNumber": "CALC-2024-001",
  "referenceType": "CONCESSION",
  "referenceId": "concession-001",
  "totalAmount": 2200.00,
  "dueDate": "2024-02-25",
  "status": "CONFIRMED",
  "paymentGuide": {
    "id": "guide-001",
    "guideNumber": "PG-2024-001",
    "barcode": "23793390120000220000123456789012345678901234",
    "pixCode": "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540522.005802BR5913PREFEITURA CV6008PRAIA CV62070503***6304ABCD"
  },
  "calculationDetails": {
    "baseAmount": 2500.00,
    "discountAmount": 550.00,
    "finalAmount": 2200.00,
    "appliedDiscounts": ["SENIOR_DISCOUNT"]
  },
  "createdDate": "2024-01-22T16:05:00Z",
  "createdBy": "user123"
}
```

#### 5.2.3 Obter Detalhes do Cálculo

**Endpoint:** `GET /api/v1/calculations/{id}`

**Descrição:** Retorna detalhes completos de um cálculo específico.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_READ`

**Rate Limiting:** 200 requests/minuto

#### 5.2.4 Recalcular Taxa

**Endpoint:** `PUT /api/v1/calculations/{id}/recalculate`

**Descrição:** Recalcula uma taxa existente com novos parâmetros ou tabela atualizada.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_RECALCULATE`

**Rate Limiting:** 50 requests/minuto

#### 5.2.5 Cálculos por Referência

**Endpoint:** `GET /api/v1/calculations/reference/{type}/{id}`

**Descrição:** Retorna todos os cálculos relacionados a uma referência específica.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.2.6 Aplicar Desconto

**Endpoint:** `POST /api/v1/calculations/{id}/apply-discount`

**Descrição:** Aplica desconto adicional a um cálculo existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_DISCOUNT`

**Rate Limiting:** 30 requests/minuto

#### 5.2.7 Aplicar Juros

**Endpoint:** `POST /api/v1/calculations/{id}/apply-interest`

**Descrição:** Aplica juros e multas por atraso a um cálculo vencido.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CALCULATIONS_INTEREST`

**Rate Limiting:** 50 requests/minuto

### 5.3 Gestão de Pagamentos

#### 5.3.1 Gerar Guia de Pagamento

**Endpoint:** `POST /api/v1/payment-guides`

**Descrição:** Gera uma nova guia de pagamento com códigos de barras e Token.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENT_GUIDES_CREATE`

**Rate Limiting:** 100 requests/minuto

**Validações:**

* Cálculo deve estar confirmado

* Não pode haver guia ativa para o mesmo cálculo

* Valores devem estar dentro dos limites

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/payment-guides" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "feeCalculationId": "calculation-001",
    "paymentMethod": "BANK_SLIP",
    "dueDate": "2024-02-25",
    "payerInfo": {
      "name": "João Silva Santos",
      "document": "123456789",
      "email": "joao.santos@email.cv",
      "phone": "+238 555-0123",
      "address": {
        "street": "Rua da Praia, 123",
        "city": "Praia",
        "postalCode": "7600-001"
      }
    },
    "instructions": [
      "Pagamento referente à concessão perpétua",
      "Válido até a data de vencimento",
      "Após vencimento, sujeito a juros e multa"
    ]
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "guide-001",
  "guideNumber": "PG-2024-001",
  "feeCalculationId": "calculation-001",
  "originalAmount": 2200.00,
  "currentAmount": 2200.00,
  "issueDate": "2024-01-22",
  "dueDate": "2024-02-25",
  "status": "ACTIVE",
  "paymentMethods": {
    "bankSlip": {
      "barcode": "23793390120000220000123456789012345678901234",
      "digitableLine": "23793.39012 00002.200001 23456.789012 3 45678901234",
      "bankCode": "237",
      "agency": "3390",
      "account": "12000022"
    },
    "token": {
      "pixCode": "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540522.005802BR5913PREFEITURA CV6008PRAIA CV62070503***6304ABCD",
      "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "pixKey": "123e4567-e12b-12d1-a456-426614174000"
    }
  },
  "payerInfo": {
    "name": "João Silva Santos",
    "document": "123456789",
    "email": "joao.santos@email.cv"
  },
  "instructions": [
    "Pagamento referente à concessão perpétua",
    "Válido até a data de vencimento",
    "Após vencimento, sujeito a juros e multa"
  ],
  "validUntil": "2024-03-25T23:59:59Z",
  "createdDate": "2024-01-22T16:10:00Z"
}
```

#### 5.3.2 Obter Guia

**Endpoint:** `GET /api/v1/payment-guides/{id}`

**Descrição:** Retorna detalhes completos de uma guia de pagamento.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENT_GUIDES_READ`

**Rate Limiting:** 200 requests/minuto

#### 5.3.3 Processar Pagamento

**Endpoint:** `POST /api/v1/payments/process`

**Descrição:** Processa um pagamento recebido e atualiza status da guia.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENTS_PROCESS`

**Rate Limiting:** 100 requests/minuto

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/payments/process" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "paymentGuideId": "guide-001",
    "paymentMethod": "Token",
    "paidAmount": 2200.00,
    "paymentDate": "2024-01-25T14:30:00Z",
    "transactionId": "TXN-Token-123456789",
    "bankReference": "E12345678901234567890123456789012345",
    "payerInfo": {
      "name": "João Silva Santos",
      "document": "123456789",
      "bankAccount": "237-3390-12000022"
    },
    "metadata": {
      "channel": "MOBILE_APP",
      "deviceId": "device-123",
      "ipAddress": "192.168.1.100"
    }
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "payment-001",
  "paymentNumber": "PAY-2024-001",
  "paymentGuideId": "guide-001",
  "paymentMethod": "Token",
  "paidAmount": 2200.00,
  "paymentDate": "2024-01-25T14:30:00Z",
  "status": "CONFIRMED",
  "transactionId": "TXN-Token-123456789",
  "bankReference": "E12345678901234567890123456789012345",
  "reconciliationStatus": "PENDING",
  "payerInfo": {
    "name": "João Silva Santos",
    "document": "123456789"
  },
  "fees": {
    "transactionFee": 2.50,
    "platformFee": 1.00,
    "netAmount": 2196.50
  },
  "receipt": {
    "receiptNumber": "REC-2024-001",
    "receiptUrl": "https://api.sgc.gov.cv/receipts/REC-2024-001.pdf",
    "digitalSignature": "SHA256:a1b2c3d4e5f6..."
  },
  "processedDate": "2024-01-25T14:30:15Z",
  "processedBy": "system-auto"
}
```

#### 5.3.4 Reconciliar Pagamento

**Endpoint:** `PUT /api/v1/payments/{id}/reconcile`

**Descrição:** Reconcilia um pagamento com dados bancários.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENTS_RECONCILE`

**Rate Limiting:** 50 requests/minuto

#### 5.3.5 Pagamentos por Guia

**Endpoint:** `GET /api/v1/payments/guide/{guideId}`

**Descrição:** Retorna todos os pagamentos relacionados a uma guia.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENTS_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.3.6 Regenerar Guia

**Endpoint:** `POST /api/v1/payment-guides/{id}/regenerate`

**Descrição:** Regenera uma guia de pagamento com nova data de vencimento.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENT_GUIDES_REGENERATE`

**Rate Limiting:** 20 requests/minuto

#### 5.3.7 Obter Código de Barras

**Endpoint:** `GET /api/v1/payment-guides/{id}/barcode`

**Descrição:** Retorna código de barras e linha digitável da guia.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PAYMENT_GUIDES_READ`

**Rate Limiting:** 200 requests/minuto

### 5.4 Controle de Inadimplência

#### 5.4.1 Listar Inadimplências

**Endpoint:** `GET /api/v1/defaulters`

**Descrição:** Retorna lista paginada de inadimplências com filtros e análise de risco.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `municipalityId` (UUID, opcional): Filtrar por município

* `collectionStage` (string, opcional): EARLY, INTERMEDIATE, ADVANCED, LEGAL

* `debtAmount` (decimal, opcional): Valor mínimo da dívida

* `overdueFrom` (int, opcional): Dias de atraso mínimo

* `overdueTo` (int, opcional): Dias de atraso máximo

* `riskLevel` (string, opcional): LOW, MEDIUM, HIGH, CRITICAL

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 20, máx: 100): Itens por página

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/defaulters?municipalityId=municipality-001&collectionStage=INTERMEDIATE&debtAmount=1000&overdueFrom=30" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "defaulter-001",
      "debtorInfo": {
        "name": "Maria Santos Silva",
        "document": "987654321",
        "email": "maria.silva@email.cv",
        "phone": "+238 555-0456",
        "address": "Rua das Flores, 456, Praia"
      },
      "debtSummary": {
        "totalDebt": 3500.00,
        "principalAmount": 2200.00,
        "interestAmount": 800.00,
        "penaltyAmount": 500.00,
        "overdueGuides": 2,
        "oldestOverdueDate": "2023-10-15"
      },
      "collectionInfo": {
        "stage": "INTERMEDIATE",
        "daysPastDue": 95,
        "lastContactDate": "2024-01-10",
        "lastContactMethod": "EMAIL",
        "nextActionDate": "2024-01-30",
        "assignedCollector": "collector-001"
      },
      "riskAssessment": {
        "riskLevel": "HIGH",
        "riskScore": 75,
        "paymentHistory": "IRREGULAR",
        "contactResponsiveness": "LOW",
        "negotiationWillingness": "MEDIUM"
      },
      "relatedServices": [
        {
          "type": "CONCESSION",
          "referenceId": "concession-001",
          "description": "Concessão perpétua - Lote A1-001"
        }
      ]
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  },
  "summary": {
    "totalDefaulters": 156,
    "totalDebtAmount": 450000.00,
    "averageDebtAmount": 2884.62,
    "collectionStages": {
      "EARLY": 45,
      "INTERMEDIATE": 67,
      "ADVANCED": 32,
      "LEGAL": 12
    }
  }
}
```

#### 5.4.2 Iniciar Negociação

**Endpoint:** `POST /api/v1/defaulters/{id}/negotiate`

**Descrição:** Inicia processo de negociação com devedor inadimplente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_NEGOTIATE`

**Rate Limiting:** 30 requests/minuto

#### 5.4.3 Criar Parcelamento

**Endpoint:** `PUT /api/v1/defaulters/{id}/installment`

**Descrição:** Cria plano de parcelamento para devedor inadimplente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_INSTALLMENT`

**Rate Limiting:** 20 requests/minuto

#### 5.4.4 Relatório de Inadimplência

**Endpoint:** `GET /api/v1/defaulters/report`

**Descrição:** Gera relatório detalhado de inadimplência por período.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_REPORT`

**Rate Limiting:** 10 requests/minuto

#### 5.4.5 Registrar Contato

**Endpoint:** `POST /api/v1/defaulters/{id}/contact`

**Descrição:** Registra tentativa de contato com devedor.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_CONTACT`

**Rate Limiting:** 100 requests/minuto

#### 5.4.6 Atualizar Estágio de Cobrança

**Endpoint:** `PUT /api/v1/defaulters/{id}/collection-stage`

**Descrição:** Atualiza estágio de cobrança do devedor.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_UPDATE_STAGE`

**Rate Limiting:** 50 requests/minuto

#### 5.4.7 Envio em Lote de Avisos

**Endpoint:** `POST /api/v1/defaulters/bulk-notice`

**Descrição:** Envia avisos de cobrança em lote para múltiplos devedores.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `DEFAULTERS_BULK_NOTICE`

**Rate Limiting:** 5 requests/minuto

### 5.5 Negociações e Parcelamentos

#### 5.5.1 Listar Negociações

**Endpoint:** `GET /api/v1/negotiations`

**Descrição:** Retorna lista de negociações ativas e históricas com filtros.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `NEGOTIATIONS_READ`

**Rate Limiting:** 100 requests/minuto

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/negotiations?status=ACTIVE&municipalityId=municipality-001" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "negotiation-001",
      "negotiationNumber": "NEG-2024-001",
      "defaulterId": "defaulter-001",
      "debtorName": "Maria Santos Silva",
      "originalDebt": 3500.00,
      "negotiatedAmount": 2800.00,
      "discountAmount": 700.00,
      "discountPercentage": 20.0,
      "proposedInstallments": 6,
      "installmentAmount": 466.67,
      "status": "PENDING_APPROVAL",
      "proposalDate": "2024-01-20",
      "expirationDate": "2024-02-20",
      "negotiator": {
        "id": "user-001",
        "name": "Ana Costa",
        "role": "COLLECTION_AGENT"
      },
      "terms": {
        "downPayment": 500.00,
        "installments": 6,
        "interestRate": 0.0,
        "penaltyWaiver": true,
        "conditions": [
          "Pagamento da entrada até 30/01/2024",
          "Parcelas com vencimento todo dia 15",
          "Quebra do acordo cancela desconto"
        ]
      },
      "approvalRequired": true,
      "approvalLevel": "SUPERVISOR"
    }
  ],
  "summary": {
    "totalNegotiations": 45,
    "totalNegotiatedAmount": 125000.00,
    "averageDiscount": 18.5,
    "successRate": 78.2
  }
}
```

#### 5.5.2 Criar Negociação

**Endpoint:** `POST /api/v1/negotiations`

**Descrição:** Cria uma nova proposta de negociação para devedor.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `NEGOTIATIONS_CREATE`

**Rate Limiting:** 20 requests/minuto

#### 5.5.3 Aceitar Proposta

**Endpoint:** `PUT /api/v1/negotiations/{id}/accept`

**Descrição:** Aceita uma proposta de negociação e cria plano de pagamento.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `NEGOTIATIONS_ACCEPT`

**Rate Limiting:** 10 requests/minuto

#### 5.5.4 Parcelamentos por Devedor

**Endpoint:** `GET /api/v1/installment-plans/debtor/{debtorId}`

**Descrição:** Retorna todos os parcelamentos de um devedor específico.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `INSTALLMENT_PLANS_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.5.5 Pagar Parcela

**Endpoint:** `POST /api/v1/installment-plans/{id}/pay-installment`

**Descrição:** Registra pagamento de uma parcela do plano.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `INSTALLMENT_PLANS_PAY`

**Rate Limiting:** 50 requests/minuto

#### 5.5.6 Cronograma de Parcelas

**Endpoint:** `GET /api/v1/installment-plans/{id}/schedule`

**Descrição:** Retorna cronograma detalhado de parcelas do plano.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `INSTALLMENT_PLANS_READ`

**Rate Limiting:** 100 requests/minuto

### 5.6 Reconciliação

#### 5.6.1 Reconciliações Pendentes

**Endpoint:** `GET /api/v1/reconciliations/pending`

**Descrição:** Lista reconciliações pendentes de processamento manual ou automático.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `RECONCILIATIONS_READ`

**Rate Limiting:** 100 requests/minuto

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/reconciliations/pending?bankCode=237&dateFrom=2024-01-20&dateTo=2024-01-25" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "reconciliation-001",
      "bankCode": "237",
      "bankName": "Banco Bradesco",
      "transactionDate": "2024-01-25",
      "bankReference": "E12345678901234567890123456789012345",
      "amount": 2200.00,
      "payerDocument": "123456789",
      "payerName": "João Silva Santos",
      "status": "PENDING_MATCH",
      "possibleMatches": [
        {
          "paymentId": "payment-001",
          "guideNumber": "PG-2024-001",
          "amount": 2200.00,
          "matchScore": 95,
          "matchReasons": [
            "EXACT_AMOUNT_MATCH",
            "DOCUMENT_MATCH",
            "DATE_RANGE_MATCH"
          ]
        }
      ],
      "importDate": "2024-01-25T08:00:00Z",
      "importBatch": "BATCH-2024-001"
    }
  ],
  "summary": {
    "totalPending": 23,
    "totalAmount": 45600.00,
    "autoMatchable": 18,
    "manualReviewRequired": 5
  }
}
```

#### 5.6.2 Reconciliação Automática

**Endpoint:** `POST /api/v1/reconciliations/automatic`

**Descrição:** Executa processo de reconciliação automática por lote.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `RECONCILIATIONS_AUTO`

**Rate Limiting:** 10 requests/minuto

#### 5.6.3 Reconciliação Manual

**Endpoint:** `PUT /api/v1/reconciliations/{id}/manual`

**Descrição:** Executa reconciliação manual de uma transação específica.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `RECONCILIATIONS_MANUAL`

**Rate Limiting:** 50 requests/minuto

#### 5.6.4 Listar Divergências

**Endpoint:** `GET /api/v1/reconciliations/divergences`

**Descrição:** Lista divergências encontradas no processo de reconciliação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `RECONCILIATIONS_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.6.5 Importar Arquivo Bancário

**Endpoint:** `POST /api/v1/reconciliations/import-bank-file`

**Descrição:** Importa arquivo de retorno bancário para reconciliação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `RECONCILIATIONS_IMPORT`

**Rate Limiting:** 5 requests/minuto

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/reconciliations/import-bank-file" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: multipart/form-data" \
  -F "file=@retorno_237_20240125.ret" \
  -F "bankCode=237" \
  -F "fileType=CNAB240" \
  -F "referenceDate=2024-01-25"
```

**Exemplo de Response (201):**

```json
{
  "importId": "import-001",
  "batchNumber": "BATCH-2024-001",
  "bankCode": "237",
  "fileType": "CNAB240",
  "referenceDate": "2024-01-25",
  "processingStatus": "PROCESSING",
  "fileInfo": {
    "fileName": "retorno_237_20240125.ret",
    "fileSize": 15420,
    "recordCount": 156,
    "checksum": "SHA256:a1b2c3d4e5f6..."
  },
  "importSummary": {
    "totalRecords": 156,
    "validRecords": 154,
    "invalidRecords": 2,
    "totalAmount": 345600.00
  },
  "estimatedProcessingTime": "5 minutos",
  "importDate": "2024-01-25T08:15:00Z",
  "importedBy": "user123"
}
```

## 6. Integrações

### 6.1 Integrações Internas (RabbitMQ)

* **BE-02-Concessao**: Cálculo de taxas para concessões e renovações

* **BE-03-Operacao**: Cobrança de taxas operacionais (inumações, exumações)

* **Notification Service**: Notificações de vencimento e cobrança

* **Audit Service**: Logs de transações financeiras

### 6.2 Integrações Externas

* **Plataformas de Pagamento Municipais**: Processamento de transações online

* **Sistemas Bancários**: Reconciliação automática via arquivos de retorno

* **Receita Municipal**: Integração com sistemas tributários municipais

* **Sistemas Contábeis**: Exportação de dados contábeis e fiscais

* **Gateways Token**: Processamento de pagamentos instantâneos

### 6.3 Webhooks e Notificações

* Webhooks para confirmação de pagamentos em tempo real

* Notificações de vencimento via RabbitMQ para múltiplos canais

* Alertas de inadimplência para gestores e cobradores

* Confirmações de reconciliação para sistemas contábeis

## 7. Regras de Negócio

### 7.1 Cálculo de Taxas

* Aplicação de tabelas vigentes na data do serviço

* Cálculo proporcional para períodos parciais de concessão

* Aplicação automática de descontos por categoria social

* Arredondamento conforme regulamentação municipal específica

* Validação de valores mínimos e máximos por tipo de serviço

### 7.2 Processamento de Pagamentos

* Validação de valores mínimos e máximos por método de pagamento

* Controle rigoroso de duplicidade de pagamentos

* Aplicação automática de juros e multas conforme legislação

* Validação de formas de pagamento permitidas por município

* Processamento de pagamentos parciais com regras específicas

### 7.3 Controle de Vencimentos e Inadimplência

* Cálculo automático de datas de vencimento por tipo de serviço

* Aplicação de prazos de carência conforme categoria do usuário

* Geração automática de segunda via com atualização de valores

* Controle de prescrição de débitos conforme legislação

* Escalonamento automático de cobrança por dias de atraso

## 8. Motor de Cálculo Financeiro

### 8.1 Engine de Cálculo Configurável

* Sistema de regras configuráveis por tipo de serviço e município

* Suporte a fórmulas matemáticas complexas com variáveis dinâmicas

* Aplicação de fatores de correção monetária automáticos

* Validação de limites mínimos e máximos por categoria

* Cálculo de valores proporcionais para períodos parciais

### 8.2 Sistema de Descontos e Isenções

* Descontos automáticos por categoria de usuário (idoso, deficiente, etc.)

* Isenções por critérios sociais configuráveis por município

* Descontos por pagamento antecipado com percentuais variáveis

* Promoções temporárias com datas de vigência específicas

* Acumulação de descontos com regras de precedência

### 8.3 Cálculo de Juros e Multas

* Cálculo automático de juros compostos por dias de atraso

* Aplicação de multas por atraso conforme legislação municipal

* Limitação de juros conforme legislação federal e municipal

* Negociação de valores em atraso com aprovação hierárquica

* Capitalização de juros com periodicidade configurável

## 9. Requisitos Não Funcionais

### 9.1 Performance

* Processamento de até 10.000 cálculos simultâneos por hora

* Tempo de resposta < 1 segundo para cálculos simples

* Processamento em lote para reconciliações bancárias

* Cache distribuído para tabelas de taxas frequentemente acessadas

* Otimização de consultas com índices específicos

### 9.2 Segurança

* Criptografia AES-256 de dados financeiros sensíveis

* Auditoria completa de todas as transações financeiras

* Controle de acesso granular por nível de valor e operação

* Logs imutáveis para compliance e auditoria externa

* Segregação de dados por município com isolamento total

### 9.3 Confiabilidade

* Transações ACID para todas as operações financeiras críticas

* Backup automático incremental de dados críticos a cada hora

* Redundância ativa para sistemas de pagamento críticos

* Monitoramento de SLA de integrações externas com alertas

* Recuperação automática de falhas com rollback inteligente

## 10. Compliance e Auditoria

### 10.1 Controles Internos Obrigatórios

* Segregação rigorosa de funções por perfil de usuário

* Aprovação obrigatória em múltiplos níveis para valores altos

* Trilha de auditoria completa e imutável para todas as operações

* Controle de alterações em tabelas com versionamento completo

* Validação cruzada de dados com sistemas externos

### 10.2 Relatórios Regulamentares Automáticos

* Relatórios automáticos para Tribunal de Contas Municipal

* Demonstrativos de receita por período com detalhamento

* Relatórios de inadimplência com análise de tendências

* Balancetes e conciliações bancárias automatizadas

* Relatórios de arrecadação por tipo de serviço

### 10.3 Conformidade Legal e Regulamentária

* Aderência total à legislação tributária municipal específica

* Conformidade com normas de pagamento do Banco Central

* Proteção rigorosa de dados financeiros conforme LGPD

* Retenção de documentos conforme prazos legais estabelecidos

* Auditoria externa com relatórios de conformidade

## 11. Monitoramento e Alertas Inteligentes

### 11.1 KPIs Financeiros em Tempo Real

* Taxa de inadimplência por período com tendências

* Tempo médio de reconciliação por método de pagamento

* Volume de transações por canal com análise comparativa

* Receita realizada vs projetada com desvios automáticos

* Performance de cobrança por estágio e responsável

### 11.2 Sistema de Alertas Automáticos

* Falhas em integrações de pagamento com escalação automática

* Divergências em reconciliações com priorização por valor

* Vencimentos em massa não processados com ações corretivas

* Transações suspeitas ou duplicadas com bloqueio preventivo

* Metas de arrecadação em risco com planos de ação

### 11.3 Dashboards Executivos Interativos

* Receita em tempo real com projeções dinâmicas

* Análise preditiva de arrecadação com cenários múltiplos

* Análise detalhada de inadimplência com segmentação

* Performance comparativa de canais de pagamento

* Indicadores de eficiência operacional e financeira

## 12. Configurações Específicas por Município

### 12.1 Parâmetros Financeiros Municipais

* Tabelas de emolumentos específicas com versionamento

* Formas de pagamento aceitas com limites por método

* Prazos de vencimento padrão por tipo de serviço

* Critérios específicos para descontos e isenções sociais

* Regras de arredondamento conforme legislação local

### 12.2 Configurações de Integração Técnica

* Credenciais seguras de plataformas de pagamento por município

* Configurações específicas de webhook por gateway

* Parâmetros de reconciliação automática personalizados

* Timeouts e políticas de retry específicas por integração

* Configurações de backup e recuperação por criticidade

### 12.3 Configurações de Negócio Operacional

* Limites de valor por perfil de usuário e tipo de operação

* Regras específicas de arredondamento por tipo de taxa

* Critérios detalhados de aplicação de juros e multas

* Políticas de negociação de débitos com alçadas definidas

* Configurações de relatórios regulamentares por órgão fiscalizador

