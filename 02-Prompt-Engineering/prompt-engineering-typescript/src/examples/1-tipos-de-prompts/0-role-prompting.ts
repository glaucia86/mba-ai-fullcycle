import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  printLlmResult,
} from "../../utils/helpers";

// Carrega as variáveis de ambiente
loadEnvironment();

async function main(): Promise<void> {
  const systemProfessor = `Você é um professor universitário de ciência da computação, muito técnico e explica conceitos
    com definições formais e pseudocódigo.`;

  const systemEstudante = `Você é um estudante do ensino médio que está começando a aprender programação.
    Você não é muito técnico e prefere explicar conceitos com palavras e exemplos simples.`;

  const userMessage = "Explique recursão em 50 palavras.";

  const chat_prompt = ChatPromptTemplate.fromMessages([
    ["system", systemProfessor],
    ["user", userMessage],
  ]);

  const chat_prompt2 = ChatPromptTemplate.fromMessages([
    ["system", systemEstudante],
    ["user", userMessage],
  ]);

  const model = new ChatOpenAI({
    model: "gpt-4o",
    configuration: {
      baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
      apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
    },
  });

  const response = await model.invoke(await chat_prompt.formatMessages({}));
  printLlmResult(systemProfessor, response);

  const response2 = await model.invoke(await chat_prompt2.formatMessages({}));
  printLlmResult(systemEstudante, response2);
}

main();
