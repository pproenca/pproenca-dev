# Effects Guide

## Table of Contents

- [When to Use Effects](#when-to-use-effects)
- [When NOT to Use Effects](#when-not-to-use-effects)
- [Effect Lifecycle](#effect-lifecycle)
- [Dependencies](#dependencies)
- [Cleanup](#cleanup)
- [Common Patterns](#common-patterns)

---

## When to Use Effects

Effects are for **synchronizing with external systems** - things outside React:

✅ **Valid use cases:**

- Connecting to external APIs/services
- Setting up subscriptions (WebSocket, event listeners)
- Syncing with browser APIs (document.title, localStorage)
- Third-party library integration (maps, charts)
- Analytics/logging on mount
- Manual DOM manipulation
- Timers (setInterval, setTimeout)

```tsx
// External API subscription
useEffect(() => {
  const conn = createConnection(roomId);
  conn.connect();
  return () => conn.disconnect();
}, [roomId]);

// Browser API sync
useEffect(() => {
  document.title = `${count} items`;
}, [count]);

// Event listener
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

---

## When NOT to Use Effects

### ❌ Derived/Computed State

```tsx
// BAD: Effect for derived state
const [items, setItems] = useState([]);
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter((i) => i.active));
}, [items]);

// GOOD: Calculate during render
const filtered = items.filter((i) => i.active);

// GOOD: Memoize if expensive
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

### ❌ Transforming Data for Display

```tsx
// BAD
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// GOOD
const fullName = `${firstName} ${lastName}`;
```

### ❌ Handling User Events

```tsx
// BAD: Effect for event response
useEffect(() => {
  if (shouldSubmit) {
    submitForm(data);
    setShouldSubmit(false);
  }
}, [shouldSubmit, data]);

// GOOD: Handle in event handler
const handleSubmit = () => {
  submitForm(data);
};
```

### ❌ Resetting State on Prop Change

```tsx
// BAD
useEffect(() => {
  setComment("");
}, [userId]);

// GOOD: Use key
<Profile userId={userId} key={userId} />;
```

### ❌ Chaining State Updates

```tsx
// BAD: Effect chain
useEffect(() => {
  if (card?.gold) setGoldCount((c) => c + 1);
}, [card]);

useEffect(() => {
  if (goldCount > 3) {
    setRound((r) => r + 1);
    setGoldCount(0);
  }
}, [goldCount]);

// GOOD: Update together in event handler
function handleCardClick(card) {
  setCard(card);
  if (card.gold) {
    const newGold = goldCount + 1;
    if (newGold > 3) {
      setRound((r) => r + 1);
      setGoldCount(0);
    } else {
      setGoldCount(newGold);
    }
  }
}
```

### ❌ Initializing App Once

```tsx
// BAD: Effect that should run once globally
useEffect(() => {
  initializeApp();
}, []);

// GOOD: Outside component or in entry point
if (typeof window !== "undefined") {
  initializeApp();
}

function App() {
  /* ... */
}
```

### ❌ Fetching Data Without Cleanup

```tsx
// BAD: Race condition
useEffect(() => {
  fetchData(id).then(setData);
}, [id]);

// GOOD: With cleanup flag
useEffect(() => {
  let ignore = false;
  fetchData(id).then((result) => {
    if (!ignore) setData(result);
  });
  return () => {
    ignore = true;
  };
}, [id]);

// BETTER: Use framework's data fetching or library
```

### ❌ Notifying Parent of State Change

```tsx
// BAD: Effect to call parent
useEffect(() => {
  onChange(value);
}, [value, onChange]);

// GOOD: Call in same event handler
const handleChange = (newValue) => {
  setValue(newValue);
  onChange(newValue);
};
```

---

## Effect Lifecycle

```
Component mounts
  → Effect setup runs

Deps change (e.g., [roomId] changes)
  → Cleanup runs (previous effect)
  → Effect setup runs (new deps)

Component unmounts
  → Cleanup runs
```

**Strict Mode**: In development, React mounts → unmounts → mounts to catch bugs.

---

## Dependencies

**Rule: Include every reactive value used inside the effect.**

```tsx
// All used values in deps
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.on("message", onMessage);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl, roomId, onMessage]); // ✅ all deps listed
```

### Removing Dependencies

**1. Move static values outside component:**

```tsx
const serverUrl = "https://api.example.com"; // static

function Chat({ roomId }) {
  useEffect(() => {
    const conn = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]); // serverUrl not needed
}
```

**2. Move function inside effect:**

```tsx
// BAD: Function in deps
const createOptions = () => ({ serverUrl, roomId });

useEffect(() => {
  const opts = createOptions();
  // ...
}, [createOptions]); // changes every render!

// GOOD: Move inside
useEffect(() => {
  const createOptions = () => ({ serverUrl, roomId });
  const opts = createOptions();
  // ...
}, [serverUrl, roomId]);
```

**3. Use updater function for state:**

```tsx
// BAD: count in deps
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]); // runs every second!

// GOOD: Functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(id);
}, []); // runs once
```

**4. Use ref for values you don't want to react to:**

```tsx
const onMessageRef = useRef(onMessage);
useLayoutEffect(() => {
  onMessageRef.current = onMessage;
});

useEffect(() => {
  connection.on("message", (...args) => onMessageRef.current(...args));
  // ...
}, []);
```

---

## Cleanup

**Always clean up subscriptions, timers, and listeners.**

```tsx
// Timer
useEffect(() => {
  const id = setInterval(() => tick(), 1000);
  return () => clearInterval(id);
}, []);

// Event listener
useEffect(() => {
  const handler = () => {};
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);

// Abort controller for fetch
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });
  return () => controller.abort();
}, [url]);

// Ignore stale responses
useEffect(() => {
  let cancelled = false;
  fetchData(id).then((data) => {
    if (!cancelled) setData(data);
  });
  return () => {
    cancelled = true;
  };
}, [id]);
```

---

## Common Patterns

### Data Fetching (with race condition handling)

```tsx
useEffect(() => {
  let ignore = false;

  async function fetchData() {
    setLoading(true);
    try {
      const result = await api.get(id);
      if (!ignore) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (!ignore) setError(err);
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  fetchData();
  return () => {
    ignore = true;
  };
}, [id]);
```

### Debounced Effect

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    search(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);
```

### Intersection Observer

```tsx
useEffect(() => {
  if (!ref.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.1 },
  );

  observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
```

### Media Query

```tsx
useEffect(() => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e) => setIsDark(e.matches);

  setIsDark(mq.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}, []);
```

### Focus Management

```tsx
useEffect(() => {
  if (isOpen) {
    inputRef.current?.focus();
  }
}, [isOpen]);
```

### Sync to localStorage

```tsx
// Read once on mount
const [value, setValue] = useState(() => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
});

// Write on change
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value));
}, [key, value]);
```

### useLayoutEffect

Use when you need to measure/mutate DOM before browser paint.

```tsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);
```
