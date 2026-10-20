# Data Model: Aplicativo de Placar de Gre-Nais

Source: spec.md requirements and acceptance scenarios.

## Entities

### Partida (persisted — finalized matches only)

| Field | Type | Constraints | Origin (FR) |
|-------|------|-------------|-------------|
| `id` | `string` | unique; generated from timestamp at finalization | identity for FlatList keys |
| `mandante` | `Equipe` | `'Grêmio' \| 'Internacional'` — required | FR-002, FR-011 |
| `gols` | `Record<Equipe, number>` | each value `>= 0` integer | FR-003, FR-004 |
| `finalizadaEm` | `string` | ISO-8601 date-time, set automatically at finalization | FR-013 |

```ts
type Equipe = 'Grêmio' | 'Internacional';
const EQUIPES: Equipe[] = ['Grêmio', 'Internacional'];

interface Partida {
  id: string;
  mandante: Equipe;
  gols: Record<Equipe, number>;
  finalizadaEm: string; // ISO-8601
}
```

### PartidaAtiva (ephemeral — in-memory screen state only)

| Field | Type | Constraints | Origin (FR) |
|-------|------|-------------|-------------|
| `mandante` | `Equipe` | set once at start, passed as navigation param | FR-002 |
| `gols` | `Record<Equipe, number>` | values `>= 0`; increments of +1 only (no decrement path exists) | FR-003, FR-004 |

Never written to storage (spec assumption confirmed with user: closing the app
loses the active match — FR-005/FR-008 persist finalized matches only).

## State Transitions

```text
[no match] --valid form submit--> [ativa] --finalizar (confirm)--> [finalizada]
                                                     |
                                                     +--> persisted to history (terminal)
                                                     +--> [no match]  (screen resets to Iniciar)
```

- The `ativa → finalizada` transition is the only transition; finalized is terminal.
- The instance disappears on app close if still `ativa` (by design).
- FR-010: no transition or path exists from `finalizada` back to an editable state.

## Validation Rules

- Mandante must be selected before starting (inline error; submit blocked) — US01.
- Only `EQUIPES` values are representable; the type system enforces this (no other team can appear) — FR-011.
- Scores change only via `+1` increments; by construction they start at `0` and can never be negative — FR-004.
- Finalization with any score (including `0 x 0`) is valid.

## Persistence Schema (AsyncStorage)

```text
Key:   @grenais/historico
Value: JSON.stringify(Partida[])     // e.g. [{"id":"...","mandante":"Grêmio","gols":{"Grêmio":2,"Internacional":1},"finalizadaEm":"2026-10-19T18:00:00.000Z"}]
Read:  JSON.parse → validate Array.isArray → sort by finalizadaEm DESC → return
Write: full array re-serialized on each save (append new match, then persist)
Errors: thrown as Error; screens render friendly message + retry (no crash)
```

## Service Signatures (interface contract between screens and storage)

```ts
// src/services/storage.ts
export async function carregarHistorico(): Promise<Partida[]>;
export async function salvarPartida(partida: Partida): Promise<void>;
```

## Navigation Param List (in-app contract between screens)

```ts
// src/navigation/types.ts
export type RootStackParamList = {
  Iniciar: undefined;
  Placar: { mandante: Equipe };
  Historico: undefined; // added in US4
};
```
