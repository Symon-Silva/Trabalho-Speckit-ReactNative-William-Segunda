# Feature Specification: Times Personalizados com Escudos

**Feature Branch**: `002-times-personalizados-escudos`  
**Created**: 2026-10-22  
**Status**: Draft  
**Input**: User description: "Transformar o aplicativo de placar em uma ferramenta genérica para registrar partidas entre times personalizados pelo usuário, mantendo Grêmio e Internacional como times padrão com escudos e permitindo cadastrar novos times com nome obrigatório e link opcional de escudo."

## Clarifications

### Session 2026-10-22

- Q: Os times personalizados poderão ser editados ou excluídos nesta versão? → A: Sim. Times personalizados podem ser editados e excluídos; times excluídos deixam de aparecer para novas partidas, mas o histórico mantém os nomes e escudos originais.
- Q: Onde o usuário gerencia os times personalizados? → A: Em uma tela própria "Meus Times", com a lista dos times cadastrados e ações de editar e excluir.
- Q: De onde vêm os escudos dos times padrão? → A: De imagens embutidas no próprio aplicativo, sem depender de internet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Times padrão com escudos (Priority: P1)

Como usuário, quero encontrar Grêmio e Internacional já disponíveis com seus respectivos escudos, para começar a usar o aplicativo sem precisar cadastrar times manualmente.

**Why priority**: É a base do aplicativo. Os times padrão garantem que o usuário consiga registrar uma partida desde a primeira utilização, mesmo sem criar times personalizados.

**Independent Test**: Abrir o aplicativo pela primeira vez, verificar que Grêmio e Internacional aparecem com escudos na seleção de equipes e, após fechar e reabrir, confirmar que não foram duplicados.

**Acceptance Scenarios**:

1. **Given** o aplicativo aberto pela primeira vez, **When** o usuário acessa a seleção de equipes, **Then** Grêmio e Internacional aparecem disponíveis com seus escudos.
2. **Given** que os times padrão já foram disponibilizados, **When** o usuário fecha e reabre o aplicativo, **Then** Grêmio e Internacional continuam disponíveis uma única vez cada.
3. **Given** que o dispositivo está sem acesso à internet, **When** o usuário acessa a seleção de equipes, **Then** os escudos dos times padrão continuam visíveis.

---

### User Story 2 - Cadastrar time personalizado (Priority: P1)

Como usuário, quero cadastrar meus próprios times informando um nome e, opcionalmente, o link de uma imagem de escudo, para registrar partidas entre equipes diferentes das padrão.

**Why priority**: É a funcionalidade que torna o aplicativo genérico. Sem o cadastro, o usuário continua limitado aos dois times padrão.

**Independent Test**: Cadastrar um time com nome e link de imagem, verificar que ele aparece na lista de equipes; cadastrar outro time sem imagem e verificar que recebe um escudo alternativo.

**Acceptance Scenarios**:

1. **Given** o formulário de cadastro de time, **When** o usuário informa um nome válido e um link de imagem acessível e confirma, **Then** o time é cadastrado e passa a aparecer na seleção de equipes com a imagem informada.
2. **Given** o formulário de cadastro de time, **When** o usuário informa apenas um nome válido e confirma, **Then** o time é cadastrado com um escudo padrão ou elemento visual de substituição.
3. **Given** o formulário com nome vazio ou composto apenas por espaços, **When** o usuário tenta cadastrar, **Then** o cadastro é impedido e uma mensagem de validação é exibida.
4. **Given** o formulário com um link de imagem malformado ou com protocolo inválido, **When** o usuário tenta cadastrar, **Then** o cadastro é impedido e uma mensagem de validação é exibida.
5. **Given** um time personalizado salvo, **When** o usuário fecha e reabre o aplicativo, **Then** o time continua disponível na seleção de equipes.

---

### User Story 3 - Iniciar partida entre quaisquer times cadastrados (Priority: P2)

Como usuário, quero escolher dois times cadastrados para iniciar uma partida, para registrar resultados entre qualquer par de equipes disponíveis.

**Why priority**: Conecta o cadastro de times ao fluxo principal do aplicativo. Depende de existir pelo menos dois times disponíveis, o que já é garantido pelos times padrão.

**Independent Test**: Selecionar dois times distintos, iniciar a partida, adicionar gols e finalizar, verificando que o placar e o resultado funcionam como antes.

**Acceptance Scenarios**:

1. **Given** a seleção de equipes, **When** o usuário escolhe dois times distintos e confirma, **Then** a partida inicia com placar 0 a 0 e os escudos dos dois times são exibidos.
2. **Given** que o usuário selecionou o mesmo time para os dois lados, **When** ele tenta iniciar a partida, **Then** o início é impedido com uma mensagem compreensível.
3. **Given** uma partida em andamento, **When** o usuário adiciona gols a qualquer um dos times, **Then** o placar é atualizado imediatamente.
4. **Given** uma partida em andamento, **When** o usuário finaliza a partida, **Then** o resultado é salvo no histórico com os dois times, o placar e a data de finalização.
5. **Given** uma partida já em andamento, **When** o usuário tenta iniciar outra partida, **Then** o comportamento existente de permitir apenas uma partida ativa por vez é preservado.

---

### User Story 4 - Histórico com escudos e dados preservados (Priority: P2)

Como usuário, quero visualizar no histórico os nomes e escudos dos times que participaram de cada partida, para consultar resultados antigos mesmo que os dados dos times mudem posteriormente.

**Why priority**: O histórico é a memória do aplicativo. Sem preservar os dados da partida, resultados antigos poderiam ficar ambíguos ou quebrar quando um time fosse alterado.

**Independent Test**: Finalizar partidas entre times diferentes, abrir o histórico e verificar nomes, escudos, placar e datas; depois editar ou excluir um time e confirmar que os resultados antigos continuam legíveis.

**Acceptance Scenarios**:

1. **Given** um histórico com partidas finalizadas, **When** o usuário abre o histórico, **Then** cada partida exibe os nomes dos dois times, seus escudos, o placar e a data, da mais recente para a mais antiga.
2. **Given** partidas salvas antes da atualização do aplicativo, **When** o usuário abre o histórico, **Then** os resultados continuam visíveis e legíveis, sem erros.
3. **Given** que os dados de um time foram alterados ou que ele deixou de estar disponível para novas partidas, **When** o usuário consulta uma partida antiga, **Then** o histórico continua exibindo os nomes e escudos originais daquela partida.
4. **Given** um escudo que não pode ser carregado, **When** o usuário consulta a partida no histórico, **Then** uma alternativa visual é exibida no lugar da imagem, sem quebrar a interface.
5. **Given** um histórico vazio, **When** o usuário abre a tela, **Then** uma mensagem informativa de lista vazia é exibida.

---

### User Story 5 - Editar e excluir times personalizados (Priority: P3)

Como usuário, quero editar ou excluir os times que cadastrei, para corrigir dados e manter a lista de seleção alinhada às equipes que desejo usar.

**Why priority**: Complementa o cadastro e permite manter os times atualizados. Depende dos times personalizados já cadastrados e não deve comprometer partidas já salvas.

**Independent Test**: Acessar a tela "Meus Times", editar o nome e o escudo de um time e verificar a atualização na seleção; excluir outro time e confirmar que ele some das novas partidas, enquanto o histórico das partidas antigas permanece inalterado.

**Acceptance Scenarios**:

1. **Given** um time personalizado cadastrado, **When** o usuário altera seu nome ou escudo e confirma, **Then** os novos dados passam a ser exibidos na seleção de equipes.
2. **Given** um time personalizado cadastrado, **When** o usuário exclui o time e confirma a ação, **Then** o time deixa de aparecer na seleção para novas partidas.
3. **Given** um time excluído que participou de partidas antigas, **When** o usuário consulta o histórico, **Then** as partidas continuam exibindo os nomes e escudos originais.
4. **Given** um time editado, **When** o usuário consulta partidas antigas desse time, **Then** o histórico continua exibindo os dados originais usados naquelas partidas.
5. **Given** que o usuário cancela uma edição ou exclusão, **When** retorna à lista de times, **Then** nenhum dado do time é alterado.
6. **Given** uma tentativa de editar um time para um nome já utilizado por outro, **When** o usuário confirma, **Then** a alteração é recusada com mensagem de validação.

---

### Edge Cases

- Nome composto apenas por espaços deve ser tratado como inválido.
- Nome com espaços no início ou no final deve ser armazenado sem esses espaços.
- Nomes duplicados, ignorando diferenças de maiúsculas/minúsculas e espaços excedentes, devem ser recusados para evitar ambiguidade na seleção, tanto no cadastro quanto na edição.
- Nome excessivamente longo deve ser recusado com mensagem clara sobre o limite.
- A edição deve validar os mesmos critérios do cadastro antes de salvar as alterações.
- A exclusão de um time personalizado deve exigir confirmação do usuário.
- A exclusão deve remover o time apenas das opções de novas partidas, sem apagar ou alterar partidas já registradas no histórico.
- Times padrão não podem ser editados nem excluídos.
- Se a exclusão de um time for cancelada, o time deve continuar disponível sem alterações.
- Link de imagem vazio deve ser tratado como ausência de imagem, não como erro.
- Link com protocolo diferente de HTTP ou HTTPS deve ser recusado.
- Link sintaticamente válido, mas cuja imagem não carrega, deve resultar em escudo alternativo.
- Link apontando para conteúdo que não é uma imagem deve resultar em escudo alternativo.
- Falha de rede ao carregar um escudo remoto não pode impedir a seleção, o placar ou a consulta ao histórico.
- Escudos com proporções diferentes devem ser exibidos sem distorção e com dimensões consistentes.
- Nomes longos devem permanecer legíveis e não podem ser encobertos pelo escudo.
- O usuário não deve conseguir iniciar uma partida com o mesmo time nos dois lados.
- O cadastro deve impedir times duplicados mesmo após fechar e reabrir o aplicativo.
- A inicialização repetida dos times padrão não pode criar cópias adicionais.
- Falha ao carregar ou salvar dados locais deve exibir mensagem compreensível, sem encerrar o aplicativo inesperadamente.
- Partidas antigas que não possuem informação de escudo devem ser exibidas com uma alternativa visual padrão.
- Partidas finalizadas com placar 0 a 0 continuam válidas.
- A partida ativa continua sendo perdida ao fechar o aplicativo, preservando o comportamento existente; apenas partidas finalizadas são mantidas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar Grêmio e Internacional como times padrão desde a primeira utilização do aplicativo.
- **FR-002**: O sistema MUST exibir os escudos de Grêmio e Internacional na interface.
- **FR-003**: O sistema MUST garantir que os times padrão sejam disponibilizados apenas uma vez, sem duplicação em inicializações posteriores.
- **FR-004**: Os escudos dos times padrão MUST ser fornecidos pelo próprio aplicativo, como imagens embutidas, sem depender de acesso à internet.
- **FR-005**: O sistema MUST permitir que o usuário cadastre um time personalizado informando nome obrigatório e link de imagem de escudo opcional.
- **FR-006**: O sistema MUST validar o nome do time antes do cadastro, recusando nomes vazios, compostos apenas por espaços ou que excedam o limite definido.
- **FR-007**: O sistema MUST normalizar o nome removendo espaços no início e no final antes de validar e salvar.
- **FR-008**: O sistema MUST recusar nomes de times duplicados, considerando diferenças de maiúsculas/minúsculas e espaços excedentes.
- **FR-009**: O sistema MUST validar o link de imagem, quando informado, exigindo um endereço HTTP ou HTTPS sintaticamente válido.
- **FR-010**: O sistema MUST exibir mensagens de validação compreensíveis e impedir o cadastro quando os dados forem inválidos.
- **FR-011**: O sistema MUST usar o escudo padrão ou um elemento visual de substituição quando nenhum link de imagem for informado.
- **FR-012**: O sistema MUST exibir uma alternativa visual quando um escudo não puder ser carregado, sem quebrar a interface.
- **FR-013**: Os escudos MUST ser exibidos com dimensões consistentes e proporções preservadas, sem distorção.
- **FR-014**: Os nomes dos times MUST permanecer legíveis independentemente do tamanho ou formato do escudo.
- **FR-015**: O sistema MUST exibir todos os times disponíveis, com nomes e escudos, na seleção de equipes.
- **FR-016**: O sistema MUST permitir iniciar uma partida somente após a seleção de dois times distintos e disponíveis.
- **FR-017**: O sistema MUST impedir o início de partida com o mesmo time nos dois lados.
- **FR-018**: O sistema MUST preservar o fluxo existente de adicionar gols e finalizar a partida.
- **FR-019**: O sistema MUST registrar automaticamente a data de finalização da partida.
- **FR-020**: O sistema MUST exibir, no histórico, os nomes e escudos dos dois times, o placar e a data de cada partida, em ordem da mais recente para a mais antiga.
- **FR-021**: O sistema MUST preservar, em cada partida finalizada, uma referência histórica aos nomes e escudos dos times participantes.
- **FR-022**: O sistema MUST manter partidas antigas legíveis mesmo que os dados dos times sejam alterados ou que um time seja excluído.
- **FR-023**: O sistema MUST manter partidas salvas antes da atualização acessíveis, exibindo uma alternativa visual quando não houver informação de escudo.
- **FR-024**: O sistema MUST persistir localmente os times personalizados e as partidas finalizadas entre execuções do aplicativo.
- **FR-025**: O sistema MUST manter os times personalizados disponíveis após fechar e reabrir o aplicativo, exceto aqueles que forem excluídos pelo usuário.
- **FR-026**: O sistema MUST operar sem backend, autenticação ou banco de dados remoto para o cadastro de times.
- **FR-027**: O sistema MUST exibir mensagens compreensíveis quando houver falha ao carregar ou salvar dados locais, sem encerrar inesperadamente.
- **FR-028**: O sistema MUST preservar as funcionalidades existentes de placar, finalização e consulta ao histórico.
- **FR-029**: O sistema MUST permitir que o usuário edite o nome e o link de escudo de um time personalizado.
- **FR-030**: O sistema MUST validar as alterações de um time com os mesmos critérios usados no cadastro, incluindo a unicidade do nome.
- **FR-031**: O sistema MUST permitir que o usuário exclua um time personalizado, mediante confirmação.
- **FR-032**: O sistema MUST remover um time excluído das opções de novas partidas.
- **FR-033**: O sistema MUST impedir a edição ou exclusão dos times padrão Grêmio e Internacional.
- **FR-034**: O sistema MUST preservar os dados históricos das partidas quando um time for editado ou excluído, sem alterar nomes, escudos, placares ou datas já registrados.
- **FR-035**: O sistema MUST oferecer uma tela "Meus Times" com a lista dos times cadastrados, a partir da qual o usuário acessa o cadastro, a edição e a exclusão.
- **FR-036**: O sistema MUST permitir acesso à tela "Meus Times" a partir da tela de seleção de equipes, preservando a navegação existente entre início, placar e histórico.

### Key Entities

- **Time**: equipe disponível para partidas; possui identificação própria, nome de exibição, indicação de ser padrão ou personalizado e referência opcional a uma imagem de escudo. Times padrão são sempre disponíveis e não podem ser editados nem removidos. Times personalizados são criados pelo usuário com nome obrigatório e escudo opcional, podendo ser editados ou excluídos. A exclusão remove o time apenas das novas partidas.
- **Partida**: confronto finalizado entre dois times; possui identificação própria, os dois participantes com seus nomes e escudos registrados no momento da finalização, o placar de cada lado e a data de finalização. Partidas finalizadas são imutáveis e não dependem da disponibilidade atual dos times para serem exibidas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das primeiras utilizações, Grêmio e Internacional estão disponíveis com escudos visíveis.
- **SC-002**: Após 10 aberturas consecutivas do aplicativo, os times padrão continuam existindo exatamente uma vez cada.
- **SC-003**: O usuário consegue cadastrar um novo time em menos de 60 segundos, com ou sem link de escudo.
- **SC-004**: 100% dos cadastros com nome vazio, inválido ou duplicado são recusados com mensagem clara.
- **SC-005**: 100% dos links de imagem inválidos ou que falham ao carregar resultam em alternativa visual, sem falha da interface.
- **SC-006**: Todos os escudos exibidos mantêm dimensões consistentes e proporções preservadas em 100% das telas de seleção, placar e histórico.
- **SC-007**: Times personalizados e partidas finalizadas permanecem disponíveis após 100% das reinicializações testadas.
- **SC-008**: O usuário consegue concluir o fluxo de iniciar partida, marcar gols, finalizar e consultar o histórico em menos de 2 minutos.
- **SC-009**: 100% das partidas antigas continuam legíveis após a atualização e após edição ou exclusão dos times.
- **SC-010**: Os fluxos existentes de placar, finalização e histórico continuam funcionando sem regressões nos critérios de aceite originais.
- **SC-011**: 100% das edições válidas de nome ou escudo passam a aparecer na seleção de equipes e nas novas partidas.
- **SC-012**: 100% dos times excluídos deixam de aparecer nas opções de novas partidas após a confirmação.
- **SC-013**: 100% das partidas antigas de um time editado ou excluído permanecem com os nomes, escudos, placares e datas originais.

## Assumptions

- Nomes de times são normalizados removendo espaços nas extremidades, devem ter entre 2 e 50 caracteres e devem ser únicos sem diferenciar maiúsculas de minúsculas.
- Nomes podem conter letras, números, acentos, hífens e espaços internos; a forma de exibição informada pelo usuário é preservada após a normalização.
- Links de escudo devem usar HTTP ou HTTPS; upload de arquivos de imagem não faz parte deste escopo.
- Escudos remotos dependem de acesso à internet; não é prometido armazenamento offline das imagens externas.
- Escudos padrão são imagens embutidas no próprio aplicativo e não dependem de serviços externos.
- Times personalizados podem ser editados e excluídos; os times padrão não podem ser editados nem removidos.
- A exclusão de um time personalizado remove-o apenas das opções de novas partidas; partidas já finalizadas permanecem inalteradas.
- O histórico armazena uma cópia dos dados de exibição dos times no momento da finalização, garantindo que partidas antigas não dependam de edições ou exclusões posteriores.
- Não faz parte deste escopo gerenciar jogadores, cronômetro, cartões, estatísticas, campeonatos, contas de usuário ou sincronização em nuvem.
- Partidas salvas antes desta melhoria, que não possuem escudos associados, devem usar uma alternativa visual compatível com o novo padrão.
- Apenas partidas finalizadas persistem; a partida ativa continua sendo perdida ao fechar o aplicativo, conforme comportamento existente.
- A navegação, os componentes visuais e os serviços existentes devem ser reutilizados quando apropriado; detalhes de implementação e dependências são definidos na etapa de planejamento.
- As restrições técnicas do projeto permanecem inalteradas e serão tratadas no planejamento, sem introduzir backend, autenticação ou banco de dados remoto.
