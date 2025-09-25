"use client";
import { useState, useEffect } from "react";
import moment from "moment-jalaali";
import { CheckCircle, TimerResetIcon } from "lucide-react";

export default function AdminPanelModern() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    // لیست ساعت‌ها
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

    return (
        <div className="text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">نوبت ها</h1>

            {loading ? (
                <p className="text-center">در حال بارگذاری...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr>
                                <th className="border p-3 bg-gray-800">تاریخ</th>
                                <th className="border p-3 bg-gray-800">ساعت</th>
                                <th className="border p-3 bg-gray-800">وضعیت</th>
                                <th className="border p-3 bg-gray-800">نام</th>
                                <th className="border p-3 bg-gray-800">مدرسه</th>
                                <th className="border p-3 bg-gray-800">شماره تماس</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nextTwoWeeks.map((date) =>
                                times.map((time) => {
                                    const res = reservations.find(
                                        (r) => r.jDate === date && r.time === time
                                    );
                                    return (
                                        <tr key={date + time} className="hover:bg-gray-800 transition">
                                            <td className="border p-3">{date}</td>
                                            <td className="border p-3">{time}</td>
                                            {res ? (
                                                <>
                                                    <td className="border p-3 text-red-500 flex items-center justify-center gap-2 font-semibold">
                                                        <TimerResetIcon /> رزرو شده
                                                    </td>
                                                    <td className="border p-3">{res.fullName}</td>
                                                    <td className="border p-3">{res.schoolName}</td>
                                                    <td className="border p-3">{res.phone}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="border p-3 text-green-400 flex items-center justify-center gap-2 font-semibold">
                                                        <CheckCircle /> خالی
                                                    </td>
                                                    <td className="border p-3">-</td>
                                                    <td className="border p-3">-</td>
                                                    <td className="border p-3">-</td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
