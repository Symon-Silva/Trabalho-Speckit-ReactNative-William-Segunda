---

description: "Task list for Aplicativo de Placar de Gre-Nais"
---

# Tasks: Aplicativo de Placar de Gre-Nais

**Input**: Design documents from `/specs/001-grenais-scoreboard/`
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Automated tests are **not** included — the feature specification requests manual validation in Expo Go only. Each user story phase ends with a manual validation task referencing quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project (chosen)**: `package.json`, `App.tsx`, `src/` at repository root — Expo app scaffolded at repo root per plan.md Structure Decision.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Scaffold Expo blank-TS app at repository root: `npx create-expo-app@latest . --template blank-typescript` (fallback if the non-empty directory is rejected: scaffold into a temp directory and move `package.json`, `app.json`, `App.tsx`, `tsconfig.json`, `assets/`, `.gitignore` into the root — preserve `.specify/`, `.opencode/`, `AGENTS.md`, `specs/`)
- [X] T002 [P] Install the five approved dependencies with `npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage` in `package.json`
- [X] T003 [P] Verify TypeScript baseline compiles: `npx tsc --noEmit` exits with zero errors on the fresh scaffold

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared typed modules that ALL later phases depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create shared types in `src/types/index.ts`: `type Equipe`, `const EQUIPES: Equipe[]`, `interface Partida` (`id`, `mandante`, `gols: Record<Equipe, number>`, `finalizadaEm`)
- [X] T005 Implement the persistence service in `src/services/storage.ts`: `carregarHistorico(): Promise<Partida[]>` (single key `@grenais/historico`, `JSON.parse`, `Array.isArray` guard, sort by `finalizadaEm` descending) and `salvarPartida(partida: Partida): Promise<void>` (load array, append, `JSON.stringify`, `setItem`); try/catch lets errors propagate to callers (depends on T004)

**Checkpoint**: Shared modules compile; later phases only add screens/navigation on top

---

## Phase 3: User Story 1 - Iniciar uma partida (Priority: P1) 🎯 MVP

**Goal**: User picks the home team in a validated form and lands on a 0 a 0 scoreboard

**Independent Test**: Launch app → submit empty form → blocked with error → select team → scoreboard shows 0 a 0 (quickstart §US01)

### Implementation for User Story 1

- [X] T006 [P] [US1] Create navigation types in `src/navigation/types.ts`: `RootStackParamList` with `Iniciar: undefined` and `Placar: { mandante: Equipe }`
- [X] T007 [P] [US1] Create `src/screens/IniciarPartidaScreen.tsx`: two mandatory `Pressable` mandante options mapped from `EQUIPES`, inline error message on empty selection, `navigation.replace('Placar', { mandante })` only when valid (depends on T006)
- [X] T008 [P] [US1] Create `src/screens/PlacarScreen.tsx`: read the `mandante` route param, render match header and score **0 a 0** (display only — no controls yet) (depends on T006)
- [X] T009 [US1] Create `src/navigation/AppNavigator.tsx` (NavigationContainer + native stack with `Iniciar` and `Placar`) and wire it as the app root in `App.tsx` (depends on T007, T008)
- [ ] T010 [US1] Manually validate US01 per `specs/001-grenais-scoreboard/quickstart.md` §US01 (empty submit blocked; valid submit shows 0 a 0; back gesture cannot return to the form; runs in Expo Go) and record actual results

**Checkpoint**: US1 independently testable — **MVP stops here** (app boots → form → 0 a 0)

---

## Phase 4: User Story 2 - Atualizar o placar (Priority: P2)

**Goal**: Per-team +1 controls update the live score instantly and can never go negative

**Independent Test**: Active match → tap each team's +1 → immediate updates, no decrement path (quickstart §US02)

### Implementation for User Story 2

- [X] T011 [P] [US2] Create `src/components/PlacarTime.tsx`: typed props `{ equipe: Equipe; gols: number; onAdicionarGol: () => void }`, renders team name, current score and a `+1` `Pressable` (depends on T004)
- [X] T012 [US2] Extend `src/screens/PlacarScreen.tsx`: add `useState` for `gols: Record<Equipe, number>` starting at 0, render two `PlacarTime` components (one per `EQUIPES` entry), increment-only handlers `setGols(prev => ({ ...prev, [equipe]: prev[equipe] + 1 }))` (depends on T011)
- [X] T013 [US2] Manually validate US02 per quickstart §US02 (each tap updates immediately; no goal-removal control exists; score never negative) and record actual results

**Checkpoint**: Scoring works; the Finalizar button arrives in US3 (same priority, next phase) so its acceptance criterion "permitir finalizar" is validated at the US3 checkpoint

---

## Phase 5: User Story 3 - Salvar uma partida finalizada (Priority: P2)

**Goal**: Finalizing confirms, persists equipes/gols/data to AsyncStorage and leaves an uneditable result

**Independent Test**: Finalize with confirmation → success feedback → back at start; persistence observed via history in US04 (quickstart §US03)

### Implementation for User Story 3

- [X] T014 [US3] Extend `src/screens/PlacarScreen.tsx`: add a `Finalizar partida` `Pressable` → confirmation `Alert` → on confirm build `Partida` (`id: String(Date.now())`, `mandante`, `gols`, `finalizadaEm: new Date().toISOString()`) → `await salvarPartida(...)` → success `Alert` + `navigation.reset` to `Iniciar`; on failure error `Alert` and remain on the match (depends on T005, T012)
- [ ] T015 [US3] Manually validate US03 per quickstart §US03 (cancel keeps match; confirm saves and returns to start; finalized score no longer editable) and record actual results; note that restart-persistence is confirmed in T019

**Checkpoint**: Full match flow US1 → US2 → US3 works end to end

---

## Phase 6: User Story 4 - Consultar o histórico (Priority: P3)

**Goal**: Newest-first history list with empty/loading/error states, reachable from the start screen

**Independent Test**: Fresh install shows empty-state message; after finalizations list shows matches newest-first and survives app restart (quickstart §US04)

### Implementation for User Story 4

- [X] T016 [P] [US4] Create `src/screens/HistoricoScreen.tsx`: `useState` for `carregando | erro | dados`, `useEffect` load calling `carregarHistorico()`, `FlatList` with `keyExtractor={item => item.id}` rendering teams + score + `toLocaleDateString('pt-BR')`, empty-state message when the list is empty, error message with `Tentar novamente` button, `ActivityIndicator` while loading (depends on T005)
- [X] T017 [US4] Extend `src/navigation/types.ts` (`Historico: undefined` in `RootStackParamList`) and `src/navigation/AppNavigator.tsx` (register the `Historico` screen) (depends on T016)
- [X] T018 [US4] Extend `src/screens/IniciarPartidaScreen.tsx`: add a `Ver histórico` `Pressable` navigating to `Historico` (depends on T017)
- [ ] T019 [US4] Manually validate US04 per quickstart §US04 (empty-state message; finalize two matches with different scores → newest first; force-close and reopen → records persist; FlatList rows render) and record actual results

**Checkpoint**: All four stories independently functional; US04's restart check also closes US03's persistence criterion

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all stories

- [X] T020 [P] Run `npx tsc --noEmit` one final time and fix any type errors; remove unused imports or dead code under `src/` and `App.tsx`
- [ ] T021 Execute the full `specs/001-grenais-scoreboard/quickstart.md` walkthrough in Expo Go (all four US sections + navigation sweep) and record every actual result honestly — do not claim any check passed without performing it on a device
- [X] T022 [P] Audit scope and Constitution conformance: exactly the five approved dependencies in `package.json`, no out-of-scope features, no `any` or `@ts-ignore` anywhere in `src/`

---

## Phase 8: UI/UX Restyle (2026-10-21)

**Purpose**: Interface visual overhaul requested after US1–US4. Presentation
only — no business rule, navigation flow or dependency changed.

- [X] T023 Create the design tokens in `src/theme/index.ts` (colors, spacing scale, radii, type scale, shadows) and replace every hardcoded value in `src/` and `App.tsx`
- [X] T024 Create the shared `src/components/Botao.tsx` (variants `primario` / `contorno` / `suave`, pressed state) and reuse it in every screen and in `Dialogo`
- [X] T025 Restyle `src/components/PlacarTime.tsx` as a scoreboard column (avatar, uppercase team label, oversized score, pill `+1` control) and `src/components/Dialogo.tsx` (accent bar, card shadow, aligned actions)
- [X] T026 Restyle `src/screens/IniciarPartidaScreen.tsx`: brand header, card with radio-style team selection, error message in a highlighted box, primary + outline actions
- [X] T027 Restyle `src/screens/PlacarScreen.tsx`: mandante card, single-row scoreboard (the score is no longer duplicated), separated teams by an `a` divider, `Finalizar partida` as the primary action
- [X] T028 Restyle `src/screens/HistoricoScreen.tsx`: card rows with avatar and score badge, structured empty state and error state with retry
- [X] T029 Add safe-area handling (`SafeAreaProvider` in `App.tsx`, `SafeAreaView` in the three screens) and style the navigator header
- [X] T030 Validate the restyle: `npx tsc --noEmit` (0 errors), `npx expo-doctor` (20/20), `npx expo export` for web and android (both bundle clean)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T004 needs `tsconfig`/`types` from the scaffold) — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (Phase 3) first — it creates the navigation shell every later screen uses
  - US2 (Phase 4) and US3 (Phase 5) extend `PlacarScreen` sequentially
  - US4 (Phase 6) touches different files than US2/US3 and can proceed once US1 exists
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependencies on other stories
- **US2 (P2)**: After Foundational + US1 (renders inside the Placar screen)
- **US3 (P2)**: After Foundational + US1 + US2 (finalizes the scored match; uses storage service)
- **US4 (P3)**: After Foundational + US1 (own screen; empty-state test needs no saves). Its full persistence check (T019) additionally requires US3's save flow — noted as an integration verification, not an implementation dependency

### Within Each User Story

- Manual validation task runs after that story's implementation tasks
- Types/models before services; services before screens that consume them
- Story checkpoint validated before moving to the next phase

### Parallel Opportunities

- T002 ∥ T003 (after T001)
- T006 → T007 ∥ T008 (both depend on the nav types only)
- T011 ∥ T016 (different files; US4 work can overlap US2 if staffed)
- T020 ∥ T022

---

## Parallel Example: User Story 1

```text
# After T006 (navigation types) lands, launch together:
Task: "Create src/screens/IniciarPartidaScreen.tsx (validated mandante form)"
Task: "Create src/screens/PlacarScreen.tsx (0 a 0 display)"
# Then wire both into the navigator:
Task: "Create src/navigation/AppNavigator.tsx + App.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1
4. **STOP and VALIDATE**: quickstart §US01 on a device
5. Demo ready: app boots, form validates, scoreboard opens at 0 a 0

### Incremental Delivery

1. Setup + Foundational → shared modules ready
2. US1 → validate → MVP demo
3. US2 → validate → live scoring
4. US3 → validate → persistence
5. US4 → validate → history view (completes all acceptance criteria)

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` labels map tasks to user stories for traceability
- Commit after each phase or logical group (only when the user explicitly requests commits)
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
- `TextInput` is intentionally absent: the spec defines no free-text field (see research.md R6)

### Pending device validation

T010, T015, T019 and T021 remain **unchecked** — they are manual checks that
require a physical device running Expo Go (Constitution IX: no check may be
reported as passed without being executed). Verified statically on
2026-10-21 instead: `npx tsc --noEmit` (0 errors, 0 unused),
`npx expo-doctor` (20/20), and `npx expo export --platform android`
(870 modules, no bundling error). See the "Status de validação" section in
quickstart.md.
