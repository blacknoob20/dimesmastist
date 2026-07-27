import { NavLink } from 'react-router-dom';

const links = [
    { name: 'Catálogo', path: '/home' },
    { name: 'Registrar', path: '/coins' },
    { name: 'Colecciones', path: '/collections' },
    { name: 'Favoritos', path: '/favorites' },
    { name: 'Acerca', path: '/about' },
];

export const Navbar = () => {
    return (
        <nav className="bg-brand-surface border-b border-brand-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6 h-10 text-sm">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className="relative"
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`transition-colors duration-150 ${isActive ? 'text-brand-text font-medium' : 'text-brand-muted hover:text-brand-text'}`}>
                                        {link.name}
                                    </span>
                                    {isActive && (
                                        <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-brand-accent rounded-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    )
}
