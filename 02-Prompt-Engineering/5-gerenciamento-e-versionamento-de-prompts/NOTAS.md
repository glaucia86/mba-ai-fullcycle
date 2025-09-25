# Versionamento de prompts

> Prompts para utilizaçao diária (foco em produtividade, pesquisa, exploração)

Tenta definir se o prompt é para uso pessoal ou para ser compartilhado com a equipe.

- Gerenciamento de prompts para equipes
  - Entenda prompt como software
  - GIT
  - Testes
  - PR's
  - Code Review
  - Evaluation
  - Produção

Como fazer versionamento de prompts? Siga os passos abaixo:

- README

  - Índice categorizado

- Documentação de cada prompt

  - Nome do Prompt
  - Link para o prompt "plain"
  - Objetivo
  - Modelos testados/utilizados
  - Observações gerais
  - Últimas atualizações

- Categorização
  - Exploração e Planejamento (analisar code base, segurança, guidelines, projetar novas features)
  - Documentação (criação e manuntenção de Design Docs)
  - Implementação (workflow de desenvolvimento, testes automatizados, correção de bugs, refatoração, LLM-as-judge)
  - Especialização (desenvolver em GO, Spring, Laravel, Langgraph),
  - Infraestrutura (dockerfile, docker-compose, k8s, terraform, CI/CD)
  - Utils (commits, PR, code review)

## Prompts para desenvolvimento de aplicações/agentes

### Lógica básica

- Registry (contém todos os prompts e suas versões a serem utilizadas)
- Identificar por Agente, caso de uso, componente, subdomínio
- SemVer
- Arquivo do Prompt
- Metadados (podem estar no próprio arquivo) do prompt
- Casos de teste para validar a "compilação" do prompt
- README.md - contexto do prompt e onde ele é utilizado e breve change log
