# Programming Guides MCP Server - Demo Skill

An MCP (Model Context Protocol) server that provides access to programming best practices guides for LLMs. This is a demonstration implementation of an MCP server built with TypeScript.

## Overview

This demo server allows LLMs to query programming best practices guides located in the `reference` folder. It provides three main tools:

1. **list_available_guides**: Lists all available programming guides
2. **query_guide_content**: Queries the content of a specific guide
3. **answer_language_question**: Answers questions about programming languages based on their guides

## Installation

```bash
cd demo-skill-mcp
npm install
npm run build
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Available Guides

- `evaluation.md`: MCP Server Evaluation Guide
- `mcp_best_practices.md`: MCP Best Practices
- `node_mcp_server.md`: Node/TypeScript MCP Server Guide
- `python_mcp_server.md`: Python MCP Server Guide

## Tools

### list_available_guides

Lists all available programming guides with their titles and descriptions.

### query_guide_content

Queries the content of a specific guide. Supports:

- Full content retrieval
- Section-specific queries
- Configurable length limits

### answer_language_question

Answers questions about programming languages by searching through their respective guides. Supports:

- Python (using python_mcp_server.md)
- TypeScript/Node.js (using node_mcp_server.md)

## Quality Evaluation

The server has been evaluated with 10 test questions covering:

- Guide content discovery
- Specific information retrieval
- Language-specific best practices
- Cross-guide queries

All tools follow MCP best practices with proper:

- Zod schema validation
- Error handling
- Response formatting
- TypeScript type safety

## Architecture

- **Language**: TypeScript
- **Framework**: MCP TypeScript SDK
- **Transport**: stdio (local), streamable HTTP (remote)
- **Validation**: Zod schemas
- **Build**: TypeScript compilation to ES2022

## Project Structure

```
demo-skill-mcp/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── constants.ts      # Guide definitions and utilities
│   ├── types.ts          # TypeScript interfaces
│   └── tools/            # Tool implementations
│       ├── list_guides.ts
│       ├── query_guide.ts
│       └── answer_question.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── programming-guides-evaluation.xml  # Evaluation test cases
└── dist/                 # Compiled JavaScript
```
