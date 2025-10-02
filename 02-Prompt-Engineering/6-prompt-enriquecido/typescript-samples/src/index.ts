import { loadEnvironment, displayResult } from "./utils/helpers";

// Carrega as variáveis de ambiente
loadEnvironment();

// =====================================================
// CONFIGURAÇÃO DE EXECUÇÃO - PROMPT ENGINEERING
// =====================================================
// Descomente a linha do exemplo que você quer executar:

async function main() {
    console.log("🚀 Prompt Engineering TypeScript Environment Ready!");
    console.log("=" .repeat(50));
    
    // Exemplos disponíveis:
    console.log("📁 Exemplos disponíveis:");
    console.log("1. Hello World: npx ts-node src/examples/1-fundamentos/1-hello_world.ts");
    console.log("2. Basic Prompt: npx ts-node src/examples/2-prompt-engineering/1-basic-prompt.ts");
    console.log("3. Zero Shot: npx ts-node src/examples/2-prompt-engineering/2-zero-shot.ts");
    console.log("4. Few Shot: npx ts-node src/examples/2-prompt-engineering/3-few-shot.ts");
    console.log("5. Chain of Thought: npx ts-node src/examples/2-prompt-engineering/4-chain-of-thought.ts");
    
    console.log("\n🔧 Para executar:");
    console.log("- npm run dev (executa este arquivo)");
    console.log("- npm run watch (modo watch)");
    console.log("- npx ts-node <caminho-do-arquivo>");
    
    // Descomente para executar um exemplo específico:
    // await import("./examples/1-fundamentos/1-hello_world");
    // await import("./examples/2-prompt-engineering/1-basic-prompt");
    
    console.log("=" .repeat(50));
}

main().catch(console.error);