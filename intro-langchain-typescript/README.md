# Intro LangChain - TypeScript

Este projeto demonstra o uso do LangChain com TypeScript e Node.js.

## Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Configure suas API keys no arquivo `.env`

3. **Executar exemplos:**
   ```bash
   # Desenvolvimento (com watch)
   npm run watch

   # Executar diretamente
   npm run dev

   # Compilar e executar
   npm run build
   npm start

   # Executar exemplo específico
   npx ts-node src/examples/1-fundamentos/1-hello_world.ts
   ```

## Estrutura do Projeto

```
src/
├── examples/
│   └── 1-fundamentos/
│       └── 1-hello_world.ts
├── utils/
│   └── helpers.ts
└── index.ts
```

## Scripts Disponíveis

- `npm run dev` - Executa o arquivo principal em modo desenvolvimento
- `npm run watch` - Executa com watch mode (recarrega automaticamente)
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa a versão compilada

## Dependências Principais

- **langchain** - Framework principal do LangChain
- **@langchain/openai** - Integração com OpenAI/GitHub Models
- **dotenv** - Carregamento de variáveis de ambiente
- **typescript** - Compilador TypeScript
- **ts-node** - Execução direta de arquivos TypeScript