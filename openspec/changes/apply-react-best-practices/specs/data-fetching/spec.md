# Data Fetching

## ADDED Requirements

### Requirement: Per-Request Memoization for Post Data

The system SHALL use `React.cache()` to memoize all post data fetching functions, ensuring each function is executed at most once per request during static generation.

#### Scenario: Multiple components request all posts

- **WHEN** multiple page components call `getAllPosts()` during a single build request
- **THEN** the filesystem is read only once
- **AND** subsequent calls return the cached result

#### Scenario: Category page fetches category then posts

- **WHEN** a category page calls `slugToCategory()` in both `generateMetadata()` and the component
- **THEN** the underlying `getAllCategories()` is executed only once
- **AND** both calls receive the same cached result

#### Scenario: Sitemap generation uses cached data

- **WHEN** sitemap generation calls `getAllPosts()` and `getAllCategorySlugs()`
- **THEN** the post data is fetched once and reused
- **AND** no redundant filesystem operations occur

---

### Requirement: Cached Category Resolution

The system SHALL cache `slugToCategory()` results to prevent duplicate category lookups within a single request.

#### Scenario: Category page resolves slug twice

- **WHEN** `/categories/[slug]/page.tsx` resolves the category name in both `generateMetadata` and the default export
- **THEN** the slug-to-category mapping is computed only once
- **AND** both functions receive the same category name

---

### Requirement: Cached Slug Generation

The system SHALL cache `getAllSlugs()` and `getAllCategorySlugs()` to optimize static params generation.

#### Scenario: Static params generation

- **WHEN** `generateStaticParams()` is called for posts or categories
- **THEN** slug lists are retrieved from cache if available
- **AND** filesystem reads are minimized

---

## Technical Notes

All caching uses React's built-in `cache()` function from the `react` package. Caching is per-request during static generation, meaning:

1. Each page build starts with an empty cache
2. First call to a cached function populates the cache
3. Subsequent calls within that page build return cached results
4. Cache is cleared between page builds

This pattern aligns with Vercel's React Best Practices rule 3.4: "Per-Request Deduplication with React.cache()".
