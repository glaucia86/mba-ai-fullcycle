import { ChatOpenAI } from "@langchain/openai";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  displayResult,
} from "../../utils/helpers";

loadEnvironment();

async function main(): Promise<void> {
  try {
    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0,
      maxTokens: 150,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    const response = await model.invoke("Hello, World!");

    displayResult("Init Chat Model (TypeScript)", response.content);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
