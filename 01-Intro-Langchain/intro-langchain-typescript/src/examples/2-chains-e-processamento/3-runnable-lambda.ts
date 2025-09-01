import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  displayResult,
} from "../../utils/helpers";

loadEnvironment();

// Interface para o resultado da análise
interface TextAnalysis {
  original_text: string;
  word_count: number;
  sentence_count: number;
  emails: string[];
  keywords: string[];
  urgency_score: number;
  text_length: "curto" | "médio" | "longo";
  has_contact: boolean;
  summary: string;
}

function extractAndAnalyzeText(text: string): TextAnalysis {
  // Extrair emails usando regex
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailPattern) || [];

  // Contar palavras e sentenças
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const sentences = text
    .split(".")
    .filter((sentence) => sentence.trim().length > 0);

  // Identificar palavras-chave importantes
  const keywords = [
    "projeto",
    "reunião",
    "prazo",
    "urgente",
    "importante",
    "deadline",
  ];
  const foundKeywords = keywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );

  // Determinar nível de urgência
  const urgentWords = [
    "urgente",
    "asap",
    "imediatamente",
    "crítico",
    "emergência",
  ];
  const urgencyLevel = urgentWords.reduce(
    (count, word) =>
      count + (text.toLowerCase().includes(word.toLowerCase()) ? 1 : 0),
    0
  );

  // Determinar tamanho do texto
  let textLength: "curto" | "médio" | "longo";
  if (words.length < 20) {
    textLength = "curto";
  } else if (words.length <= 50) {
    textLength = "médio";
  } else {
    textLength = "longo";
  }

  return {
    original_text: text,
    word_count: words.length,
    sentence_count: sentences.length,
    emails: emails,
    keywords: foundKeywords,
    urgency_score: urgencyLevel,
    text_length: textLength,
    has_contact: emails.length > 0,
    summary: `Texto ${words.length} palavras com ${foundKeywords.length} palavras-chave importantes`,
  };
}

async function main(): Promise<void> {
  try {
    console.log(
      "=== EXEMPLO PRÁTICO: ANÁLISE DE TEXTO COM RUNNABLE LAMBDA (LangChain.js) ===\n"
    );

    // Criar RunnableLambda para análise de texto
    const analyzeRunnable = new RunnableLambda({
      func: extractAndAnalyzeText,
    });

    // Template que usa os dados analisados
    const template = new PromptTemplate({
      inputVariables: ["summary", "keywords", "urgency_score", "text_length"],
      template: `
        Baseado na análise do texto:

        Resumo: {summary}
        Palavras-chave encontradas: {keywords}
        Nível de urgência: {urgency_score}
        Tamanho do texto: {text_length}

        Crie um resumo executivo deste texto e sugira qual a melhor forma de responder ou agir sobre ele
      `.trim(),
    });

    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.5,
      maxTokens: 500,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    // Chain: análise -> template -> modelo
    const analysisChain = analyzeRunnable.pipe(template).pipe(model);

    // Texto de exemplo realista
    const sampleText = `
      Prezado João,
      
      Preciso urgentemente do relatório do projeto para a reunião de amanhã.
      O prazo é crítico e o cliente estará presente. Por favor, envie para 
      joao.silva@empresa.com até as 14h de hoje.
      
      É muito importante que inclua os dados de performance e o cronograma atualizado.
      
      Obrigada!     
    `;

    console.log("Texto para Análise");
    console.log(sampleText);
    console.log("\n" + "=".repeat(60) + "\n");

    // Executar apenas a análise primeiro
    console.log("Resultado da análise do texto");
    const analysisResponse = await analyzeRunnable.invoke(sampleText);

    // Exibir resultados da análise (exceto o texto original)
    Object.entries(analysisResponse).forEach(([key, value]) => {
      if (key !== "original_text") {
        console.log(
          `  ${key}: ${Array.isArray(value) ? value.join(", ") : value}`
        );
      }
    });

    console.log("\n" + "=".repeat(60) + "\n");

    // Executar a chain completa
    console.log("Resumo Executivo gerado pelo LLM");
    try {
      const response = await analysisChain.invoke(sampleText);
      displayResult("Análise do Texto com RunnableLambda", response.content);
    } catch (error) {
      console.error(
        "Erro ao gerar o resumo executivo:",
        error instanceof Error ? error.message : error
      );
    }
  } catch (error) {}
}

main();
