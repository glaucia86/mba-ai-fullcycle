# Introdução

## Contextualizando o mundo da documentação

### Fundamentos de documentação

#### Contexto

- Processo de documentação acompanha a Engenharia de Software
- Nos anos 1970 e 1980, processos sequenciais como waterfall e metodologias baseadas em RUP (Rational Unified Process)
- Documentos de requisitos, especificações de sistemas e modelos UML eram extensos e formais
- No waterfall, a documentação era vista como um contrato, e as decisões eram registradas antes da implementação

#### Waterfall (cascata)

- Ordem linear e rígida, onde cada fase precisa ser concluída completamente antes de a próxima começar

#### Fluxo

- 1. Levantamento de

Todos os requisitos do sistema são definidos e documentados de forma detalhada logo no início do projeto.

- 2. Análise e Projeto (Design)

Com base nos requisitos, é feito o projeto da arquitetura, das interfaces e dos componentes.

- 3. Implementação (Codificação)

Os desenvolvedores escrevem o código conforme o projeto definido.

- 4. Testes

O sistema é testado para verificar se atende aos requisitos.

- 5. Deploy (Implantação)

"Produto" era "entregue" ao cliente.

- 6. Manutenção

Correções e melhorias são feitas após a entrega.

> O cliente só vê o resultado final. Se algo estiver errado nos requisitos, o retrabalho é alto.

#### RUP (Rational Unified Process)

- O Rational Unified Process (RUP) foi criado pela Rational Software Corporation (hoje IBM) para oferecer um processo mais iterativo e flexível que o waterfall. Mas ainda com forte controle e documentação.

- Ele é baseado em disciplinas (como requisitos, análise, design, implementação, testes e gerenciamento de configuração) e se organiza em quatro fases principais, que se repetem de forma iterativa:

##### Fluxo

- 1. Inception (Concepção)

Define o escopo, os objetivos do projeto e a viabilidade do negócio.

- 2. Elaboration (Elaboração)

Detalha a arquitetura do sistema, identifica riscos e refina os requisitos principais.

- 3. Construction (Construção)

Desenvolvimento incremental do produto com base na arquitetura aprovada

- 4. Transition (Transição)

Entrega do sistema, treinamento dos usuários e correção de falhas.

##### Diferenciais do RUP

- Iterativo: permite ciclos de desenvolvimento menores dentro de cada fase.
- Dirigido por casos de uso: os requisitos são modelados a partir de como o usuário interage com o sistema.
- Arquitetura centralizada: define uma arquitetura sólida antes de construir o produto.
- Baseado em papéis: define claramente os papéis de analistas, desenvolvedores, testadores.

##### Vantagens sobre waterfall

- Permite revisões e ajustes em cada iteração
- Reduz riscos, pois partes do sistema são validadas progressivamente.
- Melhora a comunicação entre times e stakeholders.

##### Desvantagens

- Mais complexo para gerenciar do que o waterfall.
- Exige bastante documentação e planejamento.
- Pode ser custoso para projetos pequenos.

#### Agile/Manifesto Ágil

- Manifesto Ágil foi criado em 2001, ele trouxe a frase que marcou essa transição
- "Software em funcionamento mais que documentação abrangente"
- Isso não significava eliminar a documentação, mas mudar seu propósito
- A documentação deixa de ser um fim em si mesma e passa a ser um meio para comunicação e alinhamento rápido

##### Problemas conhecidos e comuns ao trabalharmos com documentação

- Muitas vezes acaba sendo inexistente
- Desatualizadas
- Priorização na criação do software ao invés de documentar.
- Processo extremamente massante e lento
- Raramente é lida por todo o time (muitas vezes agrega pouco valor)
- Muitos desenvolvedores/líderes, área de produto e etc não sabem criar o documento para cada caso de uso.

### Documentação na era da IA

#### Documentação na era da IA

- É um ativo extremamente relevante para o processo de desenvolvimento (como testes automatizados são)
- Tornou-se uma das formas mais eficientes para que os modelos de IA possam utilizá-las como contexto para desenvolvimento, manuntenção, planejamento, etc
- Possibilidade de geração de forma mais rápida, eficiente e assertiva
- Ela realmente pode se tornar um "documento vivo"

#### Tipos de documentação e Design Docs

- Produto (Define o que e por quê)
- Design Docs
  - Design e arquitetura (como)
  - Infraestrutura (onde e com o que)
  - Operacional (como manter)
  - Conhecimento e referência (como trabalhar)

#### PRD's- Product Requirement Document

- É um documento de PRODUTO que visa alinhar equipes de produto com a equipe técnica
- Ele existe quando há uma entrega de valor percebido pelo usuário ou negócio
- Ele deve ser tratado como um Produto/Feature "independente", com objetivos e métricas e escopo próprio
- Nem toda feature "merece" um PRD, principalmente quando ela é apenas um dos requisitos funcionais de um sistema

#### Níveis de PRDs

- Produto
- Módulo/Epic
- Feature
- Etc

#### Seções de um PRD

Um PRD pode ser totalmente flexível e em muitos casos nem todas as seções necessariamente devem ser utilizadas, principalmente em um projeto pequeno.

- Seções:
  - Visão e propósito
  - Contexto e oportunidade
  - Público e personas
  - Objetivos e métricas
  - Escopo
  - Requisitos de alto nível (capacidades macro que o produto deve oferecer)
  - Estratégia e fases
  - Riscos
  - KPIs
  - Stakeholders

#### PRD de alto nível - como contextualização macro de um projeto

- Um PRD para um grande projeto é um artefato extremamente importante, pois responderá perguntas como:
  - Por que esse produto existe?
  - O que queremos alcançar com esse produto?
  - O que esse projeto vai entregar e o que não vai entregar?
  - Para quem estamos construindo isso?
  - Qual problema esse produto resolve e por que ele importa?
  - Como pretendemos alcançar os objetivos?
  - O que o produto deve ser capaz de fazer em linhas gerais?
  - Como saberemos se o produto deu certo?
  - O que pode dar errado e como vamos lidar com isso?
  - Qual o roadmap desse projeto?
  - Quem está envolvido e qual o papel de cada um?
  - Como esse produto se conecta à estratégia da empresa?
