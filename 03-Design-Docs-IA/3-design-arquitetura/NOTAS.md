# Design Docs: Design & Arquitetura

Importante lembrar que cada empresa, times podem tratar tipos de Design Docs que tem o mesmo objetivo com nomes diferentes ou com outras variações de estrutura.

Entender o conceito por trás de um documento acaba sendo mais importante do que o nome em si.

## Documentos Comuns

- HLD (High-Level Design): como sistema é estruturado
- Feature Design Doc: como uma feature específica será implementada
- LLD (Low-Level Design): detalhes de implementação. Exemplo: contrato de uma API
- ADRs (Architecture Decision Records): registram decisões arquiteturais ao longo de todo processo.
- RFCs (Request for Comments): propõe o que será criado ou alterado (discussão de "como" e coleta de feedback)

### HLD - High-Level Design

Fornece um panorama macro, a arquitetura geral e as principais relações entre componentes.

Responde perguntas do tipo:

- Como o sistema é estruturado?
- Quais componentes/módulos existem e como se comunicam?
- Quais tecnologias e padrões sendo adotados?

O que pode ser apresentado?

- Diagramas (exemplo: C4 nível 2: container diagram)
- Os serviços, APIs e fluxos principais
- Padrões de comunicação (REST, gRPC, mensageria, MCP)
- Considerações de segurança, escalabilidade e disponibilidade

HDL define o "terreno" onde as features serão implementadas.

#### Seções encontradas em um HLD

- Objetivo
- Arquitetura Geral
- Componentes e responsabilidades
- Fluxo de requisições
- Modelo de dados (alto nível)
- Interfaces públicas
- Considerações de escalabilidade
- Segurança
- Observabilidade
- Riscos

### Feature Design Doc

É O "como implementar uma feature específica" no contexto definido pelo HLD. Aqui vivem os contratos públicos reais, o comportamento exato, fluxos detalhados, erros, semântica de headers, opções de configuração via código, e critérios de aceite técnicos. É o documento que habilita a implementação sem ambiguidades.

Importante utilizar sempre que a feature expõe APIs, altera contratos, adiciona opções de configuração e tem efeitos claros em segurança, performance ou compatibilidade.

Responde perguntas como:

- Quais os principais detalhes técnicos dessa feature?
- Como essa feature se comporta em tempo de execução?
- Quais contratos e interfaces ela expõe para integração?
- Como ela é configurada e quais dependências exige?
- Como lida com erros, exceções e concorrência?
- Como validar que a implementação está correta e atende aos critérios técnicos?

#### Seções encontradas em um FDD

- Contexto e motivação técnica
- Objetivos técnicos
- Escopo e exclusões
- Fluxos detalhados e diagramas
- Contratos públicos (assinaturas, endpoints, headers, exemplos)
- Erros, exceções e fallback
- Observabilidade
- Dependências e compatibilidade
- Critérios de aceite técnicos
- Riscos e mitigação
