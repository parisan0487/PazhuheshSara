import { getCurrentAdmin } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function AdminPage() {
    const admin = getCurrentAdmin();

    if (!admin) {
        redirect('/admin/login'); 
    }

    const links = [
        { href: '/admin/reservation', label: "🗓️نوبت ها" },
        { href: '/admin/hall', label: "🏟️سالن ها" },
        { href: '/admin/holiday', label: "🗓️مدیریت تعطیلات" },
        { href: '/admin/blog', label: '📰 مدیریت مقالات' },
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
                خوش اومدی 👋
            </h1>
            <p className="text-gray-400 mb-10 text-sm sm:text-base">
                اینجا می‌توانید مدیریت مقالات، نوبت ها و سالن ها را به آسانی انجام دهید
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center">
                {links.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="w-full flex flex-col items-center justify-center p-6 sm:p-6 bg-[#1a1a1a] rounded-2xl shadow-md hover:shadow-xl transition-all text-[#00e0ca] font-semibold text-lg sm:text-xl min-h-[110px]"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
