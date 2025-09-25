'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        if (!currentPassword) {
            toast.error('لطفاً رمز عبور فعلی را وارد کنید.');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('رمز عبور جدید باید حداقل 6 کاراکتر باشد.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('رمز عبور جدید و تکرار آن یکسان نیستند.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'خطا در تغییر رمز عبور');
                return;
            }

            toast.success('رمز عبور با موفقیت تغییر یافت.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error('مشکلی پیش آمده. لطفاً دوباره تلاش کنید.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl shadow-lg bg-[#1a1a1a] text-white border border-gray-700">
            <h1 className="text-2xl font-bold mb-6 text-center border-b border-[#00e0ca] pb-2">
                تغییر رمز عبور
            </h1>

            <div className="space-y-5 text-right">
                <div>
                    <label className="block text-sm text-gray-300 mb-1">رمز عبور فعلی</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">رمز عبور جدید</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">تکرار رمز عبور جدید</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                    />
                </div>

                <button
                    onClick={handleChange}
                    disabled={loading}
                    className="w-full py-2 bg-[#00e0ca] text-black font-semibold rounded-lg hover:bg-[#00cbb5] transition-all disabled:opacity-50"
                >
                    {loading ? 'در حال تغییر...' : 'تغییر رمز'}
                </button>
            </div>
        </div>
    );
}
