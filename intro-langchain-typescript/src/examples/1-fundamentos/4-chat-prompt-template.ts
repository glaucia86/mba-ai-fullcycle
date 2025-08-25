import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  displayResult,
} from "../../utils/helpers";

loadEnvironment();

async function main(): Promise<void> {
  try {
    console.log("Criando Chat Prompt Template...");

    const systemTemplate =
      "You are an assistant that answers questions in a {style} style";
    const userTemplate = "{question}";

    const chatPrompt = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["user", userTemplate],
    ]);

    console.log("Chat Prompt Template criado!");

    const messages = await chatPrompt.formatMessages({
      style: "funny",
      question: "Who is Alan Turing?",
    });

    console.log("\n=== MENSAGENS FORMATADAS ===");
    messages.forEach((msg) => {
      console.log(`${msg.getType()}: ${msg.content}`);
    });

    console.log("\n" + "=".repeat(50) + "\n");

    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.5,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    console.log("Enviando mensagens para o modelo...");

    const response = await model.invoke(messages);

    console.log("=== RESPOSTA DO MODELO ===");
    displayResult("Resposta do Modelo", response.content);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
