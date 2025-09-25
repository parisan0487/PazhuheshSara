'use client';

import Footer from '@/components/shared/footer/Footer';
import Navbar from '@/components/shared/navigation/Navbar';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div>
            <Navbar />
            <div className="h-screen flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-5xl font-bold text-[#40E0D0] mb-4">404</h1>
                <p className="text-lg text-gray-700 mb-6">صفحه‌ای که دنبال آن هستید پیدا نشد.</p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-[#40E0D0] hover:bg-[#2cc7ba] text-white px-6 py-2 rounded-full transition"
                >
                    بازگشت به خانه
                </button>
            </div>
            <Footer />
        </div>
    );
}
