# Element Component Patterns

Core atomic components for TailwindCSS v4.1 themed applications.

## Dependencies

```bash
npm install clsx
```

Use `clsx/lite` for smaller bundle size:
```tsx
import { clsx } from 'clsx/lite'
```

## Container

The foundation for consistent page widths:

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Container({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx(
      'mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10', 
      className
    )} {...props}>
      {children}
    </div>
  )
}
```

## Typography Components

### Heading (h1 - Hero titles)

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Heading({
  children,
  color = 'dark/light',
  className,
  ...props
}: { color?: 'dark/light' | 'light' } & ComponentProps<'h1'>) {
  return (
    <h1
      className={clsx(
        'font-display text-5xl/12 tracking-tight text-balance sm:text-[5rem]/20',
        color === 'dark/light' && 'text-{name}-950 dark:text-white',
        color === 'light' && 'text-white',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
```

### Subheading (h2 - Section titles)

```tsx
import { clsx } from 'clsx/lite'
import { type ComponentProps } from 'react'

export function Subheading({ children, className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={clsx(
        'font-display text-[2rem]/10 tracking-tight text-pretty text-{name}-950 sm:text-5xl/14 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}
```

### Eyebrow (Label above headings)

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Eyebrow({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx(
      'text-sm/7 font-semibold text-{name}-700 dark:text-{name}-400', 
      className
    )} {...props}>
      {children}
    </div>
  )
}
```

### Text (Body text)

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Text({ 
  children, 
  className, 
  size = 'md', 
  ...props 
}: ComponentProps<'div'> & { size?: 'md' | 'lg' }) {
  return (
    <div
      className={clsx(
        size === 'md' && 'text-base/7',
        size === 'lg' && 'text-lg/8',
        'text-{name}-700 dark:text-{name}-400',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## Button Components

### Solid Button (Primary CTA)

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

const sizes = {
  md: 'px-3 py-1',
  lg: 'px-4 py-2',
}

export function Button({
  size = 'md',
  type = 'button',
  color = 'dark/light',
  className,
  ...props
}: {
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
        color === 'dark/light' &&
          'bg-{name}-950 text-white hover:bg-{name}-800 dark:bg-{name}-300 dark:text-{name}-950 dark:hover:bg-{name}-200',
        color === 'light' && 
          'bg-white text-{name}-950 hover:bg-{name}-100 dark:bg-{name}-100 dark:hover:bg-white',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function ButtonLink({
  size = 'md',
  color = 'dark/light',
  className,
  href,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
        color === 'dark/light' &&
          'bg-{name}-950 text-white hover:bg-{name}-800 dark:bg-{name}-300 dark:text-{name}-950 dark:hover:bg-{name}-200',
        color === 'light' && 
          'bg-white text-{name}-950 hover:bg-{name}-100 dark:bg-{name}-100 dark:hover:bg-white',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
```

### Soft Button (Secondary)

```tsx
export function SoftButton({
  size = 'md',
  type = 'button',
  className,
  ...props
}: {
  size?: keyof typeof sizes
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
        'bg-{name}-950/10 text-{name}-950 hover:bg-{name}-950/15',
        'dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function SoftButtonLink({
  size = 'md',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
        'bg-{name}-950/10 text-{name}-950 hover:bg-{name}-950/15',
        'dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
```

### Plain Button (Tertiary/Link-style)

```tsx
export function PlainButton({
  size = 'md',
  color = 'dark/light',
  type = 'button',
  className,
  ...props
}: {
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium',
        color === 'dark/light' && 
          'text-{name}-950 hover:bg-{name}-950/10 dark:text-white dark:hover:bg-white/10',
        color === 'light' && 
          'text-white hover:bg-white/15 dark:hover:bg-white/10',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function PlainButtonLink({
  size = 'md',
  color = 'dark/light',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium',
        color === 'dark/light' && 
          'text-{name}-950 hover:bg-{name}-950/10 dark:text-white dark:hover:bg-white/10',
        color === 'light' && 
          'text-white hover:bg-white/15 dark:hover:bg-white/10',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
```

## Link Component

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Link({
  href,
  className,
  ...props
}: {
  href: string
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex items-center gap-2 text-sm/7 font-medium text-{name}-950 dark:text-white', 
        className
      )}
      {...props}
    />
  )
}
```

## Announcement Badge

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { ChevronIcon } from '../icons/chevron-icon'

export function AnnouncementBadge({
  text,
  href,
  cta = 'Learn more',
  variant = 'normal',
  className,
  ...props
}: {
  text: ReactNode
  href: string
  cta?: ReactNode
  variant?: 'normal' | 'overlay'
} & Omit<ComponentProps<'a'>, 'href' | 'children'>) {
  return (
    <a
      href={href}
      {...props}
      data-variant={variant}
      className={clsx(
        'group relative inline-flex max-w-full gap-x-3 overflow-hidden rounded-md px-3.5 py-2 text-sm/6',
        'max-sm:flex-col sm:items-center sm:rounded-full sm:px-3 sm:py-0.5',
        variant === 'normal' &&
          'bg-{name}-950/5 text-{name}-950 hover:bg-{name}-950/10 dark:bg-white/5 dark:text-white dark:inset-ring-1 dark:inset-ring-white/5 dark:hover:bg-white/10',
        variant === 'overlay' &&
          'bg-{name}-950/15 text-white hover:bg-{name}-950/20 dark:bg-{name}-950/20 dark:hover:bg-{name}-950/25',
        className,
      )}
    >
      <span className="text-pretty sm:truncate">{text}</span>
      <span
        className={clsx(
          'h-3 w-px max-sm:hidden',
          variant === 'normal' && 'bg-{name}-950/20 dark:bg-white/10',
          variant === 'overlay' && 'bg-white/20',
        )}
      />
      <span
        className={clsx(
          'inline-flex shrink-0 items-center gap-2 font-semibold',
          variant === 'normal' && 'text-{name}-950 dark:text-white',
        )}
      >
        {cta} <ChevronIcon className="shrink-0" />
      </span>
    </a>
  )
}
```

## Main Wrapper

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Main({ children, className, ...props }: ComponentProps<'main'>) {
  return (
    <main className={clsx('isolate overflow-clip', className)} {...props}>
      {children}
    </main>
  )
}
```

## Document Content (Rich text styling)

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Document({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'space-y-4 text-sm/7 text-{name}-700 dark:text-{name}-400',
        // Links
        '[&_a]:font-semibold [&_a]:text-{name}-950 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-white',
        // Headings
        '[&_h2]:text-base/8 [&_h2]:font-medium [&_h2]:text-{name}-950 [&_h2]:not-first:mt-8 dark:[&_h2]:text-white',
        // Lists
        '[&_li]:pl-2 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_ul]:list-[square] [&_ul]:pl-6 [&_ul]:marker:text-{name}-400 dark:[&_ul]:marker:text-{name}-600',
        // Strong
        '[&_strong]:font-semibold [&_strong]:text-{name}-950 dark:[&_strong]:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## Icon Pattern

Standard 13x13 viewBox with stroke-based rendering:

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function CheckmarkIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      role="image"
      className={clsx('inline-block', className)}
      {...props}
    >
      <path d="M1.5 6.5L5.5 11.5L11.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      width={7}
      height={11}
      viewBox="0 0 7 11"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      role="image"
      className={clsx('inline-block', className)}
      {...props}
    >
      <path d="M1 1L6 5.5L1 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlusIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      role="image"
      className={clsx('inline-block', className)}
      {...props}
    >
      <path d="M6.5 0.5V12.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 6.5H0.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MinusIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      role="image"
      className={clsx('inline-block', className)}
      {...props}
    >
      <path d="M12.5 6.5H0.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowNarrowRightIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      width={16}
      height={9}
      viewBox="0 0 16 9"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      role="image"
      className={clsx('inline-block', className)}
      {...props}
    >
      <path d="M0.5 4.5L15.5 4.5M15.5 4.5L11 0.5M15.5 4.5L11 8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
```

## Alignment Pattern for Icons

Use `h-lh` to align icons with text line-height:

```tsx
<CheckmarkIcon className="h-lh shrink-0 stroke-{name}-950 dark:stroke-white" />
```

The `h-lh` utility makes the icon height match the current line-height, ensuring proper vertical alignment with adjacent text.
