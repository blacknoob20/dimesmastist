import { Topbarbrand } from './Topbarbrand';
import { Topbardropdown } from './Topbardropdown';

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
];

export const Topbar = () => {
    return (
        <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Topbarbrand />
                    <div className="flex items-center gap-3">
                        <Topbardropdown user={user} userNavigation={userNavigation} />
                    </div>
                </div>
            </div>
        </header>
    );
};
