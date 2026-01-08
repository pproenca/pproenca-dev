import { createHighlighter, type Highlighter } from "shiki";

// Module-level cache for Shiki highlighter (lazy initialization singleton)
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

export async function highlightCode(
  code: string,
  lang: string,
  theme: "light" | "dark" = "dark"
): Promise<string> {
  const hl = await getHighlighter();
  const themeName = theme === "light" ? "light-plus" : "monokai";

  try {
    return hl.codeToHtml(code, {
      lang,
      theme: themeName,
    });
  } catch {
    return hl.codeToHtml(code, {
      lang: "text",
      theme: themeName,
    });
  }
}
