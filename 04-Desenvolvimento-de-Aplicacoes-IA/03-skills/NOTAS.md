# Skills

## Project Skills

### O que são Skills?

- Habilidades que poderão ser informadas ao Agente para resolver tarefas de domínios específicos
- Skills normalmente são carregadas on-demand, ou seja, o Agente carrega skill somente quanto tem a necessidade de executar alguma tarefa correlata a Skill
- Em alguns softwares de codificação como Claude Code, uma Skill também pode ser executada como um "slash command". Exemplo: /nome-da-skill ou mesmo ser pré-carregada em um subagente em seu "frontmatter"

### Mapeamento de Skills de acordo com o projeto

- Entenda profundamente o projeto e determine quais Skills fazem sentido serem utilizadas
- Leia com atenção a descrição do frontmatter da skill, pois será exatamente baseada nessa descrição que o agente decidirá utilizá-la ou não.

### Racional para mapeamento

- Backend vs Frontend / Full Stack ou Mobile
- Habilidades amplas / conceituais. Ex frontend-design
- Guidelines: Exemplo: web-design-guidelines
- Language oriented: Exemplo: python-performance-optimization, typescript-advanced-types
- Framework oriented: vercel-react-best-practices, java-spring-boot
- Tools oriented: github-actions-templates, agent-browser

### Skills personalizados

- Cada projeto tem suas peculiaridades. Por exemplo, conhecimento específico da empresa, regras de negócio, scripts, documentos de referência, assets, etc.

Abaixo estão alguns repositórios de Skills, mas é importante ressaltar que o ideal é criar Skills personalizadas para cada projeto, de acordo com as necessidades específicas do projeto.

> Link: [Skills Repository - Anthropic](https://github.com/anthropics/skills)
> Link: [Skills.sh - Vercel](https://skills.sh/)
> Link: [Superpowers - Obra](https://github.com/obra/superpowers)

### Frontmatter

O Frontmatter é uma seção de metadados que pode ser incluída no início de um arquivo de Skill. Ele é utilizado para fornecer informações adicionais sobre a Skill, como seu nome, descrição, tags, etc. O Frontmatter é escrito em formato YAML e é delimitado por três traços (---) no início e no final da seção. E é a parte mais importante da Skill, pois é a partir dela que o agente irá decidir se a Skill é relevante para a tarefa que ele precisa resolver ou não. Por isso, é fundamental que o Frontmatter seja bem escrito e contenha informações claras e precisas sobre a Skill.

- Exemplo de Frontmatter:

```yaml
---
name: doc-coauthoring
description: Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers. Trigger when user mentions writing docs, creating proposals, drafting specs, or similar documentation tasks.
---
```

- Exemplo de uma Skill com Frontmatter: **[doc-coauthoring](https://github.com/anthropics/skills/edit/main/skills/doc-coauthoring/SKILL.md)**

> [!NOTE]: é muito importante dizer as palavras que o agente deve usar para acionar a skill. Geralmente o que está na descrição do frontmatter é o que o agente irá usar para decidir se a skill é relevante ou não para a tarefa que ele precisa resolver. Por isso, é fundamental que o frontmatter seja bem escrito e contenha informações claras e precisas sobre a skill.

> [!TIP]: para uma melhor execução de uma determinada skill seria bom ter apenas até 350 linhas de informação, ou seja, o ideal é que a skill seja o mais objetiva possível, contendo apenas as informações necessárias para a execução da tarefa. Skills muito longas podem acabar confundindo o agente e dificultando a execução da tarefa. Por isso, é importante ser objetivo e direto ao ponto na construção da skill.

### Skills e arquivos de referência

Às vezes, para a execução de uma determinada skill, o agente pode precisar de informações adicionais que não estão contidas na skill em si. Nesses casos, é possível criar arquivos de referência que contenham essas informações adicionais. Esses arquivos de referência podem ser utilizados pelo agente durante a execução da skill para obter as informações necessárias para resolver a tarefa. É importante ressaltar que esses arquivos de referência devem ser bem organizados e conter apenas as informações relevantes para a execução da skill, para evitar confusão e facilitar a execução da tarefa pelo agente.

- Exemplo de uma skill com arquivos de referência: **[mcp-builder](https://github.com/anthropics/skills/tree/main/skills/mcp-builder/reference)**

> ![!NOTE]: esses arquivos de referencia podem ser longos. Pois explica detalhadamente como deve ser implementado algo que corresponda a skill. O importante é que esses arquivos de referência sejam bem organizados e contenham apenas as informações relevantes para a execução da skill, para evitar confusão e facilitar a execução da tarefa pelo agente.

### Criando servidor MCP com Skill

- Exemplo de Skill para criação de servidor MCP: está dentro da pasta `.github/skills/mcp-builder`

- Exemplo de prompt:

```md
Build an MCP Server in TypeScript using the MCP SDK, following best practices, inside the `github/skills/mcp-builder` directory. The server should allow LLMs to query programming best practices guides located in the `reference` folder. Create tools to: list available guides, query the content of a specific guide, and answer questions about a language based on the content of its respective guide. Make to sure to evaluate the quality of the MCP Server.
```

Observe que, no momento em que enviamos o prompt no GitHub Copilot, o agente já tem acesso a skill de criação de servidor MCP, pois ela está dentro da pasta `.github/skills/mcp-builder`. O agente irá avaliar a descrição do frontmatter da skill e decidir se ela é relevante para a tarefa que ele precisa resolver ou não. Se ele decidir que a skill é relevante, ele irá utilizá-la para resolver a tarefa. Caso contrário, ele irá buscar outras skills ou informações para tentar resolver a tarefa.

![Image](./images/image-01.png)

Observe novamente que, nesse momento a aplicação já foi criada com base no que foi descrito na skill. E novamente, para dar continuidade ele, agora está vendo as referencias para a construção do servidor MCP, que estão dentro da pasta `.github/skills/mcp-builder/reference`. O agente irá avaliar o conteúdo dessas referências e utilizá-las para construir o servidor MCP de acordo com as melhores práticas descritas nessas referências.

![alt text](./images/image-02.png)

> Exemplo criado pela skill: **[Demo Skill MCP](./demo-skill-mcp/)**
