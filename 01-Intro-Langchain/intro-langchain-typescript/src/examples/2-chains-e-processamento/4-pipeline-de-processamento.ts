import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { loadEnvironment, getApiKey, getEndpoint } from "../../utils/helpers";
import { text } from "stream/consumers";

loadEnvironment();

const templateTranslate = PromptTemplate.fromTemplate(
  "Translate the following text to English:\n ```{initial_text}```"
);

const templateSummary = PromptTemplate.fromTemplate(
  "Summarize the following text in 4 words:\n ```{text}```"
);

const llmEn = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.5,
  // maxTokens: 300,
  configuration: {
    baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
    apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
  },
});

const translate = templateTranslate.pipe(llmEn).pipe(new StringOutputParser());
const pipeline = RunnablePassthrough.assign({ text: translate })
  .pipe(templateSummary)
  .pipe(llmEn)
  .pipe(new StringOutputParser());

async function main() {
  const result = await pipeline.invoke({
    initial_text:
      "LangChain é um framework para desenvolvimento de aplicações de IA",
  });

  console.log(result);
}

main();
