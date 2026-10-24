# Implementation Plan: Times Personalizados com Escudos

**Branch**: `002-times-personalizados-escudos` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-times-personalizados-escudos/spec.md`

## Summary

Tornar o placar de Gre-Nais um registrador genérico de partidas. Grêmio e
Internacional continuam disponíveis como times padrão, com escudos embutidos no
aplicativo (`assets/times/`), e o usuário passa a cadastrar, editar e excluir
seus próprios times (nome obrigatório + link de escudo opcional) em uma tela
"Meus Times". A seleção de equipes passa a listar todos os times com escudos; o
placar mostra os escudos dos dois participantes; o histórico passa a exibir os
dois times com nomes e escudos preservados no momento da finalização, mantendo
legíveis as partidas já salvas. Tudo continua local (AsyncStorage), sem backend
nem dependências novas.

## Technical Context

**Language/Version**: TypeScript (Expo SDK 58, `expo@58.0.17`, React Native 0.88, React 19)
**Primary Dependencies**: `@react-navigation/native` + `@react-navigation/native-stack` (navegação), `@react-native-async-storage/async-storage` (persistência), `react-native-safe-area-context` — todas já instaladas. Nenhuma dependência nova.
**Storage**: AsyncStorage local — chaves `@placar/times` (cadastro de times) e `@grenais/historico` (partidas finalizadas, formato migrado). Escudos padrão são assets estáticos; escudos personalizados são URLs HTTP(S) carregadas em tempo de exibição.
**Testing**: Validação manual em Expo Go conforme `quickstart.md` (sem framework de testes — não solicitado pela spec)
**Target Platform**: iOS + Android (Expo Go) com suporte a web já existente
**Project Type**: mobile-app (projeto único na raiz do repositório)
**Performance Goals**: toques de gol e navegação respondem imediatamente (estado em memória); listas dimensionadas por `FlatList`
**Constraints**: totalmente offline para cadastro e placar; escudos remotos exigem internet e falham para um fallback visual; conjunto de dependências congelado
**Scale/Scope**: 5 telas (Iniciar, Placar, Histórico, Meus Times, Cadastro/Edição de time), 3 entidades, 1 usuário local, 0 dependências novas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Fonte: `.specify/memory/constitution.md` v1.0.0.

| # | Princípio | Status | Evidência |
|---|-----------|--------|-----------|
| I | Simplicidade e Clareza | PASS | Componentes RN nativos; um único componente de escudo reutilizado; sem camadas extras; escopo restrito à spec |
| II | Componentização e Reutilização | PASS | `EscudoTime` extraído e reutilizado em seleção, placar, histórico e Meus Times; `Botao`/`Dialogo` existentes reaproveitados |
| III | SOLID (proporcional) | PASS | `storage.ts` separado entre times e histórico; telas com responsabilidade única; sem padrões arquiteturais extras |
| IV | Tecnologias e Dependências | PASS | Nenhuma dependência nova; `Image` nativo do React Native para escudos; assets locais para times padrão |
| V | TypeScript e Qualidade | PASS | Entidade `Time` tipada; `any` evitado; união de times fixos substituída por modelo tipado com id |
| VI | Interface, Formulários e Navegação | PASS | Formulário de time validado; `FlatList` em seleção/histórico/Meus Times; estados de vazio, carregando e erro; navegação em stack já existente |
| VII | SDD | PASS | Clarify → Plan → Tasks em sequência; spec é a fonte de escopo |
| VIII | Escopo e Controle de Alterações | PASS | Sem funcionalidades fora da spec; nenhum arquivo nativo (`ios/`, `android/`) tocado; alterações pequenas e localizadas |
| IX | Validação e Entrega | PASS | `quickstart.md` define checagens manuais por US; nenhuma validação é declarada sem ser executada |

**Re-check após o design (Fase 1)**: continua PASS — o design não introduziu
dependências, camadas ou escopo novos (a seção Complexity Tracking permanece
vazia).

## Project Structure

### Documentation (this feature)

```text
specs/002-times-personalizados-escudos/
├── plan.md              # Este arquivo
├── research.md          # Saída da Fase 0
├── data-model.md        # Saída da Fase 1
├── quickstart.md        # Saída da Fase 1
├── checklists/
│   └── requirements.md   # Checklist de qualidade da spec (aprovado)
└── tasks.md             # Saída da Fase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
assets/
└── times/
    ├── gremio.png            # Escudo padrão do Grêmio (embutido)
    └── internacional.png     # Escudo padrão do Internacional (embutido)

src/
├── screens/
│   ├── IniciarPartidaScreen.tsx   # Seleção de dois times + acesso a Meus Times
│   ├── PlacarScreen.tsx           # Placar com escudos dos dois times
│   ├── HistoricoScreen.tsx        # Histórico com nomes e escudos preservados
│   ├── MeusTimesScreen.tsx        # NOVO: lista com ações de editar/excluir
│   └── FormularioTimeScreen.tsx   # NOVO: cadastro e edição de time
├── components/
│   ├── PlacarTime.tsx             # Coluna do placar (time + escudo + gols)
│   ├── EscudoTime.tsx             # NOVO: imagem com fallback visual
│   ├── Botao.tsx
│   └── Dialogo.tsx
├── navigation/
│   ├── AppNavigator.tsx           # Registra Meus Times e Formulário de Time
│   └── types.ts                   # RootStackParamList atualizado
├── services/
│   └── storage.ts                 # Times (novo) + histórico (migrado)
├── types/
│   └── index.ts                   # Time, PartidaParticipante, Partida
└── theme/
    └── index.ts                   # Tokens existentes (reutilizar para escudos)
```

**Structure Decision**: Mantido o projeto único na raiz do repositório, conforme
a feature 001. Nenhuma pasta nova de arquitetura é criada; os únicos arquivos
novos são dois `screens/` (Meus Times e Formulário de Time), um `components/`
(EscudoTime) e os dois escudos padrão em `assets/times/`. Os "contratos" da
aplicação continuam sendo tipos TypeScript em `src/types/index.ts`,
`src/navigation/types.ts` e `src/services/storage.ts`, documentados em
`data-model.md` (nenhuma pasta `contracts/` é criada).

## Complexity Tracking

> Nenhuma violação da Constitution Check — tabela intencionalmente vazia.
