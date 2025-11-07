// app/api/admin/holidays/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Holiday from "@/models/holiday";
import moment from "moment-jalaali";
import "moment-timezone";

moment.loadPersian({ usePersianDigits: false });

function toEnglishDigits(str) {
    if (!str) return str;
    return str
        .replace(/[\u06F0-\u06F9]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/[\u0660-\u0669]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));
}

// 📅 گرفتن لیست تعطیلات
export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const jMonth = url.searchParams.get("jMonth"); // optional filter like 1404/10

        const filter = jMonth ? { jDate: { $regex: `^${toEnglishDigits(jMonth)}` } } : {};
        const holidays = await Holiday.find(filter).sort({ gDate: 1 });

        return NextResponse.json({ holidays });
    } catch (err) {
        console.error("❌ GET /admin/holidays error:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}

// 🆕 افزودن تعطیل جدید
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const rawDate = body.jDate;

        // تبدیل اعداد فارسی به انگلیسی
        const normalizedDate = toEnglishDigits(rawDate).trim();

        // جداسازی و اطمینان از صحت فرمت
        const parts = normalizedDate.split(/[\/\-]/).map((p) => p.trim());
        let year = parts[0],
            month = parts[1],
            day = parts[2];

        if (!year || year.length < 3) {
            console.warn("⚠️ Year seems wrong:", year);
            throw new Error("فرمت تاریخ نادرست است. مثلاً 1404/10/22");
        }

        const jDate = `${year.padStart(4, "0")}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;

        // 🗓 تبدیل به میلادی (gDate)
        const m = moment(jDate, "jYYYY/jMM/jDD");
        if (!m.isValid()) {
            throw new Error("تاریخ شمسی نامعتبر است");
        }

        // ⚠️ بررسی اینکه تاریخ از امروز عقب‌تر نباشد
        const today = moment().startOf("day"); // امروز
        const selected = m.startOf("day"); // تاریخ انتخابی
        if (selected.isBefore(today)) {
            return NextResponse.json({ error: "امکان ثبت تعطیلی برای تاریخ‌های گذشته وجود ندارد." }, { status: 400 });
        }


        // ✅ ایجاد رکورد تعطیلی
        const newHoliday = await Holiday.create({
            title: body.title || "تعطیل رسمی",
            jDate,
        });

        return NextResponse.json({ success: true, holiday: newHoliday });
    } catch (err) {
        console.error("❌ Holiday POST error:", err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}
