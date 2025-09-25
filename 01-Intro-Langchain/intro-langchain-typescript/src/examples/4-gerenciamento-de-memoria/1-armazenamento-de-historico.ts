import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import {
  RunnableConfig,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { loadEnvironment, getApiKey, getEndpoint } from "../../utils/helpers";

loadEnvironment();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const chatModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.9,
  configuration: {
    baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
    apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
  },
});

const chain = prompt.pipe(chatModel);

const sessionStore = new Map<string, InMemoryChatMessageHistory>();

function getSessionHistory(sessionId: string): InMemoryChatMessageHistory {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, new InMemoryChatMessageHistory());
  }

  return sessionStore.get(sessionId)!;
}

const conversationalChain = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: getSessionHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

const config: RunnableConfig = {
  configurable: { sessionId: "demo-session" },
};

async function main(): Promise<void> {
  const response1 = await conversationalChain.invoke(
    { input: "Hello, my name is Glaucia. How are you?" },
    config
  );
  console.log("Assistant:", response1.content);
  console.log("-".repeat(30));

  const response2 = await conversationalChain.invoke(
    { input: "Can you repeat my name?" },
    config
  );
  console.log("Assistant:", response2.content);
  console.log("-".repeat(30));

  const response3 = await conversationalChain.invoke(
    { input: "Can you repeat my name in a motivation phrase?" },
    config
  );
  console.log("Assistant:", response3.content);
  console.log("-".repeat(30));
}

void main();
