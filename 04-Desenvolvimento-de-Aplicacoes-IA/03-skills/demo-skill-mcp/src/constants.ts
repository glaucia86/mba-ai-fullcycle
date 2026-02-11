import * as path from "path";
import * as fs from "fs";

export const REFERENCE_DIR = path.resolve(process.cwd(), "..", "reference");
export const CHARACTER_LIMIT = 25000;

// Available guides
export const AVAILABLE_GUIDES = [
  "evaluation.md",
  "mcp_best_practices.md",
  "node_mcp_server.md",
  "python_mcp_server.md",
];

// Language mappings
export const LANGUAGE_GUIDES: Record<string, string> = {
  python: "python_mcp_server.md",
  typescript: "node_mcp_server.md",
  node: "node_mcp_server.md",
  javascript: "node_mcp_server.md",
};

// Check if a guide exists
export function guideExists(guideName: string): boolean {
  return AVAILABLE_GUIDES.includes(guideName);
}

// Get full path to a guide
export function getGuidePath(guideName: string): string {
  return path.join(REFERENCE_DIR, guideName);
}

// Read guide content
export function readGuide(guideName: string): string {
  const filePath = getGuidePath(guideName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Guide '${guideName}' not found`);
  }
  return fs.readFileSync(filePath, "utf-8");
}
