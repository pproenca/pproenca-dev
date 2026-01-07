import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";

// Literary Nightfall - Warm Dark Theme for code
const warmDarkTheme: ThemeRegistration = {
  name: "literary-nightfall",
  type: "dark",
  colors: {
    "editor.background": "#241f1a",
    "editor.foreground": "#e8e2d9",
  },
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#6b635a", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.quoted"],
      settings: { foreground: "#a8c082" },
    },
    {
      scope: ["constant.numeric", "constant.language.boolean"],
      settings: { foreground: "#d4a276" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#c9a962" },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#d4a276" },
    },
    {
      scope: ["variable", "variable.other"],
      settings: { foreground: "#e8e2d9" },
    },
    {
      scope: ["entity.name.type", "entity.name.class", "support.type"],
      settings: { foreground: "#c9a962" },
    },
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#c9a962" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#d4a276" },
    },
    {
      scope: ["punctuation", "meta.brace"],
      settings: { foreground: "#a69f94" },
    },
    {
      scope: ["constant.language.null", "constant.language.undefined"],
      settings: { foreground: "#8b7355" },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: "#a69f94" },
    },
    {
      scope: ["meta.import", "keyword.control.import", "keyword.control.export"],
      settings: { foreground: "#c9a962" },
    },
    {
      scope: ["string.regexp"],
      settings: { foreground: "#d4a276" },
    },
  ],
};

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", warmDarkTheme],
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
  return highlighter;
}

export async function highlightCode(
  code: string,
  lang: string,
  theme: "light" | "dark" = "dark"
): Promise<string> {
  const hl = await getHighlighter();
  const themeName = theme === "light" ? "github-light" : "literary-nightfall";

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
