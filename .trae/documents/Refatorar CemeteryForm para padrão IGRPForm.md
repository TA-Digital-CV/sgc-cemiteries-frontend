## Objetivo
- Refatorar `src/components/cemeteries/CemeteryForm.tsx` para seguir exatamente o padrão do componente gerado (`my-test-app/src/components/formcomponent.tsx`): organização, nomenclatura, tipagem, validação com Zod integrada ao `IGRPForm`, tratamento de erros e responsabilidade única, preservando todas as funcionalidades e compatibilidade.

## Referências
- Componente atual: `src/components/cemeteries/CemeteryForm.tsx` (função `handleSubmit` em `CemeteryForm.tsx:95`, JSX principal em `CemeteryForm.tsx:138`).
- Padrão alvo: `my-test-app/src/components/formcomponent.tsx` (uso de `IGRPForm`, `IGRPFormHandle`, `schema`, `defaultValues`, `validationMode`, inputs com `name`).

## Arquitetura Alvo
- Imports: alinhar ao padrão, adicionando `IGRPForm`, `IGRPFormHandle`, `IGRPHeadline`, `IGRPInputNumber`, `cn`, `useIGRPToast` do design system.
- Schema Zod: declarar `formCemetery` (equivalente ao `form1`) com validações atuais; manter nested `geoPoint` e `metadata.contact`.
- Tipos e Defaults:
  - `type FormCemeteryZodType = typeof formCemetery`.
  - `initFormCemetery: z.infer<FormCemeteryZodType>` com valores do `cemetery` (prefill), preservando defaults existentes.
- Refs e Estado:
  - `const formCemeteryRef = useRef<IGRPFormHandle<FormCemeteryZodType> | null>(null)`.
  - `const [cemeteryFormData, setCemeteryFormData] = useState(initFormCemetery)`.
  - `const { igrpToast } = useIGRPToast()`.
  - Manter `isSubmitting`, `submitError`, `submitSuccess`.

## Validação e Submissão
- Envolver todo o conteúdo em `<IGRPForm>` com:
  - `schema={formCemetery}`
  - `validationMode="onBlur"`
  - `formRef={formCemeteryRef}`
  - `defaultValues={cemeteryFormData}`
  - `onSubmit={onSubmitCemetery}`
- `onSubmitCemetery(data)`:
  - Realizar limpeza de `metadata` (remover quando `contact` vazio), preservando regra atual (`CemeteryForm.tsx:95-106`).
  - Chamar `onSubmit(parsedData)` e tratar sucesso/erro como hoje; exibir toast de sucesso/erro; acionar `onCancel` após 1500ms.

## JSX e Inputs
- Substituir `value`/`onChange` por inputs controlados pelo `IGRPForm` com `name` e `label`:
  - `municipalityId`, `name`, `address` → `IGRPInputText`.
  - `geoPoint.latitude`, `geoPoint.longitude` → `IGRPInputNumber` (garantir limites do schema).
  - `totalArea`, `maxCapacity` → `IGRPInputNumber`.
  - `metadata.contact.phone`, `metadata.contact.email`, `metadata.contact.responsible` → `IGRPInputText`.
- Manter a hierarquia visual com `IGRPCard`, `IGRPCardHeader`, `IGRPCardContent` e mensagens de erro/sucesso com `IGRPIcon`.
- Título/Descrição: adicionar `IGRPHeadline` conforme padrão gerado, reutilizando textos existentes.
- Ações:
  - Botão Cancelar (`IGRPButton` `type="button"` → `onClick={onCancel}`).
  - Botão Salvar (`IGRPButton` `type="submit"` dentro do `IGRPForm`), mantendo loading e ícone conforme atual.

## Nomenclatura e Organização
- Seguir o padrão do arquivo gerado:
  - Ordem: `"use client"` → ESLint disables (quando necessário) → imports → tipos → schema → defaults → refs/estado → handlers → JSX.
  - Nomes: `formCemetery`, `FormCemeteryZodType`, `initFormCemetery`, `formCemeteryRef`, `cemeteryFormData`, `onSubmitCemetery`.

## Compatibilidade
- Não alterar `CemeteryFormProps` nem o contrato de `onSubmit`/`onCancel`.
- Manter `className` aplicado em `IGRPCard`.
- Preservar textos e placeholders em PT-BR.
- Confirmado que o projeto possui `@igrp/igrp-framework-react-design-system@0.1.0-beta.26` e `zod` (package.json), compatíveis com o padrão.

## Testes (temporários para validação)
- Adicionar testes unitários e de integração, executar, e remover após validação (conforme regras):
  - Unitários (Vitest + Testing Library):
    - Validação Zod: campos obrigatórios e limites de latitude/longitude, `totalArea`/`maxCapacity` > 0.
    - Defaults: prefill a partir de `cemetery` prop.
    - Limpeza de `metadata`: remover quando `contact` vazio; manter quando algum campo presente.
    - `onSubmit` chamado com dados parseados.
  - Integração:
    - Renderizar componente, preencher campos, observar mensagens de validação do `IGRPForm`.
    - Simular erro de backend e verificar mensagem global.
    - Simular sucesso e verificar toast/mensagem e chamada de `onCancel`.
- Dependências de teste (dev): `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`. Instalar apenas para execução dos testes e remover arquivos após concluído.

## Entregáveis
- Código refatorado de `CemeteryForm.tsx` seguindo padrão `IGRPForm`.
- Testes unitários e de integração executados localmente, com relatório de resultados.
- Remoção dos arquivos de teste após validação, mantendo o repositório limpo.

## Plano de Execução
1. Reorganizar imports e adicionar componentes necessários.
2. Implementar `formCemetery` (Zod) e tipos/defaults.
3. Criar `formCemeteryRef`, estados e `onSubmitCemetery`.
4. Migrar JSX para `IGRPForm` e inputs com `name`.
5. Preservar feedback visual e botões.
6. Validar manualmente no preview.
7. Criar e rodar testes; corrigir qualquer falha imediatamente.
8. Remover arquivos de teste e finalizar.

## Risco e Mitigações
- Suporte a nomes nested (`geoPoint.latitude`): se o `IGRPForm` não suportar path nested, usaremos `Controller`/estratégia equivalente do design system para campos nested preservando o padrão visual.
- Impedimentos de dependências de teste: caso não seja autorizado adicionar devDeps, validaremos via preview manual e logs estruturados do `IGRPForm` e forneceremos script de verificação alternativa.
