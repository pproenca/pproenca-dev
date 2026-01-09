# Google SEO Fundamentals

Core principles from Google's official Search documentation.

## Table of Contents

1. [Search Essentials](#search-essentials)
2. [E-E-A-T Framework](#e-e-a-t-framework)
3. [Helpful Content Guidelines](#helpful-content-guidelines)
4. [Technical Requirements](#technical-requirements)
5. [What NOT to Focus On](#what-not-to-focus-on)

---

## Search Essentials

### Three Pillars

1. **Technical Requirements** - What Google needs from a web page to show it in Search
2. **Spam Policies** - Behaviors that lead to lower ranking or omission
3. **Key Best Practices** - Factors that improve search appearance

### Core Best Practices

- Create helpful, reliable, people-first content
- Use words people would search for in titles, headings, alt text, link text
- Make links crawlable (`<a href="...">`)
- Tell people about your site through community engagement
- Follow specific best practices for images, videos, structured data, JavaScript

---

## E-E-A-T Framework

**Experience, Expertise, Authoritativeness, Trustworthiness**

Trust is the most important factor. The others contribute to trust.

### Demonstrating E-E-A-T

- **Experience**: First-hand experience with the topic (actually used a product, visited a place)
- **Expertise**: Depth of knowledge demonstrated in content
- **Authoritativeness**: Recognition as a go-to source
- **Trustworthiness**: Accuracy, honesty, safety, reliability

### Content Self-Assessment Questions

1. Does content provide original information, reporting, research, or analysis?
2. Does content provide substantial, complete description of the topic?
3. Does content provide insightful analysis beyond the obvious?
4. If sourcing other content, does it add substantial value?
5. Does the headline/title provide a useful summary?
6. Would you bookmark, share, or recommend this content?
7. Would this content be referenced in a printed magazine or book?

---

## Helpful Content Guidelines

### People-First Content Checklist

- [ ] Do you have an audience that would find this useful if they came directly to you?
- [ ] Does content clearly demonstrate first-hand expertise?
- [ ] Does your site have a primary purpose or focus?
- [ ] Will readers feel they've learned enough to achieve their goal?
- [ ] Will readers have a satisfying experience?

### Search Engine-First Warning Signs (Avoid These)

- [ ] Content primarily to attract search engine visits
- [ ] Producing lots of content on different topics hoping some performs
- [ ] Using automation to produce content on many topics
- [ ] Summarizing others' content without adding value
- [ ] Writing about trending topics without expertise
- [ ] Content that leaves readers needing to search again
- [ ] Writing to a specific word count (there is no ideal length)
- [ ] Entering a niche without real expertise

### AI-Generated Content Policy

- **Not automatically spam** - Google focuses on content quality, not production method
- **Spam violation**: Using AI with primary purpose of manipulating search rankings
- **Acceptable**: Using AI to help produce helpful, original, people-first content
- **Recommendation**: Disclose AI use when readers would reasonably expect it

---

## Technical Requirements

### Minimum Requirements for Indexing

1. Page not blocked by robots.txt
2. Page returns HTTP 200 status
3. Page has indexable content (not just images/video without text)
4. Page not blocked by noindex meta tag

### JavaScript SEO (Critical for Next.js)

Google processes JavaScript in three phases:

1. **Crawling** - Fetches HTML
2. **Rendering** - Executes JavaScript (may be delayed)
3. **Indexing** - Indexes rendered content

**Best Practices:**

```javascript
// ✅ Use History API for routing (not hash fragments)
window.history.pushState({}, '', '/new-page')

// ✅ Use proper <a> tags with href
<a href="/page">Link</a>

// ❌ Avoid hash-based routing
<a href="#/page">Link</a>  // Google can't reliably resolve

// ✅ Handle 404s properly
if (!product.exists) {
  // Option 1: Redirect to 404 page
  window.location.href = '/not-found';

  // Option 2: Add noindex dynamically
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex';
  document.head.appendChild(meta);
}
```

**Server-Side Rendering Benefits:**

- Faster initial content delivery
- Content visible without JavaScript execution
- Better for crawlers that don't execute JS
- Improved Core Web Vitals (LCP)

### URL Structure

- Use descriptive, human-readable URLs
- URLs appear in breadcrumbs in search results
- Group related content in directories

```
✅ https://example.com/blog/nextjs-seo-guide
❌ https://example.com/p/123456
```

### Canonicalization

- Specify canonical URL when content accessible via multiple URLs
- Use `rel="canonical"` link element
- Google will try to canonicalize automatically if you don't

### Mobile-First Indexing

- Google primarily uses mobile version for indexing
- Ensure content parity between mobile and desktop
- Use same meta tags on both versions
- Don't lazy-load primary content on user interaction

---

## What NOT to Focus On

Based on Google's guidance, these have little to no impact:

| Myth                           | Reality                                  |
| ------------------------------ | ---------------------------------------- |
| Meta keywords                  | Google doesn't use the keywords meta tag |
| Keyword stuffing               | Violates spam policies                   |
| Keywords in domain name        | Hardly any ranking effect                |
| Domain TLD (.com vs .io)       | Only matters for country targeting       |
| Minimum/maximum content length | No magical word count target             |
| Subdomains vs subdirectories   | Do what makes sense for your business    |
| Number/order of headings       | Doesn't matter to Google                 |
| E-E-A-T as ranking factor      | It's a framework, not a direct signal    |
| Duplicate content "penalty"    | Not a penalty, just inefficient          |

---

## Key Takeaways

1. **Focus on users, not search engines** - Content created for people naturally performs better
2. **Technical foundation matters** - Ensure Google can crawl, render, and index your pages
3. **E-E-A-T demonstrates trust** - Show experience, expertise, and reliability
4. **Quality over quantity** - One excellent page beats ten mediocre ones
5. **Stay current** - Update old content, remove outdated information
6. **Be patient** - SEO changes take weeks to months to show impact
