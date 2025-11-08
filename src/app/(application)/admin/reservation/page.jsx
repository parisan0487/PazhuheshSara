"use client";

import { useState, useEffect } from "react";
import moment from "moment-jalaali";
import toast from "react-hot-toast";

export default function AdminPanelModern() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // تبدیل اعداد فارسی به انگلیسی
    const toEnglishDigits = (str) => {
        if (!str) return "";
        return str.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (d) =>
            "0123456789"[(d.charCodeAt(0) & 0xf)]
        );
    };

    // نرمال‌سازی تاریخ
    const normalizeJDate = (jDate) => {
        const eng = toEnglishDigits(jDate);
        const parts = eng.split(/[\/\-]/);
        if (parts.length === 3) {
            const year = parts[0].padStart(4, "0");
            const month = parts[1].padStart(2, "0");
            const day = parts[2].padStart(2, "0");
            return `${year}/${month}/${day}`;
        }
        return eng;
    };

    // تولید ۱۲ هفته آینده
    const getNextTwelveWeeks = () => {
        const today = moment();
        const weeks = [];
        for (let w = 0; w < 12; w++) {
            const start = today.clone().add(w * 7, "days");
            const end = start.clone().add(6, "days");
            const dates = [];
            for (let i = 0; i < 7; i++) {
                dates.push(start.clone().add(i, "days").format("jYYYY/jMM/jDD"));
            }
            weeks.push({ start, end, dates });
        }
        return weeks;
    };

    const weeks = getNextTwelveWeeks();

    // گرفتن رزروها
    const fetchReservations = async () => {
        setLoading(true);
        try {
            const from = moment().startOf("day").toISOString();
            const to = moment().add(3, "months").endOf("day").toISOString();
            const res = await fetch(`/api/admin/reservations?from=${from}&to=${to}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا در دریافت نوبت‌ها");
            setReservations(data.reservations);
        } catch (err) {
            console.error("❌ Fetch reservations error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);



    const handleDelete = async (id) => {
        toast((t) => (
            <div className="text-center">
                <p className="font-semibold mb-2 text-gray-800">آیا از حذف رزرو مطمئن هستید؟</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setDeleting(id);
                            try {
                                const res = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || "خطا در حذف رزرو");
                                setReservations((prev) => prev.filter((r) => r._id !== id));
                                toast.success("رزرو با موفقیت حذف شد");
                            } catch (err) {
                                toast.error("❌ " + err.message);
                            } finally {
                                setDeleting(null);
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


    // جدول رزروهای هر هفته
    const renderReservedTable = (weekDates) => {
        const start = moment(weekDates[0], "jYYYY/jMM/jDD");
        const end = moment(weekDates[weekDates.length - 1], "jYYYY/jMM/jDD");

        const reserved = reservations.filter((r) => {
            const normalized = normalizeJDate(r.jDate);
            const jDate = moment(normalized, "jYYYY/jMM/jDD");
            return jDate.isBetween(
                start.clone().subtract(1, "day"),
                end.clone().add(1, "day")
            );
        });

        if (reserved.length === 0) return null;

        return (
            <div className="overflow-x-auto mt-3">
                <table className="w-full min-w-[950px] border-collapse text-center">
                    <thead>
                        <tr className="bg-[#c1ebe8]">
                            <th className="border p-3">تاریخ</th>
                            <th className="border p-3">ساعت</th>
                            <th className="border p-3">نام</th>
                            <th className="border p-3">مدرسه</th>
                            <th className="border p-3">شماره تماس</th>
                            <th className="border p-3">سالن</th>
                            <th className="border p-3">مقطع</th>
                            <th className="border p-3">جنسیت</th>
                            <th className="border p-3">تعداد</th>
                            <th className="border p-3">جلسه</th>
                            <th className="border p-3 w-[200px]">توضیحات</th>
                            <th className="border p-3">عکس</th>
                            <th className="border p-3">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reserved.map((r) => (
                            <tr key={r._id} className="hover:bg-gray-100 transition">
                                <td className="border p-2">{normalizeJDate(r.jDate)}</td>
                                <td className="border p-2">{r.time}</td>
                                <td className="border p-2">{r.fullName}</td>
                                <td className="border p-2">{r.schoolName}</td>
                                <td className="border p-2">{toEnglishDigits(r.phone)}</td>
                                <td className="border p-2">{r.hall?.name || "نامشخص"}</td>
                                <td className="border p-2">{r.grade}</td>
                                <td className="border p-2">
                                    {r.gender === "male" ? "پسر" : "دختر"}
                                </td>
                                <td className="border p-2">{r.studentCount}</td>
                                <td className="border p-2">{r.meeting || "-"}</td>
                                <td className="border p-2">
                                    <div className="whitespace-pre-line break-words text-sm text-gray-700 max-w-[250px]">
                                        {r.description || "-"}
                                    </div>
                                </td>
                                <td className="border p-2">
                                    {r.image ? (
                                        <a
                                            href={r.image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={r.image}
                                                alt="receipt"
                                                className="w-16 h-16 object-cover rounded-lg mx-auto"
                                            />
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleDelete(r._id)}
                                        disabled={deleting === r._id}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                                    >
                                        {deleting === r._id ? "در حال حذف..." : "حذف"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // رابط اصلی
    return (
        <div className="text-black bg-gray-100 rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
                مدیریت نوبت‌ها (۱۲ هفته آینده)
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">در حال بارگذاری...</p>
            ) : (
                <div className="space-y-4">
                    {weeks.map((week, i) => {
                        const content = renderReservedTable(week.dates);
                        if (!content) return null;
                        return (
                            <details
                                key={i}
                                className="bg-white rounded-lg p-3 shadow-md overflow-hidden"
                            >
                                <summary className="cursor-pointer font-semibold text-lg text-green-700">
                                    📅 هفته {i + 1} ({week.start.format("jYYYY/jMM/jDD")} تا{" "}
                                    {week.end.format("jYYYY/jMM/jDD")})
                                </summary>
                                {content}
                            </details>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
