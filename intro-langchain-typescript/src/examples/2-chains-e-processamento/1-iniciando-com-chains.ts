import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  displayResult,
} from "../../utils/helpers";

loadEnvironment();

async function main(): Promise<void> {
  try {
    const questionTemplate = new PromptTemplate({
      inputVariables: ["name"],
      template: "Hi!, I'm {name}! Tell me a joke about yourself.",
    });

    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.5,
      maxTokens: 240,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    const chain = questionTemplate.pipe(model);

    const response = chain.invoke({ name: "Glaucia" });

    displayResult("Resposta da Chain", (await response).content);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
