# Fase 0 — Pesquisa: Times Personalizados com Escudos

Todas as incógnitas do contexto técnico foram resolvidas antes do design. Cada
decisão segue o formato Decisão → Justificativa → Alternativas consideradas.

## R1. Modelo da entidade Time

**Decisão**: Uma entidade `Time` com `id` próprio (gerado por
`Date.now().toString(36)` + sufixo aleatório), `nome` de exibição,
`escudoUrl: string | null` (link HTTP/HTTPS opcional ou `null`), e
`padrao: boolean`. Os times padrão Grêmio e Internacional são semeados na
primeira execução com `id` fixo (`'padrao-gremio'`, `'padrao-internacional'`),
`padrao: true` e `escudoUrl: null` (usam asset local).

**Justificativa**: O `id` desacopla o time do nome, permitindo edição e exclusão
sem quebrar referências. `escudoUrl: null` distingue "sem link informado"
(fallback padrão) de "link informado que falhou" — útil para exibição e
diagnóstico. A flag `padrao` protege os times padrão de edição/exclusão (FR-033).

**Alternativas consideradas**: usar o nome como chave (rejeitado — a edição de
nome exigiria reescrever referências em todas as partidas); `escudoUrl?: string`
opcional (preferiu-se `| null` explícito para leitura clara do JSON
armazenado); um campo `tipo: 'padrao' | 'personalizado'` (rejeitado — um boolean
atende).

## R2. Migração e compatibilidade do histórico

**Decisão**: O histórico passa a guardar, em cada partida, um snapshot de cada
participante (`{ nome, escudoUrl }`) em vez de apenas o nome. Ao ler o
histórico, aplicar uma migração em memória: partidas no formato antigo
(`mandante: 'Grêmio' | 'Internacional'` + `gols: Record<Equipe, number>`) são
convertidas para o novo formato, preenchendo `escudoUrl: null` (fallback) e
preservando placar e data. A migração é aplicada na leitura; a regravação ocorre
na próxima gravação normal.

**Justificativa**: Garante os critérios "partidas antigas continuam legíveis"
(SC-009) e "mantidas antes da atualização" (FR-023) sem que o usuário precise
migrar manualmente. Manter o snapshot no histórico cumpre FR-021/FR-034 mesmo
que um time seja editado ou excluído depois.

**Alternativas consideradas**: versionar a chave (`@grenais/historico:v2`) —
rejeitado por não recuperar automaticamente os dados antigos; migração na
gravação — rejeitado por perder leituras feitas antes da primeira gravação;
referenciar times por `id` no histórico — rejeitado por quebrar quando um time é
excluído (violaria o snapshot imutável).

**Formato novo do placar por participante**: `gols` passa a ser
`Record<string, number>` chaveado pelo `id` do time participante, mas o snapshot
de nome/escudo fica em `participantes: [PartidaParticipante, PartidaParticipante]`.
Isso permite renderizar o placar mesmo após mudanças no cadastro.

## R3. Exibição de escudos com fallback

**Decisão**: Componente `EscudoTime` que recebe `{ nome, escudoUrl?, padrao?,
tamanho? }` e renderiza:
1. Se `padrao === true`: `require()` do asset local (`assets/times/gremio.png`
   ou `assets/times/internacional.png`), resolvido por `nome`/`id`.
2. Senão, se `escudoUrl` preenchida: `Image` nativo com
   `onError={() => setFalhou(true)}`; ao falhar, cai no passo 3.
3. Fallback: círculo com a inicial do nome, usando tokens de tema existentes.

Todas as variações usam o mesmo `tamanho` (ex.: 40px) e `borderRadius` para
dimensões consistentes (FR-013); a imagem usa `resizeMode="cover"` ou
`resizeMode="contain"` conforme testado no dispositivo (decisão final na
implementação, ambas preservam proporção).

**Justificativa**: Apenas recursos nativos do React Native — nenhuma biblioteca
de imagem (Constituição IV). O fallback é o mesmo elemento visual já usado hoje
nas telas (avatar com inicial), garantindo continuidade visual.

**Alternativas consideradas**: `expo-image` (rejeitado — dependência nova sem
necessidade comprovada); `${nome.charAt(0)}` sempre (rejeitado — não atende
FR-002); checar existência da URL antes de exibir (rejeitado — passos extras de
rede sem necessidade).

**Assets dos times padrão**: colocar `gremio.png` e `internacional.png` em
`assets/times/`. Como o repositório não possui hoje escudos oficiais, os
arquivos serão criados na implementação (imagens simples/marcação provisória
com o nome do time), respeitando o formato PNG. Isso mantém o app funcional
offline e deixa claro onde trocar por artes finais.

## R4. Validação de nome e link

**Decisão**: Funções puras em `src/services/storage.ts` (ou um pequeno
`validarTime` no mesmo módulo, evitando arquivo extra):

- Normalização: `nome.trim()`.
- Nome válido: comprimento entre 2 e 50 caracteres após trim (FR-006/FR-007).
- Unicidade: comparar `nome.toLowerCase()` contra os times existentes
  (FR-008), excluindo o próprio time na edição.
- Link: vazio/`null` → válido (sem escudo). Não vazio → precisa casar com
  `/^https?:\/\/.+/i` (FR-009). Rejeitar outros protocolos.

A validação retorna uma mensagem por campo; o formulário exibe as mensagens em
português.

**Justificativa**: Sem bibliotecas de validação ou de formulário (Constituição
IV). Regras simples e testáveis manualmente. O regex exige apenas HTTP/HTTPS
sintaticamente válido; carregamento real é tratado pelo R3.

**Alternativas consideradas**: biblioteca de validação (rejeitado); `URL`
nativo sem regex (rejeitado — `URL` existe no RN moderno, mas não valida
protocolo de forma portável entre plataformas/web; o regex é explícito e
determinístico).

## R5. Exclusão de time sem afetar o histórico

**Decisão**: Excluir um time remove apenas o registro da lista de times
(`@placar/times`). O histórico nunca é alterado pela exclusão (FR-032/FR-034),
pois cada partida carrega seu snapshot. Se o time excluído era referenciado por
uma partida ativa, a partida ativa continua válida porque o placar já recebeu
os dados de nome/escudo como parâmetro de navegação (não recarrega o time).

**Justificativa**: Cumpre FR-031/FR-032/FR-034 e mantém a imutabilidade do
histórico (US4). Simples: uma operação de escrita em uma única chave.

**Alternativas consideradas**: marcar como "inativo" em vez de remover
(rejeitado — mais estados e filtros); apagar partidas do time (rejeitado —
violaria FR-034).

## R6. Navegação e telas

**Decisão**: Estender o stack existente (`Iniciar`, `Placar`, `Historico`) com
`MeusTimes` e `FormularioTime: { timeId?: string }` (sem `timeId` = cadastro;
com `timeId` = edição). Acesso a "Meus Times" a partir da tela `Iniciar`
(FR-036). Reutilizar `Botao` e `Dialogo` para ações e confirmação de exclusão.

**Justificativa**: Menor alteração possível na navegação existente; um único
formulário serve cadastro e edição (Constituição I/II). Confirmar exclusão com
`Dialogo` (já multiplataforma) evita `Alert` no-op na web.

**Alternativas consideradas**: modal em vez de rota (rejeitado — quebra o
padrão de stack e complica o retorno); tela separada só para edição (rejeitado
— duplicação de formulário).

## R7. Escala e desempenho

**Decisão**: Nenhuma paginação ou limite artificial. Listas usam `FlatList`
(já no projeto). Uma pessoa usa o app localmente; dezenas de times e centenas de
partidas são tratadas sem otimização especial.

**Justificativa**: Escala real é pessoal; complexidade extra não se justifica
(Constituição I). `FlatList` já atende listas extensas (Princípio VI).

**Alternativas consideradas**: virtualização extra, índices, paginação
(rejeitados — sem necessidade).

## Consolidado de incógnitas

| Incógnita do contexto técnico | Resolvida em |
|-------------------------------|--------------|
| Modelo do time e identificação | R1 |
| Migração do histórico antigo | R2 |
| Como exibir/fallbackar escudos | R3 |
| Validação de nome e link sem libs | R4 |
| Exclusão sem quebrar histórico | R5 |
| Telas e navegação | R6 |
| Escala/desempenho | R7 |

Nenhum `NEEDS CLARIFICATION` permanece.
