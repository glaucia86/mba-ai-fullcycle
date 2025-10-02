# Prompt Engineering - TypeScript

Este projeto demonstra técnicas avançadas de Prompt Engineering usando LangChain com TypeScript e Node.js, fornecendo exemplos práticos de diferentes estratégias de prompting para melhorar a qualidade das respostas de modelos de linguagem.

## 🚀 Configuração

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Configure suas API keys no arquivo `.env`:
     ```env
     GITHUB_MODELS_TOKEN="seu_github_token_aqui"
     GITHUB_MODELS_ENDPOINT="https://models.inference.ai.azure.com"
     ```

## 📁 Estrutura do Projeto

```
prompt-engineering-typescript/
├── src/
│   ├── examples/
│   │   ├── 1-fundamentos/
│   │   │   ├── 1-hello_world.ts
│   │   │   ├── 2-init-chat-model.ts
│   │   │   ├── 3-prompt-template.ts
│   │   │   └── 4-chat-prompt-template.ts
│   │   └── 2-prompt-engineering/
│   │       ├── 1-basic-prompt.ts
│   │       ├── 2-zero-shot.ts
│   │       ├── 3-few-shot.ts
│   │       └── 4-chain-of-thought.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts
├── .vscode/
│   └── settings.json
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 Exemplos Disponíveis

| Categoria                | Exemplo                    | Comando NPM           | Comando Direto                                                                        |
| ------------------------ | -------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| **Fundamentos**          | Hello World                | `npm run hello`       | `npx ts-node src/examples/1-fundamentos/1-hello_world.ts`                            |
| **Fundamentos**          | Init Chat Model            | `npm run init-chat`   | `npx ts-node src/examples/1-fundamentos/2-init-chat-model.ts`                        |
| **Fundamentos**          | Prompt Template            | `npm run prompt`      | `npx ts-node src/examples/1-fundamentos/3-prompt-template.ts`                        |
| **Fundamentos**          | Chat Prompt Template       | `npm run chat-prompt` | `npx ts-node src/examples/1-fundamentos/4-chat-prompt-template.ts`                   |
| **Prompt Engineering**   | Basic Prompt               | `npm run basic-prompt`| `npx ts-node src/examples/2-prompt-engineering/1-basic-prompt.ts`                    |
| **Prompt Engineering**   | Zero-Shot Prompting        | `npm run zero-shot`   | `npx ts-node src/examples/2-prompt-engineering/2-zero-shot.ts`                       |
| **Prompt Engineering**   | Few-Shot Prompting         | `npm run few-shot`    | `npx ts-node src/examples/2-prompt-engineering/3-few-shot.ts`                        |
| **Prompt Engineering**   | Chain of Thought           | `npm run chain-of-thought` | `npx ts-node src/examples/2-prompt-engineering/4-chain-of-thought.ts`           |

## ⚡ Scripts Disponíveis

| Script              | Comando                    | Descrição                                       |
| ------------------- | -------------------------- | ----------------------------------------------- |
| **Desenvolvimento** | `npm run dev`              | Executa o arquivo principal (`src/index.ts`)   |
| **Watch Mode**      | `npm run watch`            | Executa com reload automático                  |
| **Build**           | `npm run build`            | Compila TypeScript para JavaScript             |
| **Start**           | `npm start`                | Executa a versão compilada                     |
| **Exemplos**        | `npm run <exemplo>`        | Executa exemplo específico (veja tabela acima) |

## 🛠️ Dependências Principais

| Pacote                | Versão  | Descrição                              |
| --------------------- | ------- | -------------------------------------- |
| **langchain**         | ^0.3.31 | Framework principal do LangChain       |
| **@langchain/openai** | ^0.6.9  | Integração com OpenAI/GitHub Models    |
| **dotenv**            | ^17.2.1 | Carregamento de variáveis de ambiente  |
| **typescript**        | ^5.9.2  | Compilador TypeScript                  |
| **ts-node**           | ^10.9.2 | Execução direta de arquivos TypeScript |
| **nodemon**           | ^3.1.10 | Reload automático para desenvolvimento |

## 🎯 Como Executar um Exemplo

### Opção 1: Usando scripts npm (recomendado)

```bash
npm run basic-prompt
```

### Opção 2: Execução direta

```bash
npx ts-node src/examples/2-prompt-engineering/1-basic-prompt.ts
```

### Opção 3: Build e execução

```bash
npm run build
node dist/examples/2-prompt-engineering/1-basic-prompt.js
```

## 🚀 Executando Todos os Exemplos

### 📚 Fundamentos (1-fundamentos/)

```bash
# 1. Hello World - Primeiro contato com LangChain TypeScript
npm run hello

# 2. Inicializando Chat Model - Configuração básica do modelo
npm run init-chat

# 3. Prompt Template - Uso de templates para prompts
npm run prompt

# 4. Chat Prompt Template - Templates específicos para chat
npm run chat-prompt
```

### 🎯 Prompt Engineering (2-prompt-engineering/)

```bash
# 5. Basic Prompt - Comparação entre prompts básicos e melhorados
npm run basic-prompt

# 6. Zero-Shot Prompting - Técnica sem exemplos prévios
npm run zero-shot

# 7. Few-Shot Prompting - Aprendizado através de exemplos
npm run few-shot

# 8. Chain of Thought - Raciocínio passo a passo
npm run chain-of-thought
```

## 🏃‍♂️ Execução Rápida de Todos os Exemplos

Para executar todos os exemplos em sequência:

```bash
# Executar todos os fundamentos
npm run hello && npm run init-chat && npm run prompt && npm run chat-prompt

# Executar todos os exemplos de prompt engineering
npm run basic-prompt && npm run zero-shot && npm run few-shot && npm run chain-of-thought
```

## 🎓 Técnicas de Prompt Engineering Abordadas

### 1. **Basic Prompt Engineering**
- Comparação entre prompts vagos e específicos
- Importância da estruturação clara
- Definição de audiência e formato

### 2. **Zero-Shot Prompting**
- Execução de tarefas sem exemplos prévios
- Análise de sentimento
- Classificação de texto
- Extração de informações

### 3. **Few-Shot Prompting**
- Aprendizado através de exemplos
- Tradução de emojis
- Classificação de e-mails
- Criação de slogans

### 4. **Chain of Thought (CoT)**
- Raciocínio passo a passo
- Resolução de problemas matemáticos
- Análise de negócios
- Problemas lógicos complexos

## 📝 Boas Práticas

### ✅ Faça:
- Use instruções claras e específicas
- Defina o formato de saída desejado
- Forneça contexto relevante
- Use exemplos quando necessário
- Estruture prompts de forma lógica

### ❌ Evite:
- Prompts vagos ou ambíguos
- Instruções contraditórias
- Excesso de informações irrelevantes
- Exemplos de baixa qualidade
- Formatação inconsistente

## 🔧 Resolução de Problemas

### Erro de dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problemas de configuração
1. Verifique se o arquivo `.env` está configurado corretamente
2. Confirme se as variáveis de ambiente estão sendo carregadas
3. Teste a conectividade com o endpoint

### Erros de TypeScript
```bash
# Recompilar o projeto
npm run build
```

## 📖 Recursos Adicionais

- [Documentação do LangChain](https://docs.langchain.com/)
- [GitHub Models](https://github.com/marketplace/models)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](../LICENSE) para detalhes.

## 👩‍💻 Autor

**Glaucia Lemos**
- Twitter: [@glaucia_lemos86](https://twitter.com/glaucia_lemos86)
- LinkedIn: [Glaucia Lemos](https://www.linkedin.com/in/glaucialemos/)
- GitHub: [@glaucia86](https://github.com/glaucia86)