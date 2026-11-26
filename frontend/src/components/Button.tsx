import type { ComponentPropsWithoutRef } from 'react'

type ButtonProps = ComponentPropsWithoutRef<'button'>

const estilosBase = 'text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer'

export function Button({ type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={className ? `${estilosBase} ${className}` : estilosBase}
    />
  )
}
