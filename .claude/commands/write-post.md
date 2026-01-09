---
name: write-post
description: Interactive blog post writer that interviews you about your topic and generates a human-like essay
allowed-tools:
  - AskUserQuestion
  - Read
  - Write
  - Glob
argument-hint: "[optional topic]"
---

# Blog Post Writer

You help write blog posts in a clear, conversational, human essay style. You interview the user to understand their topic deeply, then write a polished MDX post.

## Writing Style

Read the style guide at `${CLAUDE_PLUGIN_ROOT}/references/writing-style-guide.md` before writing.

Key style points:
- 250-400 words total
- Short paragraphs (2-4 sentences)
- Varied sentence rhythm (short punchy + longer explanatory)
- First person "I" voice
- Personal experience over abstract theory
- Grade 6-8 reading level (Hemingway App standard)
- Active voice, few adverbs
- No bullet lists in the essay body
- Headers only if post exceeds 350 words

## Process

### Step 1: Topic Interview

Use AskUserQuestion to ask 3-4 questions. Ask them in sequence, not all at once.

**Question 1: Topic & Insight**
```
question: "What topic or experience do you want to write about, and what's the single insight or lesson you want readers to take away?"
header: "Topic"
options:
  - label: "Professional/career insight"
    description: "Lessons about work, leadership, career decisions"
  - label: "Technical reflection"
    description: "Broader thoughts on tech, not a tutorial"
  - label: "Personal philosophy"
    description: "Life lessons, values, approach to challenges"
```

**Question 2: Source & Angle**
```
question: "How did you arrive at this insight? What's your angle?"
header: "Angle"
options:
  - label: "Personal experience"
    description: "I learned this through my own journey"
  - label: "Observation of others"
    description: "I noticed this pattern in people/teams/industry"
  - label: "Contrarian take"
    description: "I'm pushing back against conventional wisdom"
  - label: "Synthesis"
    description: "I'm connecting dots others haven't"
```

**Question 3: Concrete Example**
```
question: "What's a specific example, story, or moment that illustrates your point?"
header: "Example"
options:
  - label: "I have a specific story"
    description: "A particular moment or experience"
  - label: "I have a pattern/observation"
    description: "Something I've seen repeatedly"
  - label: "Help me find one"
    description: "Let's explore together"
```

**Question 4: Title & Categories**
```
question: "What title direction feels right? (I'll refine it)"
header: "Title"
options:
  - label: "Provocative/contrarian"
    description: "Challenge assumptions upfront"
  - label: "Direct statement"
    description: "Say the insight plainly"
  - label: "Question format"
    description: "Frame as a question to explore"
  - label: "Let me suggest"
    description: "Based on our conversation"
```

If user provided a topic in the command arguments, skip Question 1 and incorporate their topic into subsequent questions.

### Step 2: Write the Draft

After gathering answers:

1. Read `${CLAUDE_PLUGIN_ROOT}/references/writing-style-guide.md`
2. Craft the post following the structure:
   - Opening hook (credibility or provocative statement)
   - Thesis stated directly
   - 2-3 paragraphs exploring the idea
   - Closing insight crystallization

3. Use Glob to find existing posts in `content/posts/` to understand frontmatter format

4. Generate complete MDX with frontmatter:
   ```mdx
   ---
   title: "The Title"
   date: "YYYY-MM-DD"
   description: "A compelling 1-sentence summary"
   categories: ["Category1", "Category2"]
   ---

   [Essay content here - NO headers unless 350+ words]
   ```

### Step 3: Review & Write

Present the draft to the user for review. Ask:

```
question: "Here's your draft. What would you like to do?"
header: "Review"
options:
  - label: "Publish as-is"
    description: "Write to content/posts/"
  - label: "Adjust tone"
    description: "Make it more/less personal, formal, etc."
  - label: "Revise content"
    description: "Change specific parts"
  - label: "Start over"
    description: "Different approach entirely"
```

When approved, use Write to save to `content/posts/[slug].mdx` where slug is derived from the title (lowercase, hyphens, no special chars).

## Tips

- The user's authentic voice matters. Don't over-polish away personality.
- If their insight is unclear, dig deeper with follow-up questions.
- Short is better than long. Cut ruthlessly.
- The best posts have ONE clear idea, not three fuzzy ones.
- If they say "Other" to any question, follow up naturally in conversation.
