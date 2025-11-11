# Diagramas de Design e Arquitetura

## Diagramas C4

É um modelo para representar a arquitetura em diferentes níveis de detalhe. Ele organiza a visualização de como o sistema se relaciona com usuários e sistemas externos, quais containers o compõem, como cada parte interna é estruturada e, se necessário, como o código está organizado. Essa estrutura também facilita para agentes de IA entenderem o contexto do sistema, permitindo análise, refatoração e geração de artefatos técnicos com mais precisão.

> [!NOTE]
> Referência: **[https://c4model.com/](https://c4model.com/)**

### C1: System Context Diagram (visão externa)

- Define o sistema no ambiente em que ele opera
- Identifica usuários, consumidores e integrações externas
- Bom para alinhamento entre diferentes times como: desenvolvimento, produto, segurança, etc.

![c1](./exemplos/1-diagramas-c4/images/image-1.png)

> [!NOTE]
> Referência: **[https://c4model.com/diagrams/system-context](https://c4model.com/diagrams/system-context)**

### C2: Container Diagram (visão de containers)

- Agrupa os principais blocos: serviços, aplicações, bancos, filas, APIs
- Evidencia como esses blocos se comunicam e em quais protocolos
- Ajuda em decisões de infraestrutura, escalabilidade e deploy

![alt text](./exemplos/1-diagramas-c4/images/image-c2.png)

> [!NOTE]
> Referência: **[https://c4model.com/diagrams/container](https://c4model.com/diagrams/container)**
