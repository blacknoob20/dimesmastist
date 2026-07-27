import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { classNames } from '../../helpers/classNames';

const menuButtonClasses = classNames(
    'max-w-xs',
    'rounded-full',
    'flex',
    'items-center',
    'text-sm',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-brand-accent',
    'ring-2',
    'ring-brand-border',
    'hover:ring-brand-accent',
    'transition-all'
);
const menuItemsClasses = classNames(
    'origin-top-right',
    'absolute',
    'right-0',
    'mt-2',
    'w-48',
    'rounded-md',
    'shadow-lg',
    'py-1',
    'bg-brand-surface',
    'ring-1',
    'ring-brand-border',
    'focus:outline-none'
);

export const Topbardropdown = ({ user, userNavigation }) => {
    return (
        <Menu as="div" className="ml-3 relative">
            <Menu.Button className={menuButtonClasses}>
                <span className="sr-only">Open user menu</span>
                <img
                    className="h-8 w-8 rounded-full"
                    src={user.imageUrl}
                    alt=""
                />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={menuItemsClasses}>
                    {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                            {({ active }) => (
                                <a
                                    href={item.href}
                                    className={
                                        classNames(
                                            active ? 'bg-brand-surface-secondary' : '',
                                            'block px-4 py-2 text-sm text-brand-text'
                                        )
                                    }
                                >
                                    {item.name}
                                </a>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
