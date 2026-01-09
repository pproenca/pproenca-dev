# Proposal: Adopt Monokai Theme

## Change ID

`adopt-monokai-theme`

## Status

Complete

## Summary

Replace the custom `literary-nightfall` syntax highlighting theme with Shiki's built-in `monokai` theme for dark mode and `light-plus` for light mode. Configure Tailwind CSS v4 to use class-based dark mode for next-themes compatibility.

## Why

- Monokai is a well-established, widely recognized syntax highlighting theme
- Using Shiki's built-in theme eliminates 65 lines of custom theme configuration
- Built-in themes are maintained by the Shiki community, reducing maintenance burden
- Consistent with the goal of using libraries over bespoke code

## What Changes

### Code Changes

1. **Remove custom theme definition** - Delete the `warmDarkTheme` object from `src/lib/shiki.ts`
2. **Update theme registration** - Change from `["github-light", warmDarkTheme]` to `["github-light", "monokai"]`
3. **Update theme reference** - Change `"literary-nightfall"` to `"monokai"` in `highlightCode()`

### Visual Changes

| Element    | Current (literary-nightfall) | New (monokai)               |
| ---------- | ---------------------------- | --------------------------- |
| Background | `#241f1a` (warm brown)       | `#272822` (dark gray-green) |
| Foreground | `#e8e2d9` (warm white)       | `#f8f8f2` (bright white)    |
| Strings    | `#a8c082` (sage green)       | `#e6db74` (yellow)          |
| Keywords   | `#c9a962` (gold)             | `#f92672` (pink/magenta)    |
| Functions  | `#d4a276` (tan)              | `#a6e22e` (bright green)    |
| Comments   | `#6b635a` (brown-gray)       | `#75715e` (olive gray)      |

## Impact Assessment

### Pros

- Zero custom theme code to maintain
- Monokai is battle-tested and familiar to developers
- Server-side friendly (Shiki built-in)

### Cons

- Visual change from warm/literary aesthetic to classic Monokai colors
- Monokai's vibrant colors (pink keywords, yellow strings) differ from the current muted palette

## Dependencies

None - Shiki already includes the `monokai` theme

## Related Changes

None

Sources:

- [Shiki Themes Documentation](https://shiki.style/themes)
- [tm-themes Repository](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes)
