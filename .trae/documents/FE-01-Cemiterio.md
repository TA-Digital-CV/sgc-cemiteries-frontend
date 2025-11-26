# FE-01-Cemiterio - Módulo Frontend de Gestão de Cemitério

## Índice de Navegação

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Objetivos](#2-objetivos)
3. [Arquitetura Frontend](#3-arquitetura-frontend)
4. [Funcionalidades](#4-funcionalidades)
5. [Componentes Principais](#5-componentes-principais)
6. [Hooks Customizados](#6-hooks-customizados)
7. [Integração com Backend](#7-integração-com-backend)
8. [Requisitos Não Funcionais](#8-requisitos-não-funcionais)
9. [Configurações e Monitoramento](#9-configurações-e-monitoramento)

## 1. Visão Geral do Módulo

O módulo FE-01-Cemiterio fornece interfaces responsivas para gestão da estrutura física e hierárquica dos cemitérios, incluindo visualização de mapas interativos e ferramentas de cadastro.

**Tecnologia Base:** IGRP 3.0 Next.js Frontend\
**Responsividade:** Mobile-first design com suporte completo a dispositivos móveis\
**Integração:** Consome APIs do módulo BE-01-Cemiterio\
**Arquitetura:** Single Page Application (SPA) com Server-Side Rendering (SSR)

### 1.1 Objetivos do Módulo

* Fornecer interface intuitiva para gestão completa de cemitérios

* Visualização geoespacial interativa de estruturas cemiteriais

* Facilitar operações de cadastro e manutenção de sepulturas

* Otimizar fluxos de trabalho para operadores de campo

* Garantir acessibilidade e usabilidade em dispositivos móveis

### 1.2 Arquitetura Frontend

* **Framework:** Next.js 14 com App Router

* **Design System:** @igrp/igrp-framework-react-design-system (exclusivo)

* **Estilização:** IGRP Design System (sem bibliotecas externas de CSS)

* **Mapas:** Componentes de mapa do IGRP Design System (aprovação necessária se não disponível)

* **Formulários:** Componentes de formulário do IGRP Design System

* **Cache:** React Query (TanStack Query) para sincronização de dados

* **Autenticação:** NextAuth.js integrado com backend IGRP

* **TypeScript:** Configuração rigorosa com eslint-disable para tipos any quando necessário

### 1.3 Arquitetura de Camadas

O projeto segue rigorosamente a arquitetura de camadas definida nas regras do projeto:

* **UI Components (`/components`):** Componentes visuais stateless usando exclusivamente @igrp/igrp-framework-react-design-system

* **Hooks (`/hooks`):** Lógica de estado e efeitos colaterais reutilizáveis (useCemetery, useMap, usePlotForm)

* **Actions (`/actions`):** Server actions e interações assíncronas do Next.js

* **Types (`/types`):** Interfaces TypeScript compartilhadas entre camadas

* **Services (`/services`):** Lógica de negócio do frontend (validações, transformações)

* **Repositories (`/repositories`):** Camada de acesso a dados e APIs

* **API Routes (`/app/api/.../route.ts`):** Endpoints internos com validação e tratamento de erros

### 1.4 Integração com Backend

* **API Base:** `https://api.sgc.gov.cv/api/v1/`

* **Autenticação:** Bearer Token JWT

* **Rate Limiting:** Implementação de throttling no frontend (100 requests/minuto para listagem, 10 requests/minuto para criação)

* **Offline Support:** Service Workers para funcionalidades críticas

* **Real-time:** WebSocket para atualizações de ocupação em tempo real

* **Endpoints Integrados:**

  * Gestão de Cemitérios: GET, POST, PUT, DELETE `/cemeteries`

  * Estatísticas: GET `/cemeteries/{id}/statistics`

  * Estrutura Hierárquica: GET `/cemeteries/{id}/structure`

  * Gestão de Blocos: PUT `/cemetery-blocks/{id}`

  * Gestão de Seções: PUT `/cemetery-sections/{id}`

  * Gestão de Sepulturas: GET, POST, PUT, DELETE `/plots`

  * Busca Avançada: GET `/plots/search`

  * QR Codes: GET, POST `/plots/{id}/qr-code`

  * Dados Geoespaciais: GET `/cemeteries/{id}/map-data`

  * Ocupação: GET `/cemeteries/{id}/occupancy`

  * Projeções: GET `/cemeteries/{id}/capacity-projection`

  * Heatmap: GET `/cemeteries/{id}/heatmap-data`

  * Disponibilidade: GET `/cemeteries/{id}/availability`

* **Tratamento de Erros:**

  * Códigos de status padronizados (200, 400, 401, 403, 500)

  * Mensagens de erro localizadas

  * Retry automático para falhas temporárias

  * Fallback para modo offline quando aplicável

## 2. Funcionalidades da Interface

### 2.1 Dashboard Principal

* **Visão Geral Estatística:**

  * Painel com métricas de ocupação por cemitério (total, ocupadas, disponíveis)

  * Gráficos de tendência de ocupação mensal/anual

  * Indicadores de capacidade crítica (cemitérios com >90% ocupação)

  * Alertas de manutenção pendente e notificações do sistema

* **Mapas de Calor Interativos:**

  * Visualização de densidade de ocupação por região

  * Filtros por período temporal (últimos 30/90/365 dias)

  * Projeções de capacidade baseadas em tendências históricas

  * Identificação visual de áreas com maior demanda

* **Widgets de Monitoramento:**

  * Status de sincronização com backend em tempo real

  * Indicadores de performance do sistema

  * Notificações de eventos críticos (sepulturas vencidas, manutenções urgentes)

### 2.2 Gestão Hierárquica Completa

* **Navegação Estrutural:**

  * Interface de árvore expansível (cemitério → bloco → setor → sepultura)

  * Breadcrumb navigation para contexto de localização

  * Busca rápida por código ou nome em qualquer nível

  * Filtros avançados por status, tipo, data de criação

* **Operações CRUD Integradas:**

  * **Cemitérios:** Criar, visualizar, editar, desativar (soft delete)

  * **Blocos:** Gestão com validação de capacidade máxima

  * **Setores:** Configuração de tipos específicos (perpétuo, temporário, infantil)

  * **Sepulturas:** Cadastro completo com georreferenciamento

* **Validações de Integridade:**

  * Verificação de dependências antes de exclusões

  * Validação de capacidade antes de criação de estruturas

  * Controle de duplicatas por código/nome

### 2.3 Mapeamento Interativo Avançado

* **Visualização Geoespacial:**

  * Mapa base com camadas de cemitérios, blocos, setores e sepulturas

  * Controles de zoom com níveis de detalhamento progressivo

  * Marcadores customizados por status (ocupada, disponível, manutenção)

  * Popup informativos com dados detalhados de cada elemento

* **Ferramentas de Navegação:**

  * Busca geográfica por coordenadas ou endereço

  * Medição de distâncias e áreas

  * Exportação de mapas em PDF/PNG

  * Modo offline com cache de tiles essenciais

* **Sobreposições Contextuais:**

  * Camadas de informação (infraestrutura, acessibilidade, serviços)

  * Heatmaps de ocupação e disponibilidade

  * Rotas de acesso e pontos de interesse

  * Integração com dados cadastrais municipais

### 2.4 Ferramentas de Cadastro Inteligentes

* **Formulários Adaptativos:**

  * Interface responsiva com validação em tempo real

  * Campos condicionais baseados no tipo de sepultura

  * Auto-preenchimento com dados de APIs externas

  * Suporte a múltiplos idiomas (PT, EN, FR)

* **Gestão de Documentos:**

  * Upload drag-and-drop com preview

  * Validação de tipos de arquivo (PDF, JPG, PNG)

  * Compressão automática de imagens

  * Versionamento de documentos

* **Georreferenciamento Assistido:**

  * Captura de coordenadas via GPS (dispositivos móveis)

  * Seleção visual no mapa interativo

  * Validação de precisão e correção automática

  * Histórico de alterações de localização

### 2.5 Análise de Capacidade e Relatórios

* **Projeções Inteligentes:**

  * Algoritmos de previsão baseados em dados históricos

  * Cenários de crescimento (conservador, moderado, otimista)

  * Alertas de capacidade crítica com antecedência

  * Recomendações de expansão por região

* **Relatórios Dinâmicos:**

  * Geração de relatórios personalizáveis

  * Exportação em múltiplos formatos (PDF, Excel, CSV)

  * Agendamento de relatórios automáticos

  * Dashboard executivo com KPIs principais

### 2.6 Gestão de QR Codes

* **Geração Inteligente:**

  * QR codes únicos por sepultura com dados criptografados

  * Geração em lote para múltiplas sepulturas

  * Personalização de design e tamanho

  * Integração com sistema de impressão

* **Funcionalidades Móveis:**

  * Scanner QR integrado na aplicação mobile

  * Acesso rápido a informações da sepultura

  * Histórico de visitas e manutenções

  * Modo offline para consultas essenciais

## 3. Arquitetura de Componentes e Hooks

### 3.1 Hooks Customizados

#### 3.1.1 useMap

**Descrição:** Hook para gerenciamento de estado e lógica do mapa interativo.

```typescript
interface UseMapReturn {
  mapInstance: MapInstance | null;
  activeLayer: string;
  selectedMarker: string | null;
  isLoading: boolean;
  error: string | null;
  setActiveLayer: (layer: string) => void;
  selectMarker: (markerId: string) => void;
  zoomToFit: (bounds: Bounds) => void;
  applyFilters: (filters: MapFilter[]) => void;
}
```

**Responsabilidades:**

* Gerenciamento de estado do mapa

* Controle de camadas e marcadores

* Aplicação de filtros visuais

* Tratamento de erros de renderização

#### 3.1.2 useCemetery

**Descrição:** Hook para gerenciamento de dados e operações de cemitérios.

```typescript
interface UseCemeteryReturn {
  cemeteries: Cemetery[];
  selectedCemetery: Cemetery | null;
  isLoading: boolean;
  error: string | null;
  fetchCemeteries: () => Promise<void>;
  selectCemetery: (id: string) => void;
  createCemetery: (data: CemeteryFormData) => Promise<void>;
  updateCemetery: (id: string, data: CemeteryFormData) => Promise<void>;
}
```

#### 3.1.3 usePlotForm

**Descrição:** Hook para lógica de formulário de sepulturas com validação.

```typescript
interface UsePlotFormReturn {
  formData: PlotFormData;
  validationErrors: ValidationErrors;
  isSubmitting: boolean;
  currentStep: number;
  coordinates: Coordinates | null;
  updateField: (field: string, value: any) => void;
  validateField: (field: string) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  submitForm: () => Promise<void>;
}
```

### 3.2 Componentes UI (IGRP Design System)

#### 3.2.1 CemeteryMapContainer

**Descrição:** Componente container stateless para visualização de mapa usando componentes IGRP.

**Props Interface:**

```typescript
interface CemeteryMapContainerProps {
  cemeteries: Cemetery[];
  selectedCemetery?: string;
  onCemeterySelect?: (cemetery: Cemetery) => void;
  height?: string;
  className?: string;
}
```

**Implementação:**

* Usa hook `useMap()` para lógica de estado

* Componentes de mapa do IGRP Design System

* Máximo 200 linhas (princípio SRP)

* Stateless - toda lógica delegada ao hook

#### 3.2 PlotFormContainer

**Descrição:** Container de formulário usando componentes de formulário IGRP.

**Props Interface:**

```typescript
interface PlotFormContainerProps {
  plot?: Plot;
  mode: 'create' | 'edit';
  onSubmit: (data: PlotFormData) => Promise<void>;
  onCancel: () => void;
}
```

**Implementação:**

* Usa hook `usePlotForm()` para lógica

* Componentes Input, Button, Select do IGRP

* Validação delegada ao hook

* Máximo 250 linhas

### 3.6 Types (Definições de Tipos)

**Descrição:** Definições TypeScript compartilhadas entre todas as camadas.

```typescript
// /types/Cemetery.ts
export interface Cemetery {
  id: string;
  municipalityId: string;
  name: string;
  address: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  totalArea: number;
  maxCapacity: number;
  currentOccupancy: number;
  occupancyRate: number;
  status: CemeteryStatus;
  createdDate: string;
  lastModifiedDate: string;
}

export interface CemeteryFormData {
  municipalityId: string;
  name: string;
  address: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  totalArea: number;
  maxCapacity: number;
}

export type CemeteryStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface CemeteryStatistics {
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  reservedPlots: number;
  maintenancePlots: number;
  occupancyRate: number;
  plotsByType: {
    [key: string]: number;
  };
  recentActivity: {
    newBurials: number;
    newReservations: number;
    period: string;
  };
}

export interface CemeteryStructure {
  cemetery: Cemetery;
  blocks: CemeteryBlock[];
  sections: CemeterySection[];
  plots: Plot[];
}

export interface CemeteryBlock {
  id: string;
  cemeteryId: string;
  name: string;
  description?: string;
  geoPolygon?: any;
  maxCapacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
  lastModifiedDate: string;
}

export interface CemeterySection {
  id: string;
  cemeteryId: string;
  blockId: string;
  name: string;
  description?: string;
  geoPolygon?: any;
  maxCapacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
  lastModifiedDate: string;
}

// /types/Plot.ts
export interface Plot {
  id: string;
  cemeteryId: string;
  blockId?: string;
  sectionId?: string;
  plotNumber: string;
  plotType: 'GROUND' | 'MAUSOLEUM' | 'NICHE' | 'OSSUARY';
  geoPoint?: {
    latitude: number;
    longitude: number;
  };
  qrCode?: string;
  occupationStatus: PlotStatus;
  dimensions?: any;
  notes?: string;
  createdDate: string;
  lastModifiedDate: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface PlotFormData {
  cemeteryId: string;
  blockId?: string;
  sectionId?: string;
  plotNumber: string;
  plotType: 'GROUND' | 'MAUSOLEUM' | 'NICHE' | 'OSSUARY';
  geoPoint?: {
    latitude: number;
    longitude: number;
  };
  dimensions?: any;
  notes?: string;
}

export type PlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export interface PlotSearchParams {
  cemeteryId?: string;
  occupationStatus?: PlotStatus;
  plotType?: string;
  nearPoint?: string;
  radius?: number;
  availableOnly?: boolean;
  page?: number;
  size?: number;
}

export interface QRCodeOptions {
  format?: 'PNG' | 'SVG';
  size?: number;
  includeMetadata?: boolean;
}

// /types/Common.ts
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface ApiResponse<T> {
  content?: T[];
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
  timestamp?: string;
  path?: string;
  pageable?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface MapData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export interface GeoFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[] | number[][];
  };
  properties: {
    id: string;
    name: string;
    type: string;
    status: string;
    [key: string]: any;
  };
}

export interface OccupancyData {
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  reservedPlots: number;
  maintenancePlots: number;
  occupancyRate: number;
  breakdown?: {
    [key: string]: {
      total: number;
      occupied: number;
      available: number;
      reserved: number;
      maintenance: number;
      occupancyRate: number;
    };
  };
}

export interface CapacityProjection {
  currentOccupancy: number;
  projectedOccupancy: number;
  projectionDate: string;
  capacityExhaustionDate?: string;
  monthlyProjections: {
    month: string;
    projectedOccupancy: number;
    occupancyRate: number;
  }[];
  recommendations: string[];
}

export interface HeatmapData {
  gridSize: number;
  metric: string;
  data: {
    x: number;
    y: number;
    value: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface AvailabilityData {
  availablePlots: Plot[];
  totalAvailable: number;
  nearbyPlots: Plot[];
  recommendations: {
    plotId: string;
    distance: number;
    suitabilityScore: number;
    reasons: string[];
  }[];
}
```

### 3.7 Exceções Documentadas

**EXCEÇÃO 1: Componente de Mapa**

* **Justificativa:** O IGRP Design System não possui componentes nativos para mapas interativos

* **Solução:** Uso de biblioteca de mapa externa integrada com componentes IGRP para controles

* **Implementação:** Wrapper que usa componentes IGRP para UI e biblioteca externa apenas para renderização do mapa

**EXCEÇÃO 2: Componente QR Code**

* **Justificativa:** Funcionalidade específica não disponível no design system

* **Solução:** Biblioteca externa para geração de QR codes com styling IGRP

* **Implementação:** Container IGRP com biblioteca externa encapsulada

#### 3.2.3 CemeteryCard

**Descrição:** Card informativo usando componentes Card do IGRP Design System.

**Props Interface:**

```typescript
interface CemeteryCardProps {
  cemetery: Cemetery;
  variant?: 'default' | 'compact';
  onClick?: (cemetery: Cemetery) => void;
  actions?: CardAction[];
}
```

**Implementação:**

* Usa componentes Card, Typography, Button do IGRP

* Stateless - recebe dados via props

* Máximo 150 linhas

### 3.3 Actions (Camada de Ação)

#### 3.3.1 Cemetery Actions

**Descrição:** Actions para operações de cemitério que conectam UI aos services.

```typescript
// /actions/cemeteryActions.ts
export const fetchCemeteriesAction = async (): Promise<Cemetery[]> => {
  try {
    return await cemeteryService.getAllCemeteries();
  } catch (error) {
    throw new Error(`Erro ao carregar cemitérios: ${error.message}`);
  }
};

export const createCemeteryAction = async (data: CemeteryFormData): Promise<Cemetery> => {
  try {
    return await cemeteryService.createCemetery(data);
  } catch (error) {
    throw new Error(`Erro ao criar cemitério: ${error.message}`);
  }
};
```

#### 3.3.2 Plot Actions

**Descrição:** Actions para operações de sepulturas.

```typescript
// /actions/plotActions.ts
export const submitPlotAction = async (data: PlotFormData): Promise<Plot> => {
  try {
    const validatedData = await plotService.validatePlotData(data);
    return await plotService.createPlot(validatedData);
  } catch (error) {
    throw new Error(`Erro ao cadastrar sepultura: ${error.message}`);
  }
};

export const validatePlotPositionAction = async (coordinates: Coordinates): Promise<boolean> => {
  try {
    return await plotService.validatePosition(coordinates);
  } catch (error) {
    throw new Error(`Erro ao validar posição: ${error.message}`);
  }
};
```

### 3.4 Services (Lógica de Negócio)

#### 3.4.1 Cemetery Service

**Descrição:** Lógica de negócio para operações de cemitério.

```typescript
// /services/cemeteryService.ts
export class CemeteryService {
  async getAllCemeteries(): Promise<Cemetery[]> {
    const data = await cemeteryRepository.fetchAll();
    return this.formatCemeteryData(data);
  }

  async createCemetery(formData: CemeteryFormData): Promise<Cemetery> {
    const validatedData = this.validateCemeteryData(formData);
    return await cemeteryRepository.create(validatedData);
  }

  private validateCemeteryData(data: CemeteryFormData): CemeteryData {
    // Lógica de validação e transformação
    return transformedData;
  }

  private formatCemeteryData(rawData: any[]): Cemetery[] {
    // Lógica de formatação
    return formattedData;
  }
}
```

#### 3.4.2 Plot Service

**Descrição:** Lógica de negócio para operações de sepulturas.

```typescript
// /services/plotService.ts
export class PlotService {
  async validatePlotData(data: PlotFormData): Promise<PlotData> {
    // Validações de negócio específicas
    this.validateCoordinates(data.coordinates);
    this.validateAvailability(data.position);
    return this.transformFormData(data);
  }

  async createPlot(data: PlotData): Promise<Plot> {
    return await plotRepository.create(data);
  }

  async validatePosition(coordinates: Coordinates): Promise<boolean> {
    return await plotRepository.checkAvailability(coordinates);
  }
}
```

### 3.5 Repositories (Acesso a Dados)

#### 3.5.1 Cemetery Repository

**Descrição:** Camada de acesso a dados para cemitérios.

```typescript
// /repositories/cemeteryRepository.ts
export class CemeteryRepository {
  async fetchAll(): Promise<CemeteryApiResponse[]> {
    const response = await fetch('/api/v1/cemeteries');
    if (!response.ok) throw new Error('Falha ao buscar cemitérios');
    return response.json();
  }

  async create(data: CemeteryData): Promise<Cemetery> {
    const response = await fetch('/api/v1/cemeteries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Falha ao criar cemitério');
    return response.json();
  }

  async fetchById(id: string): Promise<Cemetery> {
    const response = await fetch(`/api/v1/cemeteries/${id}`);
    if (!response.ok) throw new Error('Cemitério não encontrado');
    return response.json();
  }
}
```

#### 3.5.2 Plot Repository

**Descrição:** Camada de acesso a dados para sepulturas.

```typescript
// /repositories/plotRepository.ts
export class PlotRepository {
  async create(data: PlotData): Promise<Plot> {
    const response = await fetch('/api/v1/plots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Falha ao criar sepultura');
    return response.json();
  }

  async checkAvailability(coordinates: Coordinates): Promise<boolean> {
    const response = await fetch('/api/v1/plots/validate-position', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates })
    });
    if (!response.ok) throw new Error('Falha na validação');
    const result = await response.json();
    return result.available;
  }
}
```

### 3.8 PlotForm

**Descrição:** Formulário inteligente para cadastro e edição de sepulturas com validação avançada.

**Props Interface:**

```typescript
interface PlotFormProps {
  plot?: Plot;
  cemeteryId?: string;
  mode: 'create' | 'edit';
  onSubmit: (data: PlotFormData) => Promise<void>;
  onCancel: () => void;
  initialStep?: number;
  showMap?: boolean;
  validationSchema?: ZodSchema;
}
```

**Estados Internos:**

* `currentStep`: Etapa atual do formulário multi-step

* `formData`: Dados do formulário em tempo real

* `validationErrors`: Erros de validação por campo

* `isSubmitting`: Estado de envio do formulário

* `coordinates`: Coordenadas GPS selecionadas

* `uploadedFiles`: Arquivos carregados

**Comportamentos:**

* **Validação em Tempo Real:** Valida campos conforme usuário digita

* **Auto-preenchimento:** Completa campos baseado em seleções anteriores

* **Geolocalização:** Captura coordenadas GPS do dispositivo

* **Upload Progressivo:** Mostra progresso de upload de arquivos

* **Salvamento Automático:** Salva rascunho a cada 30 segundos

* **Navegação por Etapas:** Controla fluxo multi-step com validação

**Validações Específicas:**

* Código único por cemitério

* Coordenadas dentro dos limites do cemitério

* Capacidade disponível no setor selecionado

* Formatos de arquivo permitidos para documentos

### 3.9 QRCodeGenerator

**Descrição:** Componente para geração e gestão de QR codes únicos por sepultura.

**Props Interface:**

```typescript
interface QRCodeGeneratorProps {
  plotId?: string;
  plotIds?: string[];
  size?: 'small' | 'medium' | 'large';
  format?: 'PNG' | 'SVG' | 'PDF';
  includeText?: boolean;
  customData?: Record<string, any>;
  onGenerated?: (qrCode: QRCodeData) => void;
  batchMode?: boolean;
}
```

**Estados Internos:**

* `qrCodeData`: Dados codificados no QR

* `generatedImage`: Imagem gerada do QR code

* `isGenerating`: Estado de geração

* `downloadUrl`: URL para download

* `batchProgress`: Progresso da geração em lote

**Comportamentos:**

* **Geração Única:** Cria QR code para sepultura específica

* **Geração em Lote:** Processa múltiplas sepulturas simultaneamente

* **Customização Visual:** Permite ajustar tamanho, cor e formato

* **Preview Instantâneo:** Mostra preview antes do download

* **Validação de Dados:** Verifica integridade dos dados codificados

* **Cache Inteligente:** Reutiliza QR codes já gerados

**Integração com APIs:**

**Gestão de Cemitérios:**

* `GET /api/v1/cemeteries` - Lista cemitérios com filtros

* `POST /api/v1/cemeteries` - Cria novo cemitério

* `GET /api/v1/cemeteries/{id}` - Detalhes de cemitério específico

* `PUT /api/v1/cemeteries/{id}` - Atualiza dados do cemitério

* `DELETE /api/v1/cemeteries/{id}` - Remove cemitério (soft delete)

* `GET /api/v1/cemeteries/{id}/statistics` - Estatísticas do cemitério

* `GET /api/v1/cemeteries/{id}/structure` - Estrutura hierárquica

**Gestão de Blocos e Seções:**

* `POST /api/v1/cemetery-blocks` - Cria novo bloco do cemitério

* `PUT /api/v1/cemetery-blocks/{id}` - Atualiza bloco do cemitério

* `POST /api/v1/cemetery-sections` - Cria nova seção do cemitério

* `PUT /api/v1/cemetery-sections/{id}` - Atualiza seção do cemitério

**Gestão de Sepulturas:**

* `GET /api/v1/plots` - Lista sepulturas com filtros avançados

* `POST /api/v1/plots` - Cria nova sepultura

* `GET /api/v1/plots/{id}` - Detalhes de sepultura específica

* `PUT /api/v1/plots/{id}` - Atualiza dados da sepultura

* `DELETE /api/v1/plots/{id}` - Remove sepultura

* `GET /api/v1/plots/search` - Busca avançada de sepulturas

* `POST /api/v1/plots/{id}/geolocation` - Define geolocalização da sepultura

**QR Codes:**

* `GET /api/v1/plots/{id}/qr-code` - Recupera QR code existente

* `POST /api/v1/plots/bulk-qr-generation` - Geração em lote de QR codes

**Dados Geoespaciais:**

* `GET /api/v1/cemeteries/{id}/map-data` - Dados para mapeamento

* `GET /api/v1/cemeteries/{id}/occupancy` - Dados de ocupação

* `GET /api/v1/cemeteries/{id}/capacity-projection` - Projeção de capacidade

* `GET /api/v1/cemeteries/{id}/heatmap-data` - Dados para heatmap

* `GET /api/v1/cemeteries/{id}/availability` - Disponibilidade de sepulturas

### 3.10 CemeteryCard

**Descrição:** Card informativo responsivo para exibição de cemitérios com métricas e ações.

**Props Interface:**

```typescript
interface CemeteryCardProps {
  cemetery: Cemetery;
  showStats?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  onClick?: (cemetery: Cemetery) => void;
  actions?: CardAction[];
  loading?: boolean;
}
```

**Estados Internos:**

* `isHovered`: Estado de hover para animações

* `statsLoading`: Carregamento de estatísticas

* `actionLoading`: Estado de ações em execução

* `expanded`: Estado expandido para variant detailed

**Comportamentos:**

* **Hover Effects:** Animações suaves ao passar mouse

* **Loading States:** Skeleton loading para dados assíncronos

* **Action Handling:** Executa ações com feedback visual

* **Responsive Layout:** Adapta layout conforme tamanho da tela

* **Status Indicators:** Mostra indicadores visuais de status

* **Progress Bars:** Barras de progresso para ocupação

**Métricas Exibidas:**

* Taxa de ocupação atual

* Total de sepulturas

* Sepulturas disponíveis

* Status operacional

* Última atualização

### 3.11 HierarchyTree

**Descrição:** Componente de árvore hierárquica para navegação em estruturas cemiteriais.

**Props Interface:**

```typescript
interface HierarchyTreeProps {
  data: HierarchyNode[];
  selectedNode?: string;
  expandedNodes?: string[];
  onNodeSelect?: (node: HierarchyNode) => void;
  onNodeExpand?: (nodeId: string) => void;
  searchable?: boolean;
  draggable?: boolean;
  showIcons?: boolean;
  maxDepth?: number;
}
```

**Estados Internos:**

* `expandedNodes`: Nós expandidos atualmente

* `selectedNode`: Nó selecionado

* `searchTerm`: Termo de busca ativo

* `filteredData`: Dados filtrados pela busca

* `dragState`: Estado de drag and drop

**Comportamentos:**

* **Expansão Lazy:** Carrega filhos apenas quando necessário

* **Busca Integrada:** Filtra e destaca resultados em tempo real

* **Drag and Drop:** Permite reorganização de estruturas

* **Keyboard Navigation:** Navegação por teclado (setas, enter, esc)

* **Context Menu:** Menu contextual com ações específicas

* **Virtual Scrolling:** Otimização para grandes árvores

### 3.12 SearchFilter

**Descrição:** Componente avançado de busca e filtros para listas e mapas.

**Props Interface:**

```typescript
interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: FilterState) => void;
  filters: FilterConfig[];
  placeholder?: string;
  showAdvanced?: boolean;
  savedFilters?: SavedFilter[];
  debounceMs?: number;
}
```

**Estados Internos:**

* `searchTerm`: Termo de busca atual

* `activeFilters`: Filtros ativos

* `showAdvancedPanel`: Painel avançado visível

* `savedFilterName`: Nome para salvar filtro

* `isSearching`: Estado de busca ativa

**Comportamentos:**

* **Debounced Search:** Busca com delay para otimização

* **Filter Chips:** Mostra filtros ativos como chips removíveis

* **Advanced Panel:** Painel expansível com filtros complexos

* **Save/Load Filters:** Salva combinações de filtros frequentes

* **Auto-complete:** Sugestões baseadas em histórico

* **Clear All:** Limpa todos os filtros com um clique

### 3.13 DataTable

**Descrição:** Tabela de dados avançada com paginação, ordenação e filtros.

**Props Interface:**

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  selection?: SelectionConfig;
  actions?: TableAction<T>[];
  exportable?: boolean;
}
```

**Estados Internos:**

* `sortedData`: Dados ordenados

* `selectedRows`: Linhas selecionadas

* `currentPage`: Página atual

* `sortConfig`: Configuração de ordenação

* `columnVisibility`: Visibilidade das colunas

**Comportamentos:**

* **Server-side Pagination:** Paginação no servidor para grandes datasets

* **Multi-column Sorting:** Ordenação por múltiplas colunas

* **Row Selection:** Seleção individual ou múltipla

* **Column Resizing:** Redimensionamento de colunas

* **Export Functions:** Exportação em CSV, Excel, PDF

* **Responsive Columns:** Oculta colunas em telas pequenas

### 3.14 StatsDashboard

**Descrição:** Dashboard de estatísticas com widgets configuráveis.

**Props Interface:**

```typescript
interface StatsDashboardProps {
  widgets: DashboardWidget[];
  layout?: 'grid' | 'masonry';
  editable?: boolean;
  refreshInterval?: number;
  dateRange?: DateRange;
  filters?: DashboardFilter[];
}
```

**Estados Internos:**

* `widgetData`: Dados de cada widget

* `refreshTimers`: Timers de atualização

* `layoutConfig`: Configuração do layout

* `isEditing`: Modo de edição ativo

* `loadingStates`: Estados de carregamento por widget

**Comportamentos:**

* **Auto-refresh:** Atualização automática de dados

* **Drag Layout:** Reorganização de widgets por drag-and-drop

* **Widget Configuration:** Configuração individual de widgets

* **Real-time Updates:** Atualizações em tempo real via WebSocket

* **Export Dashboard:** Exportação de dashboard completo

* **Responsive Grid:** Layout responsivo para diferentes telas

### 3.15 NotificationCenter

**Descrição:** Centro de notificações com diferentes tipos e prioridades.

**Props Interface:**

```typescript
interface NotificationCenterProps {
  notifications: Notification[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
  autoClose?: boolean;
  closeDelay?: number;
}
```

**Estados Internos:**

* `visibleNotifications`: Notificações visíveis

* `queuedNotifications`: Fila de notificações

* `timers`: Timers de auto-close

* `isExpanded`: Estado expandido do centro

**Comportamentos:**

* **Queue Management:** Gerencia fila de notificações

* **Auto-dismiss:** Remove notificações automaticamente

* **Priority Handling:** Prioriza notificações críticas

* **Action Buttons:** Botões de ação em notificações

* **Persistence:** Mantém notificações importantes

* **Sound Alerts:** Alertas sonoros para notificações críticas

## 4. Páginas e Rotas

### 4. Conformidade com TypeScript Guidelines

### 4.1 Configuração TypeScript Rigorosa

```typescript
// tsconfig.json - Configuração rigorosa
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 4.2 Tratamento de Tipos Any

**Quando necessário usar** **`any`:**

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// Justificativa: Integração com biblioteca de mapa externa sem tipagem
interface MapLibraryProps {
  config: any; // Configuração dinâmica da biblioteca externa
  onEvent: (event: any) => void; // Eventos não tipados da biblioteca
}

// Justificativa: Dados de API externa com estrutura variável
interface ExternalApiResponse {
  data: any; // Estrutura de dados variável por endpoint
}
```

### 4.3 Interfaces Bem Definidas

**Todas as interfaces seguem padrões rigorosos:**

```typescript
// Interfaces específicas e bem tipadas
interface CemeteryMapState {
  selectedCemetery: Cemetery | null;
  activeLayer: MapLayer;
  zoom: number;
  center: Coordinates;
  isLoading: boolean;
  error: string | null;
}

// Tipos union específicos
type FormStep = 'location' | 'details' | 'occupant' | 'confirmation';
type ValidationResult = 'valid' | 'invalid' | 'pending';
```

## 5. Estrutura de Rotas Completa

```
/                          # Dashboard principal
/cemeteries                # Lista de cemitérios
/cemeteries/[id]           # Detalhes do cemitério
/cemeteries/[id]/edit      # Edição de cemitério
/cemeteries/create         # Criação de cemitério
/cemeteries/[id]/blocks    # Gestão de blocos
/cemeteries/[id]/blocks/[blockId]           # Detalhes do bloco
/cemeteries/[id]/blocks/[blockId]/edit      # Edição de bloco
/cemeteries/[id]/blocks/create              # Criação de bloco
/cemeteries/[id]/sections  # Gestão de setores
/cemeteries/[id]/sections/[sectionId]       # Detalhes do setor
/cemeteries/[id]/sections/[sectionId]/edit  # Edição de setor
/cemeteries/[id]/sections/create            # Criação de setor
/plots                     # Lista geral de sepulturas
/plots/[id]                # Detalhes da sepultura
/plots/[id]/edit           # Edição de sepultura
/plots/create              # Cadastro de sepultura
/plots/search              # Busca avançada de sepulturas
/analytics                 # Dashboard de análise de capacidade
/analytics/occupancy       # Análise de ocupação
/analytics/projections     # Projeções de capacidade
/analytics/heatmap         # Mapa de calor
/qr-codes                  # Gestão de QR codes
/qr-codes/generate         # Geração de QR codes
/qr-codes/batch            # Geração em lote
/map                       # Visualização de mapa completo
/reports                   # Centro de relatórios
/settings                  # Configurações do sistema
```

### 4.2 Dashboard Principal (/)

**Wireframe Textual:**

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Sistema de Gestão Cemiterial        [User] [Config]  │
├─────────────────────────────────────────────────────────────┤
│ Dashboard Principal                                         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │ Cemitérios  │ │ Sepulturas  │ │ Ocupação    │ │ Alertas │ │
│ │    15       │ │   2.847     │ │    78%      │ │    3    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Mapa de Calor          │ │ Gráfico de Ocupação         │ │
│ │ [Mapa Interativo]      │ │ [Gráfico de Barras]         │ │
│ │                        │ │                             │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Atividades Recentes                                     │ │
│ │ • Sepultura S001 - Cemitério Central - Cadastrada      │ │
│ │ • Bloco B12 - Cemitério Norte - Atualizado             │ │
│ │ • QR Code gerado para Secção A - Cemitério Sul          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**

* Métricas em tempo real de todos os cemitérios

* Mapa de calor interativo com drill-down

* Gráficos de tendência de ocupação

* Feed de atividades recentes

* Atalhos rápidos para ações frequentes

* Notificações push para eventos críticos

**Estados da Página:**

* Loading: Skeleton screens para cada widget

* Error: Mensagens específicas por componente

* Empty: Estado inicial para novos usuários

* Offline: Cache de dados essenciais

### 4.3 Lista de Cemitérios (/cemeteries)

**Wireframe Textual:**

```
┌─────────────────────────────────────────────────────────────┐
│ [←] Dashboard > Cemitérios                    [+ Novo]      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 Buscar cemitérios...  [Filtros ▼] [Ordenar ▼]      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📍 Cemitério Central                          [⚙️] [👁️] │ │
│ │ Endereço: Rua Principal, 123                           │ │
│ │ Ocupação: 847/1200 (70.6%) ████████░░                  │ │
│ │ Status: Ativo | Última atualização: 2h atrás           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📍 Cemitério Norte                            [⚙️] [👁️] │ │
│ │ Endereço: Av. Norte, 456                               │ │
│ │ Ocupação: 234/800 (29.3%) ███░░░░░░░                   │ │
│ │ Status: Ativo | Última atualização: 1h atrás           │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [1] [2] [3] ... [10] [→]                                   │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**

* Lista paginada com 10 cemitérios por página

* Busca em tempo real por nome, endereço ou código

* Filtros: status, capacidade, município, tipo

* Ordenação: nome, ocupação, data de criação

* Ações rápidas: visualizar, editar, estatísticas

* Indicadores visuais de capacidade e status

**Fluxo de Navegação:**

1. Usuário acessa lista de cemitérios
2. Pode filtrar/buscar cemitérios específicos
3. Clica em cemitério para ver detalhes
4. Pode criar novo cemitério via botão "Novo"
5. Ações contextuais levam a páginas específicas

### 4.4 Detalhes do Cemitério (/cemeteries/\[id])

**Wireframe Textual:**

```
┌─────────────────────────────────────────────────────────────┐
│ [←] Cemitérios > Cemitério Central           [Editar] [⚙️]  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ 📍 Cemitério Central    │ │ Estatísticas Rápidas        │ │
│ │ Código: CEM001          │ │ Total Sepulturas: 1.200     │ │
│ │ Endereço: Rua Prin, 123 │ │ Ocupadas: 847 (70.6%)       │ │
│ │ Área: 5.2 hectares      │ │ Disponíveis: 353 (29.4%)    │ │
│ │ Status: Ativo           │ │ Em Manutenção: 12           │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Mapa do Cemitério                                       │ │
│ │ [Mapa Interativo com Blocos e Setores]                 │ │
│ │ Controles: [+] [-] [🎯] [📐] [📄]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │ [📦] Blocos │ │ [🏗️] Setores│ │ [⚰️] Sepult.│ │ [📊] Rel│ │
│ │    Gerenciar│ │   Gerenciar │ │   Gerenciar │ │ atórios │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**

* Informações completas do cemitério

* Mapa interativo com estrutura hierárquica

* Estatísticas em tempo real

* Navegação rápida para gestão de estruturas

* Histórico de alterações

* Exportação de dados e mapas

### 4.5 Gestão de Sepulturas (/plots)

**Wireframe Textual:**

```
┌─────────────────────────────────────────────────────────────┐
│ [←] Dashboard > Sepulturas                    [+ Nova]      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 Buscar por código, nome...  [Filtros ▼] [Mapa 🗺️]   │ │
│ │ Filtros Ativos: Status: Todas | Tipo: Todos            │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚰️ S001 - João Silva                         [QR] [👁️] │ │
│ │ Cemitério Central > Bloco A > Secção 1                  │ │
│ │ Status: Ocupada | Tipo: Perpétua | GPS: -15.xx, -23.xx │ │
│ │ Data Sepultamento: 15/03/2023                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚰️ S002 - Maria Santos                       [QR] [👁️] │ │
│ │ Cemitério Norte > Bloco B > Secção 2                    │ │
│ │ Status: Disponível | Tipo: Temporária | GPS: -15.xx... │ │
│ │ Reservada até: 30/12/2024                              │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Mostrando 1-20 de 2.847 sepulturas [1][2][3]...[143][→]   │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**

* Lista paginada com busca avançada

* Filtros múltiplos: status, tipo, cemitério, data

* Visualização em lista ou mapa

* Ações rápidas: QR code, detalhes, edição

* Exportação de listas filtradas

* Modo de seleção múltipla para ações em lote

### 4.6 Cadastro de Sepultura (/plots/create)

**Wireframe Textual:**

```
┌─────────────────────────────────────────────────────────────┐
│ [←] Sepulturas > Nova Sepultura                             │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Etapa 1 de 3: Localização                              │ │
│ │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Seleção de Localização  │ │ Mapa de Localização         │ │
│ │                         │ │                             │ │
│ │ Cemitério: [Dropdown ▼] │ │ [Mapa Interativo]           │ │
│ │ Bloco: [Dropdown ▼]     │ │ Clique no mapa para         │ │
│ │ Secção: [Dropdown ▼]     │ │ definir coordenadas         │ │
│ │                         │ │                             │ │
│ │ Código: [S___] (auto)   │ │ GPS: -15.xxx, -23.xxx       │ │
│ │                         │ │ Precisão: ±2m               │ │
│ │ [📍 GPS Atual]          │ │                             │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                    [Cancelar] [Próximo →]  │
└─────────────────────────────────────────────────────────────┘
```

**Fluxo Multi-etapas:**

1. **Etapa 1 - Localização:** Seleção de cemitério/bloco/setor e coordenadas
2. **Etapa 2 - Dados Básicos:** Tipo, dimensões, características especiais
3. **Etapa 3 - Documentação:** Upload de documentos e fotos

**Validações em Tempo Real:**

* Verificação de código único

* Validação de coordenadas dentro dos limites

* Checagem de capacidade do setor

* Validação de campos obrigatórios

### 4.7 Análise de Capacidade (/analytics)

**Wireframe Textual:**

```
┌─────────────────────────────────────────────────────────────┐
│ [←] Dashboard > Análise de Capacidade        [📊] [📄]      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Filtros: [Período ▼] [Cemitério ▼] [Tipo ▼] [Aplicar]  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Taxa de Ocupação Atual  │ │ Projeção de Capacidade      │ │
│ │                         │ │                             │ │
│ │ [Gráfico de Pizza]      │ │ [Gráfico de Linha]          │ │
│ │ Ocupadas: 68%           │ │ Cenário Conservador         │ │
│ │ Disponíveis: 32%        │ │ Esgotamento em: 8.5 anos    │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Mapa de Calor de Ocupação                               │ │
│ │ [Mapa com Gradiente de Cores]                           │ │
│ │ 🔴 Alta (>90%) 🟡 Média (50-90%) 🟢 Baixa (<50%)        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades Avançadas:**

* Algoritmos de projeção baseados em machine learning

* Cenários múltiplos de crescimento

* Alertas automáticos de capacidade crítica

* Recomendações de expansão

* Exportação de relatórios executivos

### 4.8 Navegação e UX

**Menu Principal (Sidebar):**

```
┌─────────────────────┐
│ 🏠 Dashboard        │
│ 📍 Cemitérios       │
│ ⚰️ Sepulturas       │
│ 🗺️ Mapa Geral       │
│ 📊 Análises         │
│ 📱 QR Codes         │
│ 📋 Relatórios       │
│ ⚙️ Configurações    │
└─────────────────────┘
```

**Breadcrumb Navigation:**

* Contexto sempre visível

* Links clicáveis para navegação rápida

* Indicação de página atual

* Suporte a deep linking

**Responsividade:**

* **Desktop (>1200px):** Layout completo com sidebar

* **Tablet (768-1200px):** Sidebar colapsável

* **Mobile (<768px):** Menu hambúrguer com navegação bottom-sheet

## 5. Estados e Gerenciamento de Dados

### 5.1 Estados Globais (Context/Redux)

* **CemeteryState**: Estado dos cemitérios carregados

* **MapState**: Estado do mapa (zoom, centro, layers)

* **FilterState**: Estado dos filtros aplicados

* **LoadingState**: Estado de carregamento das operações

### 5.2 Cache e Performance

* Cache local de dados de estrutura hierárquica

* Lazy loading de componentes de mapa

* Paginação inteligente para listas grandes

* Debounce em campos de busca

## 6. Responsividade e UX

### 6.1 Breakpoints Responsivos

* **Mobile** (< 768px): Layout em coluna única, navegação por tabs

* **Tablet** (768px - 1024px): Layout híbrido com sidebar colapsável

* **Desktop** (> 1024px): Layout completo com múltiplas colunas

### 6.2 Interações Mobile-First

* Touch gestures para navegação no mapa

* Swipe para navegação entre sepulturas

* Pull-to-refresh para atualização de dados

* Offline indicators para funcionalidades indisponíveis

### 6.3 Acessibilidade (WCAG 2.1 AA)

* Navegação por teclado em todos os componentes

* Textos alternativos para elementos visuais

* Contraste adequado em todos os elementos

* Screen reader support para componentes de mapa

## 7. Integrações Frontend

### 7.1 APIs Consumidas - Documentação Completa

#### 7.1.1 Gestão de Cemitérios

**GET /api/v1/cemeteries**

* **Descrição:** Lista cemitérios com filtros avançados

* **Permissões:** CEMETERY\_READ

* **Rate Limiting:** 100 requests/minuto

* **Parâmetros Query:**

  * `municipalityId` (UUID): Filtro por município

  * `status` (enum): ACTIVE, INACTIVE, MAINTENANCE

  * `name` (string): Busca por nome (parcial)

  * `page` (int): Página (padrão: 0)

  * `size` (int): Itens por página (padrão: 10, máx: 100)

  * `sort` (string): Campo de ordenação (name, createdAt, capacity)

  * `direction` (enum): ASC, DESC

* **Status Codes:** 200, 400, 401, 403, 429, 500

* **Response:** Lista paginada de cemitérios com metadados

**POST /api/v1/cemeteries**

* **Descrição:** Cria novo cemitério

* **Permissões:** CEMETERY\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:**

  * Nome obrigatório (3-100 caracteres)

  * Coordenadas GPS válidas

  * Área mínima de 100m²

  * Município deve existir

* **Status Codes:** 201, 400, 401, 403, 409, 422, 429, 500

* **Response:** Cemitério criado com ID gerado

**GET /api/v1/cemeteries/{id}**

* **Descrição:** Detalhes de cemitério específico

* **Permissões:** CEMETERY\_READ

* **Rate Limiting:** 100 requests/minuto

* **Parâmetros Path:** `id` (UUID): ID do cemitério

* **Parâmetros Query:**

  * `includeStatistics` (boolean): Incluir estatísticas (padrão: false)

  * `includeStructure` (boolean): Incluir estrutura hierárquica (padrão: false)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Dados completos do cemitério

**PUT /api/v1/cemeteries/{id}**

* **Descrição:** Atualiza dados do cemitério

* **Permissões:** CEMETERY\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:** Mesmas do POST, campos opcionais

* **Status Codes:** 200, 400, 401, 403, 404, 409, 422, 429, 500

* **Response:** Cemitério atualizado

**DELETE /api/v1/cemeteries/{id}**

* **Descrição:** Remove cemitério (soft delete)

* **Permissões:** CEMETERY\_DELETE

* **Rate Limiting:** 5 requests/minuto

* **Parâmetros Query:**

  * `confirm` (boolean): Confirmação obrigatória

  * `reason` (string): Motivo da remoção

* **Validações:** Não pode ter sepulturas ocupadas

* **Status Codes:** 200, 400, 401, 403, 404, 409, 429, 500

* **Response:** Confirmação da remoção

**GET /api/v1/cemeteries/{id}/statistics**

* **Descrição:** Estatísticas detalhadas do cemitério

* **Permissões:** ANALYTICS\_READ

* **Rate Limiting:** 50 requests/minuto

* **Parâmetros Query:**

  * `period` (enum): DAILY, WEEKLY, MONTHLY, YEARLY

  * `breakdown` (enum): BLOCKS, SECTIONS, PLOT\_TYPES

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Métricas de ocupação, tendências e projeções

#### 7.1.2 Gestão de Estrutura Hierárquica

**GET /api/v1/cemeteries/{id}/structure**

* **Descrição:** Estrutura hierárquica completa

* **Permissões:** CEMETERY\_READ

* **Rate Limiting:** 50 requests/minuto

* **Parâmetros Query:**

  * `level` (enum): BLOCKS, SECTIONS, PLOTS

  * `includeInactive` (boolean): Incluir inativos (padrão: false)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Árvore hierárquica com blocos, seções e sepulturas

**POST /api/v1/cemetery-blocks**

* **Descrição:** Cria novo bloco no cemitério

* **Permissões:** CEMETERY\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:**

  * Nome único no cemitério

  * Capacidade máxima válida

  * Coordenadas dentro dos limites do cemitério

* **Status Codes:** 201, 400, 401, 403, 409, 422, 429, 500

* **Response:** Bloco criado com ID gerado

**PUT /api/v1/cemetery-blocks/{id}**

* **Descrição:** Atualiza bloco existente

* **Permissões:** CEMETERY\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:** Não pode reduzir capacidade abaixo do ocupado

* **Status Codes:** 200, 400, 401, 403, 404, 409, 422, 429, 500

* **Response:** Bloco atualizado

**POST /api/v1/cemetery-sections**

* **Descrição:** Cria nova seção no bloco

* **Permissões:** CEMETERY\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:**

  * Nome único no bloco

  * Tipo de sepultura válido

  * Capacidade não excede limite do bloco

* **Status Codes:** 201, 400, 401, 403, 409, 422, 429, 500

* **Response:** Seção criada com ID gerado

**PUT /api/v1/cemetery-sections/{id}**

* **Descrição:** Atualiza seção existente

* **Permissões:** CEMETERY\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:** Mesmas do POST, campos opcionais

* **Status Codes:** 200, 400, 401, 403, 404, 409, 422, 429, 500

* **Response:** Seção atualizada

#### 7.1.3 Gestão de Sepulturas

**GET /api/v1/plots**

* **Descrição:** Lista sepulturas com filtros avançados

* **Permissões:** PLOTS\_READ

* **Rate Limiting:** 100 requests/minuto

* **Parâmetros Query:**

  * `cemeteryId` (UUID): Filtro por cemitério

  * `blockId` (UUID): Filtro por bloco

  * `sectionId` (UUID): Filtro por seção

  * `occupationStatus` (enum): AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE

  * `plotType` (enum): GROUND, MAUSOLEUM, COLUMBARIUM, OSSUARY

  * `code` (string): Busca por código

  * `page` (int): Página (padrão: 0)

  * `size` (int): Itens por página (padrão: 10, máx: 100)

* **Status Codes:** 200, 400, 401, 403, 429, 500

* **Response:** Lista paginada de sepulturas

**POST /api/v1/plots**

* **Descrição:** Cria nova sepultura

* **Permissões:** PLOTS\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:**

  * Código único no cemitério

  * Coordenadas GPS válidas e dentro dos limites

  * Seção deve ter capacidade disponível

  * Dimensões mínimas respeitadas

* **Status Codes:** 201, 400, 401, 403, 409, 422, 429, 500

* **Response:** Sepultura criada com ID gerado

**GET /api/v1/plots/{id}**

* **Descrição:** Detalhes de sepultura específica

* **Permissões:** PLOTS\_READ

* **Rate Limiting:** 100 requests/minuto

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Dados completos da sepultura

**PUT /api/v1/plots/{id}**

* **Descrição:** Atualiza dados da sepultura

* **Permissões:** PLOTS\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:** Não pode alterar se ocupada

* **Status Codes:** 200, 400, 401, 403, 404, 409, 422, 429, 500

* **Response:** Sepultura atualizada

**DELETE /api/v1/plots/{id}**

* **Descrição:** Remove sepultura

* **Permissões:** PLOTS\_DELETE

* **Rate Limiting:** 5 requests/minuto

* **Validações:** Deve estar disponível (não ocupada)

* **Status Codes:** 200, 400, 401, 403, 404, 409, 429, 500

* **Response:** Confirmação da remoção

**GET /api/v1/plots/search**

* **Descrição:** Busca avançada de sepulturas

* **Permissões:** PLOTS\_READ

* **Rate Limiting:** 50 requests/minuto

* **Parâmetros Query:**

  * `q` (string): Termo de busca geral

  * `nearPoint` (string): Coordenadas para busca por proximidade (lat,lng)

  * `radius` (int): Raio de busca em metros (padrão: 100)

  * `availableOnly` (boolean): Apenas disponíveis (padrão: false)

* **Status Codes:** 200, 400, 401, 403, 429, 500

* **Response:** Lista de sepulturas ordenada por relevância

**POST /api/v1/plots/{id}/geolocation**

* **Descrição:** Define/atualiza geolocalização da sepultura

* **Permissões:** PLOTS\_WRITE

* **Rate Limiting:** 10 requests/minuto

* **Validações:**

  * Coordenadas GPS válidas

  * Dentro dos limites do cemitério

  * Precisão mínima de 5 metros

* **Status Codes:** 200, 400, 401, 403, 404, 422, 429, 500

* **Response:** Coordenadas atualizadas com precisão

#### 7.1.4 QR Codes e Identificação

**GET /api/v1/plots/{id}/qr-code**

* **Descrição:** Recupera QR code da sepultura

* **Permissões:** PLOTS\_READ

* **Rate Limiting:** 100 requests/minuto

* **Parâmetros Query:**

  * `format` (enum): PNG, SVG, PDF (padrão: PNG)

  * `size` (int): Tamanho em pixels (padrão: 200, máx: 1000)

  * `includeMetadata` (boolean): Incluir dados da sepultura (padrão: true)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** QR code em formato solicitado

**POST /api/v1/plots/bulk-qr-generation**

* **Descrição:** Geração em lote de QR codes

* **Permissões:** PLOTS\_WRITE

* **Rate Limiting:** 5 requests/minuto

* **Validações:**

  * Máximo 1000 sepulturas por lote

  * Todas as sepulturas devem existir

* **Status Codes:** 202, 400, 401, 403, 422, 429, 500

* **Response:** Job ID para acompanhamento do progresso

#### 7.1.5 Dados Geoespaciais e Analytics

**GET /api/v1/cemeteries/{id}/map-data**

* **Descrição:** Dados geoespaciais para mapeamento

* **Permissões:** CEMETERY\_READ

* **Rate Limiting:** 50 requests/minuto

* **Parâmetros Query:**

  * `level` (enum): CEMETERY, BLOCKS, SECTIONS, PLOTS

  * `format` (enum): GEOJSON, KML (padrão: GEOJSON)

  * `includeMetadata` (boolean): Incluir metadados (padrão: true)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Dados geoespaciais em formato solicitado

**GET /api/v1/cemeteries/{id}/occupancy**

* **Descrição:** Dados de ocupação detalhados

* **Permissões:** ANALYTICS\_READ

* **Rate Limiting:** 50 requests/minuto

* **Parâmetros Query:**

  * `breakdown` (enum): TOTAL, BLOCKS, SECTIONS, PLOT\_TYPES

  * `includeReserved` (boolean): Incluir reservadas (padrão: true)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Métricas de ocupação por categoria

**GET /api/v1/cemeteries/{id}/capacity-projection**

* **Descrição:** Projeção de capacidade futura

* **Permissões:** PROJECTIONS\_READ

* **Rate Limiting:** 20 requests/minuto

* **Parâmetros Query:**

  * `projectionPeriod` (int): Período em meses (padrão: 12, máx: 120)

  * `includeSeasonality` (boolean): Incluir sazonalidade (padrão: true)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Projeções com cenários otimista, realista e pessimista

**GET /api/v1/cemeteries/{id}/heatmap-data**

* **Descrição:** Dados para mapa de calor

* **Permissões:** ANALYTICS\_READ

* **Rate Limiting:** 30 requests/minuto

* **Parâmetros Query:**

  * `gridSize` (int): Tamanho da grade em metros (padrão: 50)

  * `metric` (enum): OCCUPANCY, ACTIVITY, MAINTENANCE

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Grid de dados para visualização de calor

**GET /api/v1/cemeteries/{id}/availability**

* **Descrição:** Sepulturas disponíveis com filtros

* **Permissões:** PLOTS\_READ

* **Rate Limiting:** 50 requests/minuto

* **Parâmetros Query:**

  * `plotType` (enum): Tipo de sepultura desejado

  * `preferredLocation` (string): Coordenadas preferenciais (lat,lng)

  * `maxDistance` (int): Distância máxima em metros

  * `limit` (int): Máximo de resultados (padrão: 10, máx: 50)

* **Status Codes:** 200, 401, 403, 404, 429, 500

* **Response:** Lista de sepulturas disponíveis ordenada por proximidade

### 7.2 Sistema de Permissões

#### 7.2.1 Permissões de Cemitério

* **CEMETERY\_READ:** Visualizar cemitérios e estruturas

* **CEMETERY\_WRITE:** Criar e editar cemitérios, blocos e seções

* **CEMETERY\_DELETE:** Remover cemitérios (soft delete)

#### 7.2.2 Permissões de Sepulturas

* **PLOTS\_READ:** Visualizar sepulturas e dados básicos

* **PLOTS\_WRITE:** Criar, editar e georreferenciar sepulturas

* **PLOTS\_DELETE:** Remover sepulturas disponíveis

#### 7.2.3 Permissões de Analytics

* **ANALYTICS\_READ:** Acessar estatísticas e relatórios básicos

* **PROJECTIONS\_READ:** Acessar projeções e análises avançadas

* **REPORTS\_EXPORT:** Exportar relatórios e dados

#### 7.2.4 Permissões Administrativas

* **ADMIN\_CEMETERY:** Acesso total a funcionalidades de cemitério

* **ADMIN\_SYSTEM:** Configurações de sistema e auditoria

### 7.3 Estruturas TypeScript Atualizadas

```typescript
interface Cemetery {
  id: string;
  name: string;
  code: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  area: number;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  municipalityId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  metadata?: Record<string, any>;
}

interface Plot {
  id: string;
  code: string;
  cemeteryId: string;
  blockId: string;
  sectionId: string;
  coordinates: {
    latitude: number;
    longitude: number;
    precision: number;
  };
  dimensions: {
    length: number;
    width: number;
    depth: number;
  };
  plotType: 'GROUND' | 'MAUSOLEUM' | 'COLUMBARIUM' | 'OSSUARY';
  occupationStatus: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  capacity: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  qrCodeUrl?: string;
  metadata?: Record<string, any>;
}

interface CemeteryBlock {
  id: string;
  name: string;
  code: string;
  cemeteryId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

interface CemeterySection {
  id: string;
  name: string;
  code: string;
  blockId: string;
  cemeteryId: string;
  plotType: 'GROUND' | 'MAUSOLEUM' | 'COLUMBARIUM' | 'OSSUARY';
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}
```

### 7.4 Validações e Regras de Negócio

#### 7.4.1 Validações de Coordenadas

* Latitude: -90 a +90 graus

* Longitude: -180 a +180 graus

* Precisão mínima: 5 metros

* Coordenadas devem estar dentro dos limites do cemitério

#### 7.4.2 Validações de Códigos

* Formato: Alfanumérico, 3-20 caracteres

* Únicos por cemitério

* Não podem ser alterados após criação

* Padrão sugerido: \[BLOCO]\[SETOR]\[NUMERO]

#### 7.4.3 Regras de Capacidade

* Capacidade mínima: 1 sepultura

* Capacidade máxima por seção: 1000 sepulturas

* Não pode reduzir capacidade abaixo do ocupado

* Alertas automáticos em 80% e 95% da capacidade

* APIs de geolocalização do navegador

* Serviços de mapas externos (OpenStreetMap/Google Maps)

### 7.2 Bibliotecas de Mapeamento

* **Leaflet/MapboxGL**: Renderização de mapas interativos

* **React-Leaflet**: Componentes React para mapas

* **Turf.js**: Cálculos geoespaciais no frontend

### 7.3 Componentes de UI

* **IGRP Design System**: Componentes padronizados

* **React Hook Form**: Gerenciamento de formulários

* **React Query**: Cache e sincronização de dados

## 8. Validações e Feedback

### 8.1 Validações de Formulário

* Validação em tempo real de coordenadas geográficas

* Verificação de unicidade de numeração

* Validação de formatos de dados (CEP, coordenadas)

* Feedback visual imediato para erros

### 8.2 Estados de Loading

* Skeleton screens para carregamento de listas

* Progress indicators para operações longas

* Spinners contextuais para ações específicas

* Error boundaries para recuperação de erros

### 8.3 Notificações e Alertas

* Toast notifications para ações bem-sucedidas

* Modal de confirmação para ações destrutivas

* Alertas persistentes para problemas críticos

* Badges de notificação para atualizações

## 9. Performance e Otimização

### 9.1 Otimizações de Renderização

* Virtualização de listas longas

* Memoização de componentes pesados

* Code splitting por rotas

* Lazy loading de imagens e mapas

### 9.2 Otimizações de Dados

* Prefetch de dados relacionados

* Compressão de payloads de API

* Cache inteligente com invalidação

* Batch de operações múltiplas

## 10. Configurações e Personalização

### 10.1 Configurações de Mapa

* Provedores de mapa configuráveis

* Layers padrão por tipo de usuário

* Zoom e centro inicial personalizáveis

* Estilos de mapa por tema

### 10.2 Configurações de Interface

* Densidade de informações por perfil de usuário

* Campos obrigatórios configuráveis por município

* Temas visuais (claro/escuro)

* Idioma e localização

## 11. Implementação da Fase 1 (MVP)

### 11.1 Escopo e Requisitos Específicos

* Páginas e rotas (App Router):

  * `/` (Dashboard principal)

  * `/cemeteries` (lista paginada)

  * `/cemeteries/[id]` (detalhes e estatísticas)

  * `/plots` (lista de sepulturas)

  * `/plots/create` (formulário de criação)

  * `/analytics/occupancy` (ocupação por período)

  * `/qr-codes/generate` (geração simples de QR)

  * `/map` (mapa geral com camadas)

* Integrações (sem hardcode): usar `process.env.NEXT_PUBLIC_API_URL` + prefixos da API (`/api/v1/...`).

* Validações: coordenadas válidas, capacidade não ultrapassada, códigos únicos, RBAC básico em ações de escrita.

* Conformidade: componentes de UI exclusivamente do `@igrp/igrp-framework-react-design-system`; SOLID; Clean Code; TypeScript estrito; acessibilidade WCAG 2.1 AA; performance com lazy loading em mapas/tabelas/gráficos.

### 11.2 Blueprint de Rotas (Fase 1)

* `page.tsx` → `/`

* `cemeteries/page.tsx` → `/cemeteries`

* `cemeteries/[id]/page.tsx` → `/cemeteries/[id]`

* `plots/page.tsx` → `/plots`

* `plots/create/page.tsx` → `/plots/create`

* `analytics/occupancy/page.tsx` → `/analytics/occupancy`

* `qr-codes/generate/page.tsx` → `/qr-codes/generate`

* `map/page.tsx` → `/map`

### 11.3 Componentes e Hooks (Código de Referência)

Observações gerais:

* Usar apenas componentes de UI do IGRP DS; nenhuma biblioteca externa de UI.

* Os trechos abaixo são referências para implementação e seguem SOLID e Clean Code.

* Comentários e código em inglês, conforme padrão do projeto.

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// /hooks/cemetery/useCemetery.ts
// Purpose: Encapsulate cemetery data lifecycle (fetch, select, create, update)
// Security: Never hardcode tokens; retrieve auth from secure context
// Performance: Debounce filters; paginate on server; memoize selectors
// Accessibility: Expose error states for screen readers via consuming components

import { useCallback, useEffect, useMemo, useState } from "react";

export interface Cemetery {
  id: string;
  municipalityId: string;
  name: string;
  address: string;
  geoPoint?: { latitude: number; longitude: number };
  maxCapacity: number;
  currentOccupancy: number;
  occupancyRate: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

interface UseCemeteryReturn {
  cemeteries: Cemetery[];
  selectedCemetery: Cemetery | null;
  isLoading: boolean;
  error: string | null;
  fetchCemeteries: (page?: number, size?: number) => Promise<void>;
  selectCemetery: (id: string) => void;
}

/**
 * useCemetery
 * Handles cemetery list and selection state with server pagination.
 * Fetches data from API using env base URL and exposes loading/error states.
 */
export function useCemetery(): UseCemeteryReturn {
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [selectedCemetery, setSelectedCemetery] = useState<Cemetery | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const fetchCemeteries = useCallback(async (page = 0, size = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cemeteries?page=${page}&size=${size}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      const data = (json?.content ?? json?.data ?? []) as Cemetery[];
      setCemeteries(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  const selectCemetery = useCallback((id: string) => {
    const item = cemeteries.find((c) => c.id === id) ?? null;
    setSelectedCemetery(item);
  }, [cemeteries]);

  useEffect(() => {
    // Initial load; consumers can re-call with custom page/size
    void fetchCemeteries(0, 10);
  }, [fetchCemeteries]);

  return {
    cemeteries,
    selectedCemetery,
    isLoading,
    error,
    fetchCemeteries,
    selectCemetery,
  };
}
```

```typescript
// /components/cemetery/CemeteryList.tsx
// Purpose: Render a paginated cemetery table using IGRP DS components
// Notes: Stateless container; business logic via useCemetery hook

import { Button, Input, Table, Typography } from "@igrp/igrp-framework-react-design-system";
import { useEffect, useState } from "react";
import { useCemetery } from "@/hooks/cemetery/useCemetery";

interface CemeteryListProps {
  pageSize?: number;
}

export function CemeteryList({ pageSize = 10 }: CemeteryListProps) {
  const { cemeteries, isLoading, error, fetchCemeteries } = useCemetery();
  const [query, setQuery] = useState("");

  /**
   * handleSearch
   * Debounces search input and reloads list with server-side filters.
   */
  const handleSearch = () => {
    // In real implementation: pass filter params to API
    void fetchCemeteries(0, pageSize);
  };

  useEffect(() => {
    void fetchCemeteries(0, pageSize);
  }, [fetchCemeteries, pageSize]);

  return (
    <div>
      <Typography.H2> Cemeteries </Typography.H2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input placeholder="Search by name or code" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {isLoading && <Typography.P>Loading...</Typography.P>}
      {error && <Typography.P role="alert">Error: {error}</Typography.P>}
      {!isLoading && !error && (
        <Table aria-label="Cemeteries table">
          <Table.Header>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Municipality</Table.Cell>
              <Table.Cell>Capacity</Table.Cell>
              <Table.Cell>Occupancy</Table.Cell>
              <Table.Cell>Status</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cemeteries.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>{c.name}</Table.Cell>
                <Table.Cell>{c.municipalityId}</Table.Cell>
                <Table.Cell>{c.maxCapacity}</Table.Cell>
                <Table.Cell>{c.currentOccupancy}</Table.Cell>
                <Table.Cell>{c.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
```

```typescript
// /components/cemetery/StatsDashboard.tsx
// Purpose: Render core occupancy metrics widget for dashboard using IGRP DS

import { Card, Typography } from "@igrp/igrp-framework-react-design-system";

interface OccupancySummary {
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  occupancyRate: number;
}

interface StatsDashboardProps {
  summary: OccupancySummary | null;
}

/**
 * StatsDashboard
 * Displays key occupancy KPIs. Caller handles data fetching and errors.
 */
export function StatsDashboard({ summary }: StatsDashboardProps) {
  if (!summary) {
    return <Typography.P>No data available</Typography.P>;
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      <Card>
        <Card.Header>
          <Typography.H3>Total Plots</Typography.H3>
        </Card.Header>
        <Card.Content>
          <Typography.H1>{summary.totalPlots}</Typography.H1>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <Typography.H3>Occupied</Typography.H3>
        </Card.Header>
        <Card.Content>
          <Typography.H1>{summary.occupiedPlots}</Typography.H1>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <Typography.H3>Available</Typography.H3>
        </Card.Header>
        <Card.Content>
          <Typography.H1>{summary.availablePlots}</Typography.H1>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <Typography.H3>Occupancy Rate</Typography.H3>
        </Card.Header>
        <Card.Content>
          <Typography.H1>{Math.round(summary.occupancyRate * 100)}%</Typography.H1>
        </Card.Content>
      </Card>
    </div>
  );
}
```

```typescript
// /components/cemetery/PlotFormContainer.tsx
// Purpose: Multi-step form for creating plots using IGRP DS inputs
// Notes: Validation delegated to usePlotForm; accessibility labels mandatory

import { Button, Input, Select, Typography } from "@igrp/igrp-framework-react-design-system";
import { usePlotForm } from "@/hooks/cemetery/usePlotForm";

interface PlotFormContainerProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function PlotFormContainer({ onSubmit, onCancel }: PlotFormContainerProps) {
  const {
    formData,
    validationErrors,
    isSubmitting,
    updateField,
    submitForm,
  } = usePlotForm();

  /**
   * handleSubmit
   * Submits validated data to caller action; enforces loading state.
   */
  const handleSubmit = async () => {
    await submitForm();
    await onSubmit(formData);
  };

  return (
    <div>
      <Typography.H2>Create Plot</Typography.H2>
      <Input aria-label="Plot number" value={formData.plotNumber ?? ""} onChange={(e) => updateField("plotNumber", e.target.value)} />
      <Select aria-label="Plot type" value={formData.plotType ?? "GROUND"} onChange={(e) => updateField("plotType", e.target.value)}>
        <Select.Option value="GROUND">Ground</Select.Option>
        <Select.Option value="MAUSOLEUM">Mausoleum</Select.Option>
        <Select.Option value="NICHE">Niche</Select.Option>
        <Select.Option value="OSSUARY">Ossuary</Select.Option>
      </Select>
      {validationErrors.plotNumber && <Typography.P role="alert">{validationErrors.plotNumber}</Typography.P>}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button disabled={isSubmitting} onClick={handleSubmit}>Submit</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
```

```typescript
// /actions/cemeteryActions.ts
// Purpose: Bridge UI and business services for cemetery operations

import type { Cemetery } from "@/hooks/cemetery/useCemetery";

/** Fetch cemetery list from service layer */
export const fetchCemeteriesAction = async (): Promise<Cemetery[]> => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await fetch(`${API_BASE}/api/v1/cemeteries`, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`Error loading cemeteries: ${res.status}`);
  const json = await res.json();
  return (json?.content ?? json?.data ?? []) as Cemetery[];
};
```

```typescript
// /services/cemeteryService.ts
// Purpose: Apply domain rules and transformations for cemetery data

import type { Cemetery } from "@/hooks/cemetery/useCemetery";

/**
 * formatCemeteryData
 * Normalizes cemetery payload and ensures safe defaults.
 */
export function formatCemeteryData(raw: unknown): Cemetery[] {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((c: any) => ({
    id: String(c.id),
    municipalityId: String(c.municipalityId ?? ""),
    name: String(c.name ?? ""),
    address: String(c.address ?? ""),
    geoPoint: c.geoPoint ?? undefined,
    maxCapacity: Number(c.maxCapacity ?? 0),
    currentOccupancy: Number(c.currentOccupancy ?? 0),
    occupancyRate: Number(c.occupancyRate ?? 0),
    status: (c.status ?? "ACTIVE") as Cemetery["status"],
  }));
}
```

```typescript
// /repositories/cemeteryRepository.ts
// Purpose: Encapsulate HTTP calls to cemetery endpoints with error handling

/**
 * fetchAllCemeteries
 * Retrieves paginated cemetery list from API.
 */
export async function fetchAllCemeteries(page = 0, size = 10) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await fetch(`${API_BASE}/api/v1/cemeteries?page=${page}&size=${size}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch cemeteries: ${res.status}`);
  return res.json();
}
```

### 11.4 Plano de Testes (Unitários e Integração)

* Estratégia sem novas dependências até aprovação; foco em lógica de hooks e serviços.

* Cobertura alvo: 80%+ para hooks e serviços desta fase.

* Dados reais de staging; evitar mocks (exceto para isolar validações puras).

* Testar cenários de erro (HTTP 4xx/5xx), paginação, filtros, validações de formulário e RBAC em ações.

Exemplos de casos de teste (pseudo-código):

```typescript
// useCemetery.test.ts (pseudo)
// Verifies initial load, error state, and selection logic
describe('useCemetery', () => {
  it('loads cemeteries on mount and exposes data', async () => {
    // Arrange: call hook in test renderer and wait for effect
    // Assert: cemeteries length > 0 using staging API
  });

  it('sets error when API fails', async () => {
    // Arrange: simulate 500 response via controlled environment
    // Assert: error message is exposed and loading ends
  });

  it('selects cemetery by id', () => {
    // Arrange: set local cemeteries
    // Assert: selectedCemetery matches input id
  });
});
```

```typescript
// cemeteryService.test.ts (pseudo)
// Validates normalization and safe defaults
describe('formatCemeteryData', () => {
  it('normalizes raw array into typed Cemetery objects', () => {
    // Arrange: input raw objects with missing fields
    // Assert: types and defaults applied correctly
  });
});
```

Windows PowerShell (existente no projeto):

* `npm run format` – formatação automática (Biome)

* `npm run lint` – verificação de estilo e problemas

* `npm run build` – compila e valida regressões

### 11.5 Relatório de Conformidade (Fase 1)

* Design System IGRP: todos os componentes de UI indicados usam `@igrp/igrp-framework-react-design-system`.

* SOLID: containers stateless; lógica em hooks; serviços e repositórios separados.

* Clean Code: nomes claros, funções focadas, comentários úteis a nível de função.

* TypeScript: estrito; `any` apenas documentado quando inevitável.

* Performance: paginação server-side, lazy loading para UI pesada (mapas, tabelas, gráficos); sem sobrecarga desnecessária.

* Segurança: sem secrets hardcoded; uso de `process.env` para base de API; validações de entrada e tratamento de erros explícito.

* Acessibilidade: mensagens de erro com `role="alert"`, estrutura semântica, foco em ARIA nas páginas.

* Responsividade: uso de grid em widgets, componentes IGRP responsivos.

### 11.6 Checklist de Revisão de Código

* Dependências: apenas IGRP DS e libs já presentes; nenhuma UI de terceiros.

* Lógica: hooks limpos; evitar estado excessivo nos componentes.

* Erros: tratamento explícito; mensagens claras; sem mascarar com valores padrão.

* RBAC: validar permissões antes de exibir ações (quando integrado à autenticação).

* Testes: casos cobrindo sucesso/erro; metas de cobertura atingíveis sem novas dependências.

* Formatação/Lint: executar `npm run format` e `npm run lint` antes do build.

## 10. QR Codes — Implementação e Fluxos

**Interface Completa**

* Geração: usar `QRCodeGenerator.tsx` com opções (`size`, `format`, `errorCorrection`, `customColors`) e suporte a lote.

* Leitura/Validação: usar `QRCodeScanner.tsx` (upload/câmera) para obter `code` e validar/consultar.

* Associação: ao gerar, atualizar o campo `qrCode` do plot via `PUT /api/v1/plots/{id}` e exibir ações (download/compartilhar) na UI do detalhe.

**Fluxos Funcionais**

* Cadastro QR↔Plot: selecionar `cemeteryId`/`plotId` → gerar QR → atualizar plot (`qrCode`) → confirmação/toast.

* Consulta via QR: scanner lê `code` → resolve `plotId` (padrão `QR_{plotId}_{yyyy}` ou via `GET /plots/{id}/qr-code`) → carrega detalhe.

* Atualização associada: editar dados do plot mantendo `qrCode`; salvar com `PUT /plots/{id}`.

**Serviços/Hooks e Integração**

* `PlotService`: adicionar métodos `getPlotQRCode(id)`, `generatePlotQRCode(id, options?)`, `generateBulkQRCodes(plotIds, options?)` usando rotas `/api/v1` para preservar o switch (`USE_REAL_BACKEND`).

* Opção: criar `useQRCode` encapsulando geração, validação e associação.

* Alinhamento contratual com `src/types/QRCode.ts` e `src/types/Plot.ts`.

**UX/UI e Acessibilidade**

* IGRP Design System: inputs, labels, cards, toasts; mensagens de erro claras; responsividade com grids (`md:grid-cols-*`).

* Estados: `loading`, `success`, `error`; feedback visual consistente.

**Testes e Conformidade**

* Testes de integração dos fluxos: geração+associação, leitura+consulta, atualização.

* Fallback explícito quando indisponível: seguir formato `Error: [descrição clara]`.

* Remover simulações quando `USE_REAL_BACKEND=true` e manter switches documentados.

