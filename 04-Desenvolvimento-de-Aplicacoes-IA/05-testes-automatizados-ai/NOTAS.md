# Testes automatizados no dia zero!

- Testes automatizados utilizando a IA de forma errada pode ser o maior ponto de falsa sensação de segurança que seu código está coberto.
- IA precisa ter clareza do que testar e como testar.
- Testes de UI devem ter um cuidado mais do que especial. Normalmente é aonde grande parte dos tokens são gastos e muitas vezes a IA entra num loop.
- Sempre pense: se eu der uma tarefa, e não intervir, ela será capaz de testar realmente o que foi desenvolvido (independente de quem dessenvolveu?)

## Definição clara sobre o que são testes de Unidade, Integração, E2E

- **Unit Testes:**
  - simples unidades (uma classe, um método, etc. Sem dependências externas)

> [!DANGER]
> Mocks. IA pode tentar gerar muitos mocks para realizar os testes. Tome ainda mais cuidado com FrontEnd

- **Integração:**
  - Pode haver múltiplas interpretações
  - Integração entre classes/componentes do sistema
  - Integração com sistemas externos
  - Incluem banco de dados? Qual tipo? SQLite vs Postgres
  - Integração entre Frontend/backend

- **E2E:**
  - Pode haver múltiplas interpretações
  - Fazer uma chamada completa em uma API?
  - Fazer o teste também chamar serviços externos
  - Abrir o browser executar uma ação que deve chamar a API
  - Verificação de UI

> [!DANGER]
> A falta de definição clara sobre o que cada categoria de teste representa pode gerar situações catastróficas.

## Cobertura de código

Defina claramente os parâmetros sobre o que representa X% de cobertura de c´pdigo.

- A IA tende a garantir literalmente a % de cobertura de código, principalmente os de unidade, em que algumas vezes jamais seriam testados individualmente por conta de relevância e que indiretamente seriam testados por testes de integração.

## Verificação/Implementação

- Busque entender se a abordagem que a IA está utilizando para gerar os testes está correta.

- Faça um planejamento (modo plan), solicitando uma análise de quais são os testes "inúteis" ou redundantes que não deveriam estar no projeto. Após a identificação, se fizer sentido, faça a remoção, e solicite ela adicionar em sua "memória" para não repetir mais esse comportamento, ou tenha uma guideline clara de como o agente deve se comportar.

- Faça um planejamento (modo plan), solicitando uma análise de testes de "edge cases" que ela não implementou. A IA muitas vezes pode tender a fazer testes óbvios, porém, pode evitar realmente pegar exatamente as situações importantes que não seguem o fluxo comum da aplicação.

## Testes desnecessários

Ao trabalhar com geração de testes usando IA, o ponto central não é apenas pedir que a ferramenta crie testes, mas **avaliar criticamente a estratégia que ela está adotando**. Um dos principais problemas é que a IA pode começar a testar comportamentos pouco relevantes, redundantes ou superficiais, enquanto deixa de cobrir fluxos realmente importantes do sistema. Por isso, antes de aceitar a geração automática, é necessário entender **qual padrão de teste está sendo produzido**, quais critérios estão sendo priorizados e se esses testes realmente agregam valor à qualidade do software.

Esse problema se manifesta de forma diferente em projetos **greenfield** e **brownfield**. Em projetos greenfield, como ainda não existe código ou suíte de testes prévia, a IA não possui referências estruturais nem exemplos concretos para seguir. Isso torna a geração de testes mais incerta e exige instruções muito mais específicas e granulares sobre como testar, o que priorizar e qual estilo adotar. Já em projetos brownfield, a presença de testes existentes oferece um padrão observável, permitindo que a IA replique convenções, estrutura e estilo com mais consistência.

Nesse contexto, arquivos como **agents.md**, **claude.md** ou outros artefatos de orientação funcionam como mecanismos temporários de alinhamento. Em fases iniciais, especialmente em greenfield, pode fazer sentido incluir nesses arquivos regras explícitas sobre testes, organização de diretórios e critérios de geração, justamente para compensar a ausência de referência no código. No entanto, esses documentos não devem ser tratados como estáticos. À medida que o projeto amadurece e a base de testes passa a servir como referência viva, parte dessas instruções pode ser removida para reduzir redundância e liberar espaço de contexto para tarefas mais relevantes.

Do ponto de vista técnico, a recomendação é realizar uma **análise deliberada dos testes já existentes** para identificar casos inúteis, redundantes ou de baixo valor. A ideia é pedir que o agente faça um planejamento para localizar testes que não deveriam estar no projeto, removendo-os quando fizer sentido e, em seguida, registrando esse aprendizado em memória ou em guidelines permanentes. Isso é importante porque a IA tende a aprender por repetição de padrão: se a base histórica estiver contaminada por testes fracos, redundantes ou mal direcionados, os próximos testes gerados provavelmente seguirão o mesmo comportamento.

Assim, a discussão sobre testes desnecessários não é apenas uma crítica à geração automática, mas uma orientação sobre **governança de qualidade assistida por IA**. O foco deve estar em ensinar o agente a distinguir o que merece cobertura do que apenas aumenta volume sem aumentar confiança. Em outras palavras, gerar muitos testes não significa gerar bons testes; o valor está em construir uma suíte que reflita riscos reais, comportamentos críticos e padrões consistentes de validação.

### Síntese técnica

A geração de testes com IA precisa ser guiada por contexto, referências e revisão crítica. Sem isso, a tendência é produzir cobertura artificial: muitos testes, pouca utilidade. O uso de instruções temporárias, análise de redundância e memória de padrões inadequados é uma forma de evoluir a qualidade dos testes gerados e evitar que a IA perpetue más práticas.

> [!INFO]
> exemplo de projeto greenfield que demonstra como criar uma aplicação do zero utilizando IA de forma adequada no processo de desenvolvimento: **[https://github.com/devfullcycle/mba-ia-greenfield-project](https://github.com/devfullcycle/mba-ia-greenfield-project)**

## Report dos testes que poderiam ser removidos

![image](./resources/testes.png)

O conteúdo discute como a análise automatizada de testes pode ajudar a revisar a qualidade da suíte de testes de um projeto e identificar quais casos realmente agregam valor à aplicação. A proposta não é simplesmente remover testes para diminuir volume, mas entender se a estratégia atual está equilibrada ou se existe excesso de validações redundantes, repetitivas ou pouco úteis.

A análise mostra que, em muitos projetos, principalmente aqueles que já cresceram bastante, é comum existir uma quantidade elevada de testes no front-end e no back-end que validam comportamentos já assegurados por bibliotecas externas ou frameworks maduros. Isso significa que parte da suíte pode estar testando algo que já é garantido por ferramentas consolidadas, em vez de concentrar esforço nos comportamentos específicos do negócio e nos riscos reais do sistema. Nesse cenário, a existência de muitos testes não representa necessariamente uma estratégia de qualidade melhor. Em alguns casos, pode significar apenas mais custo de manutenção, mais tempo de execução e mais complexidade para evoluir o código.

Para interpretar melhor esse problema, o conteúdo retoma a lógica da pirâmide de testes. Na base estão os testes de unidade, que são mais rápidos, mais baratos e mais precisos para localizar falhas em regras de negócio isoladas. No nível intermediário estão os testes de integração, que verificam a interação entre componentes e validam cenários mais próximos do comportamento real do sistema. No topo estão os testes end-to-end, que exercitam o fluxo completo da aplicação e, por isso, tendem a ser mais lentos, mais caros e mais sensíveis a dependências externas. A ideia principal é que a distribuição dos testes deve respeitar esse equilíbrio: quanto mais próximo do topo, maior o custo; quanto mais próximo da base, maior a velocidade e menor o custo de execução.

A partir dessa visão, fica claro que nem todo teste precisa ser mantido apenas porque existe. Se determinada validação já está suficientemente coberta por um teste de integração, ou se ela apenas reafirma o comportamento esperado de uma biblioteca confiável, pode não haver justificativa técnica forte para manter também testes unitários redundantes sobre aquele mesmo aspecto. A discussão, portanto, não é contra testes, mas contra o acúmulo de testes que pouco contribuem para aumentar a confiança no sistema. O foco deve estar em manter testes que protegem comportamentos críticos, ajudam a detectar regressões relevantes e refletem riscos concretos da aplicação.

Outro ponto importante é que a decisão sobre remover ou manter testes não deve ser feita de forma automática. A automação e a IA funcionam como apoio analítico, mostrando padrões de redundância e sugerindo otimizações, mas a decisão final continua dependendo de julgamento técnico. O desenvolvedor ou arquiteto precisa avaliar o contexto do projeto, a criticidade das funcionalidades, a confiabilidade das bibliotecas utilizadas e os efeitos que uma eventual remoção pode causar na segurança da evolução do software.

A conclusão principal é que a estratégia de testes precisa ser revisada periodicamente. Uma suíte saudável não é a que acumula o maior número de casos, mas a que consegue equilibrar custo, cobertura útil, velocidade de execução e proteção real contra falhas. Nesse sentido, utilizar ferramentas automatizadas para identificar excessos e redundâncias é uma prática importante para manter a base de código mais sustentável, reduzir o peso da esteira de integração contínua e garantir que os testes estejam realmente alinhados com os objetivos de qualidade do sistema.

### Síntese

A principal ideia é que **qualidade de testes não deve ser medida apenas por quantidade ou cobertura**, mas pelo valor que cada teste entrega. Uma boa estratégia é aquela que evita redundâncias, respeita a pirâmide de testes e concentra esforço na validação do que realmente importa para a estabilidade e a evolução do software.

# Test Guide Skill
