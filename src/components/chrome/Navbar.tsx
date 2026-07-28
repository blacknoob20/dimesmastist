import { useLocation, Link } from 'wouter-preact'
import type { NavItem } from '@/types/nav'
import { classNames } from '@/helpers/classNames'

const links: readonly NavItem[] = [
  { name: 'Catálogo', path: '/home' },
  { name: 'Registrar', path: '/coins' },
  { name: 'Colecciones', path: '/collections' },
  { name: 'Favoritos', path: '/favorites' },
  { name: 'Acerca', path: '/about' },
]

export const Navbar = () => {
  const [location] = useLocation()

  return (
    <nav class="bg-brand-surface border-b border-brand-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-6 h-10 text-sm">
          {links.map((link) => {
            const isActive = location === link.path || (link.path !== '/' && location.startsWith(link.path))
            return (
              <Link
                key={link.path}
                to={link.path}
                class="relative"
              >
                <span class={classNames(
                  'transition-colors duration-150',
                  isActive ? 'text-brand-text font-medium' : 'text-brand-muted hover:text-brand-text'
                )}>
                  {link.name}
                </span>
                {isActive && (
                  <span class="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-brand-accent rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
