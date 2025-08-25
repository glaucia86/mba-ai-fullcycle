import { ChatOpenAI } from "@langchain/openai";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  displayResult,
} from "../../utils/helpers";

// Carrega as variáveis de ambiente
loadEnvironment();

async function main(): Promise<void> {
  try {
    // Configura o modelo ChatOpenAI
    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.5,
      maxTokens: 100,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    // Faz a chamada para o modelo
    const response = await model.invoke("Hello World!");

    // Exibe o resultado
    displayResult("LangChain Hello World (TypeScript)", response.content);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

// Executa a função principal
main();
