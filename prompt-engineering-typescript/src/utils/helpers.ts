import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
export function loadEnvironment(): void {
    dotenv.config();
}

// Obtém uma API key do ambiente
export function getApiKey(keyName: string): string {
    const apiKey = process.env[keyName];
    if (!apiKey) {
        throw new Error(`${keyName} não encontrada nas variáveis de ambiente. Por favor, configure no arquivo .env`);
    }
    return apiKey;
}

// Exibe resultado formatado
export function displayResult(title: string, content: any): void {
    console.log(`\n🚀 ${title}`);
    console.log('=' .repeat(50));
    console.log(content);
    console.log('=' .repeat(50));
}

// Obtém endpoint configurado
export function getEndpoint(endpointName: string): string {
    const endpoint = process.env[endpointName];
    if (!endpoint) {
        throw new Error(`${endpointName} não encontrado nas variáveis de ambiente. Por favor, configure no arquivo .env`);
    }
    return endpoint;
}

// Formatador específico para prompt engineering
export function displayPrompt(title: string, prompt: string): void {
    console.log(`\n📝 ${title}`);
    console.log('-' .repeat(60));
    console.log(prompt);
    console.log('-' .repeat(60));
}

// Formatador para respostas de AI
export function displayAIResponse(response: string): void {
    console.log(`\n🤖 Resposta da AI:`);
    console.log('=' .repeat(60));
    console.log(response);
    console.log('=' .repeat(60));
}