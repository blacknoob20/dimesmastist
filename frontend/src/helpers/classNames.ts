export const classNames = (...classes: (string | boolean | null | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}
