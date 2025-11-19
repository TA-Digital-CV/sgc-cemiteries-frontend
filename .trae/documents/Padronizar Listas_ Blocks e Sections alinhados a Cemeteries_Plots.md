## Padrão de Listas Identificado
- **Composição**
  - `CemeteriesPage` usa componente dedicado de lista: `CemeteryList` (c:/projects/my-workspace/projects/sgc-cemiteries-frontend/src/app/(myapp)/(pages)/cemeteries/page.tsx:83).
  - `PlotsPage` renderiza lista diretamente com filtros e `IGRPDataTable` (c:/projects/.../plots/page.tsx:292–545).
- **Header**
  - `CemeteriesPage`: header simples com `IGRPButton` de ações (cemeteries/page.tsx:34–75).
  - `PlotsPage`: `IGRPPageHeader` padronizado (plots/page.tsx:281–290).
- **Filtros Básicos**
  - Barra de busca com ícone e botão “Filtros” (plots/page.tsx:296–316).
  - Grid com `IGRPSelect` para escopo (Cemitério/Bloco/Seção) e botão “Recarregar” (plots/page.tsx:318–359).
- **Renderização Condicional**
  - Estado de carregamento com spinner (plots/page.tsx:363–371).
- **Tabela**
  - `IGRPDataTable` com cabeçalhos sortáveis via `IGRPDataTableHeaderSortToggle` (plots/page.tsx:374–396; 398–419).
  - **Ações**: `IGRPDataTableRowAction` + `IGRPDataTableButtonLink` + `IGRPDataTableDropdownMenu` com itens condicionais (plots/page.tsx:420–535).
- **Gestão de Estado**
  - Hooks: `useCemetery` e `usePlot`; estados locais `searchTerm`, seleções de filtros, e form/edição (plots/page.tsx:64–78).
  - **Efeitos**: carregamentos encadeados de blocos/seções conforme seleção (plots/page.tsx:81–94).
- **Tratamento de Dados**
  - `useMemo` para filtrar dados por termo e escopo (plots/page.tsx:96–113).
  - Badge de ocupação com mapeamento de cor e tooltip (plots/page.tsx:115–146, 404–418).
- **Estilização**
  - Classes utilitárias Tailwind e variantes/ícones do design system (plots/page.tsx:296–316, 352–371).
- **Paginação**
  - Não utilizada no padrão atual; `CemeteryList` tinha paginação comentada e não ativa.

## Diretrizes de Refatoração
- **Objetivo**: Alinhar `BlocksPage` e `SectionsPage` ao padrão de `PlotsPage`/`CemeteryList`.
- **Impactos**: Remover paginação manual em `BlocksPage`; adotar barra de busca, grid de filtros, spinner de loading, `IGRPDataTable` com cabeçalhos sortáveis e ações padronizadas via `RowAction` + `DropdownMenu`.
- **Erros/Notificações**: Padronizar com `useIGRPToast` em ambos os arquivos; remover banners inline de erro.

## Alterações Específicas — BlocksPage
- **Header**: Trocar o header atual por `IGRPPageHeader` com título/descrição (blocks/page.tsx:68–75).
- **Filtros**:
  - Adicionar barra de busca (`IGRPInputText` com ícone `Search`) e botão “Filtros”.
  - Manter `IGRPSelect` de Cemitério e “Recarregar” com mesma disposição do grid (plots/page.tsx:318–359).
- **Estado e Efeitos**:
  - Manter `selectedCemeteryId` e carregamento de blocos via `useEffect`; remover estados `page` e `size` e a paginação manual (blocks/page.tsx:42–44, 59–64, 118–133).
  - Adicionar `searchTerm` e `useMemo` para filtrar nome do bloco.
- **Tabela**:
  - Aplicar `IGRPDataTable` com cabeçalhos sortáveis (Nome, Capacidade, Ocupação) usando `IGRPDataTableHeaderSortToggle`.
  - Substituir ações por `IGRPDataTableRowAction` com `IGRPDataTableButtonLink` e `IGRPDataTableDropdownMenu` (seguir o padrão de `PlotsPage`: 420–535).
- **Erros/Toasts**:
  - Remover card de erro (blocks/page.tsx:138–155) e disparar `igrpToast` em falhas de carregamento/ação.

## Alterações Específicas — SectionsPage
- **Header**: Substituir pelo `IGRPPageHeader` para consistência (sections/page.tsx:136–146).
- **Filtros**:
  - Manter selects de Cemitério/Bloco e adicionar barra de busca e botão “Filtros” com mesma estrutura.
- **Estado e Efeitos**:
  - Adicionar `searchTerm` (replaces `search`) e `useMemo` para filtrar por nome.
  - Manter cascata de carregamentos (`fetchBlocks`, `fetchSections`).
- **Tabela e Ações**:
  - `IGRPDataTable` com cabeçalhos sortáveis.
  - Converter botão “Editar” inline para `IGRPDataTableRowAction` + `IGRPDataTableButtonLink` ou menu com itens (Editar, etc.).
- **CRUD Inline**:
  - Opcionalmente mover o formulário de criação/edição para modal ou manter como card separado; o padrão de listas não inclui CRUD inline em `PlotsPage`, então focar apenas na listagem e ações.
- **Erros/Toasts**:
  - Hoje o código silencia erros no `handleCreate`/`handleUpdate`; substituir por `igrpToast` para `error/success` e remover no-ops (sections/page.tsx:88–105, 107–124).

## Convenções e Consistência
- **Imports**: Usar exclusivamente componentes do design system e hooks existentes.
- **Nomenclatura**: `searchTerm`, `selectedCemeteryId`, `selectedBlockId`, `selectedSectionId`.
- **Estilo**: `rounded-md border` para a tabela, grid `md:grid-cols-4`, spinner `RefreshCw` quando `isLoading`.
- **Acessibilidade**: Badge com `title` (tooltip) e ícones padronizados via componentes.

## Verificação
- **Funcional****:
  - Carregamento encadeado de filtros (cemitério → bloco → seção).
  - Busca por termo funciona nas listas.
  - Ações de tabela aparecem/ocultam conforme estado/permissões.
- **UX Consistência**:
  - Layout, espaçamentos e responsividade equivalentes às páginas de referência.
- **Notificações**:
  - Erros e sucessos visíveis via `igrpToast` (sem `alert` ou banners inline).
- **Testes**:
  - Rodar a aplicação e validar as páginas; adicionar testes leves de utilitários de filtro se necessário.

## Solicitação
- Confirmar o plano para proceder com a refatoração dos arquivos `blocks/page.tsx` e `sections/page.tsx` seguindo o padrão descrito acima. 