import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/reservation";
import Hall from "@/models/hall";
import moment from "moment-jalaali";
import "moment-timezone";

// ✅ تنظیمات اولیه‌ی moment برای تقویم جلالی
moment.locale("fa");
if (typeof moment.loadPersian === "function") {
    moment.loadPersian({ usePersianDigits: false });
}

function toEnglishDigits(str = "") {
    if (typeof str !== "string") return str;
    return str
        // اعداد فارسی
        .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
        // اعداد عربی
        .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
        .replace(/[^\d\/\-]/g, "");
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        console.log("📦 [Incoming Body]", body);

        const { fullName, schoolName, phone, jDate, time, hall, grade, gender, studentCount } = body;

        if (!fullName || !schoolName || !phone || !jDate || !time || !hall || !grade || !gender || !studentCount) {
            return NextResponse.json({ error: "تمام فیلدها الزامی هستند" }, { status: 400 });
        }

        const hallData = await Hall.findById(hall);
        if (!hallData) {
            return NextResponse.json({ error: "سالن یافت نشد" }, { status: 404 });
        }

        // 🔹 تبدیل تاریخ شمسی به انگلیسی
        const normalizedDate = toEnglishDigits(jDate);
        console.log("🗓 Raw jDate:", jDate);
        console.log("🔢 Normalized jDate:", normalizedDate);

        // 🔹 ساخت moment شمسی و بررسی اعتبارش
        const m = moment(normalizedDate, "jYYYY/jMM/jDD", true);
        console.log("📅 Parsed moment (isValid):", m.isValid(), "| format:", m.format("YYYY-MM-DD"));

        if (!m.isValid()) {
            return NextResponse.json({ error: "تاریخ وارد شده معتبر نیست" }, { status: 400 });
        }

        // 🔹 تبدیل به میلادی با تایم‌زون ایران
        const gDate = m.tz("Asia/Tehran").toDate();
        console.log("🕓 gDate (converted):", gDate);

        // 📅 تعیین روز هفته
        const dayOfWeek = m.tz("Asia/Tehran").locale("fa").format("dddd");
        console.log("📆 dayOfWeek:", dayOfWeek);

        if (!hallData.availableDays.includes(dayOfWeek)) {
            return NextResponse.json(
                { error: `سالن ${hallData.name} در روز ${dayOfWeek} باز نیست` },
                { status: 400 }
            );
        }

        // 👧👦 بررسی هفته زوج/فرد برای جنسیت مجاز
        const weekNumber = m.jWeek();
        const allowedGender = weekNumber % 2 === 0 ? "male" : "female";
        console.log("📈 WeekNumber:", weekNumber, "| AllowedGender:", allowedGender);

        if (gender !== allowedGender) {
            return NextResponse.json(
                { error: `این هفته فقط مخصوص ${allowedGender === "female" ? "دختران" : "پسران"} است` },
                { status: 400 }
            );
        }

        // 🕐 بررسی رزرو تکراری
        const exist = await Reservation.findOne({ jDate: normalizedDate, time, hall });
        if (exist) {
            return NextResponse.json({ error: "این تایم قبلاً رزرو شده است" }, { status: 400 });
        }

        const studentCountNumber = Number(studentCount);
        if (isNaN(studentCountNumber) || studentCountNumber < 1) {
            return NextResponse.json({ error: "تعداد دانش‌آموزان نامعتبر است" }, { status: 400 });
        }

        // ✅ ایجاد رزرو
        const newRes = await Reservation.create({
            fullName,
            schoolName,
            phone,
            jDate: normalizedDate,
            gDate,
            time,
            hall,
            grade,
            gender,
            studentCount: studentCountNumber,
        });

        console.log("✅ Reservation created:", newRes._id);
        return NextResponse.json({ message: "رزرو با موفقیت ثبت شد ✅", reservation: newRes });

    } catch (error) {
        console.error("❌ Reservation POST error:", error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const jDate = url.searchParams.get("jDate"); // تاریخ شمسی اگه داده شده باشه

        let query = {};
        if (jDate && jDate.trim()) {
            const from = moment(jDate, "jYYYY/jMM/jDD").startOf("day").toDate();
            const to = moment(jDate, "jYYYY/jMM/jDD").endOf("day").toDate();
            query = { gDate: { $gte: from, $lte: to } };
        }

        const reservations = await Reservation.find(query)
            .sort({ gDate: 1, time: 1 })
            .populate("hall", "name");

        return NextResponse.json({ reservations });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}