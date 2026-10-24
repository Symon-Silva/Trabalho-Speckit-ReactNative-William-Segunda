# Modelo de Dados: Times Personalizados com Escudos

Fonte: requisitos funcionais e cenários de aceite de `spec.md`, decisões em
`research.md`.

## Entidades

### Time

Representa uma equipe disponível para partidas.

| Campo | Tipo | Restrições | Origem (FR) |
|-------|------|------------|-------------|
| `id` | `string` | único; gerado na criação (ex.: `Date.now().toString(36)` + sufixo) | identidade estável para edição/exclusão |
| `nome` | `string` | obrigatório; 2 a 50 caracteres após `trim`; único sem diferenciar maiúsculas | FR-005, FR-006, FR-007, FR-008 |
| `escudoUrl` | `string \| null` | opcional; se preenchido, precisa ser HTTP/HTTPS válido | FR-005, FR-009 |
| `padrao` | `boolean` | `true` para Grêmio/Internacional; protege de edição/exclusão | FR-001, FR-033 |

```ts
interface Time {
  id: string;
  nome: string;
  escudoUrl: string | null;
  padrao: boolean;
}
```

**Times padrão semeados**: dois registros com `padrao: true` e `escudoUrl: null`
(usa asset local `assets/times/*.png`):

```ts
const TIMES_PADRAO: Time[] = [
  { id: 'padrao-gremio', nome: 'Grêmio', escudoUrl: null, padrao: true },
  { id: 'padrao-internacional', nome: 'Internacional', escudoUrl: null, padrao: true },
];
```

### PartidaParticipante

Snapshot dos dados de exibição de um time no momento da finalização. Preserva o
histórico mesmo se o time for editado ou excluído.

| Campo | Tipo | Restrições | Origem (FR) |
|-------|------|------------|-------------|
| `id` | `string` | id do time no momento da partida (informativo) | FR-021 |
| `nome` | `string` | nome exibido na partida | FR-021, FR-034 |
| `escudoUrl` | `string \| null` | link do escudo no momento da partida; `null` usa fallback | FR-021, FR-023 |

### Partida

Confronto finalizado entre dois times. Imutável após a finalização.

| Campo | Tipo | Restrições | Origem (FR) |
|-------|------|------------|-------------|
| `id` | `string` | único; gerado por `String(Date.now())` | chave do `FlatList` |
| `participantes` | `[PartidaParticipante, PartidaParticipante]` | exatamente dois, distintos | FR-016, FR-017, FR-020 |
| `gols` | `Record<string, number>` | chave = `id` do participante; inteiros `>= 1`? não — `>= 0` | FR-018 |
| `finalizadaEm` | `string` | ISO-8601 automático na finalização | FR-019 |

```ts
interface PartidaParticipante {
  id: string;
  nome: string;
  escudoUrl: string | null;
}

interface Partida {
  id: string;
  participantes: [PartidaParticipante, PartidaParticipante];
  gols: Record<string, number>; // chave: id do participante
  finalizadaEm: string;         // ISO-8601
}
```

> Nota de implementação: `gols` é chaveado pelo `id` do participante da
> esquerda (`participantes[0].id`) e da direita (`participantes[1].id`). Isso
> substitui o antigo `Record<Equipe, number>` fixo a dois nomes.

## Migração do formato antigo

Partidas salvas pela feature 001 têm o formato:

```ts
interface PartidaAntiga {
  id: string;
  mandante: 'Grêmio' | 'Internacional';
  gols: { 'Grêmio': number; 'Internacional': number };
  finalizadaEm: string;
}
```

Ao ler o histórico, converter cada item antigo para o novo formato:

```ts
function migrarPartida(bruta: unknown): Partida | null {
  // Se já tem `participantes` → usa como está (validação leve).
  // Se tem `mandante` e `gols` com as chaves 'Grêmio'/'Internacional' →
  //   participantes: [
  //     { id: 'legado-gremio', nome: 'Grêmio', escudoUrl: null },
  //     { id: 'legado-internacional', nome: 'Internacional', escudoUrl: null },
  //   ],
  //   gols: { 'legado-gremio': gols['Grêmio'], 'legado-internacional': gols['Internacional'] }
  // Itens irrecuperáveis são descartados (não quebram a lista).
}
```

Regras:
- A migração ocorre na leitura (`carregarHistorico`), em memória.
- A próxima gravação persiste o formato novo.
- Partida antiga sem escudo → `escudoUrl: null` → fallback visual (FR-023).

## Regras de validação

- **Nome**: `nome.trim()` com 2 a 50 caracteres; recusa vazio/só espaços (FR-006) e duplicados sem diferenciar maiúsculas, ignorando espaços (FR-008).
- **Edição**: aplica as mesmas regras do cadastro; unicidade ignora o próprio `id` (FR-030).
- **Link**: vazio/`null` é válido (FR-011); caso contrário precisa casar `/^https?:\/\/.+/i` (FR-009).
- **Times padrão**: `padrao === true` bloqueia edição e exclusão (FR-033).
- **Partida**: participantes precisam ter `id` distintos (FR-017); `gols` inicia em `0` e só incrementa (FR-018).

## Transições de estado

```text
[Time novo] --cadastro válido--> [Time na lista] --edição válida--> [Time atualizado]
                                          |
                                          +--exclusão (confirmada)--> [removido da lista]
                                                                         |
                                                                         +--> histórico NÃO muda

[Partida ativa] --finalizar (confirmar)--> [Partida finalizada] --serializa snapshot--> [histórico]
```

- `padrao: true` nunca transita para excluído/editado.
- Time excluído é terminal para a lista, mas os snapshots no histórico permanecem.

## Persistência (AsyncStorage)

```text
Chave times:      @placar/times
Valor:            JSON.stringify(Time[])
Leitura:          parse → Array.isArray → garante times padrão presentes (idempotente) → retorna
Escrita:          array completo re-serializado a cada operação
Semeadura:        na primeira leitura ou na inicialização; nunca duplica (checa por id padrão)

Chave histórico:  @grenais/historico
Valor:            JSON.stringify(Partida[])   // formato novo
Leitura:          parse → Array.isArray → migra itens antigos → ordena por finalizadaEm DESC → retorna
Escrita:          array completo (append) re-serializado
Erros:            propagados como Error; telas exibem mensagem amigável + tentar novamente
```

## Contratos de serviço (interface entre telas e persistência)

```ts
// src/services/storage.ts
export async function carregarTimes(): Promise<Time[]>;              // garante os padrão
export async function salvarTime(time: Time): Promise<void>;          // cria ou atualiza
export async function excluirTime(id: string): Promise<void>;         // apenas da lista
export async function carregarHistorico(): Promise<Partida[]>;        // migra formato antigo
export async function salvarPartida(partida: Partida): Promise<void>;

// Validação (funções puras no mesmo módulo para evitar arquivo extra)
export interface ResultadoValidacao {
  valido: boolean;
  nome?: string;     // mensagem de erro do nome
  escudoUrl?: string; // mensagem de erro do link
}
export function validarTime(
  nome: string,
  escudoUrl: string,
  times: Time[],
  idAtual?: string,
): ResultadoValidacao;
```

## Contrato de navegação (entre telas)

```ts
// src/navigation/types.ts
export type RootStackParamList = {
  Iniciar: undefined;
  Placar: { participantes: [PartidaParticipante, PartidaParticipante] };
  Historico: undefined;
  MeusTimes: undefined;
  FormularioTime: { timeId?: string };
};
```

> `Placar` passa a receber os dois participantes (nome + escudo) em vez de apenas
> o `mandante`, para que o placar exiba os escudos sem recarregar o cadastro de
> times — necessário para o caso de um time ser excluído durante uma partida ativa.
