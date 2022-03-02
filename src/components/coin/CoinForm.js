import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import { Fragment } from "react"
import { classNames } from "../../helpers/classNames"

export const CoinForm = () => {
    return (
        <form action="#" method="POST">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                        <label
                            htmlFor="txtValorFacial"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Pa&iacute;s
                        </label>
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                                    * Seleccionar *
                                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={
                                                        classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )
                                                    }
                                                >
                                                    Account settings
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                            <label
                                htmlFor="txtValorFacial"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Valor facial:
                            </label>
                            <div className="mt-1 flex rounded-md">
                                <span className={
                                    classNames(
                                        'inline-flex',
                                        'items-center',
                                        'px-3',
                                        'rounded-l-md',
                                        'border',
                                        'border-r-0',
                                        'border-gray-300',
                                        'bg-gray-50',
                                        'text-gray-500',
                                        'text-sm'
                                    )
                                }>
                                    $
                                </span>
                                <input
                                    type="text"
                                    name="txtValorFacial"
                                    id="txtValorFacial"
                                    className={
                                        classNames(
                                            'focus:ring-indigo-500',
                                            'focus:border-indigo-500',
                                            'flex-1',
                                            'block',
                                            'rounded-none',
                                            'rounded-r-md',
                                            'sm:text-sm',
                                            'border-gray-300'
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="txtSerie"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Año de circulación:
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="txtSerie"
                                id="txtSerie"
                                className={
                                    classNames(
                                        'focus:ring-indigo-500',
                                        'focus:border-indigo-500',
                                        'block',
                                        'rounded-md',
                                        'sm:text-sm',
                                        'border-gray-300'
                                    )
                                }
                                placeholder="yyyy"
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Anverso</label>
                            <div className="mt-1 flex items-center">
                                <span className="inline-block h-48 w-48 rounded-full overflow-hidden bg-gray-100">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                                <label
                                    htmlFor="fileAnverso"
                                    className={
                                        classNames(
                                            'ml-5',
                                            'bg-white',
                                            'py-2',
                                            'px-3',
                                            'border',
                                            'border-gray-300',
                                            'rounded-md',
                                            'shadow-sm',
                                            'text-sm',
                                            'leading-4',
                                            'font-medium',
                                            'text-gray-700',
                                            'hover:bg-gray-50',
                                            'focus:outline-none',
                                            'focus:ring-2',
                                            'focus:ring-offset-2',
                                            'focus:ring-indigo-500'
                                        )
                                    }
                                >
                                    <span>Change</span>
                                    <input
                                        id="fileAnverso"
                                        name="fileAnverso"
                                        type="file"
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Reverso</label>
                            <div className="mt-1 flex items-center">
                                <span className="inline-block h-48 w-48 rounded-full overflow-hidden bg-gray-100">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                                <label
                                    htmlFor="fileReverso"
                                    className={
                                        classNames(
                                            'ml-5',
                                            'bg-white',
                                            'py-2',
                                            'px-3',
                                            'border',
                                            'border-gray-300',
                                            'rounded-md',
                                            'shadow-sm',
                                            'text-sm',
                                            'leading-4',
                                            'font-medium',
                                            'text-gray-700',
                                            'hover:bg-gray-50',
                                            'focus:outline-none',
                                            'focus:ring-2',
                                            'focus:ring-offset-2',
                                            'focus:ring-indigo-500'
                                        )
                                    }
                                >
                                    <span>Change</span>
                                    <input
                                        id="fileReverso"
                                        name="fileReverso"
                                        type="file"
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        type="submit"
                        className={
                            classNames(
                                'inline-flex',
                                'justify-center',
                                'py-2',
                                'px-4',
                                'border',
                                'border-transparent',
                                'shadow-sm',
                                'text-sm',
                                'font-medium',
                                'rounded-md',
                                'text-white',
                                'bg-indigo-600',
                                'hover:bg-indigo-700',
                                'focus:outline-none',
                                'focus:ring-2',
                                'focus:ring-offset-2',
                                'focus:ring-indigo-500'
                            )
                        }
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}
