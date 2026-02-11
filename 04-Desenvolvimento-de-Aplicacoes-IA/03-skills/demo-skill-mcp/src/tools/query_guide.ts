import { z } from "zod";
import {
  AVAILABLE_GUIDES,
  guideExists,
  readGuide,
  CHARACTER_LIMIT,
} from "../constants.js";
import type { QueryResult } from "../types.js";

const QueryGuideInputSchema = z
  .object({
    guide_name: z
      .string()
      .refine(guideExists, {
        message: `Guide not found. Available guides: ${AVAILABLE_GUIDES.join(", ")}`,
      })
      .describe(
        `Name of the guide to query. Available: ${AVAILABLE_GUIDES.join(", ")}`,
      ),
    section: z
      .string()
      .optional()
      .describe(
        "Optional section title to focus on (case-insensitive partial match)",
      ),
    max_length: z
      .number()
      .int()
      .min(100)
      .max(CHARACTER_LIMIT)
      .default(CHARACTER_LIMIT)
      .describe(
        `Maximum content length to return (default: ${CHARACTER_LIMIT})`,
      ),
  })
  .strict();

type QueryGuideInput = z.infer<typeof QueryGuideInputSchema>;

export function registerQueryGuideTool(server: any) {
  server.registerTool(
    "query_guide_content",
    {
      title: "Query Programming Guide Content",
      description: `Query the content of a specific programming best practices guide.

This tool allows you to read and search through the content of programming guides. You can request the full content or focus on specific sections.

Args:
  - guide_name (string): Name of the guide file (e.g., 'python_mcp_server.md')
  - section (string, optional): Section title to focus on (partial match, case-insensitive)
  - max_length (number): Maximum characters to return (default: 25000)

Returns:
  The content of the requested guide, optionally filtered by section.

Examples:
  - Use when: "Show me the Python MCP server guide"
  - Use when: "What does the evaluation guide say about testing?"
  - Use when: "Read the best practices section from MCP guide"

Error Handling:
  - Returns "Guide '<name>' not found" if guide doesn't exist
  - Returns "Section '<section>' not found in guide" if section doesn't exist`,
      inputSchema: QueryGuideInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: QueryGuideInput) => {
      try {
        let content = readGuide(params.guide_name);

        // If section is specified, try to find and extract it
        if (params.section) {
          const sectionRegex = new RegExp(
            `^#{1,6}\\s.*${params.section}.*`,
            "im",
          );
          const sectionMatch = content.match(sectionRegex);

          if (sectionMatch) {
            const sectionStart = sectionMatch.index!;
            // Find the next section header or end of content
            const nextSectionRegex = /^#{1,6}\s/m;
            const nextMatch = content
              .slice(sectionStart + sectionMatch[0].length)
              .match(nextSectionRegex);

            if (nextMatch) {
              const sectionEnd =
                sectionStart + sectionMatch[0].length + nextMatch.index!;
              content = content.slice(sectionStart, sectionEnd).trim();
            } else {
              content = content.slice(sectionStart).trim();
            }
          } else {
            return {
              content: [
                {
                  type: "text",
                  text: `Section '${params.section}' not found in guide '${params.guide_name}'`,
                },
              ],
            };
          }
        }

        // Check character limit
        let truncated = false;
        if (content.length > params.max_length) {
          content =
            content.slice(0, params.max_length - 100) +
            "\n\n[Content truncated...]";
          truncated = true;
        }

        const output: QueryResult = {
          guide: params.guide_name,
          content,
          truncated,
        };

        return {
          content: [{ type: "text", text: content }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error reading guide: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );
}
