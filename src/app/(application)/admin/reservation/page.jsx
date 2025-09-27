"use client";
import { useState, useEffect } from "react";
import moment from "moment-jalaali";

export default function AdminPanelModern() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const times = [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
    ];

    // گرفتن تاریخ امروز تا دو هفته آینده
    const getNextTwoWeeks = () => {
        const today = moment();
        const dates = [];
        for (let i = 0; i < 14; i++) {
            dates.push(today.clone().add(i, "days").format("jYYYY/jMM/jDD"));
        }
        return dates;
    };

    const nextTwoWeeks = getNextTwoWeeks();
    const week1 = nextTwoWeeks.slice(0, 7);
    const week2 = nextTwoWeeks.slice(7, 14);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const from = moment().startOf("day").toISOString();
            const to = moment().add(14, "days").endOf("day").toISOString();
            const res = await fetch(`/api/admin/reservations?from=${from}&to=${to}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا در دریافت نوبت‌ها");
            setReservations(data.reservations);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    // فقط نوبت‌های رزرو شده
    const renderReservedTable = (dates) => {
        const reserved = reservations.filter((r) => dates.includes(r.jDate));
        if (reserved.length === 0) {
            return <p className="text-gray-400 text-center py-3">هیچ رزروی ثبت نشده</p>;
        }

        return (
            <div className="overflow-x-auto mt-3">
                <table className="w-full min-w-[600px] border-collapse text-center">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="border p-3">تاریخ</th>
                            <th className="border p-3">ساعت</th>
                            <th className="border p-3">نام</th>
                            <th className="border p-3">مدرسه</th>
                            <th className="border p-3">شماره تماس</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reserved.map((r) => (
                            <tr key={r._id} className="hover:bg-gray-700 transition-colors">
                                <td className="border p-2">{r.jDate}</td>
                                <td className="border p-2">{r.time}</td>
                                <td className="border p-2">{r.fullName}</td>
                                <td className="border p-2">{r.schoolName}</td>
                                <td className="border p-2">{r.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="text-white bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#00e0ca]">
                مدیریت نوبت‌ها
            </h1>

            {loading ? (
                <p className="text-center text-gray-300">در حال بارگذاری...</p>
            ) : (
                <div className="space-y-4">
                    <details className="bg-gray-900 rounded-lg p-3">
                        <summary className="cursor-pointer font-semibold text-lg text-[#00e0ca]">
                            📅 نوبت‌های هفته اول
                        </summary>
                        {renderReservedTable(week1)}
                    </details>

                    <details className="bg-gray-900 rounded-lg p-3">
                        <summary className="cursor-pointer font-semibold text-lg text-[#00e0ca]">
                            📅 نوبت‌های هفته دوم
                        </summary>
                        {renderReservedTable(week2)}
                    </details>
                </div>
            )}
        </div>
    );
}
