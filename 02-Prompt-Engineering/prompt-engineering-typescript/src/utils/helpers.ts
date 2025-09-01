import * as dotenv from 'dotenv';
import chalk from 'chalk';

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
    console.log('='.repeat(50));
    console.log(content);
    console.log('='.repeat(50));
}

// Obtém endpoint configurado
export function getEndpoint(endpointName: string): string {
    const endpoint = process.env[endpointName];
    if (!endpoint) {
        throw new Error(`${endpointName} não encontrado nas variáveis de ambiente. Por favor, configure no arquivo .env`);
    }
    return endpoint;
}

// Print LLM prompt, response and token usage with colored formatting
export function printLlmResult(prompt: string, response: any): void {
    // Print prompt
    console.log(chalk.bold.green("USER PROMPT:"));
    console.log(chalk.bold.blue(prompt) + "\n");
    
    // Print response
    console.log(chalk.bold.green("LLM RESPONSE:"));
    console.log(chalk.bold.blue(response.content) + "\n");
    
    // Print token usage - check multiple possible locations
    let usage = null;
    
    // Try response_metadata.usage first (GitHub Models format)
    if (response.response_metadata?.usage) {
        usage = response.response_metadata.usage;
    }
    // Try usage_metadata (alternative format)
    else if (response.usage_metadata) {
        usage = {
            prompt_tokens: response.usage_metadata.input_tokens,
            completion_tokens: response.usage_metadata.output_tokens,
            total_tokens: response.usage_metadata.total_tokens
        };
    }
    // Try direct usage property
    else if (response.usage) {
        usage = response.usage;
    }
    // Try response_metadata.tokenUsage (camelCase format)
    else if (response.response_metadata?.tokenUsage) {
        usage = {
            prompt_tokens: response.response_metadata.tokenUsage.promptTokens,
            completion_tokens: response.response_metadata.tokenUsage.completionTokens,
            total_tokens: response.response_metadata.tokenUsage.totalTokens
        };
    }
    
    if (usage) {
        console.log(chalk.bold.white("Input tokens: ") + chalk.gray(usage.prompt_tokens || 'N/A'));
        console.log(chalk.bold.white("Output tokens: ") + chalk.gray(usage.completion_tokens || 'N/A'));
        console.log(chalk.bold.white("Total tokens: ") + chalk.gray(usage.total_tokens || 'N/A'));
    } else {
        console.log(chalk.bold.white("Token usage: ") + chalk.gray("Not available"));
    }
    
    console.log(chalk.yellow('-'.repeat(50)));
}

// Formatador específico para prompt engineering
export function displayPrompt(title: string, prompt: string): void {
    console.log(`\n📝 ${title}`);
    console.log('-'.repeat(60));
    console.log(prompt);
    console.log('-'.repeat(60));
}

// Formatador para respostas de AI
export function displayAIResponse(response: string): void {
    console.log(`\n🤖 Resposta da AI:`);
    console.log('='.repeat(60));
    console.log(response);
    console.log('='.repeat(60));
}