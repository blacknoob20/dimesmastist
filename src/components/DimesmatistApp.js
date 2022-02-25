import React from 'react';
import { Main } from './main/Main';
import { Topbar } from './topbar/Topbar';

export const DimesmatistApp = () => {
    return (
        <div className="container mx-auto relative">
            <Topbar />
            <header className="flex justify-between bg-white p-2">
                <div className='grid grid-rows-1 grid-flow-col gap-4'>
                    <div>01</div>
                    <div>02</div>
                    <div>03</div>
                </div>
                <form>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            name="btn_search"
                            id="btn_search"
                            className="rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Search"
                        />
                    </div>
                </form>
            </header>
            <Main />
            <footer className='bg-gray-100 mt-5 py-5 px-2 sticky bottom-0'>
                Footer
            </footer>
        </div>
    )
}
