# Feature Design Doc - Rate Limiter

## 1. Contexto e motivação técnica

Os microsserviços da plataforma tratam limitação de requisições de maneiras diferentes, o que gera inconsistência e risco de sobrecarga de recursos compartilhados. Um SDK embutido em cada serviço resolve o problema ao centralizar a lógica de rate limiting dentro do próprio processo. Ele decide localmente (`allow`/`deny`), persistindo o estado em Redis (modo distribuído) ou memória local (modo isolado). Isso garante baixo acoplamento, performance previsível e observabilidade padronizada entre serviços.

## 2. Objetivos técnicos

- Oferecer uma API pública estável para checagem de limites (`Check`) e integração via middleware HTTP.
- Suportar as estratégias Janela Fixa e Token Bucket, com semântica de headers e opções configuráveis.
- Permitir execução em dois modos de storage: `redis` (compartilhado) e `memory` (local), com comportamento idêntico.
- Garantir baixa latência e atomicidade com scripts Lua (Redis) e sincronização por chave (memória).
- Prover telemetria nativa (métricas, logs estruturados e tracing).
- Suportar modo permissivo (`FallbackOpen`) para evitar falhas catastróficas em indisponibilidade do backend.

## 3. Escopo e exclusões

Incluído:

- Middleware HTTP para Go com lógica in-process.
- Estratégias Janela Fixa e Token Bucket com semântica uniforme.
- Suporte a Redis Cluster e modo memória local.
- Integração com Prometheus e OpenTelemetry.
- Geração dos headers `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

Excluído:

- Autenticação/Autorização (o SDK consome apenas identidade do host: API Key, IP, tenant).
- Gestão dinâmica de políticas (sem UI/DB/console para editar regras em tempo real).
- Outras estratégias (Sliding Window, GCRA, Leaky Bucket, adaptativas).
- Edge/CDN rate limiting e WAF/gateways externos.
- Persistência durável obrigatória (AOF/RDB é opcional para este caso de uso).

## 4. Fluxos detalhados e diagramas

Sem diagramas nesta versão. Fluxos conceituais:

- Janela Fixa: contador por chave com TTL (janela).
- Token Bucket: recarga contínua de tokens (Rate) até um teto (Burst); consumo por requisição; negação quando vazio.

## 5. Contratos públicos (assinaturas, headers, exemplos)

### 5.1 Interface pública

```go
type RateLimiter interface {
    Check(ctx context.Context, key string) (Decision, error)
    Middleware(next http.Handler) http.Handler
}

type Decision struct {
    Allowed    bool
    Remaining  int
    RetryAfter time.Duration
}

```

### 5.2 Semântica dos headers HTTP

- `X-RateLimit-Limit`: limite configurado (por janela ou Burst).
- `X-RateLimit-Remaining`: requisições restantes na janela/balde.
- `X-RateLimit-Reset`: segundos até reset (janela fixa) ou até o próximo token suficiente (aproximação no token bucket).
- `Retry-After`: tempo até nova tentativa em caso de `deny`.

### 5.3 Exemplos de uso (sucintos)

```go
// Janela Fixa (Redis)
limiter := ratelimiter.New(ratelimiter.Options{
    Strategy: "fixed_window",
    Limit:    100,
    Window:   time.Minute,
    Storage:  ratelimiter.StorageConfig{Mode: "redis"},
})

```

```go
// Token Bucket (memória)
limiter := ratelimiter.New(ratelimiter.Options{
    Strategy: "token_bucket",
    Rate:     10,  // tokens/s
    Burst:    20,  // capacidade
    Storage:  ratelimiter.StorageConfig{Mode: "memory"},
})

```

## 6. Configuração e opções

Linguagem e runtime

- Go 1.22+, Linux amd64/arm64.

Armazenamento de estado

- Redis 6.2+ (scripts Lua), opcionalmente Redis Cluster.
- Modo in-memory para desenvolvimento/local ou instâncias isoladas.

Ambiente de desenvolvimento

- Docker para empacotamento do serviço hospedeiro e do Redis.
- Docker Compose no desenvolvimento, com:
  - `app`: serviço Go contendo o SDK; expõe HTTP, healthcheck simples.
  - `redis`: `redis-cli ping` no healthcheck.
  - (Opcional) `otel-collector` / `prometheus`.
- Alternância de storage por `RL_STORAGE_MODE=redis|memory`, mapeada em `Options`.

Segurança e rede

- TLS/mTLS entre app ↔ redis (quando disponível).
- Credenciais via `REDIS_ADDR`, `REDIS_PASSWORD`.
- Pool configurável e timeouts curtos (50–100 ms) no cliente Redis.

Estrutura de opções (pública)

```go
type Options struct {
    Strategy     string         // "fixed_window" | "token_bucket"
    Limit        int            // janela fixa
    Window       time.Duration  // janela fixa
    Rate         float64        // token bucket (tokens/s)
    Burst        int            // token bucket (capacidade)
    KeyFunc      func(*http.Request) string
    Storage      StorageConfig  // Redis ou memória
    Metrics      MetricsConfig  // (se aplicável)
    Tracer       TracerConfig   // (se aplicável)
    FallbackOpen bool
}

type StorageConfig struct {
    Mode  string
    Redis *RedisConfig // usado se Mode = "redis"
}

type RedisConfig struct {
    Addr        string
    Password    string
    UseTLS      bool
    ClusterMode bool
    PoolSize    int
    Timeout     time.Duration
}

```

Validações recomendadas (em `New()`):

- `Strategy` exigida; parâmetros obrigatórios por estratégia (Limit/Window ou Rate/Burst).
- `Storage.Mode` válido e coerente com `RedisConfig`.
- Limites e defaults sensatos (ex.: `Rate > 0`, `Burst >= 1`, `Window >= 1s`).

## 7. Erros, exceções e fallback

### 7.1 Concorrência e atomicidade

Por que é crítico

- Em alta concorrência, múltiplas instâncias/goroutines avaliam a mesma chave simultaneamente; sem atomicidade, surgem condições de corrida, double counting e violações de limite (permitir acima do configurado) ou negações indevidas.

Garantias comportamentais (invariantes)

- Nenhuma chave deve exceder o limite configurado.
- `Remaining` nunca é negativo.
- Chamadas repetidas sob mesmas condições produzem decisões determinísticas (determinismo por estratégia).
- Cabe ao SDK informar `Retry-After ≥ 0` sempre que negar.

Atomicidade em Redis

- Execução serializada no nó primário do Redis (processo single-threaded).
- Scripts Lua via `EVALSHA` encapsulam leitura, cálculo e escrita numa operação lógica indivisível: obtém estado atual, calcula (incremento/recarga/consumo), atualiza valor e TTL, e retorna `allowed/denied`, `remaining` e `retry_after`.
- Replicação é assíncrona; leituras/decisões devem ocorrer contra o primário. Em clusters, roteamento consistente ao primário da shard.
- Recomendações: usar `EVALSHA` para evitar retransmitir o script; limitar lógica no Lua; monitorar duração dos scripts.

Atomicidade em memória

- Cada chave é protegida por um lock exclusivo (`sync.Mutex` por entrada), serializando atualizações por chave. Chaves distintas progridem em paralelo.
- Estruturas:
  - Janela Fixa: `FixedWindowEntry{count, expiresAt}` com expurgo em background.
  - Token Bucket: `TokenBucketEntry{tokens, lastRefill}` com atualização sob lock.
- Relógio: usar fonte monotônica (`time.Since(lastRefill)`) para minimizar efeitos de skew e saltos de clock.

Considerações de performance (efeito da concorrência)

- Redis + Lua: ida/volta de rede + execução tipicamente ~1–5 ms; picos até ~10–15 ms sob contenda/evictions.
- Memória local: caminho in-process, tipicamente < 1 ms; contenção limitada por lock por chave.
- Boas práticas: pool ajustado, timeouts 50–100 ms, evitar hot keys, shard lógico por prefixo (ex.: `tenant:rota`), e pipelines curtos.

Mitigações adicionais

- Sharding lógico para reduzir contenção por chave.
- Retry com backoff para erros transitórios (evitar busy waiting).
- Expiração precisa (TTL) para liberar chaves inativas.
- Métricas específicas de contenção/duração de script: `rate_limiter_lock_contention_total`, `rate_limiter_script_duration_ms`.

### 7.2 Erros e exceções gerais

| Situação                            | Tratamento (alto nível)                                    |
| ----------------------------------- | ---------------------------------------------------------- |
| Timeout no Redis                    | Retorna erro; aplica `FallbackOpen` se habilitado.         |
| Pool esgotado/conexão recusada      | Log `ERROR`; aplica fallback conforme política.            |
| Script Lua ausente (miss `EVALSHA`) | Recarregar script e reexecutar; log `WARN`.                |
| Key vazia/malformada                | `deny` imediato + log `WARN`; não computa quota.           |
| Clock drift em memória              | Corrigido na próxima recarga; usar fonte monotônica.       |
| Falha na serialização de log        | Ignorar erro de log; decisão preservada.                   |
| Cluster failover (Redis)            | Decisões só no primário; reconectar e reexecutar operação. |

### 7.3 Modo permissivo (FallbackOpen)

- Se `FallbackOpen = true`, erros de backend (timeout, conexão recusada, erro Lua) fazem o SDK permitir requisições temporariamente, sem consumir quota.
- Evento logado (`WARN`) e métrica `rate_limiter_fallback_total` incrementada.
- Ao restabelecer conectividade, o SDK retorna ao modo normal.
- Quando usar: sistemas críticos de disponibilidade (checkout, autenticação).
- Quando não usar: endpoints sensíveis a abuso (autenticação pública).
- Tempo máximo de espera por backend: timeout efetivo ≤ 100 ms por chamada.

## 8. Métricas, logs e tracing

Métricas

- `rate_limiter_decisions_total{decision}` (allow/deny/fallback).
- `rate_limiter_latency_ms` (histograma).
- `rate_limiter_backend_errors_total`.
- `rate_limiter_fallback_total`.
- (Opcional) `rate_limiter_lock_contention_total`, `rate_limiter_script_duration_ms`.

Logs estruturados

- JSON no `stdout` (ELK/Datadog/Cloud Logging).
- Campos: `timestamp`, `decision`, `strategy`, `storage_mode`, `latency_ms`, `retry_after_ms`, `key_hash` (SHA-256 com salt `RL_LOG_SALT`), `trace_id`, `span_id`.
- Níveis: `INFO` (normal), `WARN` (fallback), `ERROR` (backend/script/erro interno).
- Supressão opcional para tempestades de `deny`.

Tracing (OpenTelemetry)

- Span por `Check` com atributos `strategy`, `storage_mode`, `key_hash`.
- Sub-span para operação Redis (quando aplicável).

Proteção de dados (PII)

- Não logar chaves/IDs em claro; hash obrigatório com salt.
- TTL natural das estratégias evita retenção indevida de dados temporários.
- Criptografia de conexão (TLS/mTLS) recomendada.

## 9. Dependências e compatibilidade

| Componente              | Versão mínima | Observações                                |
| ----------------------- | ------------- | ------------------------------------------ |
| Go                      | 1.22          | Módulos habilitados.                       |
| Redis                   | 6.2           | Scripts Lua (`EVALSHA`); Cluster opcional. |
| Prometheus              | opcional      | Coleta de métricas.                        |
| OpenTelemetry Collector | opcional      | Exportação de traces.                      |
| Linux                   | amd64/arm64   | Ambientes oficiais de execução.            |

Compatibilidade e paridade

- Esperam-se decisões e headers equivalentes entre `redis` e `memory`, salvo diferenças inerentes (latência de rede, contenda inter-nós).
- Versionamento: mudanças breaking apenas em versões major do SDK.

## 10. Critérios de aceite técnicos

Funcional e contratos

- Determinismo por estratégia (Janela Fixa e Token Bucket).
- Headers `X-RateLimit-*` e `Retry-After` corretos conforme `allow/deny`.
- Paridade de comportamento entre `redis` e `memory` para o mesmo tráfego (limitações documentadas).

Testes automatizados

- Cobertura mínima (core) ≥ 90% nos módulos de estratégia e headers.
- Testes de contrato HTTP (200/429) para ambos os storages.
- Testes de concorrência (race detector habilitado), monotonicidade de `Remaining`, sem contagem negativa.
- Property-based tests variando `Rate/Burst/Window/Limit` e padrões de chegada (Poisson e bursts); invariantes preservados.
- Fuzzing de `KeyFunc` com caracteres extremos e alta cardinalidade.

Performance e carga

- Redis: `Check` p95 < 5 ms; p99 < 10 ms; picos eventuais aceitáveis até 15 ms com alarme.
- Memória: `Check` p95 < 1 ms.
- Throughput de referência: ≥ 50k decisões/min/instância com ≥ 1k chaves ativas sem violar metas.
- Soak test (≥ 2 h): sem vazamentos (variação < 5% do heap estável) e estabilidade de p95.

Resiliência e falhas

- `FallbackOpen`: em erro de backend, decisões não consomem quota; logs/métricas sinalizam fallback e motivo.
- Fault-injection: perda de pacotes/latência simulada e nó de Redis indisponível mantêm comportamento especificado; `FallbackOpen=false` implica negar sob erro determinístico.
- Timeout efetivo do cliente Redis ≤ 100 ms por chamada.

## 11. Riscos e mitigação

| Risco                   | Impacto             | Mitigação                                          |
| ----------------------- | ------------------- | -------------------------------------------------- |
| Redis indisponível      | Bloqueio de tráfego | `FallbackOpen` ou modo memória.                    |
| Hot keys                | Latência alta       | Distribuir chaves uniformemente (sharding lógico). |
| Configuração incorreta  | Limitação indevida  | Validação em `New()` + testes.                     |
| Divergência de contagem | Inconsistência      | Scripts determinísticos + TTLs fixos + primário.   |
| Exposição de PII        | Vazamento de dados  | Hash + política de log segura + TLS/mTLS.          |

Anexos / Referências

- Projetos e bibliotecas (Go)
  - go-redis/redis_rate (GCRA em Redis): https://github.com/go-redis/redis_rate
  - ulule/limiter (middleware com Redis/memória): https://github.com/ulule/limiter
  - uber-go/ratelimit (leaky-bucket): https://github.com/uber-go/ratelimit
  - sethvargo/go-limiter (alto throughput): https://github.com/sethvargo/go-limiter
  - redis-rate-limiter (Lua + Redis): https://github.com/januszry/redis-rate-limiter
- Materiais (conceitos e algoritmos)
  - Rate Limiting Algorithms Explained with Code — blog.algomaster.io
  - Fixed Window vs Token Bucket — Medium/@animirr
  - Token bucket vs Fixed window (Traffic Burst) — StackOverflow
- Redis e Lua (documentação)
  - Redis: Rate Limiting (Glossary) — https://redis.io/glossary/rate-limiting/
  - EVALSHA — https://redis.io/docs/latest/commands/evalsha/
  - EVALSHA_RO — https://redis.io/docs/latest/commands/evalsha_ro/
