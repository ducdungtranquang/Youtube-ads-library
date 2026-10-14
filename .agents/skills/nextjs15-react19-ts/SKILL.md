---
name: nextjs15-react19-ts
description: Standards, architecture patterns, and conventions for Next.js 15 (App Router), React 19, TypeScript 5 (Strict Mode), and Tailwind CSS v4. Use whenever creating, reviewing, or refactoring Next.js 15 pages, layouts, route handlers, server actions, React 19 hooks, and components.
---

# Next.js 15 + React 19 + TypeScript Standards & Best Practices

Tailored specifically for Next.js 15.2+, React 19, TypeScript 5 (Strict Mode), and Tailwind CSS v4.

---

## 1. Next.js 15 App Router Breaking Changes & Core Rules

### 1.1 Async `params` and `searchParams`
In Next.js 15, `params` and `searchParams` in pages, layouts, and route handlers are **Promises** and MUST be awaited.

```typescript
// ✅ DO: Always type params and searchParams as Promises and await them
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { query, page } = await searchParams;

  return <div>Slug: {slug}</div>;
}

// ❌ DON'T: Access synchronously (will fail or cause runtime warnings in Next.js 15)
export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug; // ❌ ERROR in Next.js 15
}
```

For Route Handlers (`app/api/.../route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json({ id });
}
```

### 1.2 Async `cookies()` and `headers()`
`cookies()`, `headers()`, and `draftMode()` from `'next/headers'` are now async and must be awaited.

```typescript
// ✅ DO
import { cookies, headers } from 'next/headers';

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('sb-token')?.value ?? null;
}
```

### 1.3 Fetch & Route Caching Defaults
- Next.js 15 **does not** cache `fetch` requests by default (`cache: 'no-store'` is the default).
- For static or ISR caching, explicitly specify:
  ```typescript
  // Static cached
  const res = await fetch('https://api.example.com/data', { cache: 'force-cache' });
  
  // Revalidated (ISR)
  const res = await fetch('https://api.example.com/data', { next: { revalidate: 3600 } });
  ```
- Route handlers default to dynamic/uncached. To force dynamic: `export const dynamic = 'force-dynamic';`.

### 1.4 Background Non-blocking Tasks (`after`)
Use `after()` from `'next/server'` instead of blocking the user response for fire-and-forget tasks (analytics, logging, cache warmup):

```typescript
import { after } from 'next/server';

export async function POST(req: Request) {
  // Process request
  const data = await req.json();

  after(async () => {
    // Non-blocking background operation
    await logAnalytics(data);
  });

  return Response.json({ success: true });
}
```

---

## 2. React 19 Patterns & Modern Hooks

### 2.1 Ref as a Prop (No `forwardRef`)
In React 19, `ref` can be passed directly as a standard prop to function components:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  variant?: 'primary' | 'secondary';
}

export function Button({ ref, variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button ref={ref} className={variant} {...props}>
      {children}
    </button>
  );
}
```

### 2.2 Server Actions with `useActionState`
Replace legacy `useFormState` with `useActionState`:

```typescript
// app/actions/auth.ts
'use server';

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function updateProfile(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get('name') as string;
  if (!name) {
    return { success: false, error: 'Name is required' };
  }
  return { success: true };
}

// Client Component
'use client';
import { useActionState } from 'react';
import { updateProfile } from '@/app/actions/auth';

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction}>
      <input name="name" disabled={isPending} />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit" disabled={isPending}>Save</button>
    </form>
  );
}
```

### 2.3 Direct Context Usage
In React 19, render `<ThemeContext value={theme}>` directly without `.Provider`.

---

## 3. TypeScript & Clean Architecture Standards

### 3.1 Strict Typing Rules
1. **Never use `any`**:
   - Use `unknown` with type guards/narrowing.
   - Use Generics for reusable functions/components.
2. **`interface` over `type`** for open/extensible object structures (DTOs, component props, database models).
3. **Immutability**:
   - Always prefer `const`.
   - Never mutate state or arrays directly. Use spread `[...items]`, `.map()`, `.filter()`.

### 3.2 Three-Layer Separation of Concerns
1. **Data Layer (`@/lib`, `@/services`, `@/server`)**:
   - Handles database queries (Supabase, external APIs, Sanity).
   - Validates inputs using `zod`.
   - Pure async functions, decoupled from React UI.
2. **Business Logic Layer (`@/hooks`)**:
   - Custom React hooks containing state machines, calculations, client event listeners.
   - Reusable across multiple components.
3. **UI / Presentation Layer (`@/components`)**:
   - Pure or thin client components focused solely on rendering HTML/styling.
   - Receives data and callbacks via typed props.

---

## 4. Tailwind CSS v4 & Styling Guidelines

- The project uses `@tailwindcss/postcss` and Tailwind v4.
- Import standard Tailwind styles via `@import "tailwindcss";` in `globals.css`.
- Use `clsx` and `tailwind-merge` (via `@/lib/utils` `cn()`) to handle dynamic class compositions without specificity conflicts.
- Avoid inline styles; leverage Tailwind utilities and Radix UI data attributes (`data-[state=open]`).

---

## 5. Security & Error Handling

1. **Input Validation**: Validate every Server Action and Route Handler payload using Zod before querying the database.
2. **Error Boundaries**: Place `error.tsx` at route boundaries to handle server crashes gracefully.
3. **Safe Serialization**: Do not leak server-side secrets or sensitive database columns to Client Components.
