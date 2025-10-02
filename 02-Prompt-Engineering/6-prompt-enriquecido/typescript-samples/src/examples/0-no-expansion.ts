import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  printLlmResult,
} from "../utils/helpers";

// Carrega as variáveis de ambiente
loadEnvironment();

async function main(): Promise<void> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7,
    configuration: {
      baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
      apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
    },
  });

  const prompt = PromptTemplate.fromTemplate(
    "You are a technology assistant. \n" +
      "Answer the following question: \n\n" +
      "{question}"
  );

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(llm).pipe(outputParser);

  const question = "Explain about the LangChain and LangGraph";

  const answer = await chain.invoke({ question: question });

  console.log(answer);
  console.log(answer.length);
}

main().catch(console.error);
