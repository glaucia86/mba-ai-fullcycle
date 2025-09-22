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
    Question: In an API endpoint that returns a list of users and their posts, the developer wrote:

  users := db.FindAllUsers()
  for _, u := range users {
    u.Posts = db.FindPostsByUserID(u.ID)
  }

  How many database queries will this code execute if there are N users?

  Generate 3 different reasoning paths step by step.
  At the end, summarize the answers and choose the most consistent one, ignoring outliers.
  If there are 3 different answers, ONLY reply: "I can't find a consistent answer". 
  `;

  const model = new ChatOpenAI({
    model: "gpt-4o",
    configuration: {
      baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
      apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
    },
  });

  const response1 = await model.invoke(message1);

  printLlmResult(message1, response1);
}

main();
