# Estruturação de Prompts e estratégias de utilização

> Nenhuma estratégia para estruturação de prompts resolverá todos os problemas.

- Processos e workflows de desenvolvimento
- Agentes que precisam processar informações para responder um cliente final
- Exploração
- Geração de documentos
- etc

### Casos importantes

- Quando o problema não será respondido pela IA em larga escala, não economize em tokens
- Exemplo

  - Processo de desenvolvimento
  - Exploração
  - Quando há ou pretende-se escalar uma aplicação, econmize ao máximo porem lembre-se dos trade-offs

- Exemplo
  - Mais tokens > custo
  - Mais regras ou cadeias de pensamento > latência

### Comportamento

- Defina os limites do modelo
- Quando for gerar um prompt defina o resultado final: voce tem que especificar a saída esperada

## Guidelines

- Tarefas "simples" / senso comum: (valide, identifique, sumarize): Zero Shot
- Alto volume: zero shot

- Exemplo
  - Baseado em X espero Y
  - Baseado em Z espero W

## System vs User Prompt

- System Prompt

  - Regras do jogo
  - Define comportamento, tom, restrições do modelo
  - Deve ser um manual de instruções permanente para aquela conversa
  - Geralmente não muda
  - Modelo tende a ler como "mais prioritário" do que está no "user"

- User Prompt

  - Pergunta/ Tarefa
  - Pode mudar a cada interação
  - Descrição do que o usuário quer naquele momento, já respeitando as regras do system prompt

- Nota mental
  - System = configuração global da conversa
  - User = pedido específico que você quer que o modelo execute

---

# Estruturação de prompts elaborados (normalmente não serão executados em alta escala)

## Persona e Escopo

- Defina quem o modelo "é" e o que NÃO deve fazer
- Reduz improvisos e garante alinhamento técnico
- Exemplo:
  - "Você é um assistente especializado em Node.js vX e testes com Jest. Não faça refatorações no código original."

## Objetivo

- Descreva de forma direta sem ambiguidade o que precisa ser feito
- Exemplo:
  - [errado]: "Escreva testeds para o código abaixo"
  - [certo]: "Escreva testes unitários para a função abaixo usando o Jest, cobrindo casos de entrada válidos e inválidos."

## Entradas

- Liste somente o necessário para resolver a tarefa
- Mantenha separação visual
- Evite colar arquivos inteiros se só a parte é relevante
- Exemplo:

```js
function calculateDiscount(price, discount) {
  if (discount < 0 || discount > 100) {
    throw new Error("Invalid discount");
  }
  return price - price * (discount / 100);
}
```

## Formato de saída

- Defina o formato exato para minimizar riscos de respostas fora de padrão
- Exemplo:
  - Responda apenas com um objeto JSON no formato:
  ```json
  {
    "testFile": "<conteúdo do arquivo de testes>",
    "coverage": "<percentual de cobertura estimado>"
  }
  ```

## Critérios de qualidade

- Especifique as regras que definem uma boa resposta
- Exemplo:
  - 1. O teste deve rodar com `npm test` sem erros.
  - 2. Deve cobir casos de entrada válidos e inválidos.
  - 3. Não usar bibliotecas externas além do Jest.

## Tratamento de ambiguidades e "assumptions"

- Diga o que fazer se faltar informação
- Exemplo:
  - "Se faltar a versão do Node.js , assuma a v18."
  - "Liste todos os pressupostos feitos no campo "assumptions" na resposta."

## Instruções negativas

- Liste o que não pode aparecer na resposta
- Exemplo:
  - "Não inclua explicações ou comentários fora do JSON."

## Tratamento de erros

- Explique como retonar se não foi possível cumprir
- Exemplo:
  - "Se não for possível atender os criterios, retorne
  ```json
  {
    "error": "<descrição do motivo>"
  }
  ```

## Exemplo completo

"Persona & Escopo:
Você é um assistente especializado em Node.js v18 e testes com Jest. Nao faça refatorações no código original.

Objetivo:
Gerar testes unitários para a função abaixo usando Jest.

Entrada:

```js
function calculateDiscount(price, discount) {
  if (discount < 0 || discount > 100) {
    throw new Error("Invalid discount");
  }
  return price - price * (discount / 100);
}
```

Formato de saída:
Responda apenas com objeto JSON no formato:

```json
{
  "testFile": "<conteúdo do arquivo de testes>",
  "coverage": "<percentual de cobertura estimado>",
  "assumptions": ["<lista de pressupostos feitos>"]
}
```

Critérios

1. O teste deve rodar com `npm test` sem erros.
2. Deve cobrir casos de entrada válidos e inválidos.
3. Não usar bibliotecas externas além do Jest.

Ambiguidades & Pressupostos:
Se faltar versão do Node, assuma v18 e adicione em "assumptions".

Instruções negativas:
Nao inclua explicações ou comentários fora do JSON

Tratamento de erros:
Se não puder cumprir os critérios, retorne:

```json
{
  "error": "<descrição do motivo>",
  "reason": "<descrição do motivo>"
}
```

## Regras de Ouro ao estruturar um prompt

Antes de rodar um prompt, revise se ele:

- Define persona e escopo
- Tem objetivo direto
- Fornece entradas separadas e mínimas
- Define formato de saída
- Lista critérios claros
- Trata ambiguidades e erros
- Inclui proibições ncessárias.
