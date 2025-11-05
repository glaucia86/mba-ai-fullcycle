# Exemplo de PRD para Feature (Catálogo de eCommerce)

### PRD: Plataforma de E-commerce Catálogo de Produtos

Versão: v1

Data: 2028-10-28

Responsável: Wesley Willians

---

### Resumo

Esta feature implementa o Catálogo de Produtos central do e-commerce. Esse catálogo será a fonte única de verdade para dados de produto: descrição, variações (SKUs), preço, estoque e disponibilidade comercial. Ele expõe APIs de leitura para vitrine e checkout e fornece um painel interno para gestão pelo time comercial e operacional sem depender de engenharia. O catálogo nasce em um novo sistema proprietário de e-commerce, não em cima de Shopify, VTEX ou outras plataformas prontas.

---

### Contexto e problema

Público-alvo

- Time interno de operações e comercial, que precisa cadastrar e atualizar produtos sem depender de desenvolvedor
- Clientes que navegam e compram na loja online
- Serviços internos como carrinho e checkout, que precisam de dados consistentes e atualizados

Cenários de uso chave

- Cliente navega pela vitrine e vê produto com preço e disponibilidade reais
- Checkout lê snapshot de preço e estoque da SKU no momento da compra
- Time comercial altera preço, estoque e visibilidade e isso reflete imediatamente na vitrine

Onde essa feature será implantada

- Novo sistema proprietário de e-commerce
- Serviço Catálogo de Produtos exposto via API interna
- Consumido pelo frontend público e pelo módulo de checkout

Problemas priorizados

- Não existe hoje uma base central de produtos. Cada área mantém planilhas próprias, o que causa divergência de preço e disponibilidade
- Produtos esgotados continuam aparecendo como se estivessem disponíveis, causando atrito e perda de confiança
- Não há controle por variação. Sem SKU clara por cor e tamanho não existe estoque confiável por variação

---

### Objetivos e métricas

| Objetivo                                                | Métrica                                                      | Meta                  |
| ------------------------------------------------------- | ------------------------------------------------------------ | --------------------- |
| Tornar o catálogo a única fonte de produto              | Porcentagem de páginas servidas a partir do catálogo oficial | 100 por cento da loja |
| Reduzir exposição de itens indisponíveis para o cliente | Taxa de cliques em itens marcados como indisponíveis         | menor que 2 por cento |
| Acelerar publicação e atualização pelo time comercial   | Tempo médio para publicar ou atualizar preço                 | menor que 2 horas     |

---

### Escopo

Incluso

- Estrutura de produto e SKUs com nome, descrições, imagens, categoria e status (ativo, inativo, destaque)
- Suporte a múltiplas variações por produto. Exemplo: cor, tamanho, capacidade
- Preço base e preço promocional por SKU
- Estoque por SKU
- Flags de publicação, como visível na vitrine e destaque
- API de listagem paginada e filtrável
- API de detalhe de produto com SKUs, preço e disponibilidade
- Painel interno para cadastro, edição, inativação e atualização de preço e estoque
- Auditoria de alterações sensíveis (preço, estoque, status)
- Integração de leitura com checkout para consulta de preço e estoque

Fora de escopo

- Checkout e cobrança
- Cálculo de frete e regras fiscais
- Recomendação personalizada
- Catálogo multilíngua e multimoeda
- CMS editorial avançado (reviews, landing promocional, blog)

---

### Requisitos funcionais

### RF-001 Cadastro de Produto Base

Criar produto com nome, descrições, categorias, imagens e status de publicação.

**Fluxo principal**

- Usuário interno acessa o painel administrativo
- Seleciona Criar Produto
- Informa nome, descrição curta, descrição longa, categoria, imagem principal e status ativo ou inativo
- Salva rascunho ou publica

**Fluxos alternativos e exceções**

- Se o upload de imagem falhar, ainda é possível salvar rascunho e adicionar imagem depois
- Se faltar campo obrigatório, a publicação é bloqueada, mas salvar como rascunho continua permitido

**Erros previstos**

- Tentativa de publicar produto sem preço ou sem imagem principal

**Prioridade:** alta

---

### RF-002 Gestão de Variações e SKUs

Adicionar variações a um produto. Cada combinação gera uma SKU com preço e estoque próprios.

**Fluxo principal**

- Usuário interno acessa um produto existente
- Cria uma ou mais SKUs, cada uma com atributos próprios. Exemplo: Camiseta Preta M
- Define preço e estoque por SKU
- Marca cada SKU como ativa ou inativa

**Fluxos alternativos e exceções**

- Se a SKU estiver sem estoque, ela permanece listada, mas marcada como indisponível para compra. O produto pai não precisa sair da vitrine

**Erros previstos**

- Cadastro de estoque negativo

**Prioridade:** alta

---

### RF-003 API de Listagem de Produtos

Expor endpoint interno para listar produtos paginados e filtrados.

**Fluxo principal**

- Frontend chama GET /catalog/products
- Envia filtros opcionais como categoria, faixa de preço e apenas disponíveis
- Recebe lista paginada com nome, preço atual, imagem principal e disponibilidade

**Fluxos alternativos e exceções**

- Se o filtro enviado for inválido, retornar lista vazia em vez de erro 500
- Produtos inativos não aparecem na resposta

**Erros previstos**

- Acesso sem credencial autorizada

**Prioridade:** alta

---

### RF-004 API de Detalhe de Produto

Expor endpoint interno para recuperar dados completos do produto, incluindo SKUs, preço e disponibilidade.

**Fluxo principal**

- Frontend chama GET /catalog/products/{id}
- Serviço retorna dados completos do produto e das SKUs ativas, incluindo preço atual e estoque

**Fluxos alternativos e exceções**

- SKU sem estoque aparece marcada como indisponível
- Produto inativo retorna 404

**Erros previstos**

- ID inexistente

**Prioridade:** alta

---

### RF-005 Auditoria de Alteração de Preço

Registrar quem alterou o preço e quando.

**Fluxo principal**

- Usuário interno atualiza o preço de uma SKU
- O sistema grava a SKU alterada, preço antigo, preço novo, timestamp e usuário autenticado

**Fluxos alternativos e exceções**

- Alteração em lote gera auditoria individual por SKU

**Erros previstos**

- Usuário sem permissão tenta alterar preço

**Prioridade:** média

---

### Requisitos não funcionais

Performance

- P95 das APIs de leitura menor que 150 ms
- A listagem deve continuar responsiva com pelo menos 10 mil SKUs totais

Disponibilidade

- 99.9 por cento de disponibilidade mensal para as APIs de leitura do catálogo

Segurança e autorização

- Toda alteração de produto, preço e estoque exige autenticação e autorização baseada em papel
- Toda operação de escrita gera auditoria persistida

Observabilidade

- Logs estruturados para alterações sensíveis
- Métricas de erro por endpoint
- Tracing distribuído ponta a ponta nas chamadas de leitura

Confiabilidade e integridade de dados

- Atualização de estoque deve ser transacional (ou atualiza todo o lote ou nada é confirmado)
- A mesma SKU não pode retornar dois preços diferentes dentro da mesma resposta

Compatibilidade e portabilidade

- APIs expostas como REST JSON versionado, por exemplo /v1/catalog
- Serviço empacotado como container OCI e apto a rodar em Kubernetes

Compliance

- Histórico de preço e estoque precisa ser rastreável para auditoria interna e reconciliação financeira

Acessibilidade no frontend consumidor

- A resposta das APIs deve conter informações suficientes para montar interface acessível, incluindo texto alternativo de imagem

---

### Arquitetura e abordagem

Abordagem

- O Catálogo de Produtos será um microsserviço dedicado responsável por produto, SKUs, estoque e preço
- O frontend público consome apenas endpoints de leitura. Alterações ficam restritas ao painel interno autenticado

Componentes

- API backend escrita em Go
- Banco de dados PostgreSQL como sistema de registro e trilha de auditoria
- Camada de indexação para busca e listagem rápida de produtos
- Painel administrativo interno (Next.js) para cadastro, atualização e inativação
- Módulo de auditoria de alterações críticas (preço, estoque, status)

Integrações

- Checkout consome snapshot de preço e estoque da SKU no momento da criação do carrinho
- Módulo de frete (futuro) consome dimensões e peso da SKU
- Serviço de mídia armazena e serve imagens otimizadas

### Decisões e trade-offs

### Decisão: Catálogo isolado como microsserviço

- **Justificativa:** permite evoluir e escalar de forma independente e reutilizar o mesmo catálogo em múltiplos canais de venda
- **Trade-off:** aumenta a complexidade inicial de observabilidade, telemetria e orquestração entre serviços

### Decisão: PostgreSQL como fonte de verdade

- **Justificativa:** garante consistência forte e auditoria confiável de preço e estoque
- **Trade-off:** leitura em alta escala exige cache e indexação adicional para manter latência baixa

---

### Dependências

### Dependência externa: Design de vitrine

Definição visual do card de produto e da página de produto. A área de produto e design precisa entregar os layouts para garantir consistência visual entre catálogo e vitrine.

### Dependência organizacional: Política de SKU sem estoque

Definição de regra comercial para itens esgotados. É necessário decidir se SKU esgotada continua aparecendo marcada como indisponível ou se deve ser ocultada da vitrine.

### Dependência técnica: Pipeline de imagens

Pipeline para armazenar e servir imagens otimizadas de produto. É necessário definir regras de tamanho, formatos aceitos e otimização de mídia.

---

### Riscos e mitigação

### Produto sem estoque aparecer como disponível

- **Probabilidade:** média
- **Impacto:** alto
- **Mitigação:**
  - Bloquear publicação de SKU com estoque zero como disponível para compra
  - Bloquear envio de SKU sem estoque para o checkout
- **Plano de contingência:** exibir tag Indisponível no frontend

### Divergência de preço entre catálogo e checkout

- **Probabilidade:** média
- **Impacto:** alto financeiro e reputacional
- **Mitigação:**
  - Checkout lê snapshot de preço direto do catálogo no momento de criar o carrinho
  - Auditoria de alterações de preço deve registrar quem alterou, quando e qual o valor antigo
- **Plano de contingência:** conciliação manual possível a partir do log de auditoria por SKU

### Navegação lenta com grande volume de produtos

- **Probabilidade:** alta no médio prazo
- **Impacto:** médio na conversão
- **Mitigação:**
  - Indexação otimizada para consultas de vitrine
  - Cache de leitura para endpoints de listagem
- **Plano de contingência:** paginação rígida e carregamento progressivo (lazy loading) no frontend

---

### Critérios de aceitação

Checklist objetivo que define se a feature está pronta.

- É possível cadastrar um produto com nome, descrições, pelo menos uma imagem, categoria e status de publicação
- É possível criar múltiplas SKUs com preço, estoque e atributos como cor e tamanho
- A API de listagem retorna apenas produtos ativos e disponíveis e suporta filtros e paginação
- A API de detalhe retorna todas as SKUs e sinaliza disponibilidade de cada uma sem esconder SKU esgotada
- Toda alteração de preço gera auditoria persistida com SKU, preço antigo, preço novo, timestamp e usuário
- Uma SKU sem estoque não pode ser marcada como disponível para compra
- O frontend consegue montar card de listagem apenas com a API de listagem e montar a página de produto apenas com a API de detalhe
- P95 das APIs de leitura está abaixo de 150 ms
- As APIs de leitura suportam disponibilidade 99.9 por cento

---

### Testes e validação

Tipos de teste obrigatórios

- Testes unitários cobrindo regras de preço, estoque, status de publicação e visibilidade de SKU
- Testes de integração cobrindo cadastro de produto, criação de SKU, atualização de preço e leitura pelas APIs
- Testes de segurança garantindo que apenas usuários autorizados podem alterar preço, estoque e status
- Testes de carga nas APIs de listagem e detalhe para validar latência p95 menor que 150 ms

Estratégia de validação

- TDD para lógica crítica de estoque, preço e publicação
- QA manual guiado por roteiro cobrindo os fluxos principais do painel e a leitura no frontend
- Validação exploratória navegando na vitrine com dados reais de exemplo para confirmar consistência visual, preço e disponibilidade
