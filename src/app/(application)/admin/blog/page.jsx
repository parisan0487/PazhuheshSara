'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BlogsListPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/blog')
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'خطا در دریافت مقالات');
                }
                return res.json();
            })
            .then((data) => {
                setBlogs(data.blogs || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('خطا:', err.message);
                toast.error('خطا در دریافت مقالات');
                setLoading(false);
            });
    }, []); // 👈 فقط یک بار اجرا شود

    // 🗑️ هندل حذف با Toast تأیید
    const handleDelete = (slug, title) => {
        toast((t) => (
            <div className="text-center px-2">
                <p className="font-semibold mb-3 text-gray-800">
                    آیا از حذف مقاله مطمئن هستید؟
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id); // بستن toast
                            try {
                                const res = await fetch(`/api/admin/blog/${slug}`, {
                                    method: 'DELETE',
                                });
                                const data = await res.json();
                                if (!res.ok || !data.success)
                                    throw new Error(data.message || 'خطا در حذف مقاله');

                                setBlogs((prev) => prev.filter((a) => a.slug !== slug));
                                toast.success('✅ مقاله با موفقیت حذف شد');
                            } catch (err) {
                                toast.error('❌ ' + err.message);
                            }
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                        حذف شود
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-400 transition"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
        });
    };

    if (loading)
        return <p className="text-gray-400 p-6 text-center">در حال بررسی ...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-green-800">لیست مقالات</h1>
                <Link
                    href="/admin/blog/new"
                    className="bg-[#00e0ca] text-black px-5 py-2 rounded-lg font-semibold hover:bg-[#00c8b0] transition"
                >
                    + مقاله جدید
                </Link>
            </div>

            {blogs.length === 0 ? (
                <p className="text-gray-500">هیچ مقاله‌ای یافت نشد.</p>
            ) : (
                <ul className="space-y-4">
                    {blogs.map((blog) => (
                        <li
                            key={blog._id}
                            className="p-4 rounded-xl shadow-md bg-white flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-black">{blog.title}</h2>
                                <p className="text-sm text-gray-400">
                                    {new Date(blog.createdAt).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                            <div className="space-x-4 flex">
                                <Link
                                    href={`/admin/blog/edit/${blog.slug}`}
                                    className="text-green-800 hover:underline font-medium"
                                >
                                    ویرایش
                                </Link>

                                <button
                                    onClick={() => handleDelete(blog.slug, blog.title)}
                                    className="text-red-500 hover:underline font-medium"
                                >
                                    حذف
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
