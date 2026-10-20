# Quickstart: Aplicativo de Placar de Gre-Nais

Manual validation guide for the Expo Go workflow. Every step below is executed
by hand on a physical device — these are **manual verification procedures**,
not automated tests. Never report a check as passed without performing it.

## Prerequisites

- Node.js 20+ and npm installed (`node --version`)
- Expo Go app installed on a physical iOS/Android device
- Phone and computer on the same network (or use a tunnel: `npx expo start --tunnel`)

## Setup & Run

```powershell
# 1. Install dependencies (already executed during implementation)
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage

# 2. Static check — must pass with zero errors
npx tsc --noEmit

# 3. Start Metro
npx expo start
```

Scan the QR code with Expo Go. If bundling fails, fix errors before validating.

## US01 — Iniciar uma partida

1. Launch the app → the start screen opens (initial route).
2. Tap **Iniciar partida** without selecting a team → inline validation error
   appears; the match does **not** start.
3. Select **Grêmio** (or Internacional) → tap **Iniciar partida** → the scoreboard
   opens showing **0 a 0** with the chosen home team.
4. System back gesture from the scoreboard does **not** return to the completed form.
   *(Expect: pass/fail — record actual result.)*

## US02 — Atualizar o placar

1. With a match active, tap the **+1** control under Grêmio → score changes
   immediately (e.g., 1 a 0).
2. Tap the **+1** control under Internacional → its score increments.
3. Confirm there is **no control that removes goals** and the displayed score is
   never negative.
   *(Expect: pass/fail — record actual result.)*

## US03 — Salvar uma partida finalizada

1. Tap **Finalizar partida** → confirmation dialog appears.
2. Cancel → nothing is saved; match continues.
3. Confirm → success feedback, app returns to the start screen.
4. Force-close the app entirely (remove from recents), reopen it → proceed to US04.
   *(Expect: pass/fail — record actual result.)*

## US04 — Consultar o histórico

1. On a fresh install (or before any save) tap **Ver histórico** → empty-state
   message is shown (no blank screen).
2. After finalizing matches (do this twice with different scores) tap
   **Ver histórico** → each row shows teams, score and date; the **most recent
   match is first**.
3. Return, force-close the app, reopen → **Ver histórico** → both records are
   still present (persistence across restarts).
4. The list renders via `FlatList` (observable: rows are list items, scrolls
   smoothly with several entries).
   *(Expect: pass/fail — record actual result.)*

## Navigation & platform sweep

- Start → Scoreboard → back-to-start (after finalize) → History → back: no dead ends.
- Whole flow (start → goals → finalize → history) completes in under 2 minutes.
- App runs inside **Expo Go** without native build errors.

## Recording results

Fill in each "(Expect: pass/fail)" line with the real observed outcome and
date. Only state that checks passed if they were actually executed on a device.
