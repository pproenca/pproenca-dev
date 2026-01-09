---
name: dev-react
description: React 19 best practices and patterns. Use when writing React components, hooks, forms, or server components. Enforces purity rules, proper state structure, correct hook usage, Actions pattern, and avoids common useEffect mistakes.
---

# React 19

## Core Rules (MUST follow)

### Purity

- Components/hooks must be **idempotent**: same inputs → same output
- **No side effects in render** - only in event handlers or useEffect
- **Never mutate** props, state, hook args/returns, or values after JSX use
- Local mutation during render is OK (arrays built in component body)

### Hooks

- Call **only at top level** - never in loops, conditions, or nested functions
- Call **only from React functions** - components or custom hooks
- Never pass hooks as values

### State Structure

1. **Group related** - merge vars that always change together
2. **No contradictions** - use status enum vs multiple booleans
3. **No redundant state** - derive from existing state/props
4. **No duplication** - store IDs not objects
5. **Flat over nested**

## React 19 Features

### Actions (async transitions)

```tsx
// Form with useActionState - handles pending/error automatically
const [error, submitAction, isPending] = useActionState(
  async (prev, formData) => {
    const err = await updateName(formData.get("name"));
    if (err) return err;
    redirect("/success");
    return null;
  },
  null,
);

<form action={submitAction}>
  <input name="name" />
  <button disabled={isPending}>Submit</button>
  {error && <p>{error}</p>}
</form>;
```

### useTransition for async

```tsx
const [isPending, startTransition] = useTransition();

const handleClick = () => {
  startTransition(async () => {
    const error = await saveData(data);
    if (error) setError(error);
  });
};
```

### useOptimistic

```tsx
const [optimisticName, setOptimisticName] = useOptimistic(currentName);

const submitAction = async (formData) => {
  setOptimisticName(formData.get("name")); // instant UI update
  await updateName(formData.get("name")); // server call
};
```

### use() API

```tsx
// Read promises (suspends until resolved)
const data = use(dataPromise); // must come from cache/framework

// Read context conditionally (unlike useContext)
if (condition) {
  const theme = use(ThemeContext);
}
```

### ref as prop (no forwardRef needed)

```tsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}
```

### Context as provider

```tsx
<ThemeContext value="dark">
  {" "}
  {/* not ThemeContext.Provider */}
  {children}
</ThemeContext>
```

### Ref cleanup functions

```tsx
<input
  ref={(node) => {
    // setup
    return () => {
      /* cleanup on unmount */
    };
  }}
/>
```

## Anti-Patterns

### ❌ useEffect for derived state

```tsx
// BAD
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);

// GOOD - calculate during render
const fullName = firstName + " " + lastName;
```

### ❌ useEffect for event responses

```tsx
// BAD - effect for user action
useEffect(() => {
  if (submitted) sendMessage(message);
}, [submitted]);

// GOOD - handle in event handler
function handleSubmit() {
  sendMessage(message);
  setSubmitted(true);
}
```

### ❌ useEffect to reset state on prop change

```tsx
// BAD
useEffect(() => {
  setComment("");
}, [userId]);

// GOOD - use key to reset
<Profile userId={userId} key={userId} />;
```

### ❌ Manual isPending/isSending state

```tsx
// BAD
const [isPending, setIsPending] = useState(false);
const handleSubmit = async () => {
  setIsPending(true);
  await save();
  setIsPending(false);
};

// GOOD - useTransition handles it
const [isPending, startTransition] = useTransition();
const handleSubmit = () => startTransition(async () => await save());
```

## References

- **[hooks.md](references/hooks.md)** - Complete hook patterns (useState, useEffect, useReducer, useContext, useMemo, useCallback, useRef, React 19 hooks)
- **[state.md](references/state.md)** - State structure, immutability, updates
- **[effects.md](references/effects.md)** - When to use effects, dependency rules, cleanup
- **[server.md](references/server.md)** - Server Components, Server Actions, directives
