import type { ComponentChildren } from 'preact'

interface TransitionProps {
  show: boolean
  children: ComponentChildren
  enter?: string
  leave?: string
}

export const Transition = ({ show, children, enter = 'transition-opacity duration-100', leave = 'transition-opacity duration-75' }: TransitionProps) => {
  if (!show) return null
  return (
    <div class={`${enter}`}>
      {children}
    </div>
  )
}
