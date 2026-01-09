# State Structure & Immutability

## Table of Contents
- [State Principles](#state-principles)
- [Updating Objects](#updating-objects)
- [Updating Arrays](#updating-arrays)
- [Nested State](#nested-state)
- [Normalizing State](#normalizing-state)
- [Common Patterns](#common-patterns)

---

## State Principles

### 1. Group Related State
```tsx
// ❌ Separate but always change together
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// ✅ Grouped
const [position, setPosition] = useState({ x: 0, y: 0 });
```

### 2. Avoid Contradictions
```tsx
// ❌ Can be in impossible states (both true)
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);

// ✅ Single status
const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
const isSending = status === 'sending';
const isSent = status === 'sent';
```

### 3. No Redundant State
```tsx
// ❌ Redundant - can be derived
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');

// ✅ Derive during render
const fullName = `${firstName} ${lastName}`;
```

### 4. No Duplication
```tsx
// ❌ Duplicated object
const [items, setItems] = useState([...]);
const [selectedItem, setSelectedItem] = useState(items[0]);

// ✅ Store ID only
const [selectedId, setSelectedId] = useState(items[0].id);
const selectedItem = items.find(i => i.id === selectedId);
```

### 5. Flat Over Nested
```tsx
// ❌ Deeply nested
const [data, setData] = useState({
  user: { profile: { settings: { theme: 'dark' } } }
});

// ✅ Flat
const [theme, setTheme] = useState('dark');
const [profile, setProfile] = useState({...});
```

---

## Updating Objects

**Never mutate directly. Create new objects.**

```tsx
const [person, setPerson] = useState({ name: 'Alice', age: 30 });

// ❌ Mutation
person.name = 'Bob';

// ✅ Spread
setPerson({ ...person, name: 'Bob' });

// ✅ Multiple properties
setPerson(prev => ({
  ...prev,
  name: 'Bob',
  age: prev.age + 1
}));
```

**Nested objects:**
```tsx
const [user, setUser] = useState({
  name: 'Alice',
  address: { city: 'NYC', zip: '10001' }
});

// Update nested property
setUser({
  ...user,
  address: { ...user.address, city: 'LA' }
});
```

**Computed property names:**
```tsx
function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
}
```

---

## Updating Arrays

**Never mutate. Return new arrays.**

| Operation | Avoid (mutates) | Use instead |
|-----------|-----------------|-------------|
| Add | push, unshift | [...arr, item], [item, ...arr] |
| Remove | pop, shift, splice | filter, slice |
| Replace | splice, arr[i] = x | map |
| Sort | sort, reverse | [...arr].sort() |

```tsx
const [items, setItems] = useState([]);

// Add
setItems([...items, newItem]);           // end
setItems([newItem, ...items]);           // start
setItems([...items.slice(0, i), newItem, ...items.slice(i)]); // middle

// Remove
setItems(items.filter(item => item.id !== id));

// Update one
setItems(items.map(item => 
  item.id === id ? { ...item, done: true } : item
));

// Replace all
setItems(items.map(item => ({ ...item, done: false })));

// Sort (copy first!)
setItems([...items].sort((a, b) => a.name.localeCompare(b.name)));

// Reverse (copy first!)
setItems([...items].reverse());
```

---

## Nested State

**Option 1: Spread at each level**
```tsx
const [data, setData] = useState({
  items: [{ id: 1, tasks: [{ id: 1, done: false }] }]
});

// Update deep task
setData({
  ...data,
  items: data.items.map(item =>
    item.id === itemId
      ? {
          ...item,
          tasks: item.tasks.map(task =>
            task.id === taskId ? { ...task, done: true } : task
          )
        }
      : item
  )
});
```

**Option 2: Flatten structure (preferred)**
```tsx
const [items, setItems] = useState([{ id: 1 }]);
const [tasks, setTasks] = useState([{ id: 1, itemId: 1, done: false }]);

// Update task - simple!
setTasks(tasks.map(t => t.id === taskId ? { ...t, done: true } : t));
```

**Option 3: Immer** (when deeply nested is unavoidable)
```tsx
import { produce } from 'immer';

setData(produce(draft => {
  const item = draft.items.find(i => i.id === itemId);
  const task = item.tasks.find(t => t.id === taskId);
  task.done = true;
}));
```

---

## Normalizing State

Store collections as objects keyed by ID + array of IDs for order.

```tsx
// ❌ Array of objects
const [users, setUsers] = useState([
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
]);

// ✅ Normalized
const [usersById, setUsersById] = useState({
  '1': { id: '1', name: 'Alice' },
  '2': { id: '2', name: 'Bob' }
});
const [userIds, setUserIds] = useState(['1', '2']);

// Fast lookup: O(1)
const user = usersById[userId];

// Update one user
setUsersById({
  ...usersById,
  [userId]: { ...usersById[userId], name: 'Charlie' }
});

// Delete
const { [userId]: removed, ...rest } = usersById;
setUsersById(rest);
setUserIds(userIds.filter(id => id !== userId));
```

---

## Common Patterns

### Form State
```tsx
const [form, setForm] = useState({ email: '', password: '' });

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

<input name="email" value={form.email} onChange={handleChange} />
```

### Selection State
```tsx
// Single selection - store ID
const [selectedId, setSelectedId] = useState<string | null>(null);

// Multi selection - use Set for O(1) lookup
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const toggleSelection = (id: string) => {
  setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
```

### Toggle State
```tsx
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);
```

### Counter/Stepper
```tsx
const [count, setCount] = useState(0);
const increment = () => setCount(c => c + 1);
const decrement = () => setCount(c => Math.max(0, c - 1));
const reset = () => setCount(0);
```

### Undo/History
```tsx
const [history, setHistory] = useState([initialState]);
const [index, setIndex] = useState(0);

const current = history[index];

const update = (newState) => {
  setHistory([...history.slice(0, index + 1), newState]);
  setIndex(i => i + 1);
};

const undo = () => setIndex(i => Math.max(0, i - 1));
const redo = () => setIndex(i => Math.min(history.length - 1, i + 1));
```

### Reset State with Key
```tsx
// Reset all state when userId changes
<UserProfile userId={userId} key={userId} />
```
