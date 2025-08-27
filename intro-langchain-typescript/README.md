# Intro LangChain - TypeScript

Este projeto demonstra o uso do LangChain com TypeScript e Node.js, fornecendo exemplos práticos de conceitos fundamentais e chains.

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
intro-langchain-typescript/
├── src/
│   ├── examples/
│   │   ├── 1-fundamentos/
│   │   │   ├── 1-hello_world.ts
│   │   │   ├── 2-init-chat-model.ts
│   │   │   ├── 3-prompt-template.ts
│   │   │   └── 4-chat-prompt-template.ts
│   │   └── 2-chains-e-processamento/
│   │       └── 1-iniciando-com-chains.ts
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

| Categoria       | Exemplo              | Comando NPM           | Comando Direto                                                                |
| --------------- | -------------------- | --------------------- | ----------------------------------------------------------------------------- |
| **Fundamentos** | Hello World          | `npm run hello`       | `npx ts-node src/examples/1-fundamentos/1-hello_world.ts`                     |
| **Fundamentos** | Init Chat Model      | `npm run init-chat`   | `npx ts-node src/examples/1-fundamentos/2-init-chat-model.ts`                 |
| **Fundamentos** | Prompt Template      | `npm run prompt`      | `npx ts-node src/examples/1-fundamentos/3-prompt-template.ts`                 |
| **Fundamentos** | Chat Prompt Template | `npm run chat-prompt` | `npx ts-node src/examples/1-fundamentos/4-chat-prompt-template.ts`            |
| **Chains**      | Iniciando com Chains | `npm run chains`      | `npx ts-node src/examples/2-chains-e-processamento/1-iniciando-com-chains.ts` |

## ⚡ Scripts Disponíveis

| Script              | Comando             | Descrição                                      |
| ------------------- | ------------------- | ---------------------------------------------- |
| **Desenvolvimento** | `npm run dev`       | Executa o arquivo principal (`src/index.ts`)   |
| **Watch Mode**      | `npm run watch`     | Executa com reload automático                  |
| **Build**           | `npm run build`     | Compila TypeScript para JavaScript             |
| **Start**           | `npm start`         | Executa a versão compilada                     |
| **Exemplos**        | `npm run <exemplo>` | Executa exemplo específico (veja tabela acima) |

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
npm run hello
```

### Opção 2: Execução direta

```bash
npx ts-node src/examples/1-fundamentos/1-hello_world.ts
```

### Opção 3: Build e execução

```bash
npm run build
node dist/examples/1-fundamentos/1-hello_world.js
```
