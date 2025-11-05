# Exemplo para Feature (Rate Limiter)

### PRD: Sistema de Rate Limiter

Versão: 1.1

Data: 2025-11-01

Responsável: [A definir]

---

### Resumo

O **Rate Limiter Centralizado** é um componente essencial para garantir a estabilidade, previsibilidade e qualidade de serviço da plataforma como um todo. Ele atua como uma camada de proteção e governança de tráfego, controlando o volume de requisições enviadas aos microsserviços internos e às APIs públicas. Sua função é evitar sobrecarga e degradação de performance, assegurando que clientes críticos mantenham prioridade mesmo sob alta concorrência.

O sistema será entregue como um **SDK em Go**, facilmente integrável em qualquer serviço, permitindo controle de requisições por **chave de API**, **endereço IP** ou **rota específica**. Ele suportará tanto **modo distribuído (Redis Cluster)**, para produção, quanto **modo in-memory**, para ambientes locais, garantindo flexibilidade e simplicidade de uso. O Rate Limiter é um dos pilares de resiliência da arquitetura e impacta diretamente a experiência do usuário final, sendo considerado um **componente crítico de infraestrutura de produto**.

---

### Contexto e problema

**Motivação e importância**

A ausência de um controle de tráfego padronizado resultou em múltiplas implementações isoladas entre microsserviços, cada uma com comportamentos diferentes e difíceis de auditar. Isso tem causado inconsistência na aplicação de limites, aumentando a probabilidade de falhas em cadeia e degradação global em momentos de pico.

Durante incidentes recentes, observou-se que serviços não prioritários conseguiram consumir a maior parte dos recursos disponíveis, bloqueando requisições de clientes de planos premium e causando **indisponibilidade de até 5 minutos** em períodos de tráfego superior a 1000 requisições por segundo. O novo Rate Limiter centralizado tem como meta eliminar esse tipo de falha, trazendo uniformidade, previsibilidade e priorização adequada de recursos.

**Público-alvo**

- Times de desenvolvimento e DevOps.
- Equipes de observabilidade e SRE.
- Microsserviços internos e APIs expostas a parceiros.

**Cenários de uso principais**

- Controle de tráfego entre microsserviços internos (intra-plataforma).
- Limitação de chamadas a APIs públicas e endpoints sensíveis.
- Proteção contra abuso, scraping e automações indevidas.
- Priorização de clientes conforme planos de serviço.

**Local de implantação**

- Como SDK embarcado em cada microsserviço, com operação local (in-memory) ou distribuída via Redis Cluster.

**Problemas a resolver**

- Falta de padronização no controle de requisições.
- Ausência de políticas de prioridade entre clientes.
- Sobrecarga de serviços durante picos, levando à indisponibilidade.
- Dificuldade de observabilidade e auditoria em implementações distintas.

---

### Objetivos e métricas

| Objetivo                                             | Métrica                         | Meta                              |
| ---------------------------------------------------- | ------------------------------- | --------------------------------- |
| Garantir estabilidade da plataforma sob carga alta   | Disponibilidade (uptime mensal) | ≥ 99.9%                           |
| Reduzir o impacto de sobrecarga em serviços críticos | Tempo médio de downtime         | < 1 minuto                        |
| Garantir equidade entre clientes e planos            | % requisições 429 no total      | < 2%                              |
| Assegurar desempenho eficiente                       | Latência p95 por decisão        | < 5 ms (Redis) / < 1 ms (memória) |

---

### Escopo

**Incluso**

- SDK em Go com suporte às estratégias **Janela Fixa** e **Token Bucket**.
- Armazenamento configurável entre **Redis Cluster** e **in-memory**.
- Middleware HTTP integrado com métricas, tracing e headers padronizados.
- Parâmetro `FallbackOpen` para operação permissiva durante falhas do Redis.
- Integração com Prometheus e OpenTelemetry.
- Documentação técnica e exemplos de integração.

**Fora do escopo**

- Interface administrativa para políticas dinâmicas.
- Coordenação multi-região.
- SDKs em outras linguagens.
- Funcionalidades de autenticação/autorização.
- Painel de governança e auditoria visual.

---

### Requisitos funcionais

### FR-001 — Controle de Limites por Chave e IP

- Aplicar limitação de requisições por chave de API e IP.
- Contabilizar requisições em janelas configuráveis.
- Retornar cabeçalhos padrão: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`, `X-RateLimit-Reset`.

### FR-002 — Estratégias de Rate Limiting

- **Janela Fixa:** contador simples com TTL = janela.
- **Token Bucket:** taxa de recarga e burst configurável, TTL proporcional à capacidade/taxa.
- Operações atômicas via **scripts Lua (`EVALSHA`)** para consistência e performance.

### FR-003 — Resiliência e Fallback

- Parâmetro `FallbackOpen` que permite manter a disponibilidade em caso de falha do Redis.
- Registro de métricas de fallback (`rate_limiter_fallback_total`) e alerta de anomalias.

### FR-004 — Observabilidade e Telemetria

- Expor métricas (`rate_limiter_decisions_total`, `rate_limiter_latency_ms`).
- Criar spans de tracing (`Check`, `RedisEval`).
- Gerar logs estruturados em JSON, com anonimização de chaves sensíveis.

---

### Requisitos não funcionais

**Performance**

- Latência p95 < 5 ms (Redis) / < 1 ms (memória).
- Throughput mínimo: 50k decisões/min por instância.

**Disponibilidade**

- Uptime ≥ 99.9%.
- Failover automático do Redis Cluster.

**Segurança e privacidade**

- Hash (SHA-256 + salt) de identificadores sensíveis.
- Comunicação segura com TLS/mTLS.
- Nenhum dado PII persistido ou logado em texto claro.

**Observabilidade**

- Integração nativa com Prometheus e OpenTelemetry.
- Logs estruturados e métricas por tenant/plano.

**Confiabilidade e integridade**

- Consistência determinística entre instâncias.
- Garantia de atomicidade com scripts Lua e locks locais.

**Portabilidade**

- Execução em Docker Compose (Go + Redis) no dev e Kubernetes em produção.

---

### Arquitetura e abordagem

- SDK modular embarcado nos microsserviços, operando _in-process_ e de forma leve.
- Redis como armazenamento principal; fallback para memória local.
- Scripts Lua para atomicidade e baixo custo de rede.
- Exporters para métricas e tracing integrados à observabilidade corporativa.

---

### Decisões e trade-offs

**Decisão:** Uso de Redis Cluster como armazenamento principal.

**Justificativa:** Alta performance, atomicidade e replicação nativa.

**Trade-off:** Volatilidade e dependência de infraestrutura.

**Decisão:** Implementação em Go (Golang).

**Justificativa:** Concorrência leve e latência mínima.

**Trade-off:** Curva de aprendizado para times não familiarizados.

**Decisão:** Suporte dual de storage (Redis e memória).

**Justificativa:** Flexibilidade e portabilidade entre ambientes.

**Trade-off:** Estado não compartilhado em modo local.

---

### Dependências

- **Técnica:** Redis 6.2+ (Cluster, TLS, scripts Lua).
- **Organizacional:** Times DevOps e Observabilidade.
- **Externa:** Microsserviços que integrarão o SDK.

---

### Riscos e mitigação

| Risco                       | Impacto                               | Mitigação                                               |
| --------------------------- | ------------------------------------- | ------------------------------------------------------- |
| Redis indisponível          | Perda de controle global              | `FallbackOpen` + alerta crítico e modo local temporário |
| Configuração incorreta      | Bloqueio indevido de clientes         | Validação de políticas e rollback seguro                |
| Hot keys sob carga desigual | Aumento de latência e lock contention | Chaves hashadas e monitoramento de top-k                |
| Exposição de PII            | Vazamento de dados sensíveis          | Hash com salt e política de retenção mínima             |

---

### Critérios de aceitação

- Retornar 429 quando o limite for atingido.
- Headers padronizados de rate limit.
- Latência p95 dentro das metas.
- Logs e métricas disponíveis em observabilidade.
- Testes automatizados de carga e resiliência concluídos.
- SDK integrado e validado em pelo menos um microsserviço em staging.

---

### Testes e validação

**Testes obrigatórios**

- Unitários de regras e geração de headers.
- Integração com Redis e storage local.
- Testes de carga (2000 req/s).
- Fault-injection de falhas Redis.
- Testes de concorrência com race detector e TDD.
