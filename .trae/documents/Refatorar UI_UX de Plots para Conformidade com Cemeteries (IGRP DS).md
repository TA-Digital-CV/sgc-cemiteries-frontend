## Análise Técnica
- Ler e mapear padrões da página de referência `cemeteries/page.tsx` (header com ações, uso de `IGRPButton`, separação de métricas/lista, tokens e espaçamentos padrão).
- Auditar `plots/page.tsx` e comparar:
  - Header: ajustar título/ações para padrão do DS.
  - Filtros: alinhar grid, labels, inputs e `IGRPSelect` aos espaçamentos/tokens do DS.
  - Erros: substituir bloco custom por card/alert do DS.
  - Ações de linha: padronizar variantes (`outline`, `ghost`), ícones e estados.
  - Responsividade: replicar breakpoints e espaçamentos usados em `cemeteries/page.tsx`.
  - Permissões: manter gating por `NEXT_PUBLIC_PERMISSIONS` como em `cemeteries`.

## Implementação Técnica
- Reestruturar layout de `plots/page.tsx`:
  - Header com grid padrão (título à esquerda, ações à direita: link para “Busca Avançada”).
  - Card de filtros: usar grid 5 colunas com `IGRPSelect` (cemitério, bloco, seção), `IGRPInputText` (busca), botão “Recarregar”. Remover HTML nativo quando existir componente no DS equivalente.
  - Erros: trocar o container atual por um `IGRPCard` com conteúdo e ícone (AlertTriangle), mantendo contraste e semântica.
  - Tabela: alinhar com `IGRPDataTable` como em `cemeteries`, com `IGRPDataTableHeaderSortToggle`, mantendo colunas Número/Tipo/Status/Ações e estados disabled coerentes.
  - Padronizar tokens (margens/gaps/tipografia) seguindo `cemeteries/page.tsx` (container, `space-y-6`, `flex gap-2`).
  - Estados de interação: garantir hover/active/disabled consistentes do DS em botões e selects (sem CSS customizado).
  - Responsividade: validar em 3 breakpoints (mobile, tablet, desktop) com o mesmo grid do DS.
  - Tipos: revisar `Plot`/`PlotFormData` uso e remover casts desnecessários, garantindo TypeScript estrito.

## Validação de Qualidade
- Testar visualmente em 3 dispositivos (emulador ou dimensões): 360x640 (mobile), 768x1024 (tablet), 1440x900 (desktop).
- Acessibilidade:
  - Labels presentes em todos inputs/selects, hierarquia semântica preservada.
  - Foco de teclado navegável; mensagens de erro com roles adequados.
- Performance: verificar render sem regressões; memoização para filtros; evitar re-render desnecessário.
- Funcional: manter criação/edição de plots, reserva/ocupação/cancelamento e busca avançada intactos.

## Documentação Técnica
- Em comentários de nível de função no arquivo `plots/page.tsx`:
  - Explicar propósito dos cards (header, filtros, tabela) e decisões de padronização com DS.
  - Documentar estados e por que certos componentes do DS foram escolhidos.
- Checklist para manutenção:
  - Header conforme DS, filtros em grid IGRP, tabela com `IGRPDataTable`, erros em `IGRPCard`, estados disabled consistentes, gating por permissões.
- Atualizar storybook (se houver) com variações de filtros e tabela (mobile/desktop).

## Critérios de Aceitação
- Conformidade visual 100% com `cemeteries/page.tsx` (estrutura, componentes, tokens de design).
- Zero regressões funcionais (CRUD/ações de reserva/ocupação/cancelamento/consulta permanecem).
- Código usando exclusivamente IGRP Design System.
- Comentários técnicos presentes e úteis.
- Validação em 3 resoluções aprovada.

## Observações
- Não criar novos arquivos além de comentários técnicos e ajustes no arquivo existente.
- Manter placeholders e comportamento de `cemeteries/page.tsx` como referência sem alterá-lo.
- Se necessário, adicionaremos paginação visual consistente com DS sem alterar contratos do hook.