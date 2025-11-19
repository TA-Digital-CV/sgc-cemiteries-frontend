## Diagnóstico
- O build falha porque `next/font/google` tenta baixar as fontes (Geist, Geist Mono, Inter, Mulish) durante a compilação e a rede para `https://fonts.googleapis.com` está indisponível/bloqueada.
- Em Next 15, o mecanismo de fonte faz o download em tempo de build; sem acesso, o build quebra.

## Estratégias de Correção
### Opção A: Infra/Network
- Garantir saída HTTPS para `fonts.googleapis.com` e `fonts.gstatic.com` no ambiente de build.
- Reexecutar `pnpm build` após desbloqueio.

### Opção B: Código (recomendada para builds offline)
- Substituir `next/font/google` por `next/font/local` e self-host das fontes.
- Adicionar stack de fontes de fallback de sistema para ambientes sem as fontes locais.
- Implementar chave de ambiente para alternância (ex.: `USE_LOCAL_FONTS=true` em dev/CI/offline), mantendo Google Fonts em ambientes com internet se preferido.

## Passos Técnicos (Opção B)
1. Auditar o código por imports de `next/font/google` (geralmente em `src/app/layout.tsx` ou tema). 
2. Substituir por `next/font/local` com arquivos `.woff2` hospedados localmente (`public/fonts/…`) e aplicar as classes geradas ao `body/html` conforme padrão.
3. Definir fallback stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, …`).
4. Controlar via env `USE_LOCAL_FONTS=true` para usar local em dev/offline; caso contrário, manter Google Fonts.
5. Validar páginas e componentes (cemetery/blocks/sections/plots) com o novo stack, garantindo consistência visual do IGRP DS.

## Validação
- Executar build (`pnpm build`) em ambiente offline para confirmar sucesso.
- Testar responsividade e tokens do DS; garantir ausência de regressões visuais.

## Observações
- Não criar arquivos sem autorização: para self-host é necessária a inclusão de arquivos de fonte. Caso prefira, podemos apenas remover o uso de `next/font/google` e usar o stack de sistema.
- Se optar por apenas a Opção A (rede), nenhuma alteração de código será necessária.

## Solicitação
- Confirme a opção desejada (A: rede; B: self-host local com alternância por env) para eu aplicar as alterações alinhadas às regras do projeto e manter conformidade com o IGRP DS.