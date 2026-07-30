import { ComponentChildren, createContext, h } from 'preact'
import { useContext, useEffect, useRef } from 'preact/hooks'
import { useLocation } from 'wouter-preact'

interface VTContextValue {
  ref: { current: HTMLDivElement | null }
}

const ViewTransitionContext = createContext<VTContextValue>({ ref: { current: null } })

export const useViewTransition = () => useContext(ViewTransitionContext)

export const ViewTransitionProvider = ({ children }: { children: ComponentChildren }) => {
  const [location] = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = document.documentElement
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        el.dataset.route = location
      })
    } else {
      el.dataset.route = location
    }
  }, [location])

  return (
    <ViewTransitionContext.Provider value={{ ref }}>
      {children}
    </ViewTransitionContext.Provider>
  )
}
