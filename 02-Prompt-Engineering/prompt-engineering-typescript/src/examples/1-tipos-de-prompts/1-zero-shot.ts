import { ChatOpenAI } from "@langchain/openai";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  printLlmResult,
} from "../../utils/helpers";

// Carrega as variáveis de ambiente
loadEnvironment();

async function main(): Promise<void> {
  const message1 = "Qual é a capital do Brasil?";

  const message2 = `
    Encontre a intenção do usuário no texto a seguir: Estou procurando um
    restaurante na região de São Paulo que tenha uma boa avaliação para comida 
    japonesa.
  `;

  const message3 =
    "Qual é a capital do Brasil? Responda somente dando o nome da cidade.";

  const model = new ChatOpenAI({
    model: "gpt-4o",
    configuration: {
      baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
      apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
    },
  });

  const response1 = await model.invoke(message1);
  const response2 = await model.invoke(message2);
  const response3 = await model.invoke(message3);

  printLlmResult(message1, response1);
  printLlmResult(message2, response2);
  printLlmResult(message3, response3);
}

main();
