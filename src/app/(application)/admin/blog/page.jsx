'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BlogsListPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogsToDelete, setBlogsToDelete] = useState(null);

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
    });

    if (loading) return <p className="text-gray-400 p-6 text-center">در حال بررسی ...</p>;

    const openDeleteModal = (slug) => {
        setBlogsToDelete(slug);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setBlogsToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/admin/blog/${blogsToDelete}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                setBlogs((prev) => prev.filter((a) => a.slug !== blogsToDelete));
                toast.success("مقاله با موفقیت حذف شد")
            } else {
                toast.error(data.message || 'خطا در حذف مقاله');
            }
        } catch (err) {
            console.error('خطا در حذف:', err);
            toast.error('مشکلی در حذف مقاله پیش آمد');
        } finally {
            cancelDelete();
        }
    };



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#00e0ca]">لیست مقالات</h1>
                <Link
                    href="/admin/blog/new"
                    className="bg-[#00e0ca] text-black px-5 py-2 rounded-lg font-semibold hover:bg-[#00c8b0] transition"
                >
                    + مقاله جدید
                </Link>
            </div>

            {loading ? (
                <p className="text-gray-400">در حال بارگذاری...</p>
            ) : blogs.length === 0 ? (
                <p className="text-gray-500">هیچ مقاله‌ای یافت نشد.</p>
            ) : (
                <ul className="space-y-4">
                    {blogs.map((blog) => (
                        <li
                            key={blog._id}
                            className="p-4 rounded-xl shadow-md bg-[#1a1a1a] flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-white">{blog.title}</h2>
                                <p className="text-sm text-gray-400">
                                    {new Date(blog.createdAt).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                            <div className="space-x-4 flex">
                                <Link
                                    href={`/admin/blog/edit/${blog.slug}`}
                                    className="text-[#00e0ca] hover:underline font-medium"
                                >
                                    ویرایش
                                </Link>

                                <button
                                    onClick={() => openDeleteModal(blog.slug)}
                                    className="text-red-500 hover:underline font-medium"
                                >
                                    حذف
                                </button>
                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center z-50">
                                        <div className="bg-[#062e2e] rounded-2xl p-8 w-[350px] max-w-full mx-4 shadow-2xl text-center">
                                            <p className="mb-8 text-xl font-semibold text-white">
                                                آیا از حذف مقاله مطمئن هستید؟
                                            </p>
                                            <div className="flex justify-center gap-6">
                                                <button
                                                    onClick={confirmDelete}
                                                    className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                                                    autoFocus
                                                >
                                                    حذف
                                                </button>
                                                <button
                                                    onClick={cancelDelete}
                                                    className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
