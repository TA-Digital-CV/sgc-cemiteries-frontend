# BE-01-Cemiterio - Módulo Backend de Gestão de Cemitério

## Índice de Navegação

1. [Visão Geral](#1-visão-geral-do-módulo)
2. [Funcionalidades Principais](#2-funcionalidades-principais)
3. [Modelo de Dados](#3-modelo-de-dados)
4. [Estrutura de Dados (DDL)](#4-estrutura-de-dados-ddl)
5. [APIs e Endpoints](#5-apis-e-endpoints)
6. [Integrações](#6-integrações)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Requisitos Não Funcionais](#8-requisitos-não-funcionais)
9. [Configurações e Monitoramento](#9-configurações-e-monitoramento)

## 1. Visão Geral do Módulo

O módulo BE-01-Cemiterio é responsável pela gestão da estrutura física e hierárquica dos cemitérios, incluindo cadastro, mapeamento e georreferenciamento de todas as estruturas cemiteriais.

**Tecnologia Base:** IGRP 3.0 Spring Backend\
**Base de Dados:** PostgreSQL 16 com extensão PostGIS\
**Arquitetura:** Microserviço independente (Cemetery Layout Service)

## 2. Funcionalidades Principais

### 2.1 Gestão Hierárquica

* Cadastro de cemitérios, blocos, setores e sepulturas

* Estrutura hierárquica flexível adaptável a diferentes organizações físicas

* Validação de integridade referencial entre níveis hierárquicos

* Suporte a múltiplos cemitérios por município

### 2.2 Georreferenciamento e Mapeamento

* Integração com PostGIS para armazenamento de coordenadas geográficas

* Geração automática de QR Codes únicos para identificação de sepulturas

* Cálculo de distâncias e rotas otimizadas

* Suporte a diferentes sistemas de coordenadas (EPSG)

### 2.3 Análise de Capacidade

* Cálculo em tempo real da taxa de ocupação

* Projeções de capacidade baseadas em dados históricos

* Geração de mapas de calor para visualização de ocupação

* Alertas automáticos de capacidade crítica

## 3. Modelo de Dados

### 3.1 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    t_cemeteries ||--o{ t_cemetery_blocks : contains
    t_cemetery_blocks ||--o{ t_cemetery_sections : contains
    t_cemetery_sections ||--o{ t_plots : contains
    t_cemeteries ||--o{ t_plots : belongs_to
    t_municipalities ||--o{ t_cemeteries : manages

    t_municipalities {
        uuid id PK "Identificador único do município"
        varchar name "Nome do município"
        varchar code "Código oficial do município"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_cemeteries {
        uuid id PK "Identificador único do cemitério"
        uuid municipality_id FK "Referência ao município"
        varchar name "Nome do cemitério"
        text address "Endereço completo"
        geometry geo_point "Coordenadas geográficas (PostGIS)"
        decimal total_area "Área total em metros quadrados"
        integer max_capacity "Capacidade máxima de sepulturas"
        varchar status "Status: ACTIVE, INACTIVE, MAINTENANCE"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
        uuid last_modified_by "Usuário que atualizou"
    }

    t_cemetery_blocks {
        uuid id PK "Identificador único do bloco"
        uuid cemetery_id FK "Referência ao cemitério"
        varchar name "Nome/código do bloco"
        varchar description "Descrição do bloco"
        geometry geo_polygon "Área geográfica do bloco (PostGIS)"
        integer max_capacity "Capacidade máxima do bloco"
        varchar status "Status: ACTIVE, INACTIVE"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_cemetery_sections {
        uuid id PK "Identificador único do setor"
        uuid cemetery_id FK "Referência ao cemitério"
        uuid block_id FK "Referência ao bloco"
        varchar name "Nome/código do setor"
        varchar description "Descrição do setor"
        geometry geo_polygon "Área geográfica do setor (PostGIS)"
        integer max_capacity "Capacidade máxima do setor"
        varchar status "Status: ACTIVE, INACTIVE"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
    }

    t_plots {
        uuid id PK "Identificador único da sepultura"
        uuid cemetery_id FK "Referência ao cemitério"
        uuid block_id FK "Referência ao bloco"
        uuid section_id FK "Referência ao setor"
        varchar plot_number "Número da sepultura"
        varchar plot_type "Tipo: GROUND, MAUSOLEUM, NICHE, OSSUARY"
        geometry geo_point "Coordenadas exatas (PostGIS)"
        varchar qr_code "Código QR único"
        varchar occupation_status "Status: AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE"
        json dimensions "Dimensões da sepultura (JSON)"
        text notes "Observações adicionais"
        timestamp created_date "Data de criação"
        timestamp last_modified_date "Data de atualização"
        uuid created_by "Usuário que criou"
        uuid last_modified_by "Usuário que atualizou"
    }
```

### 3.2 Legendas do Diagrama

* **PK**: Chave Primária (Primary Key)

* **FK**: Chave Estrangeira (Foreign Key)

* **geometry**: Tipo de dados espacial do PostGIS

* **json**: Tipo de dados JSON para estruturas flexíveis

* **uuid**: Identificador único universal

* **varchar**: Texto de tamanho variável

* **timestamp**: Data e hora com fuso horário

## 4. Estrutura de Dados (DDL)

### 4.1 Tabela de Cemitérios

```sql
-- Criação da tabela principal de cemitérios
CREATE TABLE t_cemeteries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    geo_point GEOMETRY(POINT, 4326),
    total_area DECIMAL(12,2),
    max_capacity INTEGER,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    last_modified_by UUID,
    CONSTRAINT fk_cemetery_municipality FOREIGN KEY (municipality_id) REFERENCES t_municipalities(id)
);

-- Índices para otimização
CREATE INDEX idx_cemeteries_municipality ON t_cemeteries(municipality_id);
CREATE INDEX idx_cemeteries_status ON t_cemeteries(status);
CREATE INDEX idx_cemeteries_geo ON t_cemeteries USING GIST(geo_point);
```

### 4.2 Tabela de Blocos

```sql
-- Criação da tabela de blocos cemiteriais
CREATE TABLE t_cemetery_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cemetery_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    geo_polygon GEOMETRY(POLYGON, 4326),
    max_capacity INTEGER,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_block_cemetery FOREIGN KEY (cemetery_id) REFERENCES t_cemeteries(id) ON DELETE CASCADE,
    CONSTRAINT uk_block_name_cemetery UNIQUE (cemetery_id, name)
);

-- Índices
CREATE INDEX idx_blocks_cemetery ON t_cemetery_blocks(cemetery_id);
CREATE INDEX idx_blocks_geo ON t_cemetery_blocks USING GIST(geo_polygon);
```

### 4.3 Tabela de Setores

```sql
-- Criação da tabela de setores
CREATE TABLE t_cemetery_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cemetery_id UUID NOT NULL,
    block_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    geo_polygon GEOMETRY(POLYGON, 4326),
    max_capacity INTEGER,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_section_cemetery FOREIGN KEY (cemetery_id) REFERENCES t_cemeteries(id) ON DELETE CASCADE,
    CONSTRAINT fk_section_block FOREIGN KEY (block_id) REFERENCES t_cemetery_blocks(id) ON DELETE CASCADE,
    CONSTRAINT uk_section_name_block UNIQUE (block_id, name)
);

-- Índices
CREATE INDEX idx_sections_cemetery ON t_cemetery_sections(cemetery_id);
CREATE INDEX idx_sections_block ON t_cemetery_sections(block_id);
CREATE INDEX idx_sections_geo ON t_cemetery_sections USING GIST(geo_polygon);
```

### 4.4 Tabela de Sepulturas

```sql
-- Criação da tabela de sepulturas
CREATE TABLE t_plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cemetery_id UUID NOT NULL,
    block_id UUID,
    section_id UUID,
    plot_number VARCHAR(50) NOT NULL,
    plot_type VARCHAR(20) NOT NULL CHECK (plot_type IN ('GROUND', 'MAUSOLEUM', 'NICHE', 'OSSUARY')),
    geo_point GEOMETRY(POINT, 4326),
    qr_code VARCHAR(255) UNIQUE,
    occupation_status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (occupation_status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE')),
    dimensions JSONB,
    notes TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    last_modified_by UUID,
    CONSTRAINT fk_plot_cemetery FOREIGN KEY (cemetery_id) REFERENCES t_cemeteries(id) ON DELETE CASCADE,
    CONSTRAINT fk_plot_block FOREIGN KEY (block_id) REFERENCES t_cemetery_blocks(id),
    CONSTRAINT fk_plot_section FOREIGN KEY (section_id) REFERENCES t_cemetery_sections(id),
    CONSTRAINT uk_plot_number_section UNIQUE (section_id, plot_number)
);

-- Índices
CREATE INDEX idx_plots_cemetery ON t_plots(cemetery_id);
CREATE INDEX idx_plots_block ON t_plots(block_id);
CREATE INDEX idx_plots_section ON t_plots(section_id);
CREATE INDEX idx_plots_status ON t_plots(occupation_status);
CREATE INDEX idx_plots_type ON t_plots(plot_type);
CREATE INDEX idx_plots_qr ON t_plots(qr_code);
CREATE INDEX idx_plots_geo ON t_plots USING GIST(geo_point);
CREATE INDEX idx_plots_dimensions ON t_plots USING GIN(dimensions);
```

## 5. APIs e Endpoints

### 5.1 Gestão de Cemitérios

#### 5.1.1 Listar Cemitérios

**Endpoint:** `GET /api/v1/cemeteries`

**Descrição:** Retorna lista paginada de cemitérios com filtros opcionais.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `municipalityId` (UUID, opcional): Filtrar por município

* `status` (string, opcional): ACTIVE, INACTIVE, MAINTENANCE

* `name` (string, opcional): Filtro por nome (contains)

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 10, máx: 100): Itens por página

* `sort` (string, opcional): Campo e direção de ordenação

**Códigos de Status:**

* 200: Sucesso

* 400: Parâmetros inválidos

* 401: Não autenticado

* 403: Sem permissão

* 500: Erro interno

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries?municipalityId=123e4567-e89b-12d3-a456-426614174000&status=ACTIVE&page=0&size=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Exemplo de Response (200):**

```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "municipalityId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Cemitério Municipal da Praia",
      "address": "Rua Principal, Praia, Santiago",
      "geoPoint": {
        "latitude": 14.9177,
        "longitude": -23.5092
      },
      "totalArea": 15000.50,
      "maxCapacity": 2500,
      "currentOccupancy": 1847,
      "occupancyRate": 73.88,
      "status": "ACTIVE",
      "createdDate": "2024-01-15T10:30:00Z",
      "lastModifiedDate": "2024-01-20T14:45:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

**Exemplo de Response (400):**

```json
{
  "error": "INVALID_PARAMETERS",
  "message": "Status deve ser um dos valores: ACTIVE, INACTIVE, MAINTENANCE",
  "timestamp": "2024-01-20T15:30:00Z",
  "path": "/api/v1/cemeteries"
}
```

#### 5.1.2 Criar Novo Cemitério

**Endpoint:** `POST /api/v1/cemeteries`

**Descrição:** Cria um novo cemitério no sistema.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_CREATE`

**Rate Limiting:** 10 requests/minuto

**Validações:**

* Nome obrigatório (3-255 caracteres)

* Município deve existir

* Coordenadas válidas (latitude: -90 a 90, longitude: -180 a 180)

* Área total > 0

* Capacidade máxima > 0

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/cemeteries" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "municipalityId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cemitério São Vicente",
    "address": "Avenida Marginal, Mindelo, São Vicente",
    "geoPoint": {
      "latitude": 16.8875,
      "longitude": -24.9956
    },
    "totalArea": 12000.00,
    "maxCapacity": 2000
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "municipalityId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Cemitério São Vicente",
  "address": "Avenida Marginal, Mindelo, São Vicente",
  "geoPoint": {
    "latitude": 16.8875,
    "longitude": -24.9956
  },
  "totalArea": 12000.00,
  "maxCapacity": 2000,
  "currentOccupancy": 0,
  "occupancyRate": 0.0,
  "status": "ACTIVE",
  "createdDate": "2024-01-20T15:30:00Z",
  "lastModifiedDate": "2024-01-20T15:30:00Z",
  "createdBy": "user123",
  "lastModifiedBy": "user123"
}
```

#### 5.1.3 Obter Cemitério Específico

**Endpoint:** `GET /api/v1/cemeteries/{id}`

**Descrição:** Retorna detalhes completos de um cemitério específico.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`

**Rate Limiting:** 200 requests/minuto

**Parâmetros Path:**

* `id` (UUID, obrigatório): Identificador do cemitério

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Exemplo de Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "municipalityId": "123e4567-e89b-12d3-a456-426614174000",
  "municipalityName": "Praia",
  "name": "Cemitério Municipal da Praia",
  "address": "Rua Principal, Praia, Santiago",
  "geoPoint": {
    "latitude": 14.9177,
    "longitude": -23.5092
  },
  "totalArea": 15000.50,
  "maxCapacity": 2500,
  "currentOccupancy": 1847,
  "occupancyRate": 73.88,
  "availablePlots": 653,
  "status": "ACTIVE",
  "blocksCount": 8,
  "sectionsCount": 24,
  "plotsCount": 2500,
  "createdDate": "2024-01-15T10:30:00Z",
  "lastModifiedDate": "2024-01-20T14:45:00Z",
  "createdBy": "admin",
  "lastModifiedBy": "user456"
}
```

#### 5.1.4 Atualizar Cemitério

**Endpoint:** `PUT /api/v1/cemeteries/{id}`

**Descrição:** Atualiza dados de um cemitério existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_UPDATE`

**Rate Limiting:** 20 requests/minuto

**Regras de Negócio:**

* Não é possível reduzir capacidade máxima abaixo da ocupação atual

* Alteração de coordenadas requer validação de integridade com sepulturas existentes

* Status INACTIVE impede criação de novas sepulturas

**Exemplo de Request:**

```bash
curl -X PUT "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cemitério Municipal da Praia - Ampliado",
    "address": "Rua Principal, 123, Praia, Santiago",
    "totalArea": 18000.00,
    "maxCapacity": 3000,
    "status": "ACTIVE"
  }'
```

#### 5.1.5 Remover Cemitério

**Endpoint:** `DELETE /api/v1/cemeteries/{id}`

**Descrição:** Remove um cemitério do sistema (soft delete).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_DELETE`

**Rate Limiting:** 5 requests/minuto

**Regras de Negócio:**

* Apenas cemitérios sem sepulturas ocupadas podem ser removidos

* Operação realiza soft delete (marca como INACTIVE)

* Requer confirmação adicional via parâmetro

**Parâmetros Query:**

* `confirm` (boolean, obrigatório): Confirmação da operação

**Exemplo de Request:**

```bash
curl -X DELETE "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000?confirm=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 5.1.6 Estatísticas do Cemitério

**Endpoint:** `GET /api/v1/cemeteries/{id}/statistics`

**Descrição:** Retorna estatísticas detalhadas de ocupação e utilização do cemitério.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `STATISTICS_READ`

**Rate Limiting:** 50 requests/minuto

**Parâmetros Query:**

* `period` (string, opcional): DAILY, WEEKLY, MONTHLY, YEARLY

* `startDate` (date, opcional): Data inicial para análise

* `endDate` (date, opcional): Data final para análise

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/statistics?period=MONTHLY" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
  "period": "MONTHLY",
  "occupancyStats": {
    "totalPlots": 2500,
    "occupiedPlots": 1847,
    "availablePlots": 653,
    "occupancyRate": 73.88,
    "reservedPlots": 45
  },
  "plotTypeDistribution": {
    "GROUND": 2100,
    "MAUSOLEUM": 200,
    "NICHE": 150,
    "OSSUARY": 50
  },
  "monthlyTrends": [
    {
      "month": "2024-01",
      "newOccupations": 12,
      "liberations": 3,
      "netChange": 9
    }
  ],
  "capacityProjection": {
    "estimatedFullCapacityDate": "2027-08-15",
    "monthsRemaining": 43,
    "averageMonthlyOccupation": 8.5
  }
}
```

### 5.2 Gestão de Estrutura Hierárquica

#### 5.2.1 Obter Estrutura Completa

**Endpoint:** `GET /api/v1/cemeteries/{id}/structure`

**Descrição:** Retorna a estrutura hierárquica completa do cemitério (blocos, setores e sepulturas).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `STRUCTURE_READ`

**Rate Limiting:** 30 requests/minuto

**Parâmetros Query:**

* `includeInactive` (boolean, padrão: false): Incluir elementos inativos

* `level` (string, opcional): BLOCKS, SECTIONS, PLOTS - nível de detalhamento

* `plotStatus` (string, opcional): Filtrar sepulturas por status

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/structure?level=SECTIONS&includeInactive=false" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
  "cemeteryName": "Cemitério Municipal da Praia",
  "structure": {
    "blocks": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "name": "Bloco A",
        "description": "Bloco principal - entrada norte",
        "maxCapacity": 500,
        "currentOccupancy": 387,
        "occupancyRate": 77.4,
        "status": "ACTIVE",
        "geoPolygon": {
          "type": "Polygon",
          "coordinates": [[[-23.5092, 14.9177], [-23.5090, 14.9177], [-23.5090, 14.9175], [-23.5092, 14.9175], [-23.5092, 14.9177]]]
        },
        "sections": [
          {
            "id": "880e8400-e29b-41d4-a716-446655440002",
            "name": "Secção A1",
            "description": "Sepulturas tradicionais",
            "maxCapacity": 100,
            "currentOccupancy": 78,
            "occupancyRate": 78.0,
            "status": "ACTIVE"
          }
        ]
      }
    ]
  },
  "summary": {
    "totalBlocks": 8,
    "activeBlocks": 8,
    "totalSections": 24,
    "activeSections": 24,
    "totalPlots": 2500,
    "occupiedPlots": 1847
  }
}
```

#### 5.2.2 Criar Novo Bloco

**Endpoint:** `POST /api/v1/cemetery-blocks`

**Descrição:** Cria um novo bloco dentro de um cemitério.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `STRUCTURE_CREATE`

**Rate Limiting:** 20 requests/minuto

**Validações:**

* Nome único dentro do cemitério

* Polígono geográfico válido e dentro dos limites do cemitério

* Capacidade máxima > 0

* Cemitério deve estar ativo

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/cemetery-blocks" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Bloco I",
    "description": "Novo bloco - expansão sul",
    "maxCapacity": 300,
    "geoPolygon": {
      "type": "Polygon",
      "coordinates": [[[-23.5095, 14.9170], [-23.5093, 14.9170], [-23.5093, 14.9168], [-23.5095, 14.9168], [-23.5095, 14.9170]]]
    }
  }'
```

**Exemplo de Response (201):**

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440003",
  "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Bloco I",
  "description": "Novo bloco - expansão sul",
  "maxCapacity": 300,
  "currentOccupancy": 0,
  "occupancyRate": 0.0,
  "status": "ACTIVE",
  "geoPolygon": {
    "type": "Polygon",
    "coordinates": [[[-23.5095, 14.9170], [-23.5093, 14.9170], [-23.5093, 14.9168], [-23.5095, 14.9168], [-23.5095, 14.9170]]]
  },
  "createdDate": "2024-01-20T16:00:00Z",
  "lastModifiedDate": "2024-01-20T16:00:00Z"
}
```

#### 5.2.3 Atualizar Bloco

**Endpoint:** `PUT /api/v1/cemetery-blocks/{id}`

**Descrição:** Atualiza dados de um bloco existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `STRUCTURE_UPDATE`

**Rate Limiting:** 30 requests/minuto

**Regras de Negócio:**

* Não é possível reduzir capacidade abaixo da ocupação atual

* Alteração de polígono requer validação com sepulturas existentes

* Status INACTIVE impede criação de novos setores

#### 5.2.4 Criar Novo Secção

**Endpoint:** `POST /api/v1/cemetery-sections`

**Descrição:** Cria um novo setor dentro de um bloco.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `STRUCTURE_CREATE`

**Rate Limiting:** 30 requests/minuto

**Validações:**

* Nome único dentro do bloco

* Polígono deve estar contido no polígono do bloco

* Capacidade não pode exceder capacidade disponível do bloco

* Bloco deve estar ativo

#### 5.2.5 Atualizar Secção

**Endpoint:** `PUT /api/v1/cemetery-sections/{id}`

**Descrição:** Atualiza dados de um setor existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `STRUCTURE_UPDATE`

**Rate Limiting:** 30 requests/minuto

### 5.3 Gestão de Sepulturas

#### 5.3.1 Listar Sepulturas com Filtros

**Endpoint:** `GET /api/v1/plots`

**Descrição:** Retorna lista paginada de sepulturas com filtros avançados.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `page` (int, padrão: 0): Número da página

* `size` (int, padrão: 10, máx: 100): Itens por página

Observação: no modo mock, filtros avançados são limitados; usar o endpoint `/plots/search` para critérios específicos.

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/plots?cemeteryId=550e8400-e29b-41d4-a716-446655440000&occupationStatus=AVAILABLE&plotType=GROUND&page=0&size=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "data": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440004",
      "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
      "cemeteryName": "Cemitério Municipal da Praia",
      "blockId": "770e8400-e29b-41d4-a716-446655440001",
      "blockName": "Bloco A",
      "sectionId": "880e8400-e29b-41d4-a716-446655440002",
      "sectionName": "Secção A1",
      "plotNumber": "A1-001",
      "plotType": "GROUND",
      "occupationStatus": "AVAILABLE",
      "geoPoint": {
        "latitude": 14.9176,
        "longitude": -23.5091
      },
      "qrCode": "QR_A1_001_2024",
      "dimensions": {
        "length": 2.5,
        "width": 1.2,
        "depth": 1.8,
        "unit": "meters"
      },
      "notes": null,
      "createdDate": "2024-01-15T11:00:00Z",
      "lastModifiedDate": "2024-01-15T11:00:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 10,
    "totalElements": 653,
    "totalPages": 66
  }
}
```

#### 5.3.2 Cadastrar Nova Sepultura

**Endpoint:** `POST /api/v1/plots`

**Descrição:** Cadastra uma nova sepultura no sistema.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_CREATE`

**Rate Limiting:** 50 requests/minuto

**Validações:**

* Número único dentro do setor

* Coordenadas dentro dos limites do setor/bloco

* Tipo de sepultura válido

* Dimensões obrigatórias para tipo GROUND

* Secção deve estar ativo

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/plots" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
    "blockId": "770e8400-e29b-41d4-a716-446655440001",
    "sectionId": "880e8400-e29b-41d4-a716-446655440002",
    "plotNumber": "A1-150",
    "plotType": "GROUND",
    "geoPoint": {
      "latitude": 14.9175,
      "longitude": -23.5090
    },
    "dimensions": {
      "length": 2.5,
      "width": 1.2,
      "depth": 1.8,
      "unit": "meters"
    },
    "notes": "Sepultura padrão - solo argiloso"
  }'
```

#### 5.3.3 Obter Sepultura Específica

**Endpoint:** `GET /api/v1/plots/{id}`

**Descrição:** Retorna detalhes completos de uma sepultura específica.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_READ`

**Rate Limiting:** 200 requests/minuto

#### 5.3.4 Atualizar Dados da Sepultura

**Endpoint:** `PUT /api/v1/plots/{id}`

**Descrição:** Atualiza dados de uma sepultura existente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_UPDATE`

**Rate Limiting:** 50 requests/minuto

**Regras de Negócio:**

* Sepulturas ocupadas não podem ter coordenadas alteradas

* Alteração de tipo requer validação de compatibilidade

* Status MAINTENANCE impede alterações de ocupação

#### 5.3.5 Remover Sepultura

**Endpoint:** `DELETE /api/v1/plots/{id}`

**Descrição:** Remove uma sepultura do sistema (apenas se disponível).

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_DELETE`

**Rate Limiting:** 10 requests/minuto

**Regras de Negócio:**

* Apenas sepulturas com status AVAILABLE podem ser removidas

* Operação é irreversível

* Requer confirmação adicional

#### 5.3.6 Buscar Sepulturas por Critérios

**Endpoint:** `GET /api/v1/plots/search`

**Descrição:** Busca avançada de sepulturas com múltiplos critérios.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_READ`

**Rate Limiting:** 50 requests/minuto

**Parâmetros Query (mock):**

* `cemeteryId` (UUID, opcional)

* `plotNumber` (string, opcional)

* `plotType` (string, opcional)

* `status` (string, opcional)

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/plots/search?q=A1&nearPoint=14.9176,-23.5091&radius=50&availableOnly=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5.4 Georreferenciamento e QR Codes

#### 5.4.1 Definir Coordenadas

**Endpoint:** `POST /api/v1/plots/{id}/geolocation`

**Descrição:** Define ou atualiza as coordenadas geográficas de uma sepultura.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_UPDATE`, `GEOLOCATION_MANAGE`

**Rate Limiting:** 100 requests/minuto

**Validações:**

* Coordenadas válidas (latitude: -90 a 90, longitude: -180 a 180)

* Ponto deve estar dentro dos limites do setor

* Precisão mínima de 6 casas decimais

* Validação de sobreposição com outras sepulturas (raio mínimo 1m)

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/plots/aa0e8400-e29b-41d4-a716-446655440004/geolocation" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 14.917634,
    "longitude": -23.509123,
    "accuracy": 1.5,
    "source": "GPS_SURVEY",
    "notes": "Coordenadas coletadas com GPS diferencial"
  }'
```

**Exemplo de Response (200):**

```json
{
  "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
  "geoPoint": {
    "latitude": 14.917634,
    "longitude": -23.509123
  },
  "accuracy": 1.5,
  "source": "GPS_SURVEY",
  "validationResults": {
    "withinSectionBounds": true,
    "minimumDistanceToNearest": 2.3,
    "nearestPlotId": "bb0e8400-e29b-41d4-a716-446655440005"
  },
  "updatedDate": "2024-01-20T16:30:00Z"
}
```

#### 5.4.2 Gerar/Obter QR Code

**Endpoint:** `GET /api/v1/plots/{id}/qr-code`

**Descrição:** Gera ou retorna o QR Code existente para uma sepultura.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_READ`, `QR_CODE_GENERATE`

**Rate Limiting:** 200 requests/minuto

**Parâmetros Query:**

* `format` (string, padrão: PNG): PNG, SVG, PDF

* `size` (int, padrão: 200): Tamanho em pixels (100-1000)

* `regenerate` (boolean, padrão: false): Forçar regeneração

* `includeMetadata` (boolean, padrão: true): Incluir dados da sepultura

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/plots/aa0e8400-e29b-41d4-a716-446655440004/qr-code?format=SVG&size=300&includeMetadata=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200):**

```json
{
  "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
  "qrCode": "QR_A1_001_2024",
  "qrData": {
    "plotId": "aa0e8400-e29b-41d4-a716-446655440004",
    "plotNumber": "A1-001",
    "cemeteryName": "Cemitério Municipal da Praia",
    "location": "Bloco A - Secção A1",
    "coordinates": "14.917634,-23.509123",
    "verificationUrl": "https://sgc.gov.cv/verify/aa0e8400-e29b-41d4-a716-446655440004"
  },
  "imageData": {
    "format": "SVG",
    "size": 300,
    "base64": "PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCI+Li4uPC9zdmc+",
    "downloadUrl": "https://api.sgc.gov.cv/api/v1/plots/aa0e8400-e29b-41d4-a716-446655440004/qr-code/download?token=temp_token_123"
  },
  "generatedDate": "2024-01-20T16:45:00Z",
  "expiresAt": "2024-01-20T17:45:00Z"
}
```

#### 5.4.3 Gerar QR Codes em Lote

**Endpoint:** `POST /api/v1/plots/bulk-qr-generation`

**Descrição:** Gera QR Codes para múltiplas sepulturas simultaneamente.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `PLOTS_READ`, `QR_CODE_GENERATE`, `BULK_OPERATIONS`

**Rate Limiting:** 5 requests/minuto

**Validações:**

* Máximo 100 sepulturas por requisição

* Todas as sepulturas devem existir

* Usuário deve ter permissão para todas as sepulturas

**Exemplo de Request:**

```bash
curl -X POST "https://api.sgc.gov.cv/api/v1/plots/bulk-qr-generation" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "plotIds": [
      "aa0e8400-e29b-41d4-a716-446655440004",
      "bb0e8400-e29b-41d4-a716-446655440005",
      "cc0e8400-e29b-41d4-a716-446655440006"
    ],
    "format": "PNG",
    "size": 200,
    "includeMetadata": true,
    "generateZip": true
  }'
```

**Exemplo de Response (200 - mock):**

```json
{
  "data": [
    { "id": "aa0e8400-e29b-41d4-a716-446655440004", "qrCode": "QR_aa0e8400-e29b-41d4-a716-446655440004_1700000000000" }
  ]
}
```

#### 5.4.4 Obter Dados para Mapeamento

**Endpoint:** `GET /api/v1/cemeteries/{id}/map-data`

**Descrição:** Retorna dados geoespaciais otimizados para renderização de mapas.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `MAPPING_DATA`

**Rate Limiting:** 20 requests/minuto

**Parâmetros Query (mock):**

* `level` (string, padrão: BLOCKS): BLOCKS

* `format` (string, padrão: GEOJSON): GEOJSON, WKT, KML

* `includeOccupied` (boolean, padrão: true): Incluir sepulturas ocupadas

* `simplify` (boolean, padrão: false): Simplificar geometrias para performance

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/map-data?level=BLOCKS&format=GEOJSON" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200 - mock):**

```json
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "EPSG:4326"
    }
  },
  "features": [
    {
      "type": "Feature",
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "properties": {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "name": "Bloco A",
        "type": "BLOCK",
        "maxCapacity": 500,
        "currentOccupancy": 387,
        "occupancyRate": 77.4,
        "status": "ACTIVE"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-23.5092, 14.9177], [-23.5090, 14.9177], [-23.5090, 14.9175], [-23.5092, 14.9175], [-23.5092, 14.9177]]]
      }
    }
  ],
  "metadata": {
    "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
    "level": "BLOCKS",
    "totalFeatures": 8,
    "bounds": {
      "minLat": 14.9170,
      "maxLat": 14.9180,
      "minLng": -23.5095,
      "maxLng": -23.5085
    },
    "generatedAt": "2024-01-20T17:00:00Z"
  }
}
```

### 5.5 Análise de Capacidade

#### 5.5.1 Taxa de Ocupação Atual

**Endpoint:** `GET /api/v1/cemeteries/{id}/occupancy`

**Descrição:** Retorna dados detalhados sobre a ocupação atual do cemitério.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `ANALYTICS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `breakdown` (string, opcional): BLOCKS, SECTIONS - nível de detalhamento

* `plotTypes` (array, opcional): Filtrar por tipos de sepultura

* `includeReserved` (boolean, padrão: true): Incluir sepulturas reservadas

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/occupancy?breakdown=BLOCKS&includeReserved=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200 - mock):**

```json
{
  "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
  "cemeteryName": "Cemitério Municipal da Praia",
  "overall": {
    "totalPlots": 2500,
    "occupiedPlots": 1847,
    "reservedPlots": 45,
    "availablePlots": 608,
    "maintenancePlots": 0,
    "occupancyRate": 73.88,
    "utilizationRate": 75.68
  },
  "byPlotType": {
    "GROUND": {
      "total": 2100,
      "occupied": 1580,
      "reserved": 35,
      "available": 485,
      "occupancyRate": 75.24
    },
    "MAUSOLEUM": {
      "total": 200,
      "occupied": 145,
      "reserved": 8,
      "available": 47,
      "occupancyRate": 72.5
    },
    "NICHE": {
      "total": 150,
      "occupied": 98,
      "reserved": 2,
      "available": 50,
      "occupancyRate": 65.33
    },
    "OSSUARY": {
      "total": 50,
      "occupied": 24,
      "reserved": 0,
      "available": 26,
      "occupancyRate": 48.0
    }
  },
  "byBlocks": [
    {
      "blockId": "770e8400-e29b-41d4-a716-446655440001",
      "blockName": "Bloco A",
      "totalPlots": 500,
      "occupiedPlots": 387,
      "reservedPlots": 8,
      "availablePlots": 105,
      "occupancyRate": 77.4,
      "status": "HIGH_OCCUPANCY"
    }
  ],
  "alerts": [
    {
      "type": "HIGH_OCCUPANCY",
      "level": "WARNING",
      "message": "Bloco A atingiu 77% de ocupação",
      "threshold": 75.0,
      "currentValue": 77.4
    }
  ],
  "lastUpdated": "2024-01-20T17:15:00Z"
}
```

#### 5.5.2 Projeção de Capacidade

**Endpoint:** `GET /api/v1/cemeteries/{id}/capacity-projection`

**Descrição:** Calcula projeções de capacidade baseadas em dados históricos.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `ANALYTICS_READ`, `PROJECTIONS_READ`

**Rate Limiting:** 30 requests/minuto

**Parâmetros Query:**

* `projectionPeriod` (int, padrão: 60): Meses para projeção

* `historicalPeriod` (int, padrão: 24): Meses de histórico para análise

* `includeSeasonality` (boolean, padrão: true): Considerar sazonalidade

* `confidenceLevel` (float, padrão: 0.95): Nível de confiança (0.8-0.99)

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/capacity-projection?projectionPeriod=36&includeSeasonality=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200 - mock):**

```json
{
  "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
  "projectionParameters": {
    "projectionPeriod": 36,
    "historicalPeriod": 24,
    "confidenceLevel": 0.95,
    "includeSeasonality": true
  },
  "currentStatus": {
    "totalCapacity": 2500,
    "currentOccupancy": 1847,
    "availableCapacity": 653,
    "occupancyRate": 73.88
  },
  "historicalTrends": {
    "averageMonthlyOccupations": 8.5,
    "seasonalityFactor": 1.15,
    "trendDirection": "INCREASING",
    "growthRate": 0.025
  },
  "projections": {
    "estimatedFullCapacityDate": "2027-08-15",
    "monthsToFullCapacity": 43,
    "confidenceInterval": {
      "lower": "2027-06-01",
      "upper": "2027-11-30"
    }
  },
  "monthlyProjections": [
    {
      "month": "2024-02",
      "projectedOccupancy": 1856,
      "projectedAvailable": 644,
      "occupancyRate": 74.24,
      "confidenceInterval": {
        "lower": 1851,
        "upper": 1861
      }
    }
  ],
  "recommendations": [
    {
      "type": "CAPACITY_PLANNING",
      "priority": "MEDIUM",
      "message": "Considerar expansão ou novo cemitério em 3-4 anos",
      "suggestedAction": "PLAN_EXPANSION"
    },
    {
      "type": "MONITORING",
      "priority": "LOW",
      "message": "Monitorar tendência de crescimento trimestralmente",
      "suggestedAction": "INCREASE_MONITORING"
    }
  ],
  "generatedAt": "2024-01-20T17:30:00Z"
}
```

#### 5.5.3 Dados para Mapa de Calor

**Endpoint:** `GET /api/v1/cemeteries/{id}/heatmap-data`

**Descrição:** Retorna dados de densidade de ocupação para visualização em mapa de calor.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `ANALYTICS_READ`, `HEATMAP_DATA`

**Rate Limiting:** 20 requests/minuto

**Parâmetros Query:**

* `gridSize` (int, padrão: 50): Tamanho da grade em metros

* `metric` (string, padrão: OCCUPANCY): OCCUPANCY, DENSITY, AGE

* `timeframe` (string, opcional): Período para análise temporal

* `normalize` (boolean, padrão: true): Normalizar valores 0-1

**Exemplo de Request (mock):**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/heatmap-data?gridSize=25&metric=OCCUPANCY" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 5.5.4 Sepulturas Disponíveis

**Endpoint:** `GET /api/v1/cemeteries/{id}/availability`

**Descrição:** Retorna lista otimizada de sepulturas disponíveis com critérios de busca.

**Autenticação:** Bearer Token obrigatório

**Permissões:** `CEMETERY_READ`, `PLOTS_READ`

**Rate Limiting:** 100 requests/minuto

**Parâmetros Query:**

* `plotType` (string, opcional): Tipo de sepultura desejado

* `preferredLocation` (string, opcional): "lat,lng" - localização preferida

* `maxDistance` (int, opcional): Distância máxima em metros

* `minDimensions` (string, opcional): "length,width" - dimensões mínimas

* `sortBy` (string, padrão: LOCATION): LOCATION, SIZE, RECENT

* `limit` (int, padrão: 20, máx: 100): Número máximo de resultados

**Exemplo de Request:**

```bash
curl -X GET "https://api.sgc.gov.cv/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/availability?plotType=GROUND&preferredLocation=14.9176,-23.5091&maxDistance=100&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo de Response (200 - mock):**

```json
{
  "cemeteryId": "550e8400-e29b-41d4-a716-446655440000",
  "searchCriteria": {
    "plotType": "GROUND",
    "preferredLocation": {
      "latitude": 14.9176,
      "longitude": -23.5091
    },
    "maxDistance": 100,
    "limit": 10
  },
  "availablePlots": [
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440007",
      "plotNumber": "A1-025",
      "location": {
        "blockName": "Bloco A",
        "sectionName": "Secção A1",
        "coordinates": {
          "latitude": 14.9175,
          "longitude": -23.5090
        }
      },
      "plotType": "GROUND",
      "dimensions": {
        "length": 2.5,
        "width": 1.2,
        "depth": 1.8,
        "unit": "meters"
      },
      "distanceFromPreferred": 15.7,
      "qrCode": "QR_A1_025_2024",
      "accessibility": {
        "wheelchairAccessible": true,
        "nearMainPath": true,
        "distanceToEntrance": 85.3
      },
      "pricing": {
        "basePrice": 2500.00,
        "locationMultiplier": 1.1,
        "finalPrice": 2750.00,
        "currency": "CVE"
      }
    }
  ],
  "summary": {
    "totalAvailable": 608,
    "matchingCriteria": 10,
    "averageDistance": 45.2,
    "priceRange": {
      "min": 2500.00,
      "max": 3200.00,
      "average": 2850.00
    }
  },
  "generatedAt": "2024-01-20T17:45:00Z"
}
```

## 6. Integrações

### 6.1 Integrações Internas (RabbitMQ)

* **BE-02-Concessao**: Validação de disponibilidade de sepulturas

* **BE-03-Operacao**: Localização para operações de campo

* **BE-04-Financeiro**: Dados para cálculo de taxas baseadas em localização

* **Dashboard Service**: Dados para relatórios executivos

### 6.2 Integrações Externas

* **Sistemas GIS**: Integração com plataformas de mapeamento (WMS/WFS)

* **PostGIS**: Consultas geoespaciais avançadas

* **Serviços de Coordenadas**: Validação e conversão de sistemas de referência

* **Serviços de QR Code**: Geração e validação de códigos QR

## 7. Regras de Negócio

### 7.1 Validações Estruturais

* Unicidade de numeração de sepulturas dentro do mesmo setor

* Validação de coordenadas dentro dos limites do cemitério

* Verificação de sobreposição de áreas entre blocos/setores

* Controle de capacidade máxima por nível hierárquico

### 7.2 Regras de Georreferenciamento

* Coordenadas obrigatórias para sepulturas do tipo GROUND

* Sistema de coordenadas padrão EPSG:4326 (WGS84)

* Validação de proximidade entre coordenadas e estrutura hierárquica

* Geração automática de QR Code após definição de coordenadas

## 8. Requisitos Não Funcionais

### 8.1 Performance

* Tempo de resposta < 2 segundos para consultas geoespaciais

* Suporte a 1.000 consultas simultâneas de mapeamento

* Cache distribuído (Redis) para dados de estrutura hierárquica

* Otimização de consultas PostGIS com índices espaciais

### 8.2 Segurança

* Controle de acesso baseado em papéis (RBAC)

* Auditoria completa de alterações na estrutura

* Criptografia AES-256 para dados sensíveis de localização

* Validação de entrada para prevenir SQL injection

### 8.3 Disponibilidade

* Uptime mínimo de 99.5%

* Backup automático de dados geoespaciais

* Recuperação de desastres com RPO 24h, RTO 8h

* Monitoramento contínuo de saúde do serviço

## 9. Configurações e Monitoramento

### 9.1 Parâmetros Configuráveis

* Tipos de sepultura por município

* Dimensões padrão por tipo de sepultura

* Sistemas de coordenadas suportados

* Regras de numeração hierárquica

* Limites de capacidade por nível

### 9.2 Métricas de Monitoramento

* Taxa de ocupação por cemitério/bloco/setor

* Tempo de resposta de consultas geoespaciais

* Número de QR codes gerados por período

- Erros de validação de coordenadas

  * Utilização de cache e performance de consultas

***

## 📋 Tabela de Tarefas de Implementação - Módulo BE-01-Cemiterio

| ID da Tarefa | Descrição da Tarefa                                                                                     | Prioridade | Status     | Responsável     | Data de Início | Data de Conclusão | Observações                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------- | ---------- | ---------- | --------------- | -------------- | ----------------- | ----------------------------------------------------------------- |
| BE-01-001    | Implementar modelos de dados e DDL para tabelas de cemitérios, blocos, setores e sepulturas com PostGIS | 🔴 Alta    | ⏳ Pendente | João Silva      | 15/01/2024     | -                 | Incluir índices espaciais e validações de integridade referencial |
| BE-01-002    | Desenvolver APIs REST para CRUD de cemitérios com autenticação JWT e controle de permissões RBAC        | 🔴 Alta    | ⏳ Pendente | Maria Santos    | 16/01/2024     | -                 | Implementar rate limiting e validações de negócio                 |
| BE-01-003    | Criar sistema de georreferenciamento com integração PostGIS para coordenadas e polígonos                | 🟡 Média   | ⏳ Pendente | Carlos Oliveira | 17/01/2024     | -                 | Suportar múltiplos sistemas de coordenadas (EPSG)                 |
| BE-01-004    | Implementar geração automática de QR Codes únicos para identificação de sepulturas                      | 🟡 Média   | ⏳ Pendente | Ana Costa       | 18/01/2024     | -                 | Integrar com serviço externo de QR Code e validação               |
| BE-01-005    | Desenvolver testes unitários e de integração para todas as APIs com cobertura >90%                      | 🟢 Baixa   | ⏳ Pendente | Pedro Rodrigues | 19/01/2024     | -                 | Incluir testes de performance e casos de erro                     |

***

## Implementação Mock para Desenvolvimento (Frontend)

Para suportar o desenvolvimento do frontend, foram disponibilizados endpoints mock sob `src/app/api/v1` que espelham esta especificação e permitem alternância transparente para o backend real:

* Alternância por ambiente:

  * `USE_REAL_BACKEND=true` e `REAL_API_URL=https://api.sgc.gov.cv/api/v1` → proxy para backend real

  * `USE_REAL_BACKEND=false` → respostas mock locais

* Endpoints cobertos no mock:

  * Cemitérios: lista, CRUD, `/{id}/statistics`, `/{id}/structure`, `/{id}/map-data` (BLOCKS), `/{id}/occupancy`, `/{id}/capacity-projection`, `/{id}/heatmap-data`, `/{id}/availability` (com preços em CVE)

  * Blocos: `POST /cemetery-blocks`, `PUT /cemetery-blocks/{id}`

  * Setores: `POST /cemetery-sections`, `PUT /cemetery-sections/{id}`

  * Sepulturas: lista, CRUD, `/statistics`, `/search`, `/{id}/geolocation`, `/{id}/qr-code`, `/bulk-qr-generation`

Observações de validação aplicadas nos mocks:

* Campos obrigatórios e formatos básicos (nomes, capacidades, polígonos, coordenadas)

---

## Notas de Alinhamento com Implementação

1. `GET /api/v1/cemeteries`: tamanho padrão `size=10` no modo mock. Suporta filtros `status` e `name`.
2. `GET /api/v1/plots`: resposta no modo mock utiliza `{ "data": [...], "pageable": {...} }`.
3. `GET /api/v1/plots/search`: parâmetros suportados no mock são `cemeteryId`, `plotNumber`, `plotType`, `status`.
4. `GET /api/v1/cemeteries/{id}/map-data`: mock retorna apenas nível `BLOCKS` em `FeatureCollection`.
5. Mensagens de erro no mock são em Português.

---

## Guia de Migração (Breaking Changes)

1. Atualizar clientes que consumiam `GET /plots` para ler o campo `data` em vez de `content`.
2. Ajustar paginação padrão para `size=10` nos listagens (`cemeteries`, `plots`).
3. Adequar consultas ao endpoint `/plots/search` aos parâmetros suportados no mock.
4. Para `map-data`, considerar nível `BLOCKS` no mock ou alternar `USE_REAL_BACKEND=true` para níveis adicionais.
5. Tratar erros com mensagens em Português e códigos `400/404/500` conforme retornos do mock.

* Regras de negócio essenciais (capacidade não pode ser reduzida abaixo da ocupação; remoção de cemitério apenas com `confirm=true` e sem sepulturas ocupadas)
## 10. Alinhamento com API Local e Mocks

**Switch Mock/Real**
- `.env`: `USE_REAL_BACKEND=true|false`, `REAL_API_URL=https://.../api/v1`.
- `src/app/api/config.ts`: `proxyFetch(req, path, init?)` para proxy padronizado.
- Diretriz: substituir usos de `IGRP_APP_MANAGER_API` por `REAL_API_URL` via `proxyFetch`.

**Mapa de Endpoints Implementados (Plots)**
- `GET /api/v1/plots` → lista paginada (`page`, `size`). Resposta: `{ data, pageable }`.
- `POST /api/v1/plots` → cria plot. Resposta: `{ data }` (201).
- `GET /api/v1/plots/{id}` → detalhe. Respostas: `200`, `404`.
- `PUT /api/v1/plots/{id}` → atualiza. Respostas: `200`, `404`.
- `DELETE /api/v1/plots/{id}` → remove quando `occupationStatus=AVAILABLE`. Respostas: `200`, `400`, `404`.
- `GET /api/v1/plots/search` → filtros: `cemeteryId`, `blockId`, `sectionId`, `plotNumber`, `plotType`, `status`, `q`, `nearPoint`, `radius`, `availableOnly`, `plotTypes`, `minDimensions`. Resposta: `{ data }`.
- `GET /api/v1/plots/{id}/qr-code` → `{ plotId, qrCode }` | `404`.
- `POST /api/v1/plots/bulk-qr-generation` → `{ plotIds }` ⇒ `{ data: [{ id, qrCode }] }`.
- `POST /api/v1/plots/{id}/geolocation` → `{ latitude, longitude }` ⇒ `Plot` atualizado | `404`.

**Contratos e Validação (alto nível)**
- `PlotFormData`: obrigatórios `cemeteryId`, `plotNumber`, `plotType`; `geoPoint` com faixas válidas; `dimensions.width/length > 0`; `unit ∈ {meters, feet}`.
- `Geolocation`: validar `latitude ∈ [-90,90]`, `longitude ∈ [-180,180]`.
- `Bulk QR`: `plotIds: string[]` não vazio.

**Mock Data**
- `src/app/api/mock-data.ts` deve refletir os tipos: `plots` com/sem `geoPoint`, `qrCode`, diversas dimensões e `occupationStatus`.
- Helper `pageable(items, page, size)` para respostas coerentes com paginação.

**Códigos HTTP**
- Sucesso: `200/201/204`.
- Validação: `400`.
- Não encontrado: `404`.
- Indisponível/Proxy: `500`.
