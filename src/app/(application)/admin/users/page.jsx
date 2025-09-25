'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import NewUserButton from '@/ui/NewUserButton';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [confirmDelete, setConfirmDelete] = useState(null);

    async function fetchUsers() {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
    }

    async function deleteUser(id) {
        try {
            await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            fetchUsers();
            toast.success('کاربر با موفقیت حذف شد');
        } catch (err) {
            toast.error('خطا در حذف کاربر');
        }
    }

    function startEdit(user) {
        setEditingUser(user);
        setFormData({ username: user.username, role: user.role });
    }

    async function submitEdit(e) {
        e.preventDefault();

        if (formData.password && formData.password.trim().length > 0 && formData.password.trim().length < 6) {
            toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
            return;
        }

        const body = {
            username: formData.username,
            role: formData.role,
        };

        if (formData.password && formData.password.trim() !== '') {
            body.password = formData.password;
        }

        try {
            await fetch(`/api/admin/users/${editingUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            toast.success('کاربر با موفقیت ویرایش شد');
            setEditingUser(null);
            setFormData({ username: '', password: '' });
            fetchUsers();
        } catch (err) {
            toast.error('خطا در ویرایش کاربر');
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
                <div>
                    <label className="mb-1 text-sm text-transparent select-none">افزودن کاربر</label>
                    <NewUserButton />
                </div>
            </div>


            <table className="w-full border border-gray-300 rounded-md bg-[#1e1e1e]">
                <thead className="bg-[#1a1616]">
                    <tr>
                        <th className="p-2 text-right">نام کاربری</th>
                        <th className="p-2 text-right">نقش</th>
                        <th className="p-2 text-right">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-t text-right">
                            <td className="p-2">{user.username}</td>
                            <td className="p-2">{user.role}</td>
                            <td className="p-2 flex gap-2">
                                <button onClick={() => startEdit(user)} className="text-blue-600">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => setConfirmDelete(user)} className="text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0a2d2d] rounded-2xl p-6 w-[360px] max-w-full mx-4 shadow-2xl text-white relative">
                        <button
                            onClick={() => setEditingUser(null)}
                            className="absolute top-4 left-4 text-white hover:text-gray-300"
                        >
                            <X />
                        </button>

                        <h2 className="text-xl font-bold text-center mb-6 border-b border-[#00e0ca] pb-2">
                            ویرایش کاربر
                        </h2>

                        <form onSubmit={submitEdit} className="space-y-4 text-right">
                            <div>
                                <label className="block mb-1 text-sm text-gray-300">نام کاربری</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-300">نقش</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                                >
                                    <option value="admin">ادمین</option>
                                </select>
                            </div>

                            <input
                                type="password"
                                value={formData.password || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 32) {
                                        setFormData({ ...formData, password: value });
                                    }
                                }}
                                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
                                placeholder="حداقل ۶ کاراکتر"
                            />



                            <div className="flex justify-between mt-6 gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-lg bg-[#00e0ca] text-black font-semibold hover:bg-[#00cbb5] transition"
                                >
                                    ذخیره
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#062e2e] rounded-2xl p-6 w-[320px] max-w-full mx-4 shadow-2xl text-center text-white relative">
                        <button
                            onClick={() => setConfirmDelete(null)}
                            className="absolute top-4 left-4 text-white hover:text-gray-600"
                        >
                            <X />
                        </button>

                        <h2 className="text-lg font-bold mb-4">حذف کاربر</h2>
                        <p className="mb-6">آیا از حذف <strong>{confirmDelete.username}</strong> مطمئن هستید؟</p>

                        <div className="flex justify-between gap-4">
                            <button
                                onClick={() => {
                                    deleteUser(confirmDelete._id);
                                    setConfirmDelete(null);
                                }}
                                className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                            >
                                حذف
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
