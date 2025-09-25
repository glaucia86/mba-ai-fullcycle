import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { trimMessages } from "@langchain/core/messages";
import { BaseMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import {
  RunnableLambda,
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

type PreparePayload = {
  input?: string;
  raw_history?: BaseMessage[];
};

const prepare = new RunnableLambda<
  PreparePayload,
  {
    input: string;
    history: BaseMessage[];
  }
>({
  func: async (payload: PreparePayload) => {
    const rawHistory = payload.raw_history ?? [];
    const trimmed = await trimMessages(rawHistory, {
      tokenCounter: async (messages) => messages.length,
      maxTokens: 2,
      strategy: "last",
      startOn: "human",
      includeSystem: true,
      allowPartial: false,
    });

    return {
      input: payload.input ?? "",
      history: trimmed,
    };
  },
});

const chain = prepare.pipe(prompt).pipe(chatModel);

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
  const resp1 = await conversationalChain.invoke(
    {
      input:
        "My name is Glaucia. Reply only with 'OK' and do not mention my name.",
    },
    config
  );
  console.log("Assistant:", resp1.content);

  const resp2 = await conversationalChain.invoke(
    {
      input: "Tell me a one-sentence fun fact. Do not mention my name.",
    },
    config
  );
  console.log("Assistant:", resp2.content);

  const resp3 = await conversationalChain.invoke(
    { input: "What is my name?" },
    config
  );
  console.log("Assistant:", resp3.content);
}

void main();
