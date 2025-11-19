# BE-03-Operacao - Módulo Backend de Operações Cemiteriais

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

O módulo BE-03-Operacao é responsável pela gestão e coordenação de todas as operações de campo realizadas nos cemitérios, incluindo inumações, exumações, trasladações e agendamento de serviços.

**Tecnologia Base:** IGRP 3.0 Spring Backend\
**Base de Dados:** PostgreSQL 16\
**Arquitetura:** Microserviço independente (Operations Service)\
**Mensageria:** RabbitMQ para coordenação de operações

## 2. Funcionalidades Principais

### 2.1 Gestão de Inumações

* Agendamento de inumações com validação de disponibilidade

* Coordenação com funerárias e famílias

* Geração automática de ordens de serviço

* Registro detalhado com evidências fotográficas

### 2.2 Gestão de Exumações

* Exumações programadas por fim de concessão

* Exumações solicitadas por famílias

* Coordenação com autoridades sanitárias

* Gestão de destino dos restos mortais

### 2.3 Gestão de Trasladações

* Trasladações intra-cemiteriais (dentro do mesmo cemitério)

* Trasladações inter-cemiteriais (entre cemitérios diferentes)

* Validação de documentação e autorizações

* Coordenação logística de transporte

### 2.4 Agendamento e Coordenação

* Sistema de agendamento com slots de tempo

* Coordenação de equipes operacionais

* Gestão de recursos e equipamentos

* Otimização de rotas e cronogramas

## 3. Modelo de Dados

### 3.1 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    t_burials ||--o{ t_burial_evidences : has
    t_exhumations ||--o{ t_exhumation_evidences : has
    t_transfers ||--o{ t_transfer_evidences : has
    t_schedules ||--|| t_burials : schedules
    t_schedules ||--|| t_exhumations : schedules
    t_schedules ||--|| t_transfers : schedules
    t_work_orders ||--o{ t_burials : generates
    t_work_orders ||--o{ t_exhumations : generates
    t_work_orders ||--o{ t_transfers : generates
    t_plots ||--o{ t_burials : receives
    t_plots ||--o{ t_exhumations : involves
    t_deceased ||--|| t_burials : involves
    t_concessions ||--|| t_burials : authorizes
    t_teams ||--o{ t_schedules : assigned
    t_funeral_homes ||--o{ t_burials : coordinates

    t_burials {
        uuid id PK "Identificador único da inumação"
        uuid plot_id FK "Referência à sepultura"
        uuid deceased_id FK "Referência ao falecido"
        uuid concession_id FK "Referência à concessão"
        uuid schedule_id FK "Referência ao agendamento"
        uuid funeral_home_id FK "Referência à funerária"
        date burial_date "Data da inumação"
        time burial_time "Hora da inumação"
        uuid responsible_id FK "Responsável pela operação"
        varchar status "Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED"
        text notes "Observações da operação"
        json burial_details "Detalhes específicos (JSON)"
        boolean evidence_collected "Se evidências foram coletadas"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
        uuid last_modified_by "Usuário que atualizou"
    }

    t_exhumations {
        uuid id PK "Identificador único da exumação"
        uuid plot_id FK "Referência à sepultura"
        uuid concession_id FK "Referência à concessão"
        uuid schedule_id FK "Referência ao agendamento"
        varchar exhumation_type "Tipo: AUTOMATIC, REQUESTED, JUDICIAL"
        varchar reason "Motivo: EXPIRY, FAMILY_REQUEST, LEGAL_ORDER"
        date exhumation_date "Data da exumação"
        time exhumation_time "Hora da exumação"
        uuid responsible_id FK "Responsável pela operação"
        varchar remains_destination "Destino: OSSUARY, TRANSFER, CREMATION"
        uuid destination_plot_id FK "Nova sepultura (se aplicável)"
        varchar status "Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED"
        text notes "Observações da operação"
        json authorization_documents "Documentos de autorização (JSON)"
        boolean evidence_collected "Se evidências foram coletadas"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_transfers {
        uuid id PK "Identificador único da trasladação"
        uuid source_plot_id FK "Sepultura de origem"
        uuid destination_plot_id FK "Sepultura de destino"
        uuid concession_id FK "Referência à concessão"
        uuid schedule_id FK "Referência ao agendamento"
        varchar transfer_type "Tipo: INTRA_CEMETERY, INTER_CEMETERY"
        uuid destination_cemetery_id FK "Cemitério de destino (inter-cemiterial)"
        date transfer_date "Data da trasladação"
        time transfer_time "Hora da trasladação"
        uuid responsible_id FK "Responsável pela operação"
        varchar reason "Motivo da trasladação"
        varchar status "Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED"
        text notes "Observações da operação"
        json authorization_documents "Documentos de autorização (JSON)"
        boolean evidence_collected "Se evidências foram coletadas"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_schedules {
        uuid id PK "Identificador único do agendamento"
        varchar operation_type "Tipo: BURIAL, EXHUMATION, TRANSFER"
        uuid plot_id FK "Referência à sepultura"
        date scheduled_date "Data agendada"
        time start_time "Hora de início"
        time end_time "Hora de fim"
        uuid team_id FK "Equipe responsável"
        uuid requester_id FK "Solicitante da operação"
        varchar priority "Prioridade: LOW, NORMAL, HIGH, URGENT"
        varchar status "Status: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED"
        text notes "Observações do agendamento"
        json required_resources "Recursos necessários (JSON)"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
    }

    t_work_orders {
        uuid id PK "Identificador único da ordem de serviço"
        varchar order_number "Número da ordem de serviço"
        varchar operation_type "Tipo: BURIAL, EXHUMATION, TRANSFER"
        uuid schedule_id FK "Referência ao agendamento"
        uuid team_id FK "Equipe responsável"
        varchar status "Status: PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED"
        json checklist "Lista de verificação (JSON)"
        json required_equipment "Equipamentos necessários (JSON)"
        text instructions "Instruções específicas"
        uuid supervisor_id FK "Supervisor responsável"
        timestamp assigned_at "Data de atribuição"
        timestamp started_at "Data de início"
        timestamp completed_at "Data de conclusão"
        timestamp created_date "Data de criação"
        uuid created_by "Usuário que criou"
    }

    t_burial_evidences {
        uuid id PK "Identificador único da evidência"
        uuid burial_id FK "Referência à inumação"
        varchar evidence_type "Tipo: PHOTO, VIDEO, DOCUMENT"
        varchar file_path "Caminho do arquivo"
        varchar file_name "Nome do arquivo"
        varchar description "Descrição da evidência"
        json metadata "Metadados (GPS, timestamp, etc.)"
        timestamp captured_at "Data de captura"
        uuid captured_by "Usuário que capturou"
    }

    t_exhumation_evidences {
        uuid id PK "Identificador único da evidência"
        uuid exhumation_id FK "Referência à exumação"
        varchar evidence_type "Tipo: PHOTO, VIDEO, DOCUMENT"
        varchar file_path "Caminho do arquivo"
        varchar file_name "Nome do arquivo"
        varchar description "Descrição da evidência"
        json metadata "Metadados (GPS, timestamp, etc.)"
        timestamp captured_at "Data de captura"
        uuid captured_by "Usuário que capturou"
    }

    t_transfer_evidences {
        uuid id PK "Identificador único da evidência"
        uuid transfer_id FK "Referência à trasladação"
        varchar evidence_type "Tipo: PHOTO, VIDEO, DOCUMENT"
        varchar file_path "Caminho do arquivo"
        varchar file_name "Nome do arquivo"
        varchar description "Descrição da evidência"
        json metadata "Metadados (GPS, timestamp, etc.)"
        timestamp captured_at "Data de captura"
        uuid captured_by "Usuário que capturou"
    }

    t_teams {
        uuid id PK "Identificador único da equipe"
        varchar team_name "Nome da equipe"
        varchar team_type "Tipo: BURIAL, EXHUMATION, MAINTENANCE"
        uuid supervisor_id FK "Supervisor da equipe"
        integer max_capacity "Capacidade máxima de operações"
        varchar status "Status: ACTIVE, INACTIVE"
        json specializations "Especializações da equipe (JSON)"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_funeral_homes {
        uuid id PK "Identificador único da funerária"
        varchar company_name "Nome da empresa"
        varchar contact_person "Pessoa de contato"
        varchar phone "Telefone"
        varchar email "Email"
        text address "Endereço"
        varchar license_number "Número da licença"
        varchar status "Status: ACTIVE, INACTIVE, SUSPENDED"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_deceased {
        uuid id PK "Identificador único do falecido"
        varchar full_name "Nome completo"
        varchar document_number "Número do documento"
        date birth_date "Data de nascimento"
        date death_date "Data de óbito"
        varchar death_certificate "Número da certidão de óbito"
        varchar cause_of_death "Causa do óbito"
        varchar nationality "Nacionalidade"
        varchar gender "Gênero"
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

* **text**: Texto longo

* **date**: Data (sem hora)

* **time**: Hora (sem data)

* **timestamp**: Data e hora com fuso horário

## 4. Estrutura de Dados (DDL)

### 4.1 Tabela de Inumações

```sql
-- Criação da tabela de inumações
CREATE TABLE t_burials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID NOT NULL,
    deceased_id UUID NOT NULL,
    concession_id UUID NOT NULL,
    schedule_id UUID,
    funeral_home_id UUID,
    burial_date DATE NOT NULL,
    burial_time TIME NOT NULL,
    responsible_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    burial_details JSONB,
    evidence_collected BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    last_modified_by UUID,
    CONSTRAINT fk_burial_plot FOREIGN KEY (plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_burial_deceased FOREIGN KEY (deceased_id) REFERENCES t_deceased(id),
    CONSTRAINT fk_burial_concession FOREIGN KEY (concession_id) REFERENCES t_concessions(id),
    CONSTRAINT fk_burial_schedule FOREIGN KEY (schedule_id) REFERENCES t_schedules(id),
    CONSTRAINT fk_burial_funeral_home FOREIGN KEY (funeral_home_id) REFERENCES t_funeral_homes(id),
    CONSTRAINT fk_burial_responsible FOREIGN KEY (responsible_id) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_burials_plot ON t_burials(plot_id);
CREATE INDEX idx_burials_deceased ON t_burials(deceased_id);
CREATE INDEX idx_burials_date ON t_burials(burial_date);
CREATE INDEX idx_burials_status ON t_burials(status);
CREATE INDEX idx_burials_responsible ON t_burials(responsible_id);
```

### 4.2 Tabela de Exumações

```sql
-- Criação da tabela de exumações
CREATE TABLE t_exhumations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID NOT NULL,
    concession_id UUID,
    schedule_id UUID,
    exhumation_type VARCHAR(20) NOT NULL CHECK (exhumation_type IN ('AUTOMATIC', 'REQUESTED', 'JUDICIAL')),
    reason VARCHAR(30) NOT NULL CHECK (reason IN ('EXPIRY', 'FAMILY_REQUEST', 'LEGAL_ORDER')),
    exhumation_date DATE NOT NULL,
    exhumation_time TIME NOT NULL,
    responsible_id UUID NOT NULL,
    remains_destination VARCHAR(20) CHECK (remains_destination IN ('OSSUARY', 'TRANSFER', 'CREMATION')),
    destination_plot_id UUID,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    authorization_documents JSONB,
    evidence_collected BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_exhumation_plot FOREIGN KEY (plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_exhumation_concession FOREIGN KEY (concession_id) REFERENCES t_concessions(id),
    CONSTRAINT fk_exhumation_schedule FOREIGN KEY (schedule_id) REFERENCES t_schedules(id),
    CONSTRAINT fk_exhumation_destination_plot FOREIGN KEY (destination_plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_exhumation_responsible FOREIGN KEY (responsible_id) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_exhumations_plot ON t_exhumations(plot_id);
CREATE INDEX idx_exhumations_type ON t_exhumations(exhumation_type);
CREATE INDEX idx_exhumations_date ON t_exhumations(exhumation_date);
CREATE INDEX idx_exhumations_status ON t_exhumations(status);
CREATE INDEX idx_exhumations_reason ON t_exhumations(reason);
```

### 4.3 Tabela de Trasladações

```sql
-- Criação da tabela de trasladações
CREATE TABLE t_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_plot_id UUID NOT NULL,
    destination_plot_id UUID,
    concession_id UUID NOT NULL,
    schedule_id UUID,
    transfer_type VARCHAR(20) NOT NULL CHECK (transfer_type IN ('INTRA_CEMETERY', 'INTER_CEMETERY')),
    destination_cemetery_id UUID,
    transfer_date DATE NOT NULL,
    transfer_time TIME NOT NULL,
    responsible_id UUID NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    authorization_documents JSONB,
    evidence_collected BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_transfer_source_plot FOREIGN KEY (source_plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_transfer_destination_plot FOREIGN KEY (destination_plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_transfer_concession FOREIGN KEY (concession_id) REFERENCES t_concessions(id),
    CONSTRAINT fk_transfer_schedule FOREIGN KEY (schedule_id) REFERENCES t_schedules(id),
    CONSTRAINT fk_transfer_destination_cemetery FOREIGN KEY (destination_cemetery_id) REFERENCES t_cemeteries(id),
    CONSTRAINT fk_transfer_responsible FOREIGN KEY (responsible_id) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_transfers_source_plot ON t_transfers(source_plot_id);
CREATE INDEX idx_transfers_destination_plot ON t_transfers(destination_plot_id);
CREATE INDEX idx_transfers_type ON t_transfers(transfer_type);
CREATE INDEX idx_transfers_date ON t_transfers(transfer_date);
CREATE INDEX idx_transfers_status ON t_transfers(status);
```

### 4.4 Tabela de Agendamentos

```sql
-- Criação da tabela de agendamentos
CREATE TABLE t_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('BURIAL', 'EXHUMATION', 'TRANSFER')),
    plot_id UUID NOT NULL,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    team_id UUID NOT NULL,
    requester_id UUID NOT NULL,
    priority VARCHAR(10) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    required_resources JSONB,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_schedule_plot FOREIGN KEY (plot_id) REFERENCES t_plots(id),
    CONSTRAINT fk_schedule_team FOREIGN KEY (team_id) REFERENCES t_teams(id),
    CONSTRAINT fk_schedule_requester FOREIGN KEY (requester_id) REFERENCES t_users(id),
    CONSTRAINT uk_schedule_time_team UNIQUE (team_id, scheduled_date, start_time) -- Evita conflitos de agendamento
);

-- Índices
CREATE INDEX idx_schedules_operation_type ON t_schedules(operation_type);
CREATE INDEX idx_schedules_date ON t_schedules(scheduled_date);
CREATE INDEX idx_schedules_team ON t_schedules(team_id);
CREATE INDEX idx_schedules_status ON t_schedules(status);
CREATE INDEX idx_schedules_priority ON t_schedules(priority);
```

### 4.5 Tabela de Ordens de Serviço

```sql
-- Criação da tabela de ordens de serviço
CREATE TABLE t_work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('BURIAL', 'EXHUMATION', 'TRANSFER')),
    schedule_id UUID NOT NULL,
    team_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    checklist JSONB,
    required_equipment JSONB,
    instructions TEXT,
    supervisor_id UUID,
    assigned_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    CONSTRAINT fk_work_order_schedule FOREIGN KEY (schedule_id) REFERENCES t_schedules(id),
    CONSTRAINT fk_work_order_team FOREIGN KEY (team_id) REFERENCES t_teams(id),
    CONSTRAINT fk_work_order_supervisor FOREIGN KEY (supervisor_id) REFERENCES t_users(id)
);

-- Índices
CREATE INDEX idx_work_orders_operation_type ON t_work_orders(operation_type);
CREATE INDEX idx_work_orders_status ON t_work_orders(status);
CREATE INDEX idx_work_orders_team ON t_work_orders(team_id);
CREATE INDEX idx_work_orders_number ON t_work_orders(order_number);
```

## 5. APIs e Endpoints

### 5.1 Gestão de Inumações

#### 5.1.1 Agendar Nova Inumação

**Endpoint:** `POST /api/v1/burials`

**Descrição:** Cria um novo agendamento de inumação com validação de disponibilidade de sepultura e coordenação com funerárias.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_CREATE`

**Rate Limiting:** 50 requests/minuto

**Validações:**

* Sepultura deve estar disponível e vinculada a concessão ativa

* Data/hora deve estar dentro do horário de funcionamento

* Equipe deve estar disponível no horário solicitado

* Documentação do falecido deve estar completa

* Funerária deve estar cadastrada e ativa

**Regras de Negócio:**

* Agendamento mínimo de 24h de antecedência

* Máximo 3 inumações simultâneas por cemitério

* Validação automática de conflitos de agenda

* Geração automática de ordem de serviço

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/burials" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
    "deceasedId": "bb0e8400-e29b-41d4-a716-446655440005",
    "concessionId": "cc0e8400-e29b-41d4-a716-446655440006",
    "funeralHomeId": "dd0e8400-e29b-41d4-a716-446655440007",
    "burialDate": "2024-01-25",
    "burialTime": "10:00:00",
    "requestedTeamId": "ee0e8400-e29b-41d4-a716-446655440008",
    "specialRequirements": [
      "RELIGIOUS_CEREMONY",
      "FAMILY_PRESENCE"
    ],
    "notes": "Cerimônia religiosa católica solicitada pela família",
    "contactPerson": {
      "name": "João Silva Santos",
      "phone": "+238 555-0123",
      "email": "joao.santos@email.cv"
    }
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "burial-001",
  "burialNumber": "BUR-2024-001",
  "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
  "plotNumber": "A1-001",
  "deceased": {
    "id": "bb0e8400-e29b-41d4-a716-446655440005",
    "name": "Maria Santos Silva",
    "documentNumber": "987654321",
    "deathDate": "2024-01-20"
  },
  "concessionId": "cc0e8400-e29b-41d4-a716-446655440006",
  "funeralHome": {
    "id": "dd0e8400-e29b-41d4-a716-446655440007",
    "name": "Funerária São José",
    "contactPhone": "+238 555-0456"
  },
  "scheduledDateTime": "2024-01-25T10:00:00Z",
  "assignedTeam": {
    "id": "ee0e8400-e29b-41d4-a716-446655440008",
    "name": "Equipe Alpha",
    "supervisor": "Carlos Mendes"
  },
  "workOrder": {
    "id": "wo-001",
    "orderNumber": "WO-2024-001",
    "status": "PENDING"
  },
  "status": "SCHEDULED",
  "estimatedDuration": "2 horas",
  "specialRequirements": [
    "RELIGIOUS_CEREMONY",
    "FAMILY_PRESENCE"
  ],
  "createdDate": "2024-01-22T14:30:00Z",
  "createdBy": "user123"
}
```

#### 5.1.2 Listar Inumações com Filtros

**Endpoint:** `GET /api/v1/burials`

**Descrição:** Retorna lista paginada de inumações com filtros avançados para gestão operacional.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `cemeteryId` (UUID, opcional): Filtrar por cemitério

* `status` (string, opcional): SCHEDULED, IN\_PROGRESS, COMPLETED, CANCELLED

* `dateFrom` (date, opcional): Data inicial do período

* `dateTo` (date, opcional): Data final do período

* `teamId` (UUID, opcional): Filtrar por equipe

* `funeralHomeId` (UUID, opcional): Filtrar por funerária

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 20, máx: 100): Itens por página

* `sort` (string, padrão: burialDate,asc): Ordenação

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/burials?cemeteryId=cemetery-001&status=SCHEDULED&dateFrom=2024-01-25&dateTo=2024-01-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "burial-001",
      "burialNumber": "BUR-2024-001",
      "plotNumber": "A1-001",
      "deceasedName": "Maria Santos Silva",
      "scheduledDateTime": "2024-01-25T10:00:00Z",
      "teamName": "Equipe Alpha",
      "funeralHomeName": "Funerária São José",
      "status": "SCHEDULED",
      "estimatedDuration": "2 horas",
      "hasSpecialRequirements": true
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  },
  "summary": {
    "totalScheduled": 15,
    "totalInProgress": 3,
    "totalCompleted": 142,
    "averageDuration": "1.5 horas"
  }
}
```

#### 5.1.3 Obter Inumação Específica

**Endpoint:** `GET /api/v1/burials/{id}`

**Descrição:** Retorna detalhes completos de uma inumação específica incluindo evidências e histórico.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_READ`

**Rate Limiting:** 200 requests/minuto

**Parâmetros Path:**

* `id` (UUID, obrigatório): Identificador da inumação

**Parâmetros Query:**

* `includeEvidences` (boolean, padrão: false): Incluir evidências fotográficas

* `includeHistory` (boolean, padrão: false): Incluir histórico de operações

#### 5.1.4 Atualizar Dados da Inumação

**Endpoint:** `PUT /api/v1/burials/{id}`

**Descrição:** Atualiza dados de uma inumação agendada (campos limitados por status).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_UPDATE`

**Rate Limiting:** 30 requests/minuto

**Campos Atualizáveis:**

* `burialDate` e `burialTime`: Apenas se status = SCHEDULED

* `notes`: Observações adicionais

* `specialRequirements`: Requisitos especiais

* `contactPerson`: Dados de contato

#### 5.1.5 Marcar Inumação como Concluída

**Endpoint:** `POST /api/v1/burials/{id}/complete`

**Descrição:** Marca uma inumação como concluída após validação de evidências obrigatórias.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_COMPLETE`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Status deve ser IN\_PROGRESS

* Evidências fotográficas obrigatórias devem estar presentes

* Checklist de qualidade deve estar completo

* Geolocalização deve ser validada

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/burials/burial-001/complete" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "completionNotes": "Inumação realizada conforme procedimentos. Família presente durante cerimônia.",
    "actualDuration": "1.5 horas",
    "qualityChecklist": {
      "plotCorrectlyIdentified": true,
      "safetyProceduresFollowed": true,
      "familyNotified": true,
      "evidencesCollected": true,
      "documentationComplete": true
    },
    "finalLocation": {
      "latitude": 14.9176,
      "longitude": -23.5091,
      "accuracy": 5.0
    }
  }'
```

#### 5.1.6 Obter Evidências Fotográficas

**Endpoint:** `GET /api/v1/burials/{id}/evidences`

**Descrição:** Retorna lista de evidências fotográficas coletadas durante a inumação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_READ`, `EVIDENCES_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.1.7 Upload de Evidências

**Endpoint:** `POST /api/v1/burials/{id}/evidences`

**Descrição:** Faz upload de evidências fotográficas com metadados de geolocalização.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `BURIALS_UPDATE`, `EVIDENCES_CREATE`

**Rate Limiting:** 30 requests/minuto

**Validações:**

* Arquivo deve ser JPG ou PNG

* Tamanho máximo: 10MB por arquivo

* Metadados EXIF com geolocalização obrigatórios

* Máximo 20 evidências por inumação

### 5.2 Gestão de Exumações

#### 5.2.1 Agendar Nova Exumação

**Endpoint:** `POST /api/v1/exhumations`

**Descrição:** Cria um novo agendamento de exumação com validação de prazos e notificações.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_CREATE`

**Rate Limiting:** 30 requests/minuto

**Validações:**

* Concessão deve estar vencida ou com solicitação válida

* Notificação prévia deve ter sido enviada (se aplicável)

* Equipe especializada deve estar disponível

* Autorização sanitária deve estar válida

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/exhumations" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
    "concessionId": "cc0e8400-e29b-41d4-a716-446655440006",
    "exhumationType": "AUTOMATIC",
    "reason": "CONCESSION_EXPIRED",
    "scheduledDate": "2024-02-15",
    "scheduledTime": "08:00:00",
    "requestedTeamId": "ee0e8400-e29b-41d4-a716-446655440008",
    "sanitaryAuthorization": "AUTH-2024-001",
    "destinationType": "OSSUARY",
    "familyNotified": true,
    "notificationDate": "2024-01-15",
    "notes": "Exumação automática por vencimento de concessão"
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "exhumation-001",
  "exhumationNumber": "EXH-2024-001",
  "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
  "plotNumber": "A1-001",
  "concessionId": "cc0e8400-e29b-41d4-a716-446655440006",
  "exhumationType": "AUTOMATIC",
  "reason": "CONCESSION_EXPIRED",
  "scheduledDateTime": "2024-02-15T08:00:00Z",
  "assignedTeam": {
    "id": "ee0e8400-e29b-41d4-a716-446655440008",
    "name": "Equipe Especializada Beta",
    "supervisor": "Ana Costa"
  },
  "sanitaryAuthorization": "AUTH-2024-001",
  "destinationType": "OSSUARY",
  "status": "SCHEDULED",
  "familyNotificationStatus": {
    "notified": true,
    "notificationDate": "2024-01-15",
    "method": "REGISTERED_MAIL"
  },
  "estimatedDuration": "4 horas",
  "workOrder": {
    "id": "wo-002",
    "orderNumber": "WO-2024-002",
    "status": "PENDING"
  },
  "createdDate": "2024-01-22T15:00:00Z",
  "createdBy": "user123"
}
```

#### 5.2.2 Listar Exumações com Filtros

**Endpoint:** `GET /api/v1/exhumations`

**Descrição:** Retorna lista paginada de exumações com filtros para gestão operacional.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.2.3 Listar Exumações Automáticas

**Endpoint:** `GET /api/v1/exhumations/automatic`

**Descrição:** Retorna exumações automáticas por vencimento de concessão que precisam ser agendadas.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.2.4 Executar Exumação

**Endpoint:** `POST /api/v1/exhumations/{id}/execute`

**Descrição:** Inicia a execução de uma exumação agendada com validações de segurança.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_EXECUTE`

**Rate Limiting:** 10 requests/minuto

#### 5.2.5 Definir Destino dos Restos

**Endpoint:** `PUT /api/v1/exhumations/{id}/destination`

**Descrição:** Define o destino final dos restos mortais após exumação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_UPDATE`

**Rate Limiting:** 20 requests/minuto

#### 5.2.6 Obter Evidências

**Endpoint:** `GET /api/v1/exhumations/{id}/evidences`

**Descrição:** Retorna evidências fotográficas da exumação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_READ`, `EVIDENCES_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.2.7 Upload de Evidências

**Endpoint:** `POST /api/v1/exhumations/{id}/evidences`

**Descrição:** Upload de evidências fotográficas da exumação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `EXHUMATIONS_UPDATE`, `EVIDENCES_CREATE`

**Rate Limiting:** 30 requests/minuto

### 5.3 Gestão de Trasladações

#### 5.3.1 Solicitar Trasladação

**Endpoint:** `POST /api/v1/transfers`

**Descrição:** Cria uma nova solicitação de trasladação com validação de documentação e autorizações.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_CREATE`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Concessão deve estar ativa

* Documentação de autorização deve estar completa

* Sepultura de destino deve estar disponível (se especificada)

* Taxas de trasladação devem estar pagas

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/transfers" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "sourcePlotId": "aa0e8400-e29b-41d4-a716-446655440004",
    "destinationPlotId": "bb0e8400-e29b-41d4-a716-446655440005",
    "concessionId": "cc0e8400-e29b-41d4-a716-446655440006",
    "transferType": "INTRA_CEMETERY",
    "reason": "FAMILY_REQUEST",
    "requesterId": "dd0e8400-e29b-41d4-a716-446655440007",
    "scheduledDate": "2024-02-20",
    "scheduledTime": "09:00:00",
    "documents": [
      {
        "type": "FAMILY_AUTHORIZATION",
        "documentId": "doc-123456",
        "verified": true
      },
      {
        "type": "PAYMENT_RECEIPT",
        "documentId": "doc-123457",
        "verified": true
      }
    ],
    "specialRequirements": [
      "FAMILY_PRESENCE",
      "RELIGIOUS_CEREMONY"
    ],
    "notes": "Trasladação solicitada pela família para sepultura perpétua"
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "transfer-001",
  "transferNumber": "TRF-2024-001",
  "sourcePlot": {
    "id": "aa0e8400-e29b-41d4-a716-446655440004",
    "plotNumber": "A1-001",
    "cemeteryName": "Cemitério Municipal da Praia"
  },
  "destinationPlot": {
    "id": "bb0e8400-e29b-41d4-a716-446655440005",
    "plotNumber": "B2-015",
    "cemeteryName": "Cemitério Municipal da Praia"
  },
  "concessionId": "cc0e8400-e29b-41d4-a716-446655440006",
  "transferType": "INTRA_CEMETERY",
  "reason": "FAMILY_REQUEST",
  "requester": {
    "id": "dd0e8400-e29b-41d4-a716-446655440007",
    "name": "João Silva Santos",
    "relationship": "FAMILY_MEMBER"
  },
  "scheduledDateTime": "2024-02-20T09:00:00Z",
  "status": "PENDING_APPROVAL",
  "approvalRequired": true,
  "estimatedDuration": "3 horas",
  "transferFee": 1500.00,
  "paymentStatus": "CONFIRMED",
  "specialRequirements": [
    "FAMILY_PRESENCE",
    "RELIGIOUS_CEREMONY"
  ],
  "workOrder": {
    "id": "wo-003",
    "orderNumber": "WO-2024-003",
    "status": "PENDING"
  },
  "createdDate": "2024-01-22T16:00:00Z",
  "createdBy": "user123"
}
```

#### 5.3.2 Listar Trasladações com Filtros

**Endpoint:** `GET /api/v1/transfers`

**Descrição:** Retorna lista paginada de trasladações com filtros.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.3.3 Aprovar Trasladação

**Endpoint:** `PUT /api/v1/transfers/{id}/approve`

**Descrição:** Aprova uma solicitação de trasladação pendente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_APPROVE`

**Rate Limiting:** 20 requests/minuto

#### 5.3.4 Executar Trasladação

**Endpoint:** `POST /api/v1/transfers/{id}/execute`

**Descrição:** Inicia a execução de uma trasladação aprovada.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_EXECUTE`

**Rate Limiting:** 10 requests/minuto

#### 5.3.5 Listar Trasladações Entre Cemitérios

**Endpoint:** `GET /api/v1/transfers/inter-cemetery`

**Descrição:** Retorna trasladações entre cemitérios diferentes.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.3.6 Obter Evidências

**Endpoint:** `GET /api/v1/transfers/{id}/evidences`

**Descrição:** Retorna evidências fotográficas da trasladação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_READ`, `EVIDENCES_READ`

**Rate Limiting:** 50 requests/minuto

#### 5.3.7 Upload de Evidências

**Endpoint:** `POST /api/v1/transfers/{id}/evidences`

**Descrição:** Upload de evidências fotográficas da trasladação.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TRANSFERS_UPDATE`, `EVIDENCES_CREATE`

**Rate Limiting:** 30 requests/minuto

### 5.4 Agendamento

#### 5.4.1 Verificar Disponibilidade

**Endpoint:** `GET /api/v1/schedules/availability`

**Descrição:** Verifica disponibilidade de horários, equipes e recursos para agendamento.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `SCHEDULES_READ`

**Rate Limiting:** 200 requests/minuto

**Parâmetros Query:**

* `cemeteryId` (UUID, obrigatório): Cemitério para verificação

* `operationType` (string, obrigatório): BURIAL, EXHUMATION, TRANSFER

* `date` (date, obrigatório): Data para verificação

* `duration` (int, opcional): Duração estimada em minutos

* `teamId` (UUID, opcional): Equipe específica

* `specialRequirements` (array, opcional): Requisitos especiais

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/schedules/availability?cemeteryId=cemetery-001&operationType=BURIAL&date=2024-01-25&duration=120" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "date": "2024-01-25",
  "cemeteryId": "cemetery-001",
  "operationType": "BURIAL",
  "availableSlots": [
    {
      "startTime": "08:00:00",
      "endTime": "10:00:00",
      "availableTeams": [
        {
          "id": "team-001",
          "name": "Equipe Alpha",
          "specializations": ["BURIAL", "RELIGIOUS_CEREMONY"],
          "supervisor": "Carlos Mendes"
        }
      ],
      "availableResources": [
        "EXCAVATOR",
        "SAFETY_EQUIPMENT",
        "CEREMONIAL_ITEMS"
      ]
    },
    {
      "startTime": "14:00:00",
      "endTime": "16:00:00",
      "availableTeams": [
        {
          "id": "team-002",
          "name": "Equipe Beta",
          "specializations": ["BURIAL", "TRANSFER"],
          "supervisor": "Ana Costa"
        }
      ],
      "availableResources": [
        "EXCAVATOR",
        "SAFETY_EQUIPMENT"
      ]
    }
  ],
  "unavailableSlots": [
    {
      "startTime": "10:00:00",
      "endTime": "12:00:00",
      "reason": "TEAM_UNAVAILABLE",
      "conflictingOperation": {
        "id": "burial-002",
        "type": "BURIAL",
        "teamId": "team-001"
      }
    }
  ],
  "operationalLimits": {
    "maxSimultaneousOperations": 3,
    "currentScheduled": 1,
    "remainingCapacity": 2
  }
}
```

#### 5.4.2 Criar Novo Agendamento

**Endpoint:** `POST /api/v1/schedules`

**Descrição:** Cria um novo agendamento após validação de disponibilidade.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `SCHEDULES_CREATE`

**Rate Limiting:** 50 requests/minuto

#### 5.4.3 Listar Agendamentos com Filtros

**Endpoint:** `GET /api/v1/schedules`

**Descrição:** Retorna lista paginada de agendamentos com filtros.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `SCHEDULES_READ`

**Rate Limiting:** 100 requests/minuto

#### 5.4.4 Atualizar Agendamento

**Endpoint:** `PUT /api/v1/schedules/{id}`

**Descrição:** Atualiza um agendamento existente com revalidação de disponibilidade.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `SCHEDULES_UPDATE`

**Rate Limiting:** 30 requests/minuto

#### 5.4.5 Cancelar Agendamento

**Endpoint:** `DELETE /api/v1/schedules/{id}`

**Descrição:** Cancela um agendamento e libera recursos alocados.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `SCHEDULES_DELETE`

**Rate Limiting:** 20 requests/minuto

#### 5.4.6 Verificar Conflitos de Agendamento

**Endpoint:** `GET /api/v1/schedules/conflicts`

**Descrição:** Identifica conflitos potenciais em agendamentos.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `SCHEDULES_READ`

**Rate Limiting:** 50 requests/minuto

### 5.5 Ordens de Serviço

#### 5.5.1 Listar Ordens Pendentes

**Endpoint:** `GET /api/v1/work-orders/pending`

**Descrição:** Retorna ordens de serviço pendentes de execução.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `WORK_ORDERS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `cemeteryId` (UUID, opcional): Filtrar por cemitério

* `teamId` (UUID, opcional): Filtrar por equipe

* `operationType` (string, opcional): BURIAL, EXHUMATION, TRANSFER

* `priority` (string, opcional): LOW, NORMAL, HIGH, URGENT

* `assignedOnly` (boolean, padrão: false): Apenas ordens atribuídas

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/work-orders/pending?cemeteryId=cemetery-001&operationType=BURIAL&priority=HIGH" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "wo-001",
      "orderNumber": "WO-2024-001",
      "operationType": "BURIAL",
      "operationId": "burial-001",
      "priority": "HIGH",
      "scheduledDateTime": "2024-01-25T10:00:00Z",
      "estimatedDuration": "2 horas",
      "cemetery": {
        "id": "cemetery-001",
        "name": "Cemitério Municipal da Praia"
      },
      "plotNumber": "A1-001",
      "assignedTeam": {
        "id": "team-001",
        "name": "Equipe Alpha",
        "supervisor": "Carlos Mendes"
      },
      "requiredResources": [
        "EXCAVATOR",
        "SAFETY_EQUIPMENT",
        "CEREMONIAL_ITEMS"
      ],
      "specialRequirements": [
        "RELIGIOUS_CEREMONY",
        "FAMILY_PRESENCE"
      ],
      "status": "PENDING",
      "createdDate": "2024-01-22T14:30:00Z"
    }
  ],
  "summary": {
    "totalPending": 12,
    "totalAssigned": 8,
    "totalUnassigned": 4,
    "urgentOrders": 2
  }
}
```

#### 5.5.2 Atribuir Ordem à Equipe

**Endpoint:** `POST /api/v1/work-orders/{id}/assign`

**Descrição:** Atribui uma ordem de serviço a uma equipe específica.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `WORK_ORDERS_ASSIGN`

**Rate Limiting:** 50 requests/minuto

#### 5.5.3 Iniciar Execução

**Endpoint:** `POST /api/v1/work-orders/{id}/start`

**Descrição:** Inicia a execução de uma ordem de serviço com validação de presença.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `WORK_ORDERS_EXECUTE`

**Rate Limiting:** 30 requests/minuto

#### 5.5.4 Concluir Ordem

**Endpoint:** `PUT /api/v1/work-orders/{id}/complete`

**Descrição:** Marca uma ordem de serviço como concluída após validações.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `WORK_ORDERS_COMPLETE`

**Rate Limiting:** 20 requests/minuto

#### 5.5.5 Upload de Evidências

**Endpoint:** `POST /api/v1/work-orders/{id}/evidences`

**Descrição:** Upload de evidências fotográficas da execução da ordem.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `WORK_ORDERS_UPDATE`, `EVIDENCES_CREATE`

**Rate Limiting:** 30 requests/minuto

#### 5.5.6 Ordens por Equipe

**Endpoint:** `GET /api/v1/work-orders/team/{teamId}`

**Descrição:** Retorna ordens de serviço atribuídas a uma equipe específica.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `WORK_ORDERS_READ`

**Rate Limiting:** 100 requests/minuto

### 5.6 Gestão de Equipes e Recursos

#### 5.6.1 Listar Equipes

**Endpoint:** `GET /api/v1/teams`

**Descrição:** Retorna lista de equipes operacionais com suas especializações.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TEAMS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `cemeteryId` (UUID, opcional): Filtrar por cemitério

* `specialization` (string, opcional): BURIAL, EXHUMATION, TRANSFER, MAINTENANCE

* `status` (string, opcional): ACTIVE, INACTIVE, ON\_LEAVE

* `availableOnly` (boolean, padrão: false): Apenas equipes disponíveis

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/teams?cemeteryId=cemetery-001&specialization=BURIAL&availableOnly=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "team-001",
      "name": "Equipe Alpha",
      "cemeteryId": "cemetery-001",
      "cemeteryName": "Cemitério Municipal da Praia",
      "supervisor": {
        "id": "user-001",
        "name": "Carlos Mendes",
        "phone": "+238 555-0789"
      },
      "members": [
        {
          "id": "user-002",
          "name": "João Santos",
          "role": "OPERATOR",
          "specializations": ["BURIAL", "SAFETY"]
        },
        {
          "id": "user-003",
          "name": "Maria Costa",
          "role": "OPERATOR",
          "specializations": ["BURIAL", "CEREMONIAL"]
        }
      ],
      "specializations": [
        "BURIAL",
        "RELIGIOUS_CEREMONY",
        "SAFETY_PROCEDURES"
      ],
      "capacity": {
        "maxSimultaneousOperations": 2,
        "currentAssigned": 1,
        "availableCapacity": 1
      },
      "equipment": [
        "EXCAVATOR_SMALL",
        "SAFETY_KIT",
        "CEREMONIAL_ITEMS"
      ],
      "status": "ACTIVE",
      "workingHours": {
        "start": "07:00:00",
        "end": "17:00:00",
        "workingDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT"]
      },
      "performance": {
        "averageOperationTime": "1.5 horas",
        "completionRate": 98.5,
        "qualityScore": 9.2
      }
    }
  ]
}
```

#### 5.6.2 Criar Nova Equipe

**Endpoint:** `POST /api/v1/teams`

**Descrição:** Cria uma nova equipe operacional.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TEAMS_CREATE`

**Rate Limiting:** 10 requests/minuto

#### 5.6.3 Atualizar Equipe

**Endpoint:** `PUT /api/v1/teams/{id}`

**Descrição:** Atualiza dados de uma equipe existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TEAMS_UPDATE`

**Rate Limiting:** 20 requests/minuto

#### 5.6.4 Verificar Disponibilidade da Equipe

**Endpoint:** `GET /api/v1/teams/{id}/availability`

**Descrição:** Verifica disponibilidade de uma equipe específica por período.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `TEAMS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `dateFrom` (date, obrigatório): Data inicial do período

* `dateTo` (date, obrigatório): Data final do período

* `operationType` (string, opcional): Tipo de operação específica

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/teams/team-001/availability?dateFrom=2024-01-25&dateTo=2024-01-31&operationType=BURIAL" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "teamId": "team-001",
  "teamName": "Equipe Alpha",
  "period": {
    "dateFrom": "2024-01-25",
    "dateTo": "2024-01-31"
  },
  "availability": [
    {
      "date": "2024-01-25",
      "availableSlots": [
        {
          "startTime": "08:00:00",
          "endTime": "10:00:00",
          "capacity": 1
        },
        {
          "startTime": "14:00:00",
          "endTime": "17:00:00",
          "capacity": 2
        }
      ],
      "scheduledOperations": [
        {
          "id": "burial-001",
          "type": "BURIAL",
          "startTime": "10:00:00",
          "endTime": "12:00:00"
        }
      ]
    }
  ],
  "summary": {
    "totalAvailableHours": 35,
    "totalScheduledHours": 12,
    "utilizationRate": 34.3
  }
}
```

## 6. Integrações

### 6.1 Integrações Internas (RabbitMQ)

* **BE-01-Cemiterio**: Validação de localização e disponibilidade de sepulturas

* **BE-02-Concessao**: Verificação de direitos e prazos de concessão

* **BE-04-Financeiro**: Validação de pagamentos de taxas operacionais

* **Notification Service**: Notificações para equipes e famílias

### 6.2 Integrações Externas

* **RabbitMQ**: Notificações para equipes móveis e coordenação

* **GPS/Geolocation Services**: Validação de localização durante operações

* **Autoridades Sanitárias**: Notificações obrigatórias de exumações

* **Funerárias**: Coordenação de agendamentos e logística

* **Document Storage**: Armazenamento de evidências e documentos

### 6.3 Aplicação Móvel (PWA)

* Sincronização offline de ordens de serviço

* Upload de evidências fotográficas com geolocalização

* Checklists digitais por tipo de operação

* Notificações push para equipes

* Validação de presença via GPS

## 7. Regras de Negócio

### 7.1 Validações de Agendamento

* Verificação de disponibilidade de horários e equipes

* Validação de capacidade operacional por período

* Controle de conflitos de recursos e equipamentos

* Respeito a restrições sanitárias e legais

* Validação de documentação obrigatória

### 7.2 Controle de Qualidade

* Checklists obrigatórios por tipo de operação

* Evidências fotográficas obrigatórias com geolocalização

* Validação de presença da equipe no local

* Aprovação de supervisor para operações críticas

* Auditoria completa de todas as etapas

### 7.3 Gestão de Recursos

* Alocação otimizada de equipes por especialização

* Controle de disponibilidade de equipamentos

* Gestão de materiais e insumos necessários

* Planejamento de manutenção preventiva

* Otimização de rotas e cronogramas

## 8. Workflow de Operações

### 8.1 Fluxo de Inumação

1. Solicitação de agendamento com dados do falecido
2. Validação de documentação e concessão
3. Alocação de sepultura e equipe especializada
4. Geração automática de ordem de serviço
5. Execução com coleta de evidências obrigatórias
6. Conclusão e atualização de todos os registros

### 8.2 Fluxo de Exumação

1. Identificação automática de vencimento ou solicitação manual
2. Notificação prévia aos interessados (família/titular)
3. Agendamento da operação com equipe especializada
4. Execução com supervisão e coleta de evidências
5. Destinação adequada dos restos mortais
6. Liberação da sepultura para nova concessão

### 8.3 Fluxo de Trasladação

1. Solicitação com documentação completa
2. Validação de autorizações e direitos
3. Coordenação entre cemitérios (se inter-cemiterial)
4. Agendamento coordenado da operação
5. Execução com acompanhamento e evidências
6. Atualização de registros em ambos os locais

## 8. Requisitos Não Funcionais

### 8.1 Performance

* Processamento de até 500 operações simultâneas

* Tempo de resposta < 3 segundos para agendamentos

* Sincronização offline-online em < 30 segundos

* Backup automático de evidências em tempo real

* Cache distribuído para otimização de consultas

### 8.2 Segurança

* Criptografia AES-256 de evidências fotográficas

* Auditoria completa com logs imutáveis

* Controle de acesso granular por tipo de operação

* Validação de geolocalização para autenticidade

* Proteção contra manipulação de evidências

### 8.3 Confiabilidade

* Redundância para dados críticos de operações

* Retry automático para falhas de sincronização

* Backup incremental contínuo de evidências

* Monitoramento de SLA de operações críticas

* Recuperação automática de falhas de sistema

## 9. Configurações e Monitoramento

### 9.1 Parâmetros Configuráveis

* Horários de funcionamento por cemitério

* Capacidade operacional por equipe

* Tipos de equipamentos por operação

* Templates de checklists por tipo

* Regras de priorização de agendamentos

### 9.2 Configurações de Qualidade

* Tipos de evidências obrigatórias

* Critérios de validação de geolocalização

* Níveis de supervisão necessários

* Padrões de documentação

* Métricas de qualidade por operação

### 9.3 Métricas de Monitoramento

* Tempo médio de execução por tipo de operação

* Taxa de conclusão no prazo agendado

* Número de operações por equipe/período

* Qualidade das evidências coletadas

* Taxa de retrabalho por equipe

* SLA de resposta a emergências

