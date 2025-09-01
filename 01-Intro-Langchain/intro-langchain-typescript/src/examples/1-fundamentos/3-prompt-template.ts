import { PromptTemplate } from "@langchain/core/prompts";
import { loadEnvironment, displayResult } from "../../utils/helpers";

loadEnvironment();

async function main(): Promise<void> {
  try {
    console.log("Criando Prompt Template...");

    const template = new PromptTemplate({
      inputVariables: ["name"],
      template: "Hi, I'm {name}! Tell me a joke about yourself.",
    });

    console.log("Template criado com sucesso.");

    const formattedPrompt = await template.format({ name: "Glaucia" });

    displayResult("Prompt Template (TypeScript)", formattedPrompt);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
