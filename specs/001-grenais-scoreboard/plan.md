# Implementation Plan: Aplicativo de Placar de Gre-Nais

**Branch**: `001-grenais-scoreboard` | **Date**: 2026-10-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-grenais-scoreboard/spec.md`

## Summary

Mobile app (Expo / React Native / TypeScript) that records Grêmio x Internacional
matches: start a validated match choosing the home team, increment per-team scores
live, finalize to a locally persisted history (AsyncStorage, JSON), and browse that
history newest-first. Three screens linked by a React Navigation stack; fully
offline; no backend or authentication.

## Technical Context

**Language/Version**: TypeScript (Expo `blank-typescript` template, current SDK via `create-expo-app`)
**Primary Dependencies**: `@react-navigation/native`, `@react-navigation/native-stack` (navigation),
`@react-native-async-storage/async-storage` (persistence), plus Expo-managed
`react-native-screens` and `react-native-safe-area-context` (React Navigation native requirements).
No Expo project existed at planning time; every package is installed with
`npx expo install` during implementation — nothing is installed during planning.
**Storage**: AsyncStorage local — single key `@grenais/historico`, JSON serialize/deserialize
**Testing**: Manual validation in Expo Go against quickstart.md (no automated test framework requested)
**Target Platform**: iOS + Android via Expo Go on a physical device
**Project Type**: mobile-app
**Performance Goals**: score taps visible immediately (in-memory React state); history loads on screen open
**Constraints**: fully offline; dependency set limited to the five justified above; academic simplicity (Constitution I–IV)
**Scale/Scope**: 3 screens, 1 persisted entity, 1 local user, 5 external packages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Source: `.specify/memory/constitution.md` v1.0.0.

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | Simplicidade e Clareza | PASS | Native RN components only; 5 justified deps; no abstractions beyond one reused component; scope = spec only |
| II | Componentização e Reutilização | PASS | `PlacarTime` extracted (used twice); form options built with a single inline `map`; no files created for count |
| III | SOLID (proporcional) | PASS | `storage.ts` owns only persistence (SRP); one concern per screen; no architectural layers added |
| IV | Tecnologias e Dependências | PASS | RN + Expo + TS per spec; new deps justified in research.md; installs deferred to implementation with `npx expo install`; no styling/state/form libs |
| V | TypeScript e Qualidade | PASS | `type Equipe = 'Grêmio' \| 'Internacional'` enforces FR-011 at compile time; no `any`; no suppressions |
| VI | Interface, Formulários, Navegação | PASS | Validated mandante form with error message; `FlatList` for history; empty/loading/error states; explicit stack navigation |
| VII | SDD | PASS | Constitution → Specify → Plan executed in sequence; spec is the sole scope source |
| VIII | Escopo e Controle de Alterações | PASS | No out-of-scope features; `TextInput` deliberately unused (spec has no free-text field) |
| IX | Validação e Entrega | PASS | quickstart.md defines per-US manual checks; no claim of executed tests without execution |

**Re-check after Phase 1 design**: still PASS — design introduced no new
dependencies, layers, or scope (Complexity Tracking remains empty).

## Project Structure

### Documentation (this feature)

```text
specs/001-grenais-scoreboard/
├── plan.md                    # This file
├── research.md                # Phase 0 output
├── data-model.md              # Phase 1 output
├── quickstart.md              # Phase 1 output
├── checklists/
│   └── requirements.md        # Spec quality checklist (passed)
├── contracts/                 # SKIPPED — purely internal app (see Structure Decision)
└── tasks.md                   # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
package.json                   # Expo project scaffolded at repo root
app.json
App.tsx                        # Entry: renders AppNavigator
src/
├── screens/
│   ├── IniciarPartidaScreen.tsx
│   ├── PlacarScreen.tsx
│   └── HistoricoScreen.tsx
├── components/
│   ├── PlacarTime.tsx         # Reused by both teams' score columns
│   ├── Botao.tsx              # Shared button (primary/outline/soft variants)
│   └── Dialogo.tsx            # Cross-platform modal (works on native and web)
├── navigation/
│   ├── AppNavigator.tsx       # NavigationContainer + native stack
│   └── types.ts               # RootStackParamList
├── theme/
│   └── index.ts               # Design tokens: colors, spacing, radii, type, shadows
├── types/
│   └── index.ts               # Equipe, Partida, PartidaAtiva
└── services/
    └── storage.ts             # AsyncStorage JSON load/save
```

**Structure Decision**: Single project at the repository root (Expo app alongside
`.specify/`). Chosen over a subdirectory to keep paths flat and match the
plan-template single-project layout; `create-expo-app .` is run from the root with
a fallback of scaffolding in a temp directory and moving files in if the
non-empty directory is rejected. `contracts/` is skipped because the app exposes
no external interfaces — its only "contracts" (navigation param list, storage
service signatures) are TypeScript types living in `src/navigation/types.ts` and
`src/services/storage.ts`, documented in data-model.md (Constitution II: no files
created just to increase file count).

## Complexity Tracking

> No Constitution Check violations — table intentionally empty.

## Revision: UI/UX Restyle (2026-10-21)

Requested after US1–US4 were implemented. **Presentation-only change**: no
business rule, navigation flow, data model or dependency was altered.

| Change | Justification | Constitution |
|--------|---------------|--------------|
| `src/theme/index.ts` (new) | Single source of truth for colors, spacing, radii, type scale and shadows — replaces 9 hardcoded hex values and arbitrary spacing scattered across 6 files | II (reutilização), I (clareza) |
| `src/components/Botao.tsx` (new) | One button component reused in 4 places (iniciar, histórico, finalizar, dialog) instead of 4 duplicated `Pressable` blocks | II (reutilização) |
| `src/components/Dialogo.tsx` | `Alert.alert` is a no-op in `react-native-web`; a `Modal`-based dialog keeps the finalize flow identical on native and web | IV (sem lib nova), I |
| Safe-area handling | `SafeAreaProvider` + `SafeAreaView` (already-approved `react-native-safe-area-context`) so content respects notches and the home indicator | VI (interface) |
| Screen restyle | Real scoreboard layout (no duplicated score), radio-style team selection, card-based history rows, structured empty/error states, pressed states on every control | VI (interface) |

**No new dependencies** were added — `expo-doctor` still reports 20/20 and the
dependency set is unchanged.

