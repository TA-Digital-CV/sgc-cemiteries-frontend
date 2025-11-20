## Análise Atual
- `sgmm-mercados-frontend`:
  - `src/app/(igrp)/markets/map/page.tsx`: página simples com `IGRPPageHeader` e `MarketMapViewer showAllMarkets`.
  - `src/app/(igrp)/markets/[id]/page.tsx`: usa `useMarket` para carregar detalhe e exibe `MarketDetails`; padrão de composição UI+hook com loading.
- `sgc-cemiteries-frontend` (onde vamos implementar):
  - Página: `src/app/(igrp)/maps/page.tsx` já compõe abas “Visualizador”, “Camadas”, “Busca”, “Exportar” e usa `MapViewer` e `MapLayers`.
  - Viewer: `src/components/maps/MapViewer.tsx` contém UI completa de controles, busca, filtros, placeholders e integração com `useMap`.
  - Camadas: `src/components/maps/MapLayers.tsx` lista camadas, alterna visibilidade e exibe estatísticas.
  - Hook: `src/app/(myapp)/hooks/useMap.ts` já busca `BLOCKS`, `PLOTS` e `HEATMAP` em `/api/v1/cemeteries/{id}/...`; faltam `SECTIONS` e estilos dinâmicos por ocupação.
  - Tipos: `src/app/(myapp)/types/Map.ts` suportam `LayerType`, `LayerStyle`, `MapControls`, etc.
  - Guia técnico: `.trae/documents/implementation_guide.md` e `FE-01-Cemiterio.md` exigem camadas múltiplas, hierarquia completa, legenda dinâmica e diferenciação ocupada/disponível.

## Objetivos de Implementação
- Suportar camadas: Cemitérios (base), Blocos, Setores, Sepulturas, Heatmap.
- Implementar navegação hierárquica: cemitérios → blocos → setores → plots, com breadcrumb/seleção.
- Estilos visuais distintos por nível e por status (ocupada/disponível/reservada/manutenção).
- Controles completos: zoom, navegação, centralizar, exportar, imprimir, alternância de camadas.
- Legenda dinâmica baseada em estilos e status.
- Testes de validação cobrindo renderização de camadas, navegação e consistência de dados.

## Alterações Planejadas (Arquivos)
### 1) Hook de Mapas
- Arquivo: `src/app/(myapp)/hooks/useMap.ts`
- Ações:
  - Adicionar carregamento de níveis faltantes:
    - `fetchBlocks(cemeteryId)` → `GET /api/v1/cemeteries/{id}/map-data?level=BLOCKS&format=GEOJSON`
    - `fetchSections(cemeteryId)` → `GET /api/v1/cemeteries/{id}/map-data?level=SECTIONS&format=GEOJSON`
    - Reestruturar `fetchMapData` para montar `MapData.layers` com `blocks` e `sections` além do `plots` já existente
  - Ocupação e estilos:
    - `fetchOccupancy(cemeteryId)` → `GET /api/v1/cemeteries/{id}/occupancy?breakdown=PLOT_TYPES`
    - Mapear cores por status: available (verde `#22c55e`), occupied (vermelho `#ef4444`), reserved (amarelo `#f59e0b`), maintenance (laranja `#fb923c`)
    - Aplicar `LayerStyle` em `plots` por `feature.properties.occupationStatus` (quando disponível) ou por join de ocupação
  - Hierarquia (navegação):
    - Expor `setActiveLevel(level: 'CEMETERY'|'BLOCKS'|'SECTIONS'|'PLOTS')`
    - Expor `zoomToBounds(bounds)` e `focusOnFeature(id)` para navegação entre níveis
  - Legenda:
    - Expor `legendItems: {label:string;color:string}[]` conforme camadas e status ativos
  - Manter APIs existentes (`fetchHeatmapData`, `toggleLayer`, `centerOnLocation`, `exportMap`, `printMap`) e adicionar `minZoom/maxZoom` por camada (tipos suportados já em `MapLayer`).
- Referências de inserção:
  - Após `fetchLayers` atual: `src/app/(myapp)/hooks/useMap.ts:191–220`
  - Mapeamento de marcadores: `src/app/(myapp)/hooks/useMap.ts:226–270`

### 2) Visualizador de Mapas
- Arquivo: `src/components/maps/MapViewer.tsx`
- Ações:
  - Trocar placeholder por renderização real quando aprovado (Exceção do FE-01): integrar `Leaflet/MapLibre` via wrapper, mantendo UI IGRP.
  - Incluir breadcrumb/hierarquia (topo do card) e comutação de nível:
    - Botões/Select para níveis: Cemitério → Blocos → Setores → Sepulturas
    - Ao alterar nível, chamar `setActiveLevel` e `zoomToBounds`
  - Legenda dinâmica:
    - Seção “Legenda” abaixo do mapa mostrando cores por status e por camada ativa
  - Diferença visual ocupada/disponível:
    - Aplicar cor/outline no overlay dos `plots` e ícones para `markers` segundo status
  - Controles de zoom/navegação mantidos; conectar com viewport do hook
- Referências de inserção:
  - Header e controles: `src/components/maps/MapViewer.tsx:224–276` e `412–442`
  - Área do mapa: `src/components/maps/MapViewer.tsx:444–467`
  - Camadas/legenda UI: `src/components/maps/MapViewer.tsx:468–501`

### 3) Gerenciador de Camadas
- Arquivo: `src/components/maps/MapLayers.tsx`
- Ações:
  - Adicionar contadores por camada e status quando disponível
  - Mostrar `minZoom/maxZoom` e z-index de cada camada
  - Botão “Ocultar/Mostrar todas” e filtros por status
- Referências: `src/components/maps/MapLayers.tsx:253–353` e `382–435`

### 4) Página de Mapas (IGRP)
- Arquivo: `src/app/(igrp)/maps/page.tsx`
- Ações:
  - Substituir cabeçalho manual por `IGRPPageHeader` para seguir DS
  - Adicionar seleção de cemitério (combobox) que injeta `cemeteryId` em `MapViewer`/`MapLayers`
  - Navegação entre abas mantém-se; integrar novos callbacks de nível e legenda
- Referências: `src/app/(igrp)/maps/page.tsx:46–70` (cabeçalho) e `99–146` (aba viewer)

## Estilos e Legenda
- Camadas e cores:
  - Blocos: cinza (`stroke:#6b7280` / `fill:#f3f4f6`)
  - Setores: verde (`stroke:#10b981` / `fill:#d1fae5`)
  - Plots:
    - Available: `#22c55e`
    - Occupied: `#ef4444`
    - Reserved: `#f59e0b`
    - Maintenance: `#fb923c`
- Legenda dinâmica por camada/status usando `IGRPCard`, `IGRPBadge`, `IGRPIcon`.

## Dados e Endpoints (FE-01)
- `GET /api/v1/cemeteries/{id}/map-data?level=CEMETERY|BLOCKS|SECTIONS|PLOTS&format=GEOJSON`
- `GET /api/v1/cemeteries/{id}/occupancy?breakdown=BLOCKS|SECTIONS|PLOT_TYPES`
- `GET /api/v1/cemeteries/{id}/heatmap-data?gridSize=50&metric=OCCUPANCY`
- Sem dados: exibir “No data available” conforme guia; sem mocks persistentes.

## Testes de Validação
- Ferramentas: `vitest` + `@testing-library/react` já presentes.
- Casos:
  - `useMap` monta camadas `blocks`, `sections`, `plots` com estilos distintos
  - Alternância de camadas não altera contagem de itens
  - Navegação de nível foca bounds e não gera erro
  - Legenda reflete status conforme dados de ocupação
  - Exportar/Imprimir retornam sucesso e estados de loading/erro coerentes
- Local: `src/tests/maps.useMap.test.ts` e `src/tests/maps.viewer.test.ts` (após aprovação)

## Dependências Externas (Map Render)
- Seguir Exceção 1 do FE-01:
  - Propor `leaflet` + `react-leaflet` (ou `maplibre-gl`) somente para renderização
  - UI continua 100% IGRP DS; sem UI externa
  - Adição de dependência condicionada à sua aprovação explícita

## Entregáveis
- Código atualizado nos quatro arquivos citados
- Estilos e legenda funcionais conforme status
- Navegação hierárquica entre níveis com breadcrumbs/seletores
- Testes unitários cobrindo hook e viewer
- Sem novas rotas ou arquivos além dos existentes (seguindo regra do usuário)

## Riscos e Mitigações
- Ausência de biblioteca de mapas: manter placeholder temporário, focar em dados, camadas e legenda; integrar renderização após aprovação.
- Dados incompletos/variáveis: validar e normalizar propriedades das features (tipos estritos, safe defaults).
- Performance: lazy load de camadas pesadas e limitar render pelo `zoom` via `minZoom/maxZoom`.

## Próximo Passo
- Com sua confirmação, edito os arquivos existentes e, caso aprove, adiciono a lib de mapas para renderização real, mantendo conformidade com o Design System IGRP e o guia FE-01.