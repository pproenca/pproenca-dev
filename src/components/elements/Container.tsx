import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Container({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'mx-auto w-full px-5 sm:px-6 md:max-w-2xl lg:max-w-[680px] lg:px-golden-3',
        className
      )}
      {...props}
    />
  )
}
