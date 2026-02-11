import { z } from "zod";
import {
  LANGUAGE_GUIDES,
  guideExists,
  readGuide,
  CHARACTER_LIMIT,
} from "../constants.js";
import type { QuestionAnswer } from "../types.js";

const AnswerQuestionInputSchema = z
  .object({
    language: z
      .string()
      .refine((lang) => lang.toLowerCase() in LANGUAGE_GUIDES, {
        message: `Unsupported language. Supported: ${Object.keys(LANGUAGE_GUIDES).join(", ")}`,
      })
      .describe(
        `Programming language to query about. Supported: ${Object.keys(LANGUAGE_GUIDES).join(", ")}`,
      ),
    question: z
      .string()
      .min(5, "Question must be at least 5 characters")
      .max(500, "Question must not exceed 500 characters")
      .describe("The question about the programming language best practices"),
  })
  .strict();

type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

export function registerAnswerQuestionTool(server: any) {
  server.registerTool(
    "answer_language_question",
    {
      title: "Answer Programming Language Questions",
      description: `Answer questions about programming languages based on their best practices guides.

This tool searches through the relevant programming guide for the specified language and provides answers to questions about best practices, implementation details, and development guidelines.

Args:
  - language (string): Programming language (python, typescript, node, javascript)
  - question (string): Question about the language's best practices

Returns:
  An answer based on the content of the language's guide, with relevant context.

Examples:
  - Use when: "How do I implement error handling in Python MCP servers?"
  - Use when: "What are the best practices for TypeScript MCP server development?"
  - Use when: "How should I structure my Node.js MCP server?"

Error Handling:
  - Returns "Unsupported language" if language not supported
  - Returns "No relevant information found" if question cannot be answered from the guide`,
      inputSchema: AnswerQuestionInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: AnswerQuestionInput) => {
      try {
        const language = params.language.toLowerCase();
        const guideName = LANGUAGE_GUIDES[language];

        if (!guideExists(guideName)) {
          return {
            content: [
              {
                type: "text",
                text: `Guide for language '${params.language}' not found`,
              },
            ],
          };
        }

        const guideContent = readGuide(guideName);
        const question = params.question.toLowerCase();

        // Simple keyword-based search (could be enhanced with more sophisticated NLP)
        const keywords = question
          .split(/\s+/)
          .filter((word) => word.length > 2);
        const relevantSections: string[] = [];

        // Split guide into sections
        const sections = guideContent.split(/^#{1,6}\s/m);

        for (const section of sections) {
          const sectionLower = section.toLowerCase();
          const matches = keywords.filter(
            (keyword) =>
              sectionLower.includes(keyword) ||
              // Check for related terms
              (keyword === "error" && sectionLower.includes("exception")) ||
              (keyword === "async" && sectionLower.includes("await")) ||
              (keyword === "type" && sectionLower.includes("interface")) ||
              (keyword === "class" && sectionLower.includes("object")) ||
              (keyword === "function" && sectionLower.includes("method")),
          );

          if (matches.length > 0) {
            relevantSections.push(section.trim());
          }
        }

        let answer: string;
        let context: string;

        if (relevantSections.length > 0) {
          // Combine relevant sections
          context = relevantSections.slice(0, 3).join("\n\n---\n\n"); // Limit to 3 sections

          // Generate a simple answer based on the content
          answer = `Based on the ${params.language} best practices guide, here's what I found regarding your question "${params.question}":\n\n${context}`;

          // Truncate if too long
          if (answer.length > CHARACTER_LIMIT) {
            answer =
              answer.slice(0, CHARACTER_LIMIT - 100) +
              "\n\n[Answer truncated...]";
          }
        } else {
          // Fallback: provide general guidance
          const generalSections = sections.filter(
            (section) =>
              section.toLowerCase().includes("best practice") ||
              section.toLowerCase().includes("guideline") ||
              section.toLowerCase().includes("implementation"),
          );

          if (generalSections.length > 0) {
            context = generalSections.slice(0, 2).join("\n\n---\n\n");
            answer = `I couldn't find specific information about "${params.question}" in the ${params.language} guide. However, here are some general best practices from the guide:\n\n${context}`;
          } else {
            answer = `No relevant information found in the ${params.language} guide for the question: "${params.question}". The guide may not cover this specific topic.`;
            context = "";
          }
        }

        const output: QuestionAnswer = {
          language: params.language,
          guide: guideName,
          question: params.question,
          answer,
          context,
        };

        return {
          content: [{ type: "text", text: answer }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error answering question: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );
}
