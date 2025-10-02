'use client';
import { useState } from 'react';
import { UserPlus, X } from 'lucide-react'; 

export default function NewUserButton({ onUserCreated }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'admin',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'خطا در ایجاد کاربر');
                return;
            }

            setShowModal(false);
            setForm({ username: '', password: '', role: 'admin' });
            onUserCreated?.();
        } catch (err) {
            setError('مشکل در ارتباط با سرور');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-[#00e0ca] text-black px-4 py-2 rounded-lg hover:bg-[#00cbb5] transition-colors"
            >
                <UserPlus className="w-4 h-4" />
                افزودن کاربر
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0a2d2d] rounded-2xl p-6 w-[360px] max-w-full mx-4 shadow-2xl text-black relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 left-4 text-black hover:text-gray-300"
                        >
                            <X />
                        </button>

                        <h2 className="text-xl font-bold text-center mb-6 border-b border-[#00e0ca] pb-2">
                            افزودن کاربر جدید
                        </h2>

                        <div className="space-y-4 text-right">
                            <div>
                                <label className="block mb-1 text-sm text-gray-300">نام کاربری</label>
                                <input
                                    type="text"
                                    placeholder="مثلاً ali123"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-300">رمز عبور اولیه</label>
                                <input
                                    type="password"
                                    placeholder="حداقل ۶ حرف"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-300">نقش</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                                >
                                    <option value="admin">ادمین</option>
                                </select>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}
                        </div>

                        <div className="flex justify-between mt-6 gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-2 rounded-lg bg-[#00e0ca] text-black font-semibold hover:bg-[#00cbb5] transition disabled:opacity-50"
                            >
                                {loading ? 'در حال ارسال...' : 'ثبت'}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
