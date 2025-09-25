'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

    return (
        <div className="flex flex-col sm:flex-row min-h-screen text-white mt-10">
            {!isAuthPage && <Sidebar />}
            <div className="flex-1 p-4 sm:p-8">
                <main>{children}</main>
            </div>
        </div>
    );
}
