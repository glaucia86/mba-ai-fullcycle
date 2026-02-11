import { z } from "zod";
import { AVAILABLE_GUIDES, guideExists } from "../constants.js";
import type { GuideInfo } from "../types.js";

const ListGuidesInputSchema = z.object({}).strict();

type ListGuidesInput = z.infer<typeof ListGuidesInputSchema>;

export function registerListGuidesTool(server: any) {
  server.registerTool(
    "list_available_guides",
    {
      title: "List Available Programming Guides",
      description: `List all available programming best practices guides.

This tool returns a list of all programming guides available for querying. Each guide contains best practices and implementation details for specific programming languages or MCP development.

Returns:
  A list of available guides with their names, titles, and descriptions.

Examples:
  - Use when: "What guides are available?" or "Show me the programming guides"
  - Use when: "List all best practices guides"

Error Handling:
  - This tool always succeeds as it lists static content`,
      inputSchema: ListGuidesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListGuidesInput) => {
      const guides: GuideInfo[] = [
        {
          name: "evaluation.md",
          title: "MCP Server Evaluation Guide",
          description:
            "Guide for creating and running evaluations to test MCP server quality and effectiveness",
        },
        {
          name: "mcp_best_practices.md",
          title: "MCP Best Practices",
          description:
            "Universal guidelines and best practices for MCP server development",
        },
        {
          name: "node_mcp_server.md",
          title: "Node/TypeScript MCP Server Guide",
          description:
            "Complete guide for implementing MCP servers in TypeScript using the MCP SDK",
          language: "TypeScript",
        },
        {
          name: "python_mcp_server.md",
          title: "Python MCP Server Guide",
          description:
            "Complete guide for implementing MCP servers in Python using FastMCP",
          language: "Python",
        },
      ];

      const output = {
        total: guides.length,
        guides: guides.filter((guide) => guideExists(guide.name)),
      };

      const textContent = guides
        .filter((guide) => guideExists(guide.name))
        .map(
          (guide) =>
            `## ${guide.title}\n- **File**: ${guide.name}\n- **Description**: ${guide.description}${guide.language ? `\n- **Language**: ${guide.language}` : ""}\n`,
        )
        .join("\n");

      return {
        content: [{ type: "text", text: textContent }],
        structuredContent: output,
      };
    },
  );
}
