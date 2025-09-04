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

## One-shot/Few-shot

Dá um ou poucos exemplos de entrada/saída para o modelo aprender o padrão esperado.

### Quando utilizar?

- Ensinar como formatar um email formal
- Criar casos de teste adicionais a partir de um exemplo
- Mostrar exemplo de resumo de notícia e pedir outro semelhante
- Padronizar estilo de documentação de API
- Criar perguntas no estilo de quizzes de estudo.

### Limitações

- Depende da qualidade do exemplo
- Não cobre todas as variações
- Aumenta custo de tokens
- Pode enviesar a respsta
- Pode imitar demais e não inovar

## Chain of Thought (CoT)

Instrui o modelo a pensar em etapas antes de dar a resposta final.

### Quando utilizar?

- Resolver cálculo matemático passo a passo
- Explicar a lógica de um algoritmo
- Listar etapas de correção de um bug
- Mostrar como chegou a uma conclusão em um debate
- Estruturar os passos de um plano de projeto

### Limitações

- Respostas longas e verbosas
- Pode inventar passos irreais
- Nem sempre garante resposta correta
- Menos útil em tarefas simples
- Aumenta custo de tokens

## CoT + Self-Consistency

Cria múltiplos raciocínios e escolhe a resposta mais consistente.

### Quando utilizar?

- Confirmar cálculos complexos
- Validar diferentes hipóteses de arquitetura de sistema.
- Classificar sentimento em frases curtas
- Revisar interpretações de um mesmo texto
- Decidir a melhor opção em múltipla escolha

### Limitações

- Muito mais tokens consumidos
- Pode ser mais lento
- Nem sempre converge para a resposta correta
- Em tarefas fáceis, não agrega muito valor
- Pode repetir respostas redundantes

## Tree of Thought (ToT)

O modelo explora diferentes caminhos de raciocínio, compara-os e escolhe o melhor.

### Quando utilizar?

- Fazer brainstorming de soluções criativas
- Planejar um roteiro de viagem considerando alternativas
- Decidir entre diferentes estratégias de estudo
- Avaliar prós e contras de uma escolha importante
- Explorar hipóteses antes de tomar uma decisão final

### Limitações

- Saídas longas e complexas
- Gasta mais tokens
- Difícil garantir que os ramos sejam distintos
- Pode ficar repetitivo
- Requer instruções claras para funcionar bem

## Skeleton of Thought (SoT)

O modelo primeiro cria um esqueleto de tópicos e depois expande cada um.

### Quando utilizar?

- Estruturar uma redação antes de escrever
- Criar um ADR (Architecture Decision Record)
- Planejar endpoints de uma API antes de codar
- Organizar um artigo em seções e depois detalhar
- Definir checklist de requisitos antes da análise completa

### Limitações

- Esqueleto ruim leva a expansão ruim
- Pode perder contexto entre etapas
- Mais tokens consumidos
- Exige controle para não pular direto para detalhes
- Saída vem em duas fases.
