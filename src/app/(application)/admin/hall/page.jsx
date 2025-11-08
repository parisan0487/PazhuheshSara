'use client';

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function AdminHalls() {
    const [halls, setHalls] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [availableDays, setAvailableDays] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

    const fetchHalls = async () => {
        try {
            const res = await fetch("/api/admin/halls");
            const data = await res.json();
            setHalls(data.halls || []);
        } catch (err) {
            console.error(err);
            toast.error("خطا در دریافت سالن‌ها");
        }
    };

    useEffect(() => { fetchHalls(); }, []);

    const toggleDay = (day) => {
        if (availableDays.includes(day)) {
            setAvailableDays(availableDays.filter(d => d !== day));
        } else {
            setAvailableDays([...availableDays, day]);
        }
    };

    const handleSubmit = async () => {
        if (!name || availableDays.length === 0) {
            toast.error("نام سالن و روزهای باز بودن الزامی است");
            return;
        }

        const body = { name, description, availableDays };
        let method = "POST";
        if (editingId) { body.id = editingId; method = "PUT"; }

        try {
            setLoading(true);
            const res = await fetch("/api/admin/halls", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) toast.success(data.message);
            else toast.error(data.message || "خطا در عملیات");

            setName(""); setDescription(""); setAvailableDays([]); setEditingId(null);
            fetchHalls();
        } catch (err) {
            console.error(err);
            toast.error("خطا در عملیات");
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (hall) => {
        setEditingId(hall._id);
        setName(hall.name);
        setDescription(hall.description || "");
        setAvailableDays(hall.availableDays);
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="text-center px-2">
                <p className="font-semibold mb-3 text-gray-800">
                    آیا از حذف سالن مطمئن هستید؟
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                setLoading(true);
                                const res = await fetch(`/api/admin/halls?id=${id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (res.ok) toast.success(data.message || "سالن با موفقیت حذف شد");
                                else toast.error(data.message || "خطا در حذف سالن");
                                fetchHalls();
                            } catch (err) {
                                toast.error("❌ خطا در حذف سالن");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                         حذف شود
                    </button>
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => toast.dismiss(t.id)}
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
        <div className="p-6 bg-gray-50 rounded-2xl shadow-lg max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-green-800 text-center">مدیریت سالن‌ها</h2>

            {/* فرم اضافه کردن / ویرایش */}
            <div className="space-y-4 border border-green-300 p-5 rounded-xl shadow-sm bg-white">
                <input
                    type="text"
                    placeholder="نام سالن"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-green-200 p-3 rounded w-full focus:ring-2 focus:ring-green-300 focus:outline-none bg-gray-50"
                />

                <textarea
                    placeholder="توضیحات سالن (اختیاری)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-green-200 p-3 rounded w-full focus:ring-2 focus:ring-green-300 focus:outline-none bg-gray-50"
                />

                <div className="flex flex-wrap gap-2">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${availableDays.includes(day)
                                ? "bg-green-400 text-white shadow-md"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold transition ${editingId
                        ? "bg-[#00e0ca] hover:bg-green-400 text-white"
                        : "bg-[#00e0ca] hover:bg-green-400 text-white"
                        }`}
                >
                    {loading ? "در حال انجام..." : editingId ? "ویرایش سالن" : "اضافه کردن سالن"}
                </button>
            </div>

            {/* لیست سالن‌ها */}
            <div className="space-y-3">
                {halls.map(hall => (
                    <div key={hall._id} className="flex justify-between items-center border border-green-200 rounded-lg p-4 shadow-sm bg-white">
                        <div>
                            <span className="font-semibold text-green-800">{hall.name}</span> - روزهای باز: {hall.availableDays.join(", ")}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => startEdit(hall)}
                                className="text-green-800 hover:underline font-medium"
                            >
                                ویرایش
                            </button>
                            <button
                                onClick={() => handleDelete(hall._id)}
                                className="text-red-600 hover:text-red-800 hover:underline font-medium transition"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                ))}
                {halls.length === 0 && <p className="text-gray-500 text-center py-6">هیچ سالنی ثبت نشده است</p>}
            </div>
        </div>
    );
}
