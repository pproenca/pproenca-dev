import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Container({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={clsx('mx-auto w-full max-w-[680px] px-golden-3', className)}
      {...props}
    />
  )
}
