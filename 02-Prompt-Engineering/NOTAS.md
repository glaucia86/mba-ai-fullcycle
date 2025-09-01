# O que é Prompt Engineering?

"Sistemas de IA generativa são projetados para produzir respostas específicas com base na qualidade dos prompts fornecidos.

Prompt engineering permite que esses modelos compreendam melhor instruções e consigam trabalhar com uma ajuda de demandas, desde comandos simples até questões altamente técnicas."

## Processo de Desenvolvimento de Software

- Desenvolver e manter
- Automatizar tarefas repetitivas
- Obter soluções rápidas
- Auxiliar em processos complexos de desenvolvimento
- Documentação e Design Docs
- Code Review
- Brainstorming

## Aplicabilidade em Softwares que utilizam IA (ex.: Agente especializado em vendas)

- Definir comportamento e escopo
- Pró-atividade (entender a necessidade de um cliente)
- Respostas especializadas
- Segurança e Privacidade de Dados
- Execução de tarefas extremamente específicas
- Prompt Engineering é a "nova linguagem de programação"

# Técnicas / Tipos de Prompts

## Role Prompting

Define explicitamente o papel do modelo, como professor, engenheiro ou crítico, para controlar o estilo e consistente.

### Quando utilizar?

- Forçar estilo formal em uma documentação
- Simular papéis diferentes em uma revisão de arquitetura
- Criar um agente de suporte com persona consistente
- Ensinar conceitos complexos como se fosse para um aluno
- Ajustar a comunicação técnica para diferentes públicos

### Limitações

- Nem sempre o role é seguido fielmente
- Pode ser sobrescrito por instruções do usuário
- Difícil medir impacto real em tarefas simples
- Pouco constrate em models mais avançados
- Precisa de reforço constante em cadeias longas

## Zero-shot

Técnica em que o modelo recebe apenas a instrução da tarefa, sem exemplos. Objetivo é testar a generalização e capacidade base do modelo.

### Quando utilizar?

- Resumir um parágrafo de um artigo
- Perguntar a capital de um país
- Gerar rapidamente o esqueleto de uma API em Go.
- Traduzir uma frase curta.
- Explicar o que é arquitetura orientada a eventos
- Sistemas de alta escala que precisam de economia de tokens

### Limitações

- Pode falhar em problemas complexos
- Pouco controle no formato da saída
- Pode gerar alucinações
- Saída varia com pequenas mudanças no prompt
- Fraco em raciocínio lógico elaborado
