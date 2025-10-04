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

    // گرفتن تاریخ امروز تا ۴ هفته آینده
    const getNextFourWeeks = () => {
        const today = moment();
        const dates = [];
        for (let i = 0; i < 28; i++) {
            dates.push(today.clone().add(i, "days").format("jYYYY/jMM/jDD"));
        }
        return dates;
    };

    const nextFourWeeks = getNextFourWeeks();
    const week1 = nextFourWeeks.slice(0, 7);
    const week2 = nextFourWeeks.slice(7, 14);
    const week3 = nextFourWeeks.slice(14, 21);
    const week4 = nextFourWeeks.slice(21, 28);

    // --- 🔑 تبدیل همه اعداد فارسی/عربی به انگلیسی
    const toEnglishDigits = (str) => {
        if (!str) return "";
        return str.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (d) =>
            "0123456789"[(d.charCodeAt(0) & 0xf)]
        );
    };

    // --- 🔑 نرمالایز تاریخ جلالی (تبدیل به yyyy/mm/dd)
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

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const from = moment().startOf("day").toISOString();
            const to = moment().add(28, "days").endOf("day").toISOString();
            const res = await fetch(`/api/admin/reservations?from=${from}&to=${to}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا در دریافت نوبت‌ها");
            setReservations(data.reservations);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

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

        if (reserved.length === 0) {
            return (
                <p className="text-gray-500 text-center py-3">
                    هیچ رزروی ثبت نشده
                </p>
            );
        }

        return (
            <div className="overflow-x-auto mt-3">
                <table className="w-full min-w-[700px] border-collapse text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-3">تاریخ</th>
                            <th className="border p-3">ساعت</th>
                            <th className="border p-3">نام</th>
                            <th className="border p-3">مدرسه</th>
                            <th className="border p-3">شماره تماس</th>
                            <th className="border p-3">سالن</th>
                            <th className="border p-3">مقطع</th>
                            <th className="border p-3">جنسیت</th>
                             <th className="border p-3">تعداد دانش آموزان</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reserved.map((r) => (
                            <tr
                                key={r._id}
                                className="hover:bg-gray-100 transition-colors"
                            >
                                <td className="border p-2">{normalizeJDate(r.jDate)}</td>
                                <td className="border p-2">{r.time}</td>
                                <td className="border p-2">{r.fullName}</td>
                                <td className="border p-2">{r.schoolName}</td>
                                <td className="border p-2">{toEnglishDigits(r.phone)}</td>
                                <td className="border p-2">{r.hall?.name || "نامشخص"}</td>
                                <td className="border p-2">{r.grade}</td>
                                <td className="border p-2">{r.gender === "male" ? "پسر" : r.gender === "female" ? "دختر" : ""}</td>
                                <td className="border p-2">{r.studentCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="text-black bg-gray-100 rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
                مدیریت نوبت‌ها
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">در حال بارگذاری...</p>
            ) : (
                <div className="space-y-4">
                    <details className="bg-white rounded-lg p-3 shadow-md">
                        <summary className="cursor-pointer font-semibold text-lg text-green-700">
                            📅 نوبت‌های هفته اول
                        </summary>
                        {renderReservedTable(week1)}
                    </details>

                    <details className="bg-white rounded-lg p-3 shadow-md">
                        <summary className="cursor-pointer font-semibold text-lg text-green-700">
                            📅 نوبت‌های هفته دوم
                        </summary>
                        {renderReservedTable(week2)}
                    </details>

                    <details className="bg-white rounded-lg p-3 shadow-md">
                        <summary className="cursor-pointer font-semibold text-lg text-green-700">
                            📅 نوبت‌های هفته سوم
                        </summary>
                        {renderReservedTable(week3)}
                    </details>

                    <details className="bg-white rounded-lg p-3 shadow-md">
                        <summary className="cursor-pointer font-semibold text-lg text-green-700">
                            📅 نوبت‌های هفته چهارم
                        </summary>
                        {renderReservedTable(week4)}
                    </details>
                </div>
            )}
        </div>
    );
}
