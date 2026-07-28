import { TopbarBrand } from './TopbarBrand'
import { TopbarDropdown } from './TopbarDropdown'
import type { User, NavDropdownItem } from '@/types/nav'

const user: User = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const userNavigation: readonly NavDropdownItem[] = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

export const Topbar = () => (
  <header class="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <TopbarBrand />
        <div class="flex items-center gap-3">
          <TopbarDropdown user={user} items={userNavigation} />
        </div>
      </div>
    </div>
  </header>
)
