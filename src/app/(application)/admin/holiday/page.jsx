"use client";
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

    useEffect(() => { fetchHolidays(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!jDate) return toast.error("لطفا تاریخ شمسی را وارد کنید (مثال 1404/08/19)");
        try {
            const res = await fetch("/api/admin/holidays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jDate, title }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا");
            toast.success("تعطیلی اضافه شد");
            setJDate(""); setTitle("");
            fetchHolidays();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("آیا مطمئن هستید؟")) return;
        try {
            const res = await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا");
            toast.success("حذف شد");
            setHolidays(prev => prev.filter(h => h._id !== id));
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">مدیریت تعطیلات رسمی</h3>

            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input value={jDate} onChange={e => setJDate(e.target.value)}
                    placeholder="تاریخ شمسی (مثال 1404/08/19)" className="border p-2 rounded w-48" />
                <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="عنوان (مثلاً عید قربان)" className="border p-2 rounded flex-1" />
                <button className="bg-green-600 text-white px-4 rounded">افزودن</button>
            </form>

            {loading ? <p>درحال بارگذاری...</p> : (
                <table className="w-full text-sm">
                    <thead><tr><th>تاریخ</th><th>عنوان</th><th></th></tr></thead>
                    <tbody>
                        {holidays.map(h => (
                            <tr key={h._id} className="border-t">
                                <td className="p-2">{h.jDate}</td>
                                <td className="p-2">{h.title}</td>
                                <td className="p-2 text-right">
                                    <button onClick={() => handleDelete(h._id)} className="text-red-600">حذف</button>
                                </td>
                            </tr>
                        ))}
                        {holidays.length === 0 && <tr><td colSpan={3} className="p-3 text-center">تعطیلی ثبت نشده</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
}
