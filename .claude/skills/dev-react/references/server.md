# Server Components & Actions

## Table of Contents

- [Server Components](#server-components)
- [Client Components](#client-components)
- [Server Actions](#server-actions)
- [Directives](#directives)
- [Patterns](#patterns)

---

## Server Components

Default in RSC frameworks (Next.js App Router). Run on server only.

**Can:**

- Access server resources directly (DB, filesystem, env vars)
- Keep secrets/API keys secure
- Reduce client bundle size
- Async/await at component level

**Cannot:**

- Use hooks (useState, useEffect, etc.)
- Use browser APIs
- Add event handlers
- Use context (except for shared server context)

```tsx
// Server Component (default in App Router)
async function ProductPage({ id }) {
  const product = await db.product.findUnique({ where: { id } });
  const reviews = await db.reviews.findMany({ where: { productId: id } });

  return (
    <div>
      <h1>{product.name}</h1>
      <ProductDetails product={product} />
      <ReviewList reviews={reviews} />
      <AddToCartButton productId={id} /> {/* Client Component */}
    </div>
  );
}
```

---

## Client Components

Mark with `'use client'` directive. Run on client (and pre-render on server).

**Can:**

- Use all hooks
- Use browser APIs
- Add event handlers
- Use context

```tsx
"use client";

import { useState } from "react";

export function AddToCartButton({ productId }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      onClick={async () => {
        setIsPending(true);
        await addToCart(productId);
        setIsPending(false);
      }}
      disabled={isPending}
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

---

## Server Actions

Functions that run on server, callable from client. Mark with `'use server'`.

### Defining Server Actions

**In separate file:**

```tsx
// actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  await db.post.create({ data: { title } });
  revalidatePath("/posts");
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath("/posts");
}
```

**Inline (in Server Component):**

```tsx
// Server Component
async function PostForm() {
  async function create(formData: FormData) {
    "use server";
    await db.post.create({ data: { title: formData.get("title") } });
    revalidatePath("/posts");
  }

  return (
    <form action={create}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Using in Client Components

```tsx
"use client";

import { createPost } from "./actions";
import { useActionState } from "react";

export function PostForm() {
  const [error, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const result = await createPost(formData);
      if (result.error) return result.error;
      return null;
    },
    null,
  );

  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### With useOptimistic

```tsx
"use client";

import { addTodo } from "./actions";
import { useOptimistic, useRef } from "react";

export function TodoList({ todos }) {
  const formRef = useRef();
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }],
  );

  async function formAction(formData) {
    const title = formData.get("title");
    addOptimistic({ id: Date.now(), title });
    formRef.current.reset();
    await addTodo(formData);
  }

  return (
    <>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>
      <form action={formAction} ref={formRef}>
        <input name="title" />
        <button>Add</button>
      </form>
    </>
  );
}
```

---

## Directives

### `'use client'`

Marks entry point to Client Components. All components imported by it are also client.

```tsx
"use client"; // Must be at top of file

import { useState } from "react";
import { ChildComponent } from "./Child"; // Also becomes client

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Rules:**

- First line of file (before imports)
- All child imports become client components
- Can still receive Server Components as children via props

### `'use server'`

Marks functions as Server Actions.

```tsx
// Entire file
"use server";

export async function action1() {}
export async function action2() {}
```

```tsx
// Single function (inside Server Component)
async function Component() {
  async function action() {
    "use server";
    // runs on server
  }
}
```

**Rules:**

- For file: first line, makes all exports Server Actions
- For function: first line of function body
- Can only be in Server Components or separate files

---

## Patterns

### Composition: Server + Client

```tsx
// Server Component
async function Dashboard() {
  const data = await fetchDashboardData();

  return (
    <div>
      <ServerRenderedStats data={data} />
      <InteractiveChart data={data} /> {/* 'use client' */}
    </div>
  );
}
```

### Pass Server Components as Children

```tsx
// Server Component
export default function Layout({ children }) {
  return (
    <ClientSidebar>
      {" "}
      {/* 'use client' */}
      {children} {/* Can be Server Components */}
    </ClientSidebar>
  );
}
```

### Server Action with Validation

```tsx
"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signup(formData: FormData) {
  const result = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  await db.user.create({ data: result.data });
  redirect("/dashboard");
}
```

### Server Action with Revalidation

```tsx
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({
    where: { id },
    data: { title: formData.get("title") },
  });

  revalidatePath("/posts"); // Revalidate path
  revalidatePath(`/posts/${id}`); // Revalidate specific page
  revalidateTag("posts"); // Revalidate by cache tag
}
```

### Bound Arguments

```tsx
// Server Component
async function PostList() {
  const posts = await getPosts();

  return posts.map((post) => (
    <form action={deletePost.bind(null, post.id)}>
      <span>{post.title}</span>
      <button>Delete</button>
    </form>
  ));
}

// actions.ts
("use server");

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath("/posts");
}
```

### Error Handling

```tsx
"use server";

export async function createItem(formData: FormData) {
  try {
    const item = await db.item.create({
      data: { name: formData.get("name") },
    });
    return { success: true, item };
  } catch (error) {
    if (error.code === "P2002") {
      return { error: "Item already exists" };
    }
    return { error: "Something went wrong" };
  }
}
```

### With useFormStatus

```tsx
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

export function Form({ action }) {
  return (
    <form action={action}>
      <input name="title" />
      <SubmitButton />
    </form>
  );
}
```
