import { createHighlighter, type Highlighter } from "shiki";

let highlighterInstance: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ["light-plus", "monokai"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "json",
        "bash",
        "css",
        "html",
        "markdown",
        "yaml",
        "python",
        "go",
        "rust",
      ],
    });
  }
  return highlighterInstance;
}
