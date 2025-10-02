import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  JsonOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import * as readline from "readline";
import { loadEnvironment, getApiKey, getEndpoint } from "../utils/helpers";

// Load environment variables
loadEnvironment();

// ========= Configuration =========

interface RequiredInformation {
  field: string;
  question: string;
}

class EnrichmentConfig {
  modelName: string = "gpt-4o";
  temperature: number = 0.0;
  maxRounds: number = 10;
  requiredInformation: RequiredInformation[] | null = null;

  constructor(options?: Partial<EnrichmentConfig>) {
    Object.assign(this, options);

    if (this.requiredInformation === null) {
      // Default configuration for PR review scenario
      this.requiredInformation = [
        { field: "pr_id", question: "What is the PR ID?" },
        { field: "repository", question: "What is the repository name?" },
        { field: "branch", question: "What is the branch name?" },
        { field: "concerns", question: "What are your specific concerns?" },
        {
          field: "style_guide",
          question: "What style guide should be followed?",
        },
        {
          field: "test_requirements",
          question: "What are the test requirements?",
        },
      ];
    }
  }
}

// ========= Models =========

interface EnrichedQuery {
  is_complex: boolean; // Whether the query is complex
  sub_queries: string[]; // Breakdown into specific tasks
  clarifications: string[]; // Questions needing clarification
  entities: string[]; // Extracted entities
}

// ========= Query Enricher =========

class QueryEnricher {
  public config: EnrichmentConfig;
  private llm: ChatOpenAI;
  private enrichmentChain: any;
  private rewriteChain: any;

  constructor(config: EnrichmentConfig) {
    this.config = config;

    // Initialize LLM with GitHub Models configuration
    this.llm = new ChatOpenAI({
      model: config.modelName,
      temperature: config.temperature,
      configuration: {
        baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
        apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
      },
    });

    this.enrichmentChain = this.createEnrichmentChain();
    this.rewriteChain = this.createRewriteChain();
  }

  private createEnrichmentChain() {
    // Build the list of required questions dynamically from config
    let questionsText = "";
    if (this.config.requiredInformation) {
      questionsText = this.config.requiredInformation
        .map((info) => `  * "${info.question}"`)
        .join("\n");
    }

    const enrichmentPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a query refinement assistant for software development questions.

Your task is to identify missing information and generate clarifying questions.

CRITICAL: You MUST ask for ALL 6 required pieces of information. Do NOT stop early.

Required information (ALL must be explicitly provided):
1. PR ID
2. Repository name
3. Branch name
4. Specific concerns
5. Style guide
6. Test requirements

Output STRICT JSON with this structure:
{{
  "is_complex": bool,
  "sub_queries": [string],
  "clarifications": [string],
  "entities": [string]
}}

Rules:
- clarifications: MUST include questions for ANY of these that are NOT explicitly mentioned in the query:
${questionsText}
  IMPORTANT: Keep the clarifications list populated until ALL 6 items above are provided.
  Even if you have PR ID, repository, and branch, you MUST still ask for concerns, style guide, and test requirements.
- sub_queries: Break down the request into specific tasks
- entities: Extract ONLY the information that was actually provided
- is_complex: true if multiple sub-tasks are needed

NEVER set clarifications to empty [] unless ALL 6 required items are explicitly present in the query.`,
      ],
      ["user", "{question}"],
    ]);

    const parser = new JsonOutputParser();
    return enrichmentPrompt.pipe(this.llm).pipe(parser);
  }

  private createRewriteChain() {
    const rewritePrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Rewrite the information into a single, natural, well-formed question. Be concise and clear.",
      ],
      [
        "user",
        "Original request: {original}\n\nAdditional context:\n{context}",
      ],
    ]);

    return rewritePrompt.pipe(this.llm).pipe(new StringOutputParser());
  }

  async enrich(query: string): Promise<EnrichedQuery> {
    try {
      return await this.enrichmentChain.invoke({ question: query });
    } catch (error) {
      console.log(`Error during enrichment: ${error}`);
      return {
        is_complex: false,
        sub_queries: [],
        clarifications: ["Error processing query"],
        entities: [],
      };
    }
  }

  async generateNaturalQuestion(
    original: string,
    context: string[]
  ): Promise<string> {
    if (context.length === 0) {
      return original;
    }

    const contextText = context.map((info) => `- ${info}`).join("\n");

    try {
      return await this.rewriteChain.invoke({
        original: original,
        context: contextText,
      });
    } catch (error) {
      console.log(`Error generating natural question: ${error}`);
      // Fallback: return concatenated version
      return `${original} | ${context.join(" | ")}`;
    }
  }
}

// ========= Interactive Session =========

class EnrichmentSession {
  private enricher: QueryEnricher;
  private initialQuestion: string = "";
  private providedInformation: string[] = [];
  private roundNum: number = 0;

  constructor(enricher: QueryEnricher) {
    this.enricher = enricher;
  }

  private displayEnrichment(enriched: EnrichedQuery): void {
    console.log(`\n=== Round ${this.roundNum}: Enrichment Output ===`);
    console.log(JSON.stringify(enriched, null, 2));
  }

  private async collectAnswers(clarifications: string[]): Promise<string[]> {
    console.log("\nPlease provide answers for the following clarifications:");
    console.log("(Press Enter to skip any question)");

    const answers: string[] = [];

    for (const clarification of clarifications) {
      const answer = await this.askQuestion(`  ${clarification}: `);
      if (answer.trim()) {
        answers.push(`${clarification}: ${answer}`);
      }
    }

    return answers;
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      // Create a new readline interface for each question to avoid conflicts
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  private showProgress(newAnswers: string[]): void {
    if (newAnswers.length > 0) {
      console.log(`\n>>> Information provided in this round:`);
      newAnswers.forEach((answer) => {
        console.log(`    - ${answer}`);
      });
    }
  }

  async run(initialQuestion: string): Promise<[string, EnrichedQuery]> {
    this.initialQuestion = initialQuestion;
    this.providedInformation = [];
    this.roundNum = 0;

    console.log(`\nInitial question: '${initialQuestion}'`);
    console.log("=".repeat(60));

    // Build the current query
    let currentQuery = initialQuestion;
    let enriched = await this.enricher.enrich(currentQuery);

    while (this.roundNum < this.enricher.config.maxRounds) {
      this.roundNum++;
      this.displayEnrichment(enriched);

      // Check if we have clarifications
      const clarifications = enriched.clarifications || [];
      if (clarifications.length === 0) {
        console.log("\n>>> All required information has been provided!");
        break;
      }

      // Collect answers
      const newAnswers = await this.collectAnswers(clarifications);

      if (newAnswers.length > 0) {
        // Update information and query
        this.providedInformation.push(...newAnswers);
        currentQuery =
          this.initialQuestion + " | " + this.providedInformation.join(" | ");

        this.showProgress(newAnswers);

        // Re-enrich with updated information
        enriched = await this.enricher.enrich(currentQuery);
      } else {
        // No new information provided
        console.log("\n>>> No additional information provided in this round.");
        const userContinue = await new Promise<string>((resolve) => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
          });

          rl.question(
            "Continue with remaining clarifications? (yes/no): ",
            (answer) => {
              rl.close();
              resolve(answer);
            }
          );
        });
        if (!["yes", "y"].includes(userContinue.trim().toLowerCase())) {
          console.log(">>> Stopping enrichment with partial information.");
          break;
        }
      }
    }

    // Show final results
    console.log("\n=== Final Enriched Query (JSON) ===");
    console.log(JSON.stringify(enriched, null, 2));

    // Generate natural language version
    const naturalQuestion = await this.enricher.generateNaturalQuestion(
      this.initialQuestion,
      this.providedInformation
    );

    console.log("\n=== Final Enriched Question ===");
    console.log(naturalQuestion);

    return [naturalQuestion, enriched];
  }
}

// ========= Application =========

class QueryEnrichmentApp {
  private config: EnrichmentConfig;
  private enricher: QueryEnricher;
  private session: EnrichmentSession;

  constructor(config?: EnrichmentConfig) {
    this.config = config || new EnrichmentConfig();
    this.enricher = new QueryEnricher(this.config);
    this.session = new EnrichmentSession(this.enricher);
  }

  async runInteractive(): Promise<[string, EnrichedQuery] | [null, null]> {
    console.log("Query Enrichment Technique");
    console.log(
      "This technique transforms vague queries into detailed, specific questions"
    );
    console.log("#".repeat(60));

    try {
      console.log("\n" + "=".repeat(60));
      console.log("Interactive Query Enrichment");
      console.log("=".repeat(60));

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      const question = await new Promise<string>((resolve) => {
        rl.question(
          "\nEnter your question (e.g., 'Review my PR'): ",
          (answer) => {
            rl.close();
            resolve(answer.trim());
          }
        );
      });

      if (question) {
        const [finalQuestion, enriched] = await this.session.run(question);
        return [finalQuestion, enriched];
      } else {
        console.log("No question provided.");
        return [null, null];
      }
    } catch (error) {
      console.log("\n\nProgram interrupted.");
      return [null, null];
    }
  }
}

// ========= Main Execution =========

async function main(): Promise<void> {
  const app = new QueryEnrichmentApp();
  await app.runInteractive();
}

// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log("\n\nProgram interrupted.");
  process.exit(0);
});

main().catch(console.error);
