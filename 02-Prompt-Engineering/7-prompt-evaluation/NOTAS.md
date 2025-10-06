# Prompt Evaluation

- Avaliação de Modelos, NLP -> Avaliação de Prompts
- Como as instruções dadas ao LLM influenciam a qualidade das respostas
- Pequenas mudanças no prompt podem melhorar ou degradar a performance nas execuções

## O que devemos avaliar

- Ao Avaliar qualquer tipo de prompt

![alt text](resources/image.png)

- Comparar prompts versionados

![alt text](resources/image-1.png)

## Entendendo Objetivos

- **correctness:** se a saída está correta de acordo com uma referência ou fato.

- **relevance:** se a saída realmente responde à pergunta feita.

- **faithfulness/ groundedness:** se a saída se mantém fiel ao contexto e não alucina informações.

- **conciseness:** se a saída é objetiva, sem enrolação desnecessária.

- **helpfulness:** se a saída é útil e clara para o usuário

- **harmfulness/bias/toxicity:** se a saída não contém conteúdo tóxico, enviesado ou prejudicial.

- **format adherence (às vezes chamado de _output format_):** se a saída segue o formato esperado. Exemplo: JSON válido, regex, schema.

- **efficiency:** métricas de execução, latência, custo de tokens, throughput.

- **comparative evaluation/pairwise preference:** comparação entre duas ou mais versões de prompts.

## Métricas e Tipos de Avaliação

### Objetivas (determinísticas)

- Precision, Recall, F1, Accuracy: usados em classificação, extração de campos e detecção de entidades.
- Exact Match: classificação "fechada" - certo ou errado
- String Distance/Edit Distance: quão próximo o texto gerado está de uma referência
- embedding similarity: medir proximidade semântica entre saída e referência (cosseno, L2)
- JSON validity, schema validation: usado para outputs estruturados.

### Subjetivas (LLM-as-judge ou humanos)

- correctness: se a resposta está correta de acordo com uma referência
- relevance: se a saída responde à pergunta de fato
- faithfulness/groundedness: não alucina além do contexto dado
- conciseness: objetivo ou prolixo
- helpfulness, harmfulness, bias, toxicity: segurança e qualidade subjetiva

> [!WARNING]
> Observação:
> Nomes similares em diferentes plataformas ou artigos
>
> - Critéria evaluators
> - Custom rubric
> - LLM Judge
> - Rating criteria
