import { ChatOpenAI } from "@langchain/openai";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  printLlmResult,
} from "../../utils/helpers";
import { get } from "http";

loadEnvironment();

async function main(): Promise<void> {
  const message1 = `
  Classify the log severity.

  Input: "Disk usage at 85%."
  Answer only with INFO, WARNING, or ERROR.
  `;

  const message2 = `
  Classify the log severity.

  Input: "Disk usage at 85%."
  Think step by step about why this is INFO, WARNING, or ERROR. 
  At the end, give only the final answer after "Answer:".
  `;

  const message3 = `
    Question: How many "r" are in the word "strawberry"?
    Answer only with the number of "r".
  `;

  const message4 = `
    Question: How many "r" are in the word "strawberry"?
    
    Explain step by step by breaking down each letter in bullet points, pointing out the "r" before giving the final answer. 
    Give the final result after "Answer:".  
  `;

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
  const response4 = await model.invoke(message4);

  printLlmResult(message1, response1);
  printLlmResult(message2, response2);
  printLlmResult(message3, response3);
  printLlmResult(message4, response4);
}

main();
