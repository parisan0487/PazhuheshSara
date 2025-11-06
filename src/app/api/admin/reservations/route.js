import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Reservation from "@/models/reservation";
import Hall from "@/models/hall";
import moment from "moment";
import "moment-timezone";
import "moment-jalaali";


function toEnglishDigits(str) {
    if (!str) return str;
    return str
        .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584));
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const { fullName, schoolName, phone, jDate, time, hall, grade, gender, studentCount } = body;

        if (!fullName || !schoolName || !phone || !jDate || !time || !hall || !grade || !gender || !studentCount) {
            return NextResponse.json({ error: "تمام فیلدها الزامی هستند" }, { status: 400 });
        }

        const hallData = await Hall.findById(hall);
        if (!hallData) {
            return NextResponse.json({ error: "سالن یافت نشد" }, { status: 404 });
        }

        // 🔹 تاریخ شمسی به انگلیسی و بعد به میلادی
        const normalizedDate = toEnglishDigits(jDate);
        const gregorianDate = moment(normalizedDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");

        // 📅 تعیین روز هفته بر اساس میلادی در تایم‌زون ایران
        const dayOfWeek = moment
            .tz(gregorianDate, "YYYY-MM-DD", "Asia/Tehran")
            .locale("fa")
            .format("dddd");

        if (!hallData.availableDays.includes(dayOfWeek)) {
            return NextResponse.json(
                { error: `سالن ${hallData.name} در روز ${dayOfWeek} باز نیست` },
                { status: 400 }
            );
        }

        // 👧👦 بررسی هفته زوج/فرد برای جنسیت مجاز
        const weekNumber = moment(normalizedDate, "jYYYY/jMM/jDD").jWeek();
        const allowedGender = weekNumber % 2 === 0 ? "male" : "female";

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

        // ✅ gDate کاملاً معتبر
        const gDate = moment.tz(gregorianDate, "YYYY-MM-DD", "Asia/Tehran").toDate();

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