'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            toast.success('ورود موفق بود');
            router.push('/admin');
        } else {
            toast.error(data.error || 'ورود ناموفق بود');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <form
                onSubmit={handleLogin}
                className="bg-[#1c1c1c] p-8 rounded-2xl shadow-xl w-80 space-y-5 border border-[#2c2c2c]"
            >
                <h2 className="text-2xl font-bold text-center text-white">ورود</h2>

                <input
                    type="text"
                    placeholder="نام کاربری"
                    className="w-full p-3 rounded-lg bg-[#2b2b2b] border border-[#444] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="رمز عبور"
                    className="w-full p-3 rounded-lg bg-[#2b2b2b] border border-[#444] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00e0ca] hover:bg-[#00e0ca]/90 transition-colors p-3 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loading ? 'در حال ورود...' : 'ورود'}
                </button>
            </form>
        </div>
    );
}
