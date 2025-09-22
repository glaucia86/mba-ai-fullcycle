# Conceitos Importantes

## Janelas de contexto e limite de tokens

- Janela de contexto

Quantidade máxima de mensagens na "conversa", documento ou código que o modelo consegue utilizar de uma vez para gerar a próxima resposta.

- Exemplos (tokens):

  - GPT 3: 2048
  - GPT 4o: 128k
  - Claude 4: 200k
  - GPT 4.1: 1mi
  - Gemini 2.5: 1mi
  - Meta Llama 4 Scout: 10mi

> observação: Intermanete o modelo avalia a relação de TODOS os tokens. Custo computacional chega a (O(n^2)).

## Context Window para Prompt Engineering

## Context Window vs memória, custo e latência

## Janela de contexto vs parâmetros

- Parâmetros são pesos/ espécie de memória do modelo/guardam o que o modelo aprendeu o conhecimento e a capacidade do modelo.
- Capturam padrões nos dados durante o treinamento
- Armazena o conhecimento sobre a linguagem, imagens, códigos etc
- Ajuda na inferência para gerar a resposta

### Normalmente

- Mais parâmetros = mais capacidade de aprendizado (modelo consegue capturar mais nuances, textos)
- Mais paraâmetros = mais consumo de memória, mais tempo de treinamento, mais custo

Exemplo: GPT-3 possui 175 bilhões de parâmetros treinados e sua janela de contexto era de apenas 2048 tokens.

## Truncamento

- Remove partes menos relavantes do contexto quando ele fica muito grande
- Normalmente corta mensagens antigas do início da conversa ou trechos iniciais
- Tenta garantir que as informações mais recentes fiquem na janela de contexto
- Solução simples e rápida, mas pode ter efeitos drásticos

## Sumarização

- Ao invés de cortar/ perder informações, podemos resumir os conteúdos anteriores e liberar espaço na janela de contexto.
- Esse resumo pode ser feito utilizando o próprio modelo
- Normalmente, há rotinas internas que monitoram uma conversa e conseguem identificar quando a sumarização deve ser feita

## Sliding window (Janela deslizante)

- Técnica (windowing) básica para tratar o histórico como uma janela móvel que desliza sobre o conteúdo conforme ele cresce
- Na prática, teremos sempre a versão mais recente do texto dentro do limite
- Podemos: descartar ou arquivar o conteúdo que ficou para trás.

## Prompt Caching

- Evita retrabalho do modelo em partes do prompt que se repetem
- Cada provider pode trabalhar com caching de forma diferente

### OpenAI

- Cache de forma automática e transparente
- Exemplo: se enviar vários prompts começando com o mesmo texto fixo, pagará o valor cheio apenas a primeira vez. Nas próximas, poderá ter desconto de ~50%.
- OpenAI quem decide o que entra em cache e por quanto tempo ele fica disponível

### Google Gemini

- O desenvolvedor via API pode explicitamente criar um conteúdo cacheado e fazer referências no futuro
- Exemplo: fazer upload de um PDF e armazenar em cache através de um ID. Quando for realizar "perguntas" sobre aquele arquivo, é indicado ao modelo a usar o conteúdo cacheado
- Possível definir TTL
- Cobra por armazenamento / TTL
- Você possui mais controle
- Desconto de ~= 75%

## Batch Prompting

- Estratégia focada em envio de prompts em lote
- Podemos criar múltiplas perguntas/ requisições em uma mesma chamada
- LLM processa todas de uma vez e retorna a resposta para cada item do lote
- Evita fazer inúmeras requisições ao modelo e tende a economizar MUITO dependendo do caso de uso

### Vantagens

- Velocidade. Processar 10 itens em uma chamada tende a ser mais rápido do que fazer 10 chamadas
- Tende a manter consistência nas respostas, pois todas as "perguntas" estão dentro do mesmo contexto e condição
- Reduz o custo por requisição. Exemplo: prompt do sistema ou instruções fixas que se repetem a cada requisição

### Limitações

- É importante que as tarefas sejam similares em formato ou objetivo
- Modelo pode ter dificuldade em responder requisições em contextos muito diferentes


