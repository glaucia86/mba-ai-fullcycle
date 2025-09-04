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
You are a senior backend engineer. A junior developer asked you how to optimize SQL queries for better performance. 
Follow the Skeleton of Thought approach: 

Step 1: Generate only the skeleton of your answer in 3–5 concise bullet points. 
Step 2: Expand each bullet point into a clear and detailed explanation with examples. 
Make sure the final answer is structured and easy to follow.
  `;

  const message2 = `
You are a senior Go developer. I want you to help me plan a REST API for managing products in Go.

Follow the Skeleton of Thought approach:

Step 1: Output only the skeleton of the solution in 6–8 concise bullet points. 
The skeleton must cover: data model definition in Go (structs), choice of HTTP framework or net/http, routing, handlers, validations, database layer, error handling, and project structure. Do not expand yet.

Step 2: Expand each bullet point with clear technical details, examples, and Go best practices. 
Include sample code snippets in Go (structs, handlers, routes) and considerations about packages (e.g., chi, or net/http), error handling with idiomatic Go, and how to organize the project into packages (handlers, models, db). 
Use concise and professional language.

The API must implement CRUD operations for products with fields: id, name, description, price, stock.
  `;

  const message3 = `
    Question: How many "r" are in the word "strawberry"?
    Answer only with the number of "r".
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

  printLlmResult(message1, response1);
  printLlmResult(message2, response2);
  printLlmResult(message3, response3);
}

main();
