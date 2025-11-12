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

### C3: Component Diagram (visão de componentes)

- Organiza cada container em módulos, pacotes ou camadas
- Deixa claro onde estão as responsabilidades
- Auxilia desenvolvedores a manterem coesão e baixo acoplamento

![alt text](./exemplos/1-diagramas-c4/images/image-02.png)

> [!NOTE]
> Referência: **[https://c4model.com/diagrams/component](https://c4model.com/diagrams/component)**

### C4: Code Diagram (visão de código)

- Aprofunda em classes, funções ou estruturas
- Usado apenas quando há necessidade real de padronização ou auditoria.
- Não é obrigatório na maioria dos projetos
- Raramente recomendado

![alt text](./exemplos/1-diagramas-c4/images/image-04.png)

> [!NOTE]
> Referência: **[https://c4model.com/diagrams/code](https://c4model.com/diagrams/code)**

## Diagramas Mermaid

Mermaid é uma linguagem de marcação que transforma texto em diagramas. Ela permite representar fluxos, interações e estruturas de sistemas de forma simples e legível dentro de documentos técnicos. Por gerar gráficos diretamente do código, facilita a manutenção, revisão e automação por agentes de IA, tornando a documentação sempre atualizada e consistente

### Flowchart (fluxogramas)

- Representa fluxos de decisão, etapas e caminhhos alternativos
- Ideal para mostrar lógica de processos e pipelines
- Útil em documentações de sistemas, APIs e automações

```mermaid
flowchart TD
    A[Início] --> B{Decisão}
    B -- Sim --> C[Processo 1]
    B -- Não --> D[Processo 2]
    C --> E[Fim]
    D --> E[Fim]
```

### Sequence Diagram (diagramas de sequência)

- Mostra a troca de mensagens entre componentes ao longo do tempo
- Excelente para visualizar chamadas entre serviços, APIs e banco de dados
- Ajuda a identificar dependências e gargalos de comunicação

```mermaid
sequenceDiagram
    participant User
    participant API
    participant DB

    User->>API: Solicita dados
    API->>DB: Consulta dados
    DB-->>API: Retorna dados
    API-->>User: Envia resposta
```

### Class Diagram (diagramas de classes)

- Exibe classes, structs e seus relacionamentos
- Mostra atributos, métodos e heranças
- Bom para explicar a estrutura interna do código e o design do domínio

```mermaid
classDiagram
    class Pessoa {
        +String nome
        +int idade
        +falar()
    }
    class Aluno {
        +String matricula
        +estudar()
    }
    Pessoa <|-- Aluno
```

### ER Diagram (diagramas de entidade-relacionamento)

- Exibe classes, structs e seus relacionamentos
- Mostra atributos, métodos e heranças
- Bom para explicar a estrutura interna do código e o design do domínio

```mermaid
erDiagram
    CLIENTE ||--o{ PEDIDO : faz
    PEDIDO ||--|{ ITEM : contém
    CLIENTE {
        int id
        String nome
        String email
    }
    PEDIDO {
        int id
        Date data
        float total
    }
    ITEM {
        int id
        String descricao
        float preco
    }
```

### State Diagram (diagramas de estado)

- Mostra os estados possíveis de um sistema e suas transações
- Indicado para workflows, automações e máquinas de estado
- Ajuda a entender como o sistema reage a diferentes eventos e condições

```mermaid
stateDiagram-v2
    [*] --> Estado1
    Estado1 --> Estado2 : EventoA
    Estado2 --> Estado3 : EventoB
    Estado3 --> [*] : EventoC
    Estado2 --> Estado1 : EventoD
```
