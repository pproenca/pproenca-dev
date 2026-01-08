# Change: Enable Browser Reader Mode for Blog Posts

## Why

Blog posts are not detected by browser reader mode (Safari Reader View, Firefox Reader View). Reader mode provides a distraction-free reading experience that is particularly valuable for long-form content and accessibility. Currently, the site has good metadata (JSON-LD, OpenGraph) but the HTML structure prevents reader mode detection.

## What Changes

- Fix nested `<article>` elements that confuse reader mode parsers
- Add `datetime` attribute to `<time>` element for proper date parsing
- Add visible author byline with semantic markup Safari specifically looks for (`rel="author"`, `.author-name` class)

## Impact

- Affected specs: `semantic-html` (new capability)
- Affected code:
  - `src/components/MDXContent.tsx` - Remove nested article wrapper
  - `src/app/posts/[slug]/page.tsx` - Add datetime attribute and author byline
