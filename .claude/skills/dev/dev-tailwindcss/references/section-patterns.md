# Section Component Patterns

Composite components that combine elements into page sections.

## Base Section Component

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from './container'
import { Eyebrow } from './eyebrow'
import { Subheading } from './subheading'
import { Text } from './text'

export function Section({
  eyebrow,
  headline,
  subheadline,
  cta,
  className,
  children,
  ...props
}: {
  eyebrow?: ReactNode
  headline?: ReactNode
  subheadline?: ReactNode
  cta?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className="flex flex-col gap-10 sm:gap-16">
        {headline && (
          <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-2">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <Subheading>{headline}</Subheading>
            </div>
            {subheadline && <Text className="text-pretty">{subheadline}</Text>}
            {cta}
          </div>
        )}
        <div>{children}</div>
      </Container>
    </section>
  )
}
```

## Hero Sections

### Hero Left Aligned with Demo

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { Text } from '../elements/text'

export function HeroLeftAlignedWithDemo({
  eyebrow,
  headline,
  subheadline,
  cta,
  demo,
  footer,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta?: ReactNode
  demo?: ReactNode
  footer?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          {eyebrow}
          <Heading className="max-w-4xl">{headline}</Heading>
          <Text size="lg" className="flex max-w-2xl flex-col gap-4">
            {subheadline}
          </Text>
          {cta}
        </div>
        {demo}
        {footer}
      </Container>
    </section>
  )
}
```

### Hero Centered with Demo

```tsx
export function HeroCenteredWithDemo({
  eyebrow,
  headline,
  subheadline,
  cta,
  demo,
  footer,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta?: ReactNode
  demo?: ReactNode
  footer?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className="flex flex-col gap-16">
        <div className="flex flex-col items-center gap-32">
          <div className="flex flex-col items-center gap-6">
            {eyebrow}
            <Heading className="max-w-5xl text-center">{headline}</Heading>
            <Text size="lg" className="flex max-w-3xl flex-col gap-4 text-center">
              {subheadline}
            </Text>
            {cta}
          </div>
          {demo}
        </div>
        {footer}
      </Container>
    </section>
  )
}
```

## Features Sections

### Features Three Column

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Section } from '../elements/section'

export function Feature({
  icon,
  headline,
  subheadline,
  className,
  ...props
}: {
  icon?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
} & ComponentProps<'div'>) {
  return (
    <div className={clsx('flex flex-col gap-2 text-sm/7', className)} {...props}>
      <div className="flex items-start gap-3 text-{name}-950 dark:text-white">
        {icon && <div className="flex size-3.25 h-lh items-center">{icon}</div>}
        <h3 className="font-semibold">{headline}</h3>
      </div>
      <div className="flex flex-col gap-4 text-{name}-700 dark:text-{name}-400">
        {subheadline}
      </div>
    </div>
  )
}

export function FeaturesThreeColumn({
  features,
  ...props
}: {
  features: ReactNode
} & Omit<ComponentProps<typeof Section>, 'children'>) {
  return (
    <Section {...props}>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {features}
      </div>
    </Section>
  )
}
```

## Pricing Sections

### Multi-Tier Pricing

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Section } from '../elements/section'
import { CheckmarkIcon } from '../icons/checkmark-icon'

export function Plan({
  name,
  price,
  period,
  subheadline,
  badge,
  features,
  cta,
  className,
}: {
  name: ReactNode
  price: ReactNode
  period?: ReactNode
  subheadline: ReactNode
  badge?: ReactNode
  features: ReactNode[]
  cta: ReactNode
} & ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'flex flex-col justify-between gap-6 rounded-xl p-6 sm:items-start',
        'bg-{name}-950/2.5 dark:bg-white/5',
        className,
      )}
    >
      <div className="self-stretch">
        <div className="flex items-center justify-between">
          {badge && (
            <div className="order-last inline-flex rounded-full px-2 text-xs/6 font-medium bg-{name}-950/10 text-{name}-950 dark:bg-white/10 dark:text-white">
              {badge}
            </div>
          )}
          <h3 className="text-2xl/8 tracking-tight text-{name}-950 dark:text-white">
            {name}
          </h3>
        </div>
        <p className="mt-1 inline-flex gap-1 text-base/7">
          <span className="text-{name}-950 dark:text-white">{price}</span>
          {period && <span className="text-{name}-500 dark:text-{name}-500">{period}</span>}
        </p>
        <div className="mt-4 flex flex-col gap-4 text-sm/6 text-{name}-700 dark:text-{name}-400">
          {subheadline}
        </div>
        <ul className="mt-4 space-y-2 text-sm/6 text-{name}-700 dark:text-{name}-400">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-4">
              <CheckmarkIcon className="h-lh shrink-0 stroke-{name}-950 dark:stroke-white" />
              <p>{feature}</p>
            </li>
          ))}
        </ul>
      </div>
      {cta}
    </div>
  )
}

export function PricingMultiTier({
  plans,
  ...props
}: {
  plans: ReactNode
} & ComponentProps<typeof Section>) {
  return (
    <Section {...props}>
      <div className="grid grid-cols-1 gap-2 sm:has-[>:nth-child(5)]:grid-cols-2 sm:max-lg:has-[>:last-child:nth-child(even)]:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:has-[>:nth-child(5)]:grid-flow-row lg:has-[>:nth-child(5)]:grid-cols-3">
        {plans}
      </div>
    </Section>
  )
}
```

## Testimonials

### Large Quote Testimonial

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'

export function TestimonialLargeQuote({
  quote,
  img,
  name,
  byline,
  className,
  ...props
}: {
  quote: ReactNode
  img: ReactNode
  name: ReactNode
  byline: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container>
        <figure className="text-{name}-950 dark:text-white">
          <blockquote className="mx-auto flex max-w-240 flex-col gap-4 text-center font-display text-[2rem]/12 tracking-tight text-pretty *:first:before:content-['"'] *:last:after:content-['"'] sm:text-5xl/16">
            {quote}
          </blockquote>
          <figcaption className="mt-16 flex flex-col items-center">
            <div className="flex size-12 overflow-hidden rounded-full outline -outline-offset-1 outline-black/5 *:size-full *:object-cover dark:outline-white/5">
              {img}
            </div>
            <p className="mt-4 text-center text-sm/6 font-semibold">{name}</p>
            <p className="text-center text-sm/6 text-{name}-700 dark:text-{name}-400">
              {byline}
            </p>
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}
```

### Three Column Testimonial Grid

```tsx
export function Testimonial({
  quote,
  img,
  name,
  byline,
  className,
  ...props
}: {
  quote: ReactNode
  img: ReactNode
  name: ReactNode
  byline: ReactNode
} & ComponentProps<'figure'>) {
  return (
    <figure
      className={clsx(
        'flex flex-col gap-6 rounded-xl p-6',
        'bg-{name}-950/2.5 dark:bg-white/5',
        className
      )}
      {...props}
    >
      <blockquote className="text-sm/7 text-{name}-700 dark:text-{name}-400">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <div className="flex size-10 overflow-hidden rounded-full outline -outline-offset-1 outline-black/5 *:size-full *:object-cover dark:outline-white/5">
          {img}
        </div>
        <div>
          <p className="text-sm/6 font-semibold text-{name}-950 dark:text-white">{name}</p>
          <p className="text-sm/6 text-{name}-700 dark:text-{name}-400">{byline}</p>
        </div>
      </figcaption>
    </figure>
  )
}

export function TestimonialThreeColumnGrid({
  children,
  ...props
}: ComponentProps<typeof Section>) {
  return (
    <Section {...props}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </Section>
  )
}
```

## FAQ Sections

### Accordion FAQs

```tsx
import { clsx } from 'clsx/lite'
import { type ComponentProps, type ReactNode, useId } from 'react'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import { MinusIcon } from '../icons/minus-icon'
import { PlusIcon } from '../icons/plus-icon'

export function Faq({
  id,
  question,
  answer,
  ...props
}: { question: ReactNode; answer: ReactNode } & ComponentProps<'div'>) {
  let autoId = useId()
  id = id || autoId

  return (
    <div id={id} {...props}>
      <button
        type="button"
        id={`${id}-question`}
        aria-expanded="false"
        aria-controls={`${id}-answer`}
        className="flex w-full items-start justify-between gap-6 py-4 text-left text-base/7 text-{name}-950 dark:text-white"
      >
        {question}
        <PlusIcon className="h-lh [button[aria-expanded=true]_&]:hidden" />
        <MinusIcon className="h-lh [button[aria-expanded=false]_&]:hidden" />
      </button>
      <div
        id={`${id}-answer`}
        hidden
        className="-mt-2 flex flex-col gap-2 pr-12 pb-4 text-sm/7 text-{name}-700 dark:text-{name}-400"
      >
        {answer}
      </div>
    </div>
  )
}

export function FAQsAccordion({
  headline,
  subheadline,
  className,
  children,
  ...props
}: {
  headline?: ReactNode
  subheadline?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 lg:max-w-5xl lg:px-10">
        <div className="flex flex-col gap-6">
          <Subheading>{headline}</Subheading>
          {subheadline && <Text className="flex flex-col gap-4 text-pretty">{subheadline}</Text>}
        </div>
        <div className="divide-y divide-{name}-950/10 border-y border-{name}-950/10 dark:divide-white/10 dark:border-white/10">
          {children}
        </div>
      </div>
    </section>
  )
}
```

## Footer Sections

### Footer with Link Categories

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'

export function FooterCategory({ title, children, ...props }: { title: ReactNode } & ComponentProps<'div'>) {
  return (
    <div {...props}>
      <h3>{title}</h3>
      <ul role="list" className="mt-2 flex flex-col gap-2">
        {children}
      </ul>
    </div>
  )
}

export function FooterLink({ href, className, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <li className={clsx('text-{name}-700 dark:text-{name}-400', className)}>
      <a href={href} {...props} />
    </li>
  )
}

export function FooterWithLinkCategories({
  links,
  fineprint,
  className,
  ...props
}: {
  links: ReactNode
  fineprint: ReactNode
} & ComponentProps<'footer'>) {
  return (
    <footer className={clsx('pt-16', className)} {...props}>
      <div className="bg-{name}-950/2.5 py-16 text-{name}-950 dark:bg-white/5 dark:text-white">
        <Container className="flex flex-col gap-16">
          <nav className="grid grid-cols-2 gap-6 text-sm/7 sm:has-[>:last-child:nth-child(3)]:grid-cols-3 sm:has-[>:nth-child(5)]:grid-cols-3 md:has-[>:last-child:nth-child(4)]:grid-cols-4 lg:has-[>:nth-child(5)]:grid-cols-5">
            {links}
          </nav>
          <div className="text-sm/7 text-{name}-600 dark:text-{name}-500">{fineprint}</div>
        </Container>
      </div>
    </footer>
  )
}
```

## Call to Action

### Simple CTA

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'

export function CallToActionSimple({
  headline,
  subheadline,
  cta,
  className,
  ...props
}: {
  headline: ReactNode
  subheadline?: ReactNode
  cta?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className="flex flex-col gap-6">
        <Subheading className="max-w-2xl">{headline}</Subheading>
        {subheadline && <Text className="max-w-2xl text-pretty">{subheadline}</Text>}
        {cta}
      </Container>
    </section>
  )
}
```

## Navbar

### Navbar with Centered Links

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'

export function NavbarLink({
  children,
  href,
  className,
  ...props
}: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'group inline-flex items-center justify-between gap-2',
        'text-3xl/10 font-medium lg:text-sm/7',
        'text-{name}-950 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export function NavbarLogo({ className, href, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return <a href={href} {...props} className={clsx('inline-flex items-stretch', className)} />
}

export function NavbarWithCenteredLinks({
  links,
  logo,
  actions,
  className,
  ...props
}: {
  links: ReactNode
  logo: ReactNode
  actions: ReactNode
} & ComponentProps<'header'>) {
  return (
    <header className={clsx('sticky top-0 z-10 bg-{name}-100 dark:bg-{name}-950', className)} {...props}>
      <style>{`:root { --scroll-padding-top: 5.25rem }`}</style>
      <nav>
        <div className="mx-auto flex h-(--scroll-padding-top) max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 items-center">{logo}</div>
          <div className="flex gap-8 max-lg:hidden">{links}</div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex shrink-0 items-center gap-5">{actions}</div>
            {/* Mobile menu button */}
            <button
              aria-label="Toggle menu"
              className="inline-flex rounded-full p-1.5 lg:hidden text-{name}-950 hover:bg-{name}-950/10 dark:text-white dark:hover:bg-white/10"
            >
              {/* Menu icon SVG */}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
```

## Screenshot Component (Decorative Wrapper)

```tsx
import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

const html = String.raw

const noisePattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  html`
    <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 100 100">
      <filter id="n">
        <feTurbulence type="turbulence" baseFrequency="1.4" numOctaves="1" seed="2" stitchTiles="stitch" result="n" />
        <feComponentTransfer result="g">
          <feFuncR type="linear" slope="4" intercept="1" />
          <feFuncG type="linear" slope="4" intercept="1" />
          <feFuncB type="linear" slope="4" intercept="1" />
        </feComponentTransfer>
        <feColorMatrix type="saturate" values="0" in="g" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  `.replace(/\s+/g, ' '),
)}")`

export function Wallpaper({
  children,
  color,
  className,
  ...props
}: { color: 'green' | 'blue' | 'purple' | 'brown' } & ComponentProps<'div'>) {
  return (
    <div
      data-color={color}
      className={clsx(
        'relative overflow-hidden bg-linear-to-b',
        'data-[color=green]:from-[#9ca88f] data-[color=green]:to-[#596352]',
        'data-[color=blue]:from-[#637c86] data-[color=blue]:to-[#778599]',
        'data-[color=purple]:from-[#7b627d] data-[color=purple]:to-[#8f6976]',
        'data-[color=brown]:from-[#8d7359] data-[color=brown]:to-[#765959]',
        // Dark variants
        'dark:data-[color=green]:from-[#333a2b] dark:data-[color=green]:to-[#26361b]',
        'dark:data-[color=blue]:from-[#243a42] dark:data-[color=blue]:to-[#232f40]',
        'dark:data-[color=purple]:from-[#412c42] dark:data-[color=purple]:to-[#3c1a26]',
        'dark:data-[color=brown]:from-[#382d23] dark:data-[color=brown]:to-[#3d2323]',
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay dark:opacity-25"
        style={{
          backgroundPosition: 'center',
          backgroundImage: noisePattern,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function Screenshot({
  children,
  wallpaper,
  placement,
  className,
  ...props
}: {
  wallpaper: 'green' | 'blue' | 'purple' | 'brown'
  placement: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right'
} & Omit<ComponentProps<'div'>, 'color'>) {
  return (
    <Wallpaper color={wallpaper} data-placement={placement} className={clsx('group', className)} {...props}>
      <div className="relative [--padding:min(10%,--spacing(16))] group-data-[placement=bottom]:px-(--padding) group-data-[placement=bottom]:pt-(--padding) ...">
        <div className="*:relative *:ring-1 *:ring-black/10 group-data-[placement=bottom]:*:rounded-t-sm ...">
          {children}
        </div>
      </div>
    </Wallpaper>
  )
}
```
