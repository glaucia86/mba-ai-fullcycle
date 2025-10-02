# Query reformulation/ Prompt Enrichement

## Consulta do usuário é vaga ou ambígua

- Prompts curtos ou com baixa clareza
  - Exemplo: <user> Python em Langchain
  - Melhorar: crie um guia completo explicando como trabalhar com LangChain com Python do básico ao avançado.

## Falta de contexto relevante

- Usuário não adiciona no prompt informações/contexto importantes para o modelo responder de forma assertiva
  - Exemplo: <user> Como criar uma API em Python?
  - Melhorar: Explique como desenvolver um CRUD com Golang e disponibilizar endpoints REST utilizando o framework Go Chi

## Alinhamento de formatos

- Se há necessidade de que a resposta tenha uma saída explicíta seguindo um determinado padrão.
  - Exemplo <user>: Explique as regras de negócio desse sistema.
  - Melhorar: Faça um resumo das regras de negócio módulo a módulo desse sistema e retorne o resultado utilizando markdown no formato: # Regras de Negócio, ## Regra X, Conteúdo do resumo

## Minimizar riscos de respstas incorretas

- Uma pergunta pode induzir a IA gerar respostas com alucinações ou incompletas
  - Exemplo <user>: Quem criou a linguagem Python em 2012?
  - Melhorar: Quem foi o criador da linguagem Python? Forneça uma breve biografia e a data correta de criação da linguagem.

## Realizações de buscas semânticas

- Ter a possibilidade de enriquecer com mais detalhes, corrigindo erros de ortogradfia, expandir sinônimos.
  - Exemplo <user>: Esse código está "serto" em go?
  - Melhorar: Revise o seguinte código na linguagem Go e identifique possíveis bugs, problemas de performance, segurança e melhorias. Forneça sugestões de melhorias com exemplos.

## Personalização

- Quando há conhecimento do contexto, perfil, público e detalhes importantes que possa ajudar no resultado da pergunta.
  - Exemplo <user>: Explique como desenvolver aplicações IA com Python.
  - Melhorar: Explique como desenvolver aplicações com Python para quem nunca teve contato com a linguagem. A cada exemplo faça comparativo com TypeScript.

## Principais Tecnicas

### Query2Doc

- Geração de um "documento" que explica o que a consulta realmente quer.
- Utilização do texto gerado para expandir a query antes de executar.

Passo a passo:

- Recebe a query curta do usuário
- Prompt few-shot para o LLM pedindo um "mini-documento" bem objetivo sobre o tema da query
- Concatena esse documento com a query original
- Realiza a busca léxica (BM25/Elastic)
- Retorna os trechos recuperados
- Gera resposta final

### Hyde (Hypothetical Document Embedding)

- Geração de um "documento" que explica o que a consulta realmente quer.
- Utilização do texto gerado para expandir a query antes de executar.

Passo a passo:

- Recebe query curta do usuario
- Prompt para gerar documento
- Concatena esse documento com a query original
- Gera embeddings
- Realiza busca semântica
- Retorna os trechos recuperados
- Gera resposta final

### Query2Doc vs Hyde

- Query2Doc pede um mini-artigo explicativo/neutro (para enriquecer o vocabulário)
- HYDE pede um documento que parece a resposta real (capturar a semântica e contexto relevante)

- Query2Doc nasceu focada para quem já utiliza BM25/Elastic e quer enriquecer as queries
- HyDE nasceu para quem já usa bancos vetoriais e precisa melhorar o "dense retrieval zero-shot"

- São similares mas o estilo de teto que você pede ao LLM é diferente:
  - Query2Doc precisa de descrição neutra
  - HyDE que resposta hipotética

#### Prompt para Query2Doc

```
Escreva um texto informativo e neutro, de 100 a 150 palavras, que explique o tópico abaixo. Inclua definições, termos técnicos, sinonimos e contexto relacionado, mas não dê uma resposta direta se for uma pergunta

Tópico: {query}
```

#### Prompt para HyDE

```
Escreva um parágrafo conciso que responda de forma clara à pergunta abaixo. A resposta deve parecer um documento real, com datas, fatos ou descriçoes prováveis, mesmo que hipotéticas. Não use linguagem especulativa (não diva "talvez" ou "possivelmente")

Pergunta: {query}
```
