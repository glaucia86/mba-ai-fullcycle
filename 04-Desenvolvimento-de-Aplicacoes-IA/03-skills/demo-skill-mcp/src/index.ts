#!/usr/bin/env node
/// <reference types="node" />
/**
 * MCP Server for Programming Best Practices Guides.
 *
 * This server provides tools to query programming best practices guides,
 * allowing LLMs to access development guidelines and implementation details.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerListGuidesTool } from "./tools/list_guides.js";
import { registerQueryGuideTool } from "./tools/query_guide.js";
import { registerAnswerQuestionTool } from "./tools/answer_question.js";

// Create MCP server instance
const server = new McpServer({
  name: "programming-guides-mcp-server",
  version: "1.0.0",
});

// Register all tools
registerListGuidesTool(server);
registerQueryGuideTool(server);
registerAnswerQuestionTool(server);

// Main function for stdio transport
async function runStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Programming Guides MCP server running via stdio");
}

// Run the server
runStdio().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
