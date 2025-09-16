import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import { loadEnvironment, getApiKey, getEndpoint } from "../../utils/helpers";

loadEnvironment();

const calculator = new DynamicTool({
  name: "calculator",
  description:
    "Evaluate a simple mathematical expression and return the result as a string",
  func: async (expression: string): Promise<string> => {
    try {
      // Note: Using eval() is dangerous in production. Consider using a math library like math.js
      const result = eval(expression);
      return String(result);
    } catch (error) {
      return `Error: ${error}`;
    }
  },
});

// Web search mock tool
const webSearchMock = new DynamicTool({
  name: "web_search_mock",
  description:
    "Return the capital of a given country if it exists in the mock data",
  func: async (query: string): Promise<string> => {
    const data: Record<string, string> = {
      Brazil: "Brasília",
      France: "Paris",
      Germany: "Berlin",
      Italy: "Rome",
      Spain: "Madrid",
      "United States": "Washington, D.C.",
    };

    for (const [country, capital] of Object.entries(data)) {
      if (query.toLowerCase().includes(country.toLowerCase())) {
        return `The capital of ${country} is ${capital}.`;
      }
    }
    return "I don't know the capital of that country.";
  },
});

const llm = new ChatOpenAI({
  model: "gpt-4o",
  streaming: false,
  configuration: {
    baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
    apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
  },
});

const tools = [calculator, webSearchMock];

const prompt = PromptTemplate.fromTemplate(`
Answer the following questions as best you can. You have access to the following tools.
Only use the information you get from the tools, even if you know the answer.
If the information is not provided by the tools, say you don't know.

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action

... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Rules:
- If you choose an Action, do NOT include Final Answer in the same step.
- After Action and Action Input, stop and wait for Observation.
- Never search the internet. Only use the tools provided.

Begin!

Question: {input}
Thought: {agent_scratchpad}
`);

async function main(): Promise<void> {
  try {
    const agentChain = await createReactAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent: agentChain,
      tools,
      verbose: true,
      handleParsingErrors:
        "Invalid format. Either provide an Action with Action Input, or Final Answer only.",
      maxIterations: 3,
    });

    console.log("=== Question 1: What is the capital of Iran? ===");
    const result1 = await agentExecutor.invoke({
      input: "What is the capital of Iran?",
    });
    console.log("\nFinal Result:", result1);
    
    console.log("\n=== Question 2: How much is 13 * 12? ===");
    const result2 = await agentExecutor.invoke({
      input: "How much is 13 * 12?",
    });
    console.log("\nFinal Result:", result2);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
