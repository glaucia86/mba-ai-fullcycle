import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  displayResult,
} from "../../utils/helpers";

loadEnvironment();

type SquareInput = { x: number };
type SquareOutput = { square_result: number };

async function main(): Promise<void> {
  try {
    console.log("Criando Chain com função customizada com decorators");

    const square = new RunnableLambda<SquareInput, SquareOutput>({
      func: (input: SquareInput) => {
        const x = input.x;
        console.log(`Calculando quadrado de ${x}`);
        return { square_result: x * x };
      },
    });

    const question_template = new PromptTemplate({
      inputVariables: ["square_result"],
      template: "What is the square result? {square_result}",
    });

    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.5,
      maxTokens: 100,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    console.log(
      "Criando RunnableSequence: square -> template -> model -> parser"
    );

    // Equivalente a: square | question_template | model no Python
    const chain = RunnableSequence.from([
      square, // Passo 1: Calcula o quadrado
      question_template, // Passo 2: Formata a pergunta
      model, // Passo 3: Chama o modelo
      new StringOutputParser(), // Passo 4: Extrai o conteúdo
    ]);

    console.log("Executando a RunnableSequence com x = 10...");

    const response = await chain.invoke({ x: 10 });
    displayResult("Resultado da Chain com Decorators", response);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
