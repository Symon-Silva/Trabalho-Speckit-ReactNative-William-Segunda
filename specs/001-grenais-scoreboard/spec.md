# Feature Specification: Aplicativo de Placar de Gre-Nais

**Feature Branch**: `001-grenais-scoreboard`  
**Created**: 2026-10-19  
**Status**: Draft  
**Input**: User description: "Aplicativo mobile simples para registrar partidas entre Grêmio e Internacional: iniciar partida, registrar gols, finalizar e consultar histórico persistente (SDD)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar uma partida (Priority: P1)

Como usuário, quero iniciar uma partida entre Grêmio e Internacional escolhendo a equipe mandante, para começar a registrar o resultado de um Gre-Nal.

**Why this priority**: É a porta de entrada do aplicativo; sem iniciar uma partida, nenhum dos demais fluxos pode ocorrer. Entrega valor sozinho ao validar o formulário e exibir o placar inicial.

**Independent Test**: Abrir o aplicativo, preencher o formulário com a equipe mandante e verificar que a partida inicia com placar 0 a 0.

**Acceptance Scenarios**:

1. **Given** o aplicativo aberto na tela de partida, **When** o usuário seleciona a equipe mandante e confirma, **Then** a partida inicia com placar 0 a 0.
2. **Given** o formulário sem equipe mandante selecionada, **When** o usuário tenta iniciar, **Then** o início é impedido e uma mensagem de validação é exibida.
3. **Given** uma partida já em andamento, **When** o usuário tenta iniciar outra partida, **Then** o início de nova partida não é oferecido (apenas uma partida ativa por vez).

---

### User Story 2 - Atualizar o placar (Priority: P2)

Como usuário, quero adicionar gols ao Grêmio ou ao Internacional por meio de controles individuais, para acompanhar o resultado da partida em tempo real.

**Why this priority**: Sem registrar gols, o aplicativo não cumpre sua função principal de placar. Depende da US01 para existir uma partida ativa.

**Independent Test**: Com uma partida ativa, acionar o controle de gol de cada equipe e verificar que o placar é atualizado imediatamente; verificar que nenhum valor negativo é possível.

**Acceptance Scenarios**:

1. **Given** uma partida ativa com placar X a Y, **When** o usuário adiciona um gol ao Grêmio, **Then** o placar do Grêmio é incrementado em 1 imediatamente.
2. **Given** uma partida ativa, **When** o usuário adiciona um gol ao Internacional, **Then** o placar do Internacional é incrementado em 1 imediatamente.
3. **Given** uma partida ativa com qualquer placar, **Then** nenhum placar é exibido ou alcançado com valor negativo.
4. **Given** uma partida ativa, **Then** a partida pode ser finalizada (fluxo completo de finalização concluído na US03).

---

### User Story 3 - Salvar uma partida finalizada (Priority: P2)

Como usuário, quero que o resultado seja salvo automaticamente ao finalizar a partida, para consultá-lo posteriormente mesmo após fechar o aplicativo.

**Why this priority**: Persistência dá duração ao aplicativo; sem salvar, o histórico desaparece ao fechar. Depende de uma partida em andamento (US01 + US02).

**Independent Test**: Finalizar uma partida, fechar e reabrir o aplicativo e verificar que o resultado permanece disponível para consulta (verificado na tela de histórico da US04).

**Acceptance Scenarios**:

1. **Given** uma partida ativa, **When** o usuário finaliza a partida, **Then** equipes, gols e data da partida são registrados no histórico.
2. **Given** uma partida finalizada e salva, **When** o usuário fecha e reabre o aplicativo, **Then** o registro permanece disponível.
3. **Given** uma partida já finalizada, **Then** o placar não pode mais ser alterado.
4. **Given** uma partida ativa, **When** o usuário fecha o aplicativo sem finalizar, **Then** a partida ativa não é preservada (apenas partidas finalizadas persistem).

---

### User Story 4 - Consultar o histórico (Priority: P3)

Como usuário, quero visualizar a lista das partidas finalizadas, ordenada da mais recente para a mais antiga, para consultar os resultados registrados.

**Why this priority**: É a consulta do valor acumulado; depende de partidas salvas (US03), mas pode ser testada inicialmente com a lista vazia.

**Independent Test**: Abrir a tela de histórico com a lista vazia e verificar a mensagem informativa; com registros, verificar ordem e dados exibidos.

**Acceptance Scenarios**:

1. **Given** histórico com partidas salvas, **When** o usuário abre a tela de histórico, **Then** cada partida exibe equipes, placar e data, da mais recente para a mais antiga.
2. **Given** histórico vazio, **When** o usuário abre a tela de histórico, **Then** uma mensagem informativa de lista vazia é exibida.

---

### Edge Cases

- Fechar o aplicativo com partida ativa: a partida ativa é perdida (apenas finalizadas persistem).
- Tentar iniciar nova partida com partida ativa: início não é oferecido (uma partida por vez).
- Finalizar partida com placar 0 a 0: permitido (empate é resultado válido).
- Histórico vazio: mensagem informativa exibida.
- Falha ao gravar ou ler dados locais: mensagem de erro compreensível com opção de tentar novamente; o aplicativo não encerra inesperadamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve iniciar uma partida entre Grêmio e Internacional com placar inicial 0 a 0.
- **FR-002**: O sistema deve exigir a seleção da equipe mandante por meio de um formulário validado antes de iniciar a partida.
- **FR-003**: O sistema deve permitir adicionar gols individualmente a cada equipe durante a partida, atualizando o placar imediatamente.
- **FR-004**: O sistema deve impedir que qualquer placar atinja ou exiba valor negativo.
- **FR-005**: O sistema deve permitir finalizar a partida e salvar automaticamente o resultado (equipes, gols e data) no histórico.
- **FR-006**: O sistema deve exibir o histórico das partidas finalizadas, ordenado da mais recente para a mais antiga.
- **FR-007**: O sistema deve exibir mensagem informativa quando o histórico estiver vazio.
- **FR-008**: O sistema deve preservar o histórico de partidas finalizadas entre execuções do aplicativo.
- **FR-009**: O sistema deve operar com no máximo uma partida ativa por vez.
- **FR-010**: O sistema deve impedir alterações no placar de uma partida já finalizada.
- **FR-011**: O sistema deve restringir as equipes registráveis a Grêmio e Internacional.
- **FR-012**: O sistema deve oferecer navegação clara entre as telas de início/partida e de histórico.
- **FR-013**: O sistema deve registrar a data da partida automaticamente no momento da finalização.
- **FR-014**: O sistema deve operar de forma totalmente local, sem backend, autenticação ou banco de dados remoto.

### Key Entities

- **Partida**: confronto entre Grêmio e Internacional; atributos: equipe mandante, gols do Grêmio, gols do Internacional, data/hora da finalização e situação (ativa ou finalizada). Apenas partidas finalizadas compõem o histórico. As equipes são fixas: Grêmio e Internacional (sem cadastro de outras equipes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue iniciar uma partida e ver o placar 0 a 0 em menos de 30 segundos após abrir o aplicativo.
- **SC-002**: 100% dos toques no controle de gol refletem o novo placar na tela de forma imediata, sem passos adicionais.
- **SC-003**: 100% das partidas finalizadas aparecem no histórico após fechar e reabrir o aplicativo.
- **SC-004**: O histórico exibe as partidas sempre em ordem decrescente de data, sem ação de ordenação do usuário.
- **SC-005**: O usuário consegue concluir o fluxo completo (iniciar → marcar gols → finalizar → consultar no histórico) em menos de 2 minutos.

## Assumptions

- Apenas uma partida pode estar ativa por vez; o aplicativo não oferece início de nova partida enquanto houver partida em andamento.
- A partida ativa não é preservada ao fechar o aplicativo; apenas partidas finalizadas persistem.
- Gols são adicionados apenas por incremento; não há controle de remoção de gols, e o placar nunca fica negativo por construção.
- A data registrada é a data/hora automática da finalização da partida, não uma data digitada pelo usuário.
- A escolha da equipe mandante é obrigatória e informativa (define o confronto exibido); não altera regras de placar.
- A finalização com placar 0 a 0 é permitida (empate é resultado válido).
- Exibição do histórico segue o padrão visual do dispositivo para data (formato local), sem bibliotecas adicionais de datas.
- Restrições tecnológicas de implementação (framework mobile, componente de lista, armazenamento local) são tratadas no planejamento, conforme a Constituição do projeto.
- Funcionalidades explicitamente fora do escopo: cadastro de jogadores/autores de gols, cronômetro, cartões, estatísticas avançadas, campeonatos e tabelas, integração com resultados esportivos reais, login, contas de usuário e sincronização em nuvem.
