"use client"
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminHolidays() {
    const [holidays, setHolidays] = useState([]);
    const [jDate, setJDate] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/holidays");
            const data = await res.json();
            setHolidays(data.holidays || []);
        } catch (err) {
            toast.error("خطا در دریافت تعطیلات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!jDate) return toast.error("تاریخ شمسی را وارد کنید (مثال 1404/08/19)");
        try {
            const res = await fetch("/api/admin/holidays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jDate, title }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا");
            toast.success("تعطیلی اضافه شد");
            setJDate("");
            setTitle("");
            fetchHolidays();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id, jDate) => {
        toast((t) => (
            <div className="text-center">
                <p className="font-semibold mb-3 text-gray-800">آیا از حذف تعطیلی {jDate} مطمئن هستید؟</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id); // بستن toast
                            try {
                                const res = await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || "خطا در حذف تعطیلی");
                                setHolidays(prev => prev.filter(h => h._id !== id));
                                toast.success("تعطیلی با موفقیت حذف شد");
                            } catch (err) {
                                toast.error("❌ " + err.message);
                            }
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                        بله، حذف شود
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



    return (
    <div className="p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto">
        <h3 className="text-2xl font-extrabold mb-6 text-center text-green-800 tracking-wide">
            مدیریت تعطیلات رسمی
        </h3>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
                value={jDate}
                onChange={e => setJDate(e.target.value)}
                placeholder="تاریخ (مثال 1404/08/19)"
                className="border border-green-300 p-3 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow-sm"
            />
            <button className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 shadow-md transition transform hover:-translate-y-1">
                افزودن
            </button>
        </form>

        {loading ? (
            <p className="text-center text-gray-500 animate-pulse">در حال بارگذاری...</p>
        ) : (
            <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full border-collapse text-center min-w-[320px]">
                    <thead className="bg-green-200 text-green-900 font-semibold">
                        <tr>
                            <th className="p-3 border-b">تاریخ</th>
                            <th className="p-3 border-b">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holidays.length === 0 && (
                            <tr>
                                <td colSpan={2} className="p-6 text-gray-500">
                                    هیچ تعطیلی ثبت نشده
                                </td>
                            </tr>
                        )}
                        {holidays.map(h => (
                            <tr key={h._id} className="hover:bg-green-50 transition-colors">
                                <td className="p-3 border-b">{h.jDate}</td>
                                <td className="p-3 border-b">
                                    <button
                                        onClick={() => handleDelete(h._id, h.jDate)}
                                        className="text-red-600 hover:text-red-800 hover:underline font-medium transition"
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
}
