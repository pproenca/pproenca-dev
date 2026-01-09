# Hook Patterns

## Table of Contents

- [useState](#usestate)
- [useReducer](#usereducer)
- [useContext](#usecontext)
- [useRef](#useref)
- [useMemo](#usememo)
- [useCallback](#usecallback)
- [useEffect](#useeffect)
- [useTransition](#usetransition)
- [useDeferredValue](#usedeferredvalue)
- [useActionState](#useactionstate)
- [useOptimistic](#useoptimistic)
- [useFormStatus](#useformstatus)
- [use](#use)
- [Custom Hooks](#custom-hooks)

---

## useState

```tsx
const [value, setValue] = useState(initialValue);
const [value, setValue] = useState(() => computeInitial()); // lazy init
```

**Update patterns:**

```tsx
setValue(newValue); // replace
setValue((prev) => prev + 1); // functional update (for derived)
setValue({ ...obj, key: newVal }); // object spread (immutable)
setValue([...arr, newItem]); // array spread
setValue(arr.filter((x) => x.id !== id)); // filter
setValue(arr.map((x) => (x.id === id ? { ...x, done: true } : x))); // map update
```

**Lazy initialization** - use when initial value is expensive:

```tsx
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem("key"));
});
```

---

## useReducer

Better than useState when: complex state logic, multiple sub-values, or next state depends on previous.

```tsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "set":
      return { count: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: "increment" });
dispatch({ type: "set", payload: 5 });
```

**With TypeScript:**

```tsx
type State = { count: number };
type Action = { type: "increment" } | { type: "set"; payload: number };

function reducer(state: State, action: Action): State {
  /* ... */
}
```

---

## useContext

```tsx
const ThemeContext = createContext<Theme>("light");

// Provider (React 19: use Context directly)
<ThemeContext value={theme}>{children}</ThemeContext>;

// Consumer
const theme = useContext(ThemeContext);
```

**Pattern: Context + Reducer**

```tsx
const StateContext = createContext(null);
const DispatchContext = createContext(null);

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext value={state}>
      <DispatchContext value={dispatch}>{children}</DispatchContext>
    </StateContext>
  );
}
```

---

## useRef

**DOM refs:**

```tsx
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />;
inputRef.current?.focus();
```

**Mutable values (no re-render on change):**

```tsx
const intervalRef = useRef<number | null>(null);
intervalRef.current = window.setInterval(() => {}, 1000);
```

**Previous value pattern:**

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

---

## useMemo

Cache expensive calculations. Re-runs when dependencies change.

```tsx
const filtered = useMemo(() => items.filter((item) => item.active), [items]);

const sorted = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items],
);
```

**When to use:**

- Filtering/sorting large arrays
- Complex object transformations
- Computationally expensive operations
- Stabilizing objects/arrays for child component props

**When NOT to use:**

- Simple calculations
- Primitives
- When deps change every render anyway

---

## useCallback

Cache function definitions. Use to prevent child re-renders.

```tsx
const handleClick = useCallback((id: string) => {
  setItems((items) => items.filter((item) => item.id !== id));
}, []); // stable reference

<ChildComponent onClick={handleClick} />; // won't cause re-render
```

Equivalent to: `useMemo(() => fn, deps)`

---

## useEffect

**Only for synchronization with external systems.** See [effects.md](effects.md) for when NOT to use.

```tsx
useEffect(() => {
  // setup
  const subscription = api.subscribe(id);

  return () => {
    // cleanup (runs before next effect and on unmount)
    subscription.unsubscribe();
  };
}, [id]); // re-run when id changes
```

**Common patterns:**

```tsx
// Run once on mount
useEffect(() => {
  analytics.pageView();
}, []);

// Sync with external store
useEffect(() => {
  const unsubscribe = store.subscribe(() => setData(store.getState()));
  return unsubscribe;
}, []);

// DOM measurement
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setHeight(rect.height);
}, []);
```

---

## useTransition

Mark state updates as non-urgent. UI stays responsive.

```tsx
const [isPending, startTransition] = useTransition();

function handleChange(value) {
  startTransition(() => {
    setSearchQuery(value); // deferred, interruptible
  });
}

return (
  <>
    <input onChange={(e) => handleChange(e.target.value)} />
    {isPending && <Spinner />}
    <Results query={searchQuery} />
  </>
);
```

**React 19: Async transitions**

```tsx
startTransition(async () => {
  const data = await fetchData();
  setData(data);
}); // isPending stays true until async completes
```

---

## useDeferredValue

Defer updating a value. Like useTransition but for values you don't control.

```tsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;

// React 19: initial value
const deferred = useDeferredValue(value, initialValue);
```

---

## useActionState

**React 19**: Form state management with Actions.

```tsx
const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    const error = await submitForm(formData);
    if (error) return { error };
    return { success: true };
  },
  { error: null, success: false },
);

<form action={formAction}>
  <input name="email" />
  <button disabled={isPending}>Submit</button>
  {state.error && <p>{state.error}</p>}
</form>;
```

**Signature:** `(action, initialState, permalink?) => [state, action, isPending]`

Action receives: `(previousState, formData) => newState`

---

## useOptimistic

**React 19**: Optimistic UI updates.

```tsx
const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (current, newLike) => [...current, newLike],
);

async function handleLike() {
  addOptimisticLike({ id: tempId, pending: true });
  await saveLike();
}
```

Automatically reverts on error.

---

## useFormStatus

**React 19** (react-dom): Access parent form state.

```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

// Must be child of <form>
<form action={action}>
  <SubmitButton />
</form>;
```

---

## use

**React 19**: Read resources in render.

```tsx
import { use } from "react";

// Read promise (suspends)
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map((c) => <p key={c.id}>{c.text}</p>);
}

// Read context conditionally
function Heading({ children }) {
  if (!children) return null;
  const theme = use(ThemeContext); // OK after early return
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
```

**Caveats:**

- Promise must come from Suspense-compatible source (framework/cache)
- Don't create promise in render
- Can call conditionally (unlike hooks)

---

## Custom Hooks

Extract reusable stateful logic. Name must start with `use`.

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function useOnClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
```
