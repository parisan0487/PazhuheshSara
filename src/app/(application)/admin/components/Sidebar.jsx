'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
    { href: '/admin/reservation', label: "نوبت ها" },
    { href: '/admin/blog', label: 'مقالات' },
    { href: '/admin/change-password', label: "تغییر رمز" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <aside className="bg-gray-200 border border-gray-200 rounded-lg sm:h-96 h-36 shadow-sm w-full sm:w-64">
            <div className="flex flex-col p-4 gap-4 h-full relative">
                {/* Header */}
                <div className="flex justify-between items-center sm:block">
                    <Link href="/admin">
                        <h2 className="text-xl font-bold text-teal-600">پنل ادمین</h2>
                    </Link>

                    {/* Hamburger Menu - Only visible on mobile */}
                    <button
                        className="sm:hidden text-gray-600"
                        onClick={toggleMenu}
                        aria-label="toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav
                    className={`flex flex-col gap-3 transition-all duration-300 overflow-hidden sm:overflow-visible
        ${menuOpen ? 'max-h-screen mt-4' : 'max-h-0 sm:max-h-full'} sm:mt-6 sm:flex`}
                >
                    {links.map(({ href, label }) => {
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={`
                px-3 py-2 rounded-md text-center sm:text-right text-[15px] sm:text-lg font-medium
                transition-all
                ${isActive
                                        ? 'bg-teal-500 text-white shadow'
                                        : 'text-gray-700 hover:text-teal-600 hover:bg-gray-100'}
              `}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 text-[16px] sm:text-lg transition-colors mt-4 sm:mt-8 font-medium"
                >
                    خروج
                </button>
            </div>
        </aside>
    );
}
