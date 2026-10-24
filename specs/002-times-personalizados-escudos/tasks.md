---

description: "Lista de tarefas para Times Personalizados com Escudos"
---

# Tasks: Times Personalizados com Escudos

**Input**: Documentos de design de `/specs/002-times-personalizados-escudos/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Testes automatizados **não** estão incluídos — a spec prevê validação manual em Expo Go. Cada fase de história termina com uma tarefa de validação manual referenciando o quickstart.

**Organization**: Tarefas agrupadas por história para permitir implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: História à qual a tarefa pertence (US1, US2, ...)
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

- **Projeto único**: `assets/`, `src/` na raiz do repositório (app Expo na raiz, conforme plan.md).

## Phase 1: Setup (Infra compartilhada)

**Purpose**: Preparar assets que todos os times padrão usam

- [X] T001 Criar os escudos padrão em `assets/times/gremio.png` e `assets/times/internacional.png` (PNGs válidos, quadrados, com marcação provisória do nome de cada time)
- [X] T002 [P] Verificar o TypeScript de base antes das mudanças: `npx tsc --noEmit` deve sair sem erros no estado atual

---

## Phase 2: Foundational (Pré-requisitos bloqueantes)

**Purpose**: Módulos tipados e persistência que TODAS as histórias dependem

**⚠️ CRITICAL**: Nenhuma história começa antes desta fase terminar

- [X] T003 Reescrever `src/types/index.ts`: definir `interface Time`, `interface PartidaParticipante`, `interface Partida` (participantes + gols por id + finalizadaEm) e `const TIMES_PADRAO` com `padrao-gremio` e `padrao-internacional`; remover a união fixa `type Equipe` e a lista `EQUIPES`
- [X] T004 Estender `src/services/storage.ts`: `carregarTimes()` (chave `@placar/times`, semeia `TIMES_PADRAO` sem duplicar, retorna `Time[]`), `salvarTime(time)` (cria/atualiza) e `excluirTime(id)` (apenas da lista); try/catch deixando erros propagarem (depende de T003)
- [X] T005 Implementar `validarTime(nome, escudoUrl, times, idAtual?)` em `src/services/storage.ts`: trim, 2 a 50 caracteres, unicidade sem diferenciar maiúsculas ignorando o próprio id, e link vazio ou `/^https?:\/\/.+/i`; retornar mensagens por campo (depende de T003)
- [X] T006 Migrar `src/services/storage.ts` do histórico: `carregarHistorico()` converte partidas no formato antigo (`mandante` + `gols` com chaves `'Grêmio'`/`'Internacional'`) para o novo formato com `participantes` e `gols` por id, preservando placar/data e descartando itens irrecuperáveis; manter ordenação por `finalizadaEm` DESC (depende de T003)
- [X] T007 Atualizar `src/navigation/types.ts`: `RootStackParamList` com `Placar: { participantes: [PartidaParticipante, PartidaParticipante] }`, `MeusTimes: undefined` e `FormularioTime: { timeId?: string }` (depende de T003)
- [X] T008 Atualizar `src/navigation/AppNavigator.tsx`: registrar as telas `MeusTimes` e `FormularioTime` com títulos e reutilizar o estilo de header existente (depende de T007)

**Checkpoint**: Tipos, persistência e rotas prontos; as histórias podem começar

---

## Phase 3: User Story 1 - Times padrão com escudos (Priority: P1) 🎯 MVP

**Goal**: Grêmio e Internacional disponíveis com escudos, sem duplicação e sem depender de internet

**Independent Test**: Abrir o app em instalação limpa → ver os dois times com escudos na seleção → fechar/reabrir 3x → sem duplicatas; em modo avião, escudos continuam visíveis (quickstart §US1)

### Implementation for User Story 1

- [X] T009 [P] [US1] Criar `src/components/EscudoTime.tsx`: props `{ nome, escudoUrl?, padrao?, tamanho? }`; asset local quando `padrao` (mapa id→require), `Image` com `onError` para link, fallback circular com a inicial; dimensões consistentes via tokens de `src/theme`
- [X] T010 [US1] Reescrever `src/screens/IniciarPartidaScreen.tsx`: carregar times de `carregarTimes()`, listar todos com `EscudoTime` na seleção, estados de carregando/erro, e manter os botões "Iniciar partida" e "Ver histórico" (depende de T004, T009)
- [X] T011 [US1] Exibir os escudos dos times padrão também como base do cabeçalho/lista, reutilizando `EscudoTime`, e remover qualquer uso residual de `EQUIPES`/`Equipe` no arquivo (depende de T010)
- [ ] T012 [US1] Validar US1 conforme `quickstart.md` §US1 (sem duplicatas após 3 aberturas; escudos visíveis offline) e registrar o resultado real

**Checkpoint**: US1 funcional — os times padrão existem e aparecem com escudos (MVP parcial)

---

## Phase 4: User Story 2 - Cadastrar time personalizado (Priority: P1)

**Goal**: Cadastro de times com nome obrigatório e link de escudo opcional, validado

**Independent Test**: Cadastrar time com nome+link e outro só com nome; validar erros de nome/duplicado/link; reabrir app e confirmar persistência (quickstart §US2)

### Implementation for User Story 2

- [X] T013 [P] [US2] Criar `src/screens/FormularioTimeScreen.tsx`: usar `useLocalSearchParams` para `timeId`, campos de nome e link via `TextInput`, chamada a `validarTime`, mensagens de erro, salvamento com `salvarTime` e retorno a "Meus Times" (depende de T004, T005, T007)
- [X] T014 [US2] Implementar o estado de feedback no formulário: mensagem de sucesso ao salvar e tratamento de erro de armazenamento usando `Dialogo`, sem encerrar o app (depende de T013)
- [X] T015 [US2] Garantir que a tela de seleção reflita um time recém-cadastrado ao voltar (recarregar com `useFocusEffect` ou ao focar) em `src/screens/IniciarPartidaScreen.tsx` (depende de T010, T013)
- [ ] T016 [US2] Validar US2 conforme `quickstart.md` §US2 (nome+link; só nome; nome vazio; duplicado; link inválido; persistência) e registrar o resultado real

**Checkpoint**: US1 e US2 funcionam; cadastro de times operante

---

## Phase 5: User Story 3 - Iniciar partida entre quaisquer times (Priority: P2)

**Goal**: Selecionar dois times distintos, jogar com escudos no placar e finalizar preservando snapshot

**Independent Test**: Escolher dois times → placar 0 a 0 com escudos → gols → finalizar → resultado no histórico (quickstart §US3)

### Implementation for User Story 3

- [X] T017 [US3] Atualizar `src/screens/IniciarPartidaScreen.tsx`: seleção de dois times distintos (mandante/visitante), impedir o mesmo time nos dois lados, e navegar com `replace('Placar', { participantes })` montando os `PartidaParticipante` (depende de T007, T010)
- [X] T018 [P] [US3] Atualizar `src/components/PlacarTime.tsx`: receber `participante` (nome + escudo) e renderizar `EscudoTime` no lugar do avatar com inicial (depende de T009)
- [X] T019 [US3] Reescrever `src/screens/PlacarScreen.tsx`: ler `participantes` da rota, `gols` como `Record<string, number>` chaveado por id, renderizar os dois `PlacarTime` com escudos, e ao finalizar montar `Partida` com snapshot (depois chamar `salvarPartida`) (depende de T018)
- [X] T020 [US3] Preservar o fluxo existente de finalização: confirmação com `Dialogo`, reset para `Iniciar` no sucesso e mensagem de erro quando `salvarPartida` falhar (depende de T019)
- [ ] T021 [US3] Validar US3 conforme `quickstart.md` §US3 (dois times distintos; mesmo time bloqueado; gols imediatos; finalização salvando) e registrar o resultado real

**Checkpoint**: US1–US3 funcionais; fluxo completo de partida com times personalizados

---

## Phase 6: User Story 4 - Histórico com escudos e dados preservados (Priority: P2)

**Goal**: Histórico exibe nomes, escudos, placar e data; partidas antigas continuam legíveis

**Independent Test**: Abrir histórico com partidas → ver escudos/placar/data; editar/excluir um time → partidas antigas inalteradas; dados antigos migrados permanecem legíveis (quickstart §US4)

### Implementation for User Story 4

- [X] T022 [US4] Reescrever `src/screens/HistoricoScreen.tsx`: renderizar cada `Partida` com dois `EscudoTime`, nomes dos participantes, placar (por id) e `toLocaleDateString('pt-BR')`, mantendo `FlatList`, estado vazio, carregando e erro com "Tentar novamente" (depende de T006, T009)
- [X] T023 [US4] Garantir o fallback visual para escudos ausentes/antigos (`escudoUrl: null`) em `HistoricoScreen` via `EscudoTime`, sem quebrar a lista (depende de T022)

**Checkpoint**: Histórico íntegro, com escudos e dados preservados

---

## Phase 7: User Story 5 - Editar e excluir times personalizados (Priority: P3)

**Goal**: Tela "Meus Times" com lista e ações de editar/excluir; padrão protegido; histórico intacto

**Independent Test**: Editar time → reflete na seleção; excluir → some das novas partidas; histórico inalterado; padrão bloqueado; cancelar não altera (quickstart §US5)

### Implementation for User Story 5

- [X] T024 [P] [US5] Criar `src/screens/MeusTimesScreen.tsx`: `FlatList` dos times com `EscudoTime`, botão "Cadastrar time" (navega para `FormularioTime`) e ações de editar (`FormularioTime` com `timeId`) e excluir, ocultas/bloqueadas para `padrao` (depende de T004, T009)
- [X] T025 [US5] Adicionar a confirmação de exclusão em `MeusTimesScreen` usando `Dialogo` e chamar `excluirTime`, tratando erros de armazenamento (depende de T024)
- [X] T026 [US5] Estender `src/screens/FormularioTimeScreen.tsx` para modo edição: carregar o time por `timeId`, pré-preencher os campos e atualizar via `salvarTime`, reaplicando `validarTime` (depende de T005, T013)
- [X] T027 [US5] Adicionar em `src/screens/IniciarPartidaScreen.tsx` o acesso à tela "Meus Times" (botão), preservando os fluxos existentes (depende de T010, T024)
- [ ] T028 [US5] Validar US5 conforme `quickstart.md` §US5 (editar, duplicado na edição, excluir, padrão protegido, cancelar) e registrar o resultado real

**Checkpoint**: Todas as histórias independentemente funcionais

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verificação final e limpeza

- [X] T029 [P] Rodar `npx tsc --noEmit` e corrigir erros; remover imports mortos e resíduos de `EQUIPES`/`Equipe` em `src/`
- [X] T030 [P] Rodar `npx expo-doctor` e resolver problemas de dependência/configuração
- [ ] T031 Executar `quickstart.md` por completo em Expo Go (US1–US5 + navegação/regressão) e registrar cada resultado honestamente
- [X] T032 [P] Auditar escopo e Constituição: nenhuma dependência nova em `package.json`, nenhum nativo criado/alterado, nenhum `any`/`@ts-ignore` em `src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode iniciar já
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as histórias
- **User Stories (Phase 3+)**: dependem da Foundational
  - US1 primeiro (base da seleção de equipes)
  - US2 depende de US1 (tela de seleção já refatorada)
  - US3 depende de US1 (usa `EscudoTime` e navegação)
  - US4 pode rodar após a Foundational; integra com US2/US3 na validação
  - US5 depende de US1 e US2 (reusa formulário e escudo)
- **Polish (Phase 8)**: depende das histórias desejadas completas

### User Story Dependencies

- **US1 (P1)**: após Foundational — sem dependências
- **US2 (P1)**: após Foundational + US1 (reusa seleção e navegação)
- **US3 (P2)**: após Foundational + US1 (usa `EscudoTime` e tipos)
- **US4 (P2)**: após Foundational; beneficia-se de US3 para dados reais, mas testável com histórico migrado
- **US5 (P3)**: após Foundational + US2 (modo edição no formulário)

### Within Each User Story

- Validação manual após a implementação da história
- Modelos/tipos antes de serviços; serviços antes de telas
- Checkpoint de cada história antes de avançar

### Parallel Opportunities

- T001 ∥ T002
- T004 ∥ T005 ∥ T006 ∥ T007 (arquivos distintos; T007 só depende de T003)
- T009 ∥ T012 (independentes dentro de US1, respeitando dependências)
- T013 ∥ T018 (arquivos distintos)
- T022 ∥ T024 (arquivos distintos)
- T029 ∥ T030 ∥ T032

---

## Parallel Example: Foundational

```text
# Após T003, lançar em paralelo:
Task: "T004 persistência de times em src/services/storage.ts"
Task: "T005 validarTime em src/services/storage.ts"
Task: "T006 migração do histórico em src/services/storage.ts"
Task: "T007 RootStackParamList em src/navigation/types.ts"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Fase 1: Setup
2. Fase 2: Foundational (CRÍTICA)
3. US1 → validar → times padrão com escudos
4. US2 → validar → cadastro de times
5. **PARAR e VALIDAR** o MVP: os times padrão e personalizados aparecem com escudos

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → validar → times padrão com escudos
3. US2 → validar → cadastro
4. US3 → validar → partidas entre quaisquer times
5. US4 → validar → histórico com escudos
6. US5 → validar → edição/exclusão

---

## Notes

- `[P]` = arquivos distintos, sem dependência
- Testes automatizados não incluídos (validação manual conforme a spec)
- Não criar nem editar `ios/` ou `android/` (geração automática)
- Validações em dispositivo permanecem **abertas** até serem realmente executadas
