import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { loadEnvironment, getApiKey, getEndpoint } from "../utils/helpers";

// Load environment variables
loadEnvironment();

// Initialize the LLM
const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
  configuration: {
    baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
    apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
  },
});

// ========= Enhanced Prompt Templates =========

// Prompt to generate initial draft with MANY specific gaps
const draftPrompt = PromptTemplate.fromTemplate(
  `You are an expert assistant with limited initial knowledge.
Answer the following question, but you MUST mark MANY specific details as missing.
Use [MISSING: ...] markers for:
- Specific version numbers and release dates
- Technical specifications and parameters
- Performance metrics and benchmarks
- Comparison data between different versions
- Implementation details and code examples
- Real-world use cases and case studies
- Limitations and known issues
- Future roadmap and upcoming features

Be thorough in identifying what specific information would make the answer complete.
Start with a basic overview but mark MANY specific details as missing.

Do not generate more than 5 MISSING Markers.
Question: {question}

Answer:`
);

// Prompt to generate queries from gaps - now more specific
const queryPrompt = PromptTemplate.fromTemplate(
  `You received the following draft with gaps:
{draft}

For each [MISSING: ...] marker, provide information to fill that gap.
Format each as: 'For [MISSING: topic]: provide the actual information'
Be specific and provide real data when possible.
Example: 'For [MISSING: version numbers]: LangChain is at version 0.1.0, LangGraph at 0.2.0'
List information for each gap, maximum 5 items.`
);

// Prompt to fill gaps gradually based on complexity
const fillPrompt = PromptTemplate.fromTemplate(
  `Original question: {question}

Current draft (iteration {iteration}):
{draft}

Information to help fill the gaps:
{queries}

CRITICAL INSTRUCTIONS:
1. You MUST replace AT LEAST 1-2 [MISSING: ...] markers with concrete information
2. ACTUALLY REPLACE the text '[MISSING: xyz]' with real content - don't keep the marker
3. Use the information above to guide what content to add
4. Do NOT add any new [MISSING:] markers - only fill or keep existing ones
5. If you cannot fill a gap with certainty, keep it as [MISSING: ...]

Example of what to do:
- WRONG: '[MISSING: version numbers and release dates]' (keeping the marker)
- RIGHT: 'LangChain version 0.1.0 was released in January 2024' (replacing with content)

Important: This is iteration {iteration}. You MUST make progress by filling gaps.

Rewrite the ENTIRE answer with the [MISSING:] markers replaced:`
);

// New prompt to identify additional gaps after filling
const expansionPrompt = PromptTemplate.fromTemplate(
  `Review this draft answer:
{draft}

Identify areas that could benefit from MORE specific information.
Add new [MISSING: ...] markers for:
- Technical details that were glossed over
- Specific examples that would clarify concepts
- Comparative data that would add context
- Implementation specifics that developers would need

Return the same text but with ADDITIONAL [MISSING: ...] markers for deeper details:`
);

// ========= Create Runnable Chains =========

const outputParser = new StringOutputParser();

const draftChain = draftPrompt.pipe(llm).pipe(outputParser);
const queryChain = queryPrompt.pipe(llm).pipe(outputParser);
const fillChain = fillPrompt.pipe(llm).pipe(outputParser);
const expansionChain = expansionPrompt.pipe(llm).pipe(outputParser);

// ========= Enhanced Main Function =========

/**
 * Perform iterative retrieval and generation with multiple natural rounds.
 * Continues until all gaps are filled or max iterations reached.
 *
 * @param question - The question to answer
 * @param maxIters - Maximum number of iterations to refine the answer
 * @param targetCompleteness - Target completeness (0-1), stops when achieved
 * @returns The final refined answer
 */
async function iterRetgenMulti(
  question: string,
  maxIters: number = 10,
  targetCompleteness: number = 0.95
): Promise<string> {
  // Generate initial draft with many gaps
  let draft = await draftChain.invoke({ question });
  console.log("\n=== Initial Draft (with many gaps) ===");
  console.log(draft);

  // Count initial gaps
  const initialGaps = (draft.match(/\[MISSING:/g) || []).length;
  console.log(`\nInitial gaps identified: ${initialGaps}`);

  let actualIterations = 0;
  let consecutiveNoProgress = 0;

  // Iterative refinement - continue until complete or max iterations
  for (let iteration = 0; iteration < maxIters; iteration++) {
    actualIterations = iteration + 1;
    let currentGaps = (draft.match(/\[MISSING:/g) || []).length;

    // Check if we've reached completion
    if (currentGaps === 0) {
      console.log("\nAll gaps filled!");

      // Only expand in early iterations, not indefinitely
      if (iteration < 2) {
        // Only expand in first couple iterations
        console.log("Checking for areas to expand...");
        draft = await expansionChain.invoke({ draft });
        currentGaps = (draft.match(/\[MISSING:/g) || []).length;

        if (currentGaps === 0) {
          console.log("Answer is comprehensive and complete!");
          break;
        } else {
          console.log(`Identified ${currentGaps} new areas for expansion`);
          consecutiveNoProgress = 0; // Reset counter
        }
      } else {
        console.log("✅ Answer is complete after multiple refinements!");
        break; // Stop after filling all gaps in later iterations
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`ITERATION ${iteration + 1}`);
    console.log(`Current gaps to address: ${currentGaps}`);
    console.log("=".repeat(60));

    // Generate queries for missing information
    const queries = await queryChain.invoke({ draft });
    console.log("\n=== Generated Queries ===");
    const queriesList = queries.split("\n");
    queriesList.slice(0, 10).forEach((query, i) => {
      // Show max 10 queries
      if (query.trim()) {
        console.log(`${i + 1}. ${query.trim()}`);
      }
    });
    if (queriesList.length > 10) {
      console.log(`   ... and ${queriesList.length - 10} more queries`);
    }

    // Fill gaps with new information (gradual filling based on iteration)
    draft = await fillChain.invoke({
      question,
      draft,
      queries,
      iteration: iteration + 1,
    });

    // Show refined answer
    console.log("\n=== Refined Answer ===");
    console.log(draft.length > 500 ? draft.substring(0, 500) + "..." : draft); // Show preview

    // Report progress
    const newGaps = (draft.match(/\[MISSING:/g) || []).length;
    const filled = currentGaps - newGaps;
    console.log(`\nProgress: Filled ${filled} gaps, ${newGaps} remaining`);

    // Check if we're making progress
    if (filled === 0) {
      consecutiveNoProgress++;
      if (consecutiveNoProgress >= 3) {
        console.log("\nNo progress in 3 consecutive iterations. Stopping.");
        break;
      }
    } else {
      consecutiveNoProgress = 0;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`REFINEMENT COMPLETE after ${actualIterations} iterations`);
  console.log("=".repeat(60));

  return draft;
}

// ========= Main Execution =========

async function main(): Promise<void> {
  // Using a complex technical question that naturally requires multiple iterations
  const demonstrationQuestion = "Explain about the LangChain and LangGraph";

  console.log(`'${demonstrationQuestion}'`);
  console.log("#".repeat(60));

  // Run with more iterations to ensure completion
  const finalAnswer = await iterRetgenMulti(demonstrationQuestion, 10);

  console.log("\n" + "=".repeat(60));
  console.log("FINAL COMPLETE ANSWER:");
  console.log("=".repeat(60));
  console.log(finalAnswer);

  // Final statistics
  const finalGaps = (finalAnswer.match(/\[MISSING:/g) || []).length;
  const initialLength = demonstrationQuestion.length;
  const finalLength = finalAnswer.length;

  console.log("\n" + "=".repeat(60));
  console.log("FINAL STATISTICS:");
  console.log(`   - Remaining gaps: ${finalGaps}`);
  console.log(
    `   - Answer expansion: ${(finalLength / initialLength).toFixed(
      1
    )}x original question length`
  );
  console.log("=".repeat(60));
}

main().catch(console.error);
