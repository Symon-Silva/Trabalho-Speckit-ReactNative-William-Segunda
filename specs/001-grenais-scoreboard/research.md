# Phase 0 Research: Aplicativo de Placar de Gre-Nais

All Technical Context unknowns were resolved during planning. Each decision:
Decision → Rationale → Alternatives considered.

## R1. Project scaffold

**Decision**: Scaffold at the repository root with
`npx create-expo-app@latest . --template blank-typescript`.

**Rationale**: `blank-typescript` gives a minimal TypeScript app with a plain
`App.tsx` entry — no file-based routing to fight with, matching the explicit
React Navigation decision and keeping the codebase legible for students
(Constitution I). Root location keeps task paths flat.

**Alternatives considered**: default `create-expo-app` template — rejected
(ships expo-router, unnecessary routing layer); `expo-router` — rejected for 3
screens; subdirectory scaffold — rejected (nested paths in every task/doc).
Fallback if root scaffold rejects the non-empty directory: scaffold into a temp
directory and move generated files into the root, preserving `.specify/`,
`.opencode/` and `AGENTS.md`.

## R2. Navigation structure

**Decision**: `@react-navigation/native` + `@react-navigation/native-stack`
with three routes: `Iniciar` (initial), `Placar`, `Historico`.
Flows: `Iniciar →(valid submit, replace)→ Placar`;
`Iniciar →(push)→ Historico` ("Ver histórico" button);
finalization → confirmation Alert → `navigation.reset` to `Iniciar`.

**Rationale**: One native stack is the smallest navigator that satisfies
"pelo menos duas telas com navegação". `replace` on start prevents back-
gesture return to a completed form. Resetting to `Iniciar` after finalize keeps
US3 free of any dependency on the `Historico` route (created in US4), so stories
stay independently completable.

**Alternatives considered**: bottom-tabs — rejected (second navigator + tab
bar for a single linear flow); `expo-router` — rejected (file-based routing
overkill); reset directly into `[Iniciar, Historico]` after finalize — rejected
(cross-story coupling; the history button one tap away gives the same outcome).

## R3. Active match state

**Decision**: The active match lives in `useState` inside `PlacarScreen`
(scores) with the home team passed as a route param. It is never persisted.

**Rationale**: Spec decision — only finalized matches persist (US03 assumption
confirmed with the user). In-memory state is the simplest mechanism and needs
no state-management library (Constitution IV).

**Alternatives considered**: React Context / reducer — rejected (single screen
owns the state; no sharing need); persisting the active match — rejected
(explicitly out of agreed scope).

## R4. Storage strategy

**Decision**: Single service module `src/services/storage.ts` exposing
`carregarHistorico(): Promise<Partida[]>` and
`salvarPartida(partida): Promise<void>`. One AsyncStorage key
`@grenais/historico` holds a JSON array of `Partida`. Read path sorts descending
by `finalizadaEm` (ISO-8601, so lexicographic order = chronological). All
operations are try/catch-wrapped; errors propagate as plain `Error` to the
screen layer, which renders a friendly message.

**Rationale**: Centralizes persistence (no storage calls scattered in screens),
JSON matches AsyncStorage's string-only API, and sorting at read time makes the
newest-first requirement robust regardless of insertion order (FR-006).

**Alternatives considered**: one key per match — rejected (merge/ordering
complexity for no gain); sorting by unshift only — rejected (read-time sort is
strictly more robust); a generic storage abstraction layer — rejected
(Constitution III: layers without justifiable need).

## R5. Screen states

**Decision**: `HistoricoScreen` manages `carregando | erro | dados` via
`useState` + a `useEffect` load on mount; error state offers "Tentar
novamente". `PlacarScreen` holds only score state; save errors surface as an
`Alert`.

**Rationale**: Covers the spec's required loading/empty/error states with the
minimum machinery; mount-based loading is sufficient because history is only
re-entered through fresh navigation after data changes.

**Alternatives considered**: `useFocusEffect` re-load on every focus —
rejected (unnecessary: data changes only at finalization, which leaves the
screen).

## R6. Start-match form validation

**Decision**: The only form field is the mandatory home-team selection,
rendered as two `Pressable` options mapped from a fixed `EQUIPES` list. Submit
without a selection shows an inline error and is blocked; there are no text
inputs anywhere in scope.

**Rationale**: The spec requires choosing the mandante and validating required
fields, and forbids registering other teams — a fixed selection both validates
and enforces FR-011. No free-text field exists in the approved scope, so
`TextInput` (listed in the stack as an available native component) is not used;
adding a text field would violate Constitution VIII.

**Alternatives considered**: `TextInput` + string matching ("Grêmio"/
"Internacional") — rejected (typos, worse UX, needless error paths); a form
library — rejected (Constitution IV, one field).

## R7. Finalization flow

**Decision**: `Finalizar` button (created in US3) → confirmation `Alert` →
build `Partida` (`id` from `Date.now()`, `gols` record, `finalizadaEm` =
`new Date().toISOString()`) → `salvarPartida` → success `Alert` +
`navigation.reset` to `Iniciar`; failure → error `Alert`, stay on the match.

**Rationale**: One confirmation prevents accidental saves (US03 "impedir
alterações acidentais"); reset guarantees the finalized screen can no longer be
edited (FR-010) and gives a predictable single-screen stack.

**Alternatives considered**: silent auto-save on route change — rejected
(explicit confirmation matches user expectations for "finalizar"); staying on a
locked scoreboard screen — rejected (extra UI states for no spec benefit).
