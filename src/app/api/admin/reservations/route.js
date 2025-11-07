import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/reservation";
import Hall from "@/models/hall";
import Holiday from "@/models/holiday";
import moment from "moment-jalaali";
import "moment-timezone";

// ✅ تنظیمات اولیه‌ی moment برای تقویم جلالی
moment.locale("fa");
if (moment.loadPersian) {
    moment.loadPersian({ usePersianDigits: false });
}

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

        const { fullName, schoolName, phone, jDate, time, hall, grade, gender, studentCount, meeting, description, image } = body;

        // بررسی فیلدهای ضروری
        if (!fullName || !schoolName || !phone || !jDate || !time || !hall || !grade || !gender || !studentCount || !meeting) {
            return NextResponse.json({ error: "تمام فیلدها الزامی هستند" }, { status: 400 });
        }

        // پیدا کردن سالن
        const hallData = await Hall.findById(hall);
        if (!hallData) {
            return NextResponse.json({ error: "سالن یافت نشد" }, { status: 404 });
        }

        // 🔹 تبدیل تاریخ شمسی به انگلیسی
        const normalizedDate = toEnglishDigits(jDate);

        // 🔹 ساخت moment شمسی و بررسی اعتبارش
        const m = moment(normalizedDate, "jYYYY/jMM/jDD", true);

        if (!m.isValid()) {
            return NextResponse.json({ error: "تاریخ وارد شده معتبر نیست" }, { status: 400 });
        }

        // 🔹 تبدیل به میلادی با تایم‌زون ایران
        const gDate = m.tz("Asia/Tehran").toDate();

        // 📅 تعیین روز هفته
        const dayOfWeek = m.tz("Asia/Tehran").locale("fa").format("dddd");

        if (!hallData.availableDays.includes(dayOfWeek)) {
            return NextResponse.json(
                { error: `سالن ${hallData.name} در روز ${dayOfWeek} باز نیست` },
                { status: 400 }
            );
        }


        // 👧👦 بررسی جنسیت روز بر اساس اولین رزرو آن روز
        const sameDayReservations = await Reservation.find({ jDate: normalizedDate });

        if (sameDayReservations.length > 0) {
            const dayGender = sameDayReservations[0].gender;
            if (gender !== dayGender) {
                return NextResponse.json(
                    { error: `این روز مخصوص ${dayGender === "female" ? "دختران" : "پسران"} است` },
                    { status: 400 }
                );
            }
        }

        // 🕐 بررسی رزرو تکراری
        const exist = await Reservation.findOne({ jDate: normalizedDate, time, hall });
        if (exist) {
            return NextResponse.json({ error: "این تایم قبلاً رزرو شده است" }, { status: 400 });
        }

        
        
        // 🗓 بررسی تعطیل رسمی بودن روز انتخاب‌شده
        console.log("📅 Checking holiday for jDate:", normalizedDate);

        const foundHoliday = await Holiday.findOne({ jDate: normalizedDate });
        console.log("🧾 Found holiday record:", foundHoliday);

        if (foundHoliday) {
            console.log("🚫 This day is a holiday:", foundHoliday.title);
            return NextResponse.json(
                { error: `❌ این تاریخ (${foundHoliday.title}) تعطیل رسمی است و امکان رزرو وجود ندارد.` },
                { status: 400 }
            );
        } else {
            console.log("✅ No holiday found for this date.");
        }



        // 🔢 اعتبارسنجی تعداد دانش‌آموزان
        const studentCountNumber = Number(studentCount);
        if (isNaN(studentCountNumber) || studentCountNumber < 1) {
            return NextResponse.json({ error: "تعداد دانش‌آموزان نامعتبر است" }, { status: 400 });
        }

        // ✅ ساخت و ذخیره رزرو
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
            meeting,
            description,
            image,
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
        let jDate = url.searchParams.get("jDate"); // تاریخ شمسی اگه داده شده باشه
        if (jDate) jDate = toEnglishDigits(jDate);

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
