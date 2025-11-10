# HLD (Rate Limiter)

# High-Level Design (HLD) - Rate Limiter

## Objetivo

Fornecer uma visão clara dos princípios, responsabilidades e metas do **Rate Limiter embutido (SDK)** desenvolvido em **Go (Golang)**, que será integrado diretamente aos microsserviços da plataforma. O objetivo é permitir que cada serviço controle de forma eficiente o volume de requisições recebidas, aplicando políticas de limitação baseadas em **chaves de API**, **endereços IP** e **planos de cliente**, garantindo previsibilidade e proteção contra sobrecarga.

O SDK deve implementar as estratégias de **Janela Fixa** e **Token Bucket**, equilibrando precisão e desempenho para cenários de tráfego variável. Ele precisa assegurar **isolamento entre clientes**, **estabilidade da plataforma em picos de carga** e **baixa latência operacional** (meta p95 inferior a 5 ms para operações com Redis). Além disso, deve ser fácil de integrar, observável, configurável por ambiente e consistente em sua operação tanto em **Docker Compose** durante o desenvolvimento.

---

## Arquitetura Geral

- **Linguagem:** Implementado em **Go (Golang)**, escolhida pela alta concorrência nativa via goroutines e canais, pela baixa latência e footprint reduzido de memória.
- **Runtime:** Go 1.22+ com compilação estática, builds otimizados para Linux/amd64 e arm64.
- **Containerização:** Empacotado via **Docker** e orquestrado por **Docker Compose** no ambiente de desenvolvimento (mínimo: contêiner `app` em Go e `redis`), e **Kubernetes** em produção.
- **Estilo:** Biblioteca vinculada ao processo de cada microsserviço; _stateless_ no processo, com estado externo no Redis ou _in-memory_ local conforme configuração.
- **Integração:** Chamada _in-process_ (middleware HTTP) antes da lógica de negócio; nenhuma dependência de rede adicional além do Redis (quando habilitado).
- **Armazenamento:**
  - **Redis Cluster** em produção, para contadores e buckets com atomicidade via scripts Lua e TTL configurável.
  - **In-memory** para desenvolvimento local e cenários isolados, sem compartilhamento entre instâncias.
- **Observabilidade:** Métricas, logs e traces integrados à stack do serviço hospedeiro; integração nativa com Prometheus e OpenTelemetry.
- **Prioridades/Tiers:** Políticas por plano (ex.: _premium_, _standard_) com limites e taxas distintos, isoladas por _keyspace_.
- **Estilo:** biblioteca vinculada ao processo de cada serviço; _stateless_ no processo. O estado de limitação é externo (**Redis**) ou **in-memory** (para ambientes locais/isolados), selecionado por configuração.
- **Integração:** chamada _in-process_ via middleware HTTP antes da lógica de negócio; sem _extra hops_ entre serviços (apenas Redis, quando habilitado).
- **Armazenamento:**
  - **Redis Cluster** (prod): contadores/buckets com atomicidade via Lua e TTLs; suporta sharding e failover.
  - **In-memory** (dev/edge-cases): estado local por instância, sem compartilhamento (trade-off documentado no PRD/FDD).
- **Containerização:** Docker/Compose no desenvolvimento (mínimo: `app` + `redis`), Kubernetes em produção; readiness/liveness do host protegem o plano de controle do SDK.
- **Observabilidade:** o SDK emite métricas, logs e traces integrados; nomes padronizados de métricas e atributos de spans.
- **Prioridades/planos:** política pode diferenciar _tiers_ (ex.: premium, standard) por _keyspace_ e alíquotas distintas (ver "Modelo de dados").

**Representação (C4 — contêiner, textual):**

```
Cliente → Serviço A (SDK RateLimiter) ↔ Redis Cluster
                     └─→ Observability do Serviço A (Prometheus / OpenTelemetry)

```

---

## Componentes e responsabilidades

### SDK RateLimiter (biblioteca)

- Ponto de verificação síncrono (`allow`/`deny`) por rota/tenant/plano/IP.
- Resolvedor de política por **tier** (premium/standard) e por **escopo** (global, rota, método HTTP).
- Retorna dados para headers (`Retry-After`, `X-RateLimit-*`) sem acoplar ao framework HTTP.
- Emite métricas, logs e spans; surface de _hooks_ para o host.

### Service Host

- Middleware chama `Check(...)`; injeta identidade normalizada (`apiKey`, `tenant`, `plan`, `ip`, `route`, `method`).
- Compõe os headers de resposta e aplica a decisão (seguir handler ou 429).

### Redis Cluster

- Armazena tokens/contadores/timestamps; provê réplicas e _failover_.
- Observabilidade própria (latência de comandos, uso de memória, _hitrate_ de cache, _evictions_).

---

## Fluxo de requisições (alto nível)

1. **Entrada:** request atinge o serviço → middleware do SDK.
2. **Identidade:** `KeyFunc` normaliza (ex.: `tenant:plan:apiKey|ip|route|method`).
3. **Política:** resolver determina estratégia/limites para o _tier_ e rota corrente.
4. **Estado:**
   - **Redis:** executa script Lua atômico (cálculo do contador/bucket, TTL/retry-after).
   - **In-memory:** aplica algoritmo equivalente com locks leves por chave.
5. **Decisão:** `allow` ou `deny` + metadados (remaining/reset/retryAfter).
6. **Resposta:** host adiciona headers e prossegue (200) ou encerra (429).
7. **Telemetria:** incrementa métricas, cria spans e escreve log estruturado.
8. **Falhas:** em erro de backend e `FallbackOpen=true`, permite e marca `fallback`; caso contrário retorna 5xx conforme política do host.

---

## Modelo de dados

**Keyspaces e nomes (conceito):**

- Prefixos por estratégia e escopo para isolar _tiers_ e evitar colisões:
  - Fixed Window: `rl:fw:{tenant}:{plan}:{route}:{method}:{subject}`
  - Token Bucket: `rl:tb:{tenant}:{plan}:{route}:{method}:{subject}`
  - `subject` pode ser `apiKey` ou `ip` (hash truncado para reduzir hot keys em logs/metricas).

**Campos por estratégia:**

- **Janela Fixa:** contador (int), TTL = duração da janela.
- **Token Bucket:** `tokens` (float/int), `ts_last` (epoch ms); TTL ≈ `burst / rate`.

**Prioridades (tiers):**

- Planos definem _alíquotas_ (ex.: `premium: rate=50/s, burst=100`; `standard: rate=10/s, burst=20`).
- Políticas podem sobrepor por rota crítica (ex.: `/checkout` mais restritiva).

**PII/Logs:**

- Em armazenamento e logs, valores sensíveis são hashados; chaves em Redis são compostas por valores normalizados sem PII direta.

---

## Interfaces públicas (nominais do SDK)

**API In-process (nominal):**

- `Check(ctx, identity, scope) -> Decision{allowed, remaining, resetAt, retryAfter}`
- `Middleware(next http.Handler) http.Handler`
- `New(Options)` / `Reload()` / `WithMetrics(...)` / `WithTracing(...)`

**Configuração (exemplos de campos):** `Strategy`, `Limit/Window` (FW), `Rate/Burst` (TB), `StorageMode=redis|memory`, `FallbackOpen`, `KeyFunc`, `Redis{Addr,TLS,Pool,Timeouts}`.

**Headers HTTP recomendados:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.

---

## Considerações de escalabilidade

- **Baixa latência:** decisão local + 1 _round-trip_ Redis; meta operativa p95 1–5 ms (fim a fim) sob carga nominal.
- **Dimensionamento:**
  - Tamanho de pool Redis proporcional a _QPS_ (regra prática inicial: `pool ≈ cores × 4`).
  - Timeouts conservadores (connect/read ≤ 100 ms) e _circuit breaker_ quando fila do pool saturar.
- **Sharding e _hot keys_:** chave canônica distribui bem slots; evitar prefixos com baixa cardinalidade; monitorar `top-k` chaves.
- **Cache local opcional:** micro‑TTL (ex.: 10–50 ms) para rotas de altíssimo QPS, com trade-offs de precisão documentados.
- **Multi‑instância:** instâncias escalam horizontalmente; no modo `memory`, decisões não são compartilhadas (uso restrito).

---

## Segurança

- **Modelo de ameaça (alto nível):** abuso por chaves comprometidas; _replay_ de requests; _floods_ de IP; exploração de `FallbackOpen`.
- **Identidade:** normalização e validação de `apiKey/plan/tenant/ip/route/method` feitas pelo host; SDK consome valores confiáveis.
- **Transporte:** **TLS/mTLS** entre serviço e Redis; secretos armazenados em _secrets manager_ e não logados.
- **Autorização:** fora do escopo; o SDK apenas aplica políticas já decididas.
- **Auditoria:** amostragem de bloqueios, trilha de mudanças de políticas (no host) e correlação via `trace_id`.

---

## Observabilidade

- **SLIs sugeridos:**
  - Latência p95/p99 do `Check` (Redis e memória).
  - Taxa de `deny` por rota/plan/tenant (alvos esperados vs. observados).
  - Erros de backend (`rate_limiter_backend_errors_total`) e ativações de `fallback`.
- **Alertas (exemplos):**
  - p95 do `Check` > 10 ms por 5 min (Redis) → **WARN**; > 15 ms → **CRIT**.
  - `fallback_total` > 0 por 1 min → **CRIT** (investigar Redis/Network).
  - Top‑k _hot keys_ consumindo > X% do tráfego → **WARN**.
- **Tracing:** spans com atributos `strategy`, `storage_mode`, `key_space`, `decision`, `retry_after_ms`.
- **Logs:** JSON com `key_hash` (salt), sem PII; supressão sob _high‑deny rate_ para evitar _log floods_.

---

## Riscos e mitigação

**Redis indisponível/particionado**

Mitigação: operar em **Redis Cluster** com réplicas e failover; _circuit breaker_ no cliente; opção **FallbackOpen** (quando aceitável pelo produto) com alerta crítico e telemetria dedicada (`fallback_total`).

**Configuração incorreta bloqueando tráfego legítimo**

Mitigação: validação estática no _load_ das políticas; _canary_ por serviço/rota; revisão obrigatória; rollback da última configuração válida; métricas de _deny spike_ acompanhadas de alerta.

**Hot keys e distribuição desigual de carga**

Mitigação: composição de chaves com hash para alta cardinalidade; quotas por IP quando aplicável; monitoramento de top‑k chaves e _rate shaping_ em rotas críticas.

**Divergência de semântica entre estratégias (FW vs TB)**

Mitigação: padronização de headers (`X‑RateLimit‑*`, `Retry‑After`) e telemetria; suíte de testes de contrato no CI; ADR de semântica documentando decisões.

**Exposição de PII (API Key/IP) em logs/telemetria**

Mitigação: hashing com salt (SHA‑256) de identificadores antes de logar; proibição de PII em chaves de log; TLS/mTLS obrigatório; política de retenção curta e acesso restrito.
