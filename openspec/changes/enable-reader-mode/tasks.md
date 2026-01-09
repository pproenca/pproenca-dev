## 1. Implementation

- [x] 1.1 Change MDXContent wrapper from `<article>` to `<div>` to fix nested article elements
- [x] 1.2 Add `dateTime` attribute to `<time>` element in post header
- [x] 1.3 Add visible author byline with `rel="author"` and `.author-name` class

## 2. Verification

- [x] 2.1 Test Safari Reader View on a blog post (Reader icon should appear)
- [x] 2.2 Test Firefox Reader View on a blog post (book icon should appear)
- [x] 2.3 Verify title, author, and date are correctly extracted by reader mode

### Verification Results

HTML structure verified via browser inspection:

- Single `<article>` element (no nesting) ✓
- Author link with `rel="author"` attribute ✓
- `.author-name` class present ✓
- `<time>` element with `dateTime="2025-01-07"` ✓
- `.entry-date` class present ✓
