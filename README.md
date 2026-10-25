# Aplicativo de Placar de Gre-Nais

Desenvolva a especificação de um aplicativo mobile simples para registrar partidas entre Grêmio e Internacional, utilizando a abordagem Spec-Driven Development (SDD).

## Objetivo

Permitir que o usuário inicie uma partida entre Grêmio e Internacional, registre os gols das duas equipes, finalize a partida e consulte um histórico persistente dos resultados.

## Público-alvo

Usuários que desejam registrar manualmente os resultados de partidas entre Grêmio e Internacional.

## Funcionalidades obrigatórias

1. Iniciar uma partida entre Grêmio e Internacional, permitindo escolher a equipe mandante por meio de um formulário validado.
2. Exibir um placar inicial de 0 a 0 e permitir adicionar gols individualmente para cada equipe.
3. Finalizar uma partida e salvar seu resultado no histórico.
4. Consultar o histórico das partidas finalizadas, ordenado da mais recente para a mais antiga.
5. Preservar o histórico após fechar e reabrir o aplicativo.

## User Stories e critérios de aceite

### US01 — Iniciar uma partida

Como usuário, quero iniciar uma partida entre Grêmio e Internacional, para registrar o resultado de um Gre-Nal.

Critérios de aceite:
- Permitir escolher qual equipe será a mandante.
- Validar os campos obrigatórios antes de iniciar.
- Iniciar o placar em 0 a 0.
- Impedir o início quando os dados do formulário forem inválidos.

### US02 — Atualizar o placar

Como usuário, quero adicionar gols ao Grêmio ou ao Internacional, para acompanhar o resultado da partida.

Critérios de aceite:
- Permitir adicionar gols individualmente a cada equipe.
- Atualizar o placar imediatamente.
- Impedir valores negativos.
- Permitir finalizar a partida.

### US03 — Salvar uma partida finalizada

Como usuário, quero salvar o resultado de uma partida finalizada, para consultá-lo posteriormente.

Critérios de aceite:
- Salvar o resultado ao finalizar a partida.
- Registrar equipes, gols e data da partida.
- Impedir alterações acidentais no placar de uma partida finalizada.
- Manter os dados disponíveis após fechar e reabrir o aplicativo.

### US04 — Consultar o histórico

Como usuário, quero visualizar as partidas finalizadas, para consultar os resultados registrados.

Critérios de aceite:
- Exibir equipes, placar e data.
- Ordenar as partidas da mais recente para a mais antiga.
- Utilizar FlatList para renderizar a lista.
- Exibir uma mensagem informativa quando o histórico estiver vazio.

## Requisitos técnicos e restrições

- Utilizar React Native, Expo e TypeScript.
- Implementar pelo menos duas telas com navegação.
- Implementar pelo menos um formulário com validação.
- Utilizar FlatList para o histórico.
- Salvar os dados localmente no dispositivo, com persistência entre execuções do aplicativo.
- Não utilizar backend, autenticação ou banco de dados remoto.
- Não permitir o cadastro de equipes diferentes de Grêmio e Internacional.
- Seguir a Constituição do projeto, priorizando simplicidade, componentização adequada, reutilização, tipagem segura e dependências mínimas.
- Não adicionar funcionalidades fora do escopo aprovado.

## Fora do escopo

- Cadastro de jogadores e autores dos gols.
- Cronômetro, cartões e estatísticas avançadas.
- Campeonatos, classificação e tabela de pontos.
- Integração com resultados esportivos reais.
- Login, contas de usuário e sincronização em nuvem.

## Diretrizes para a especificação

Produza uma especificação funcional clara, com cenários verificáveis e critérios de aceite objetivos. Preserve as quatro User Stories e suas intenções. Não implemente o aplicativo nesta etapa e não antecipe decisões detalhadas de arquitetura ou dependências, que serão tratadas durante o planejamento.



Essa era a ideia inicial, no começo eram apenas Grêmio e Inter que podiam participar
