<!-- Sync Impact Report
- Version change: template (unversioned) → 1.0.0
- Modified principles: 5 placeholder principles → 9 concrete principles (I–IX)
- Added sections: Princípios Centrais (I–IX), Governança (Prioridade das Regras,
  Procedimento de Emenda, Política de Versionamento, Revisão de Conformidade)
- Removed sections: all template placeholder tokens ([PROJECT_NAME],
  [PRINCIPLE_*], [SECTION_2_*], [SECTION_3_*], [GOVERNANCE_RULES],
  [CONSTITUTION_VERSION], [RATIFICATION_DATE], [LAST_AMENDED_DATE])
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no change (Constitution Check defers to this file)
  - .specify/templates/spec-template.md ✅ no change (no mandatory sections added)
  - .specify/templates/tasks-template.md ✅ no change (tests remain optional per spec)
  - .specify/templates/checklist-template.md ✅ no change (generic)
  - .opencode/command/*.md ✅ no change (no agent-specific references)
  - AGENTS.md ✅ no change (generic plan pointer)
- Follow-up TODOs: none
-->
# aula-speckit Constitution

## Princípios Centrais

### I. Simplicidade e Clareza

- O código deve ser simples, legível e fácil de entender por um estudante em fase de aprendizado.
- Soluções diretas têm prioridade; complexidade desnecessária, abstrações prematuras e padrões de projeto sem necessidade real são evitados.
- Cada funcionalidade é implementada da maneira mais simples que atende corretamente aos requisitos.
- Não são adicionadas funcionalidades, telas ou comportamentos que não estejam definidos nas especificações aprovadas.

### II. Componentização e Reutilização

- A interface é organizada em componentes reutilizáveis, com responsabilidades bem definidas.
- Componentes são extraídos somente quando há reutilização real ou quando a extração melhora significativamente a organização e a legibilidade.
- Comportamentos compartilhados mantêm uma única implementação quando apropriado.
- Cada componente tem propósito claro; não são criados componentes excessivamente grandes ou com responsabilidades não relacionadas.
- Componentes ou abstrações não são criados apenas para aumentar a quantidade de arquivos.

### III. Boas Práticas e Princípios SOLID

- Os princípios SOLID são aplicados de forma proporcional ao tamanho e à complexidade do projeto.
- Responsabilidade única: cada componente, função e módulo mantêm uma finalidade clara.
- Responsabilidades de interface, regras de negócio e manipulação de dados são separadas quando essa separação traz benefícios concretos.
- Mantêm-se funções pequenas, nomes descritivos e fluxo de execução fácil de acompanhar.
- Duplicação de lógica, acoplamento desnecessário e dependências entre módulos que dificultem futuras alterações são evitados.
- Camadas, interfaces ou padrões arquiteturais complexos não são introduzidos sem justificativa.

### IV. Tecnologias e Dependências

- React Native com Expo e TypeScript são utilizados, conforme os requisitos do projeto.
- Recursos nativos do React, React Native e Expo, bem como dependências oficiais já presentes no projeto, têm prioridade.
- Bibliotecas externas não são instaladas quando a funcionalidade pode ser implementada de maneira simples, segura e adequada com os recursos disponíveis.
- Novas dependências são adicionadas somente quando necessárias para atender aos requisitos ou quando há justificativa técnica clara.
- Toda nova dependência tem sua necessidade explicada antes da instalação, aguardando autorização.
- Não são instaladas bibliotecas redundantes, desnecessárias ou destinadas a resolver problemas que não existem.
- Dependências existentes não são atualizadas, substituídas ou removidas sem necessidade justificada e autorização.
- Bibliotecas de estilização, gerenciamento de estado, formulários ou outras soluções adicionais não são utilizadas sem necessidade comprovada.

### V. TypeScript e Qualidade do Código

- TypeScript é utilizado para tipar componentes, propriedades, funções, estados e dados sempre que aplicável.
- `any` é evitado; tipos explícitos e soluções seguras são preferidos.
- Supressões de erros de TypeScript não são utilizadas para esconder problemas que deveriam ser corrigidos.
- Nomes de variáveis, funções, componentes e tipos são claros e consistentes.
- Código morto, imports não utilizados, funções duplicadas e comentários que apenas repetem o código são evitados.
- Comentários são adicionados quando ajudam a explicar decisões ou comportamentos que não sejam evidentes.

### VI. Interface, Formulários e Navegação

- A interface é simples, organizada, consistente e adequada para dispositivos móveis.
- Navegação entre telas é implementada de maneira clara e compatível com o ecossistema Expo.
- Formulários são validados antes de processar os dados, apresentando mensagens compreensíveis para entradas inválidas.
- `FlatList` é utilizada para listas de dados dinâmicas ou extensas, conforme os requisitos da atividade.
- Estados relevantes da interface (listas vazias, carregamento e erros) são tratados quando aplicáveis.
- Duplicação de elementos visuais e regras de interface é evitada.

### VII. Desenvolvimento Orientado por Especificações (SDD)

- A sequência de trabalho Constitution, Specify, Plan, Tasks e Implement é seguida.
- Cada etapa é revisada antes de iniciar a seguinte.
- As especificações aprovadas são a referência principal para o desenvolvimento.
- Funcionalidades não previstas nas especificações aprovadas não são implementadas sem autorização.
- Ambiguidades, contradições ou requisitos tecnicamente inviáveis são apontados antes de tomar decisões que alterem o escopo.
- O planejamento e as tarefas refletem as funcionalidades realmente especificadas, sem adicionar trabalho desnecessário.

### VIII. Escopo e Controle de Alterações

- Implementa-se somente o necessário para cumprir os requisitos da atividade.
- Partes funcionais do projeto não são refatoradas sem uma razão concreta.
- Arquivos, configurações ou dependências sem relação com a tarefa em execução não são modificados.
- Antes de adicionar uma nova camada, ferramenta ou padrão, avalia-se se a solução existente já atende à necessidade.
- Preserva-se o código funcional e realizam-se alterações pequenas, coerentes e fáceis de revisar.

### IX. Validação e Entrega

- A implementação é verificada contra os critérios de aceite das User Stories.
- Erros de TypeScript, problemas de navegação e falhas de execução identificados durante a validação são corrigidos.
- Os fluxos principais do aplicativo são testados no Expo Go, conforme os requisitos da atividade.
- Testes não são afirmados como executados com sucesso sem que tenham sido realmente executados.
- A atividade é considerada concluída somente quando os requisitos especificados e os critérios de aceite tiverem sido verificados.

## Governança

### Prioridade das Regras

Em caso de conflito, priorizam-se os requisitos obrigatórios da atividade e as especificações aprovadas, respeitando as restrições técnicas e de segurança. As decisões de implementação buscam simplicidade, clareza, manutenção fácil e cumprimento dos critérios de aceite.

### Procedimento de Emenda

- Alterações nesta Constituição são registradas neste arquivo, com a data da emenda.
- Toda emenda incrementa a versão conforme a política de versionamento abaixo e atualiza o Relatório de Sincronização no topo do arquivo.
- Templates dependentes (`.specify/templates/*.md`) e documentos de contexto são revisados após cada emenda.

### Política de Versionamento

- MAJOR: remoções ou redefinições incompatíveis de princípios ou de governança.
- MINOR: novo princípio ou seção adicionado, ou expansão material de orientações.
- PATCH: clarificações, ajustes de redação, correções de tipografia, refinamentos não semânticos.

### Revisão de Conformidade

- O plano de implementação (`plan.md`) passa pela "Constitution Check" antes e depois da fase de design; violações injustificadas bloqueiam a execução.
- Análises (`/speckit.analyze`) tratam violações da Constituição como CRÍTICAS, exigindo ajuste da spec, do plano ou das tarefas — nunca a diluição ou o contorno silencioso do princípio.
- A revisão de entrega confere aderência aos critérios de aceite e às restrições de escopo antes de considerar a atividade concluída.

**Version**: 1.0.0 | **Ratified**: 2026-10-19 | **Last Amended**: 2026-10-19
