# Documentação na Era da IA

## Valor Estratégico

- Ativo essencial para o processo de desenvolvimento (tal como testes automatizados)
- Tornou-se uma das formas mais eficientes para que modelos de IA utilizem contexto em desenvolvimento, manutenção, planejamento etc.
- Possibilita geração de documentação de forma mais rápida, eficiente e assertiva
- Pode realmente se tornar um "documento vivo"

## Tipos de Documentação e Design Docs

- **Produto:** define o que e por quê
- **Design Docs:**
  - Design e arquitetura (como)
  - Infraestrutura (onde e com o quê)
  - Operacional (como manter)
  - Conhecimento e referência (como trabalhar)

## PRDs - Product Requirement Documents

### O que é um PRD

- Documento de produto que visa alinhar equipes de produto com a equipe técnica
- Existe quando há entrega de valor percebido pelo usuário ou negócio
- Deve ser tratado como produto/feature independente, com objetivos, métricas e escopo próprios
- Nem toda feature "merece" um PRD, principalmente quando é apenas um dos requisitos funcionais de um sistema

### Níveis de PRDs

- Produto
- Módulo/Epic
- Feature
- Outros conforme necessidade

### Seções de um PRD

Um PRD pode ser totalmente flexível e, em muitos casos, nem todas as seções necessariamente devem ser utilizadas, principalmente em projetos pequenos.

**Seções principais:**

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

### PRD de Alto Nível - Contextualização Macro de um Projeto

Um PRD para um grande projeto é um artefato extremamente importante, pois responderá perguntas como:

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

### Quando um PRD Pode ser Necessário como Módulo/Feature

> [!NOTE]
> Chamamos de "módulo" no contexto técnico e "Epic" no contexto de produto, pois ambos representam o mesmo nível de granularidade: um agrupamento de funcionalidades relacionadas.

#### Caso 1: Sistema de Autenticação/Login (Commodity)

- Para que a plataforma de estudo da Full Cycle funcione, ela obrigatoriamente precisa de um sistema de login
- Olhando dessa forma, isso é apenas mais um pré-requisito técnico para acessar o sistema; ou seja, não há nada de novo, nenhuma inovação nem decisão de produto envolvida
- É commodity (não gera valor de negócio específico)
- Já existe modelo padrão de implementação
- Não muda a experiência nem o modelo do produto
- As decisões são puramente técnicas, não de produto
- Provavelmente fazia parte dos requisitos funcionais de um sistema maior que pode possuir um PRD

#### Caso 2: Login como Feature com Valor de Produto

Você está criando uma plataforma multi-tenant para desenvolvedores, com foco em segurança corporativa. O time precisa implementar um novo sistema de login com Single Sign-On (SSO), 2FA, OAuth e política de acesso.

**Nesse caso:**

- Muda a experiência do usuário
- Impacta compliance, onboarding e integrações
- Tem objetivos mensuráveis (ex.: reduzir fricção no login, aumentar adoção, reduzir acessos indevidos)
- Envolve decisões mais específicas sobre integrações e segurança

### Seções Comuns em um PRD de Feature

Um PRD pode ser totalmente flexível e, em muitos casos, nem todas as seções necessariamente devem ser utilizadas, principalmente em projetos pequenos.

**Seções principais:**

- Resumo da feature
- Contexto e problema a ser resolvido
- Objetivos e métricas
- Escopo
- Requisitos funcionais
- Requisitos não funcionais
- Fluxo do usuário (user flow)
- Dependências
- Critérios de aceitação
- Riscos e considerações
