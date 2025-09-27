'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isAuthPage = pathname === '/admin/login';

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);

            // فقط اگه صفحه لاگین نیست ری‌دایرکت کن
            if (!isAuthPage) {
                router.replace('/admin/login');
            }
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <div className="text-center mt-20">در حال بارگذاری...</div>;
    }

    return (
        <div className="flex flex-col sm:flex-row min-h-screen text-white mt-10">
            {!isAuthPage && isAuthenticated && <Sidebar />}
            <div className="flex-1 p-4 sm:p-8">
                <main>{children}</main>
            </div>
        </div>
    );
}
