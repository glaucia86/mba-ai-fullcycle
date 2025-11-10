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
