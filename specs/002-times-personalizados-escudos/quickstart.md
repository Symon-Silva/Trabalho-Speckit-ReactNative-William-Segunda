# Quickstart: Times Personalizados com Escudos

Roteiro de validação manual em Expo Go (iOS/Android), organizado por User
Story. Cada seção é independente e pode ser executada na ordem.

**Pré-requisitos**: `npx expo start` e abrir no Expo Go, ou `npx expo start --web`
para uma passada rápida no navegador.

> Status de validação: as checagens abaixo **não** foram executadas em
> dispositivo até a data desta escrita. Não declarar nenhuma como aprovada sem
> executá-la de fato (Constituição IX).

## Checagens estáticas (sem dispositivo)

```bash
npx tsc --noEmit      # 0 erros de tipo
npx expo-doctor       # dependências/configuração sãs
```

## US1 — Times padrão com escudos

1. Apagar dados do app (ou usar instalação limpa) e abrir.
2. Ir à seleção de equipes.
   - [ ] Grêmio e Internacional aparecem com seus escudos.
3. Fechar e reabrir o app 3 vezes.
   - [ ] Cada time padrão aparece uma única vez (sem duplicatas).
4. Ativar modo avião e reabrir.
   - [ ] Os escudos de Grêmio e Internacional continuam visíveis.

## US2 — Cadastrar time personalizado

1. Abrir "Meus Times" → "Cadastrar time".
2. Informar nome válido (ex.: `Aimoré`) e um link de imagem acessível; confirmar.
   - [ ] O time aparece em "Meus Times" e na seleção de equipes com a imagem.
3. Cadastrar outro time só com nome (ex.: `Brasil de Pelotas`), sem link.
   - [ ] O time é cadastrado com um escudo alternativo (inicial do nome).
4. Tentar cadastrar com nome vazio.
   - [ ] Cadastro impedido com mensagem clara.
5. Tentar cadastrar com nome já existente (ex.: `grêmio`, `GRÊMIO `).
   - [ ] Cadastro impedido como nome duplicado.
6. Tentar cadastrar com link inválido (ex.: `ftp://x`, `www.sem-http.com`).
   - [ ] Cadastro impedido com mensagem sobre o link.
7. Fechar e reabrir o app.
   - [ ] Os times personalizados continuam disponíveis.

## US3 — Iniciar partida entre quaisquer times

1. Na seleção, escolher dois times distintos (padrão ou personalizados).
   - [ ] O placar abre em 0 a 0 com os escudos dos dois times.
2. Adicionar gols aos dois lados.
   - [ ] O placar atualiza imediatamente.
3. Tentar iniciar com o mesmo time nos dois lados.
   - [ ] O início é impedido com mensagem compreensível.
4. Finalizar a partida.
   - [ ] Resultado salvo; o app volta ao início.

## US4 — Histórico com escudos e dados preservados

1. Abrir "Histórico" com partidas salvas.
   - [ ] Cada partida mostra nomes, escudos, placar e data, da mais recente para a mais antiga.
2. Simular partida antiga: se houver dados da versão anterior, abrir o histórico.
   - [ ] As partidas antigas continuam legíveis, com fallback no lugar do escudo.
3. Finalizar uma partida com um time personalizado; depois editar esse time
   (nome/escudo) e excluí-lo; reabrir o histórico.
   - [ ] A partida antiga continua mostrando o nome e o escudo originais.
4. Informar no cadastro um link válido, porém sem carregar (ex.: imagem
   inexistente) e consultar onde o time aparece.
   - [ ] A interface mostra o fallback, sem quebrar.

## US5 — Editar e excluir times personalizados

1. Abrir "Meus Times", tocar em um time personalizado → editar nome e link.
   - [ ] Na seleção de equipes, os novos dados aparecem.
   - [ ] Partidas antigas desse time permanecem inalteradas.
2. Tentar editar para um nome já usado por outro time.
   - [ ] Alteração recusada com mensagem de validação.
3. Excluir um time personalizado e confirmar.
   - [ ] Ele some das opções de novas partidas.
   - [ ] O histórico continua íntegro.
4. Tentar editar/excluir Grêmio ou Internacional.
   - [ ] As ações não são oferecidas / são bloqueadas.
5. Cancelar uma exclusão.
   - [ ] O time continua disponível sem alterações.

## Passada final de navegação e regressão

- [ ] Navegar Iniciar → Meus Times → Formulário → volta → Iniciar sem travar.
- [ ] Iniciar → Placar → Finalizar → Iniciar → Histórico sem erros.
- [ ] Uma única partida ativa por vez continua sendo respeitada.
- [ ] Partida ativa é perdida ao fechar o app (comportamento mantido).
- [ ] Feedback ao usuário em telas vazias (sem times além dos padrão, histórico vazio).
