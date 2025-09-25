import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Reservation from "@/models/reservation";
import moment from "moment-jalaali";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const { fullName, schoolName, phone, jDate, gDate, time } = body;

        if (!fullName || !schoolName || !phone || !jDate || !gDate || !time) {
            return NextResponse.json({ error: "تمام فیلدها الزامی هستند" }, { status: 400 });
        }

        // بررسی اینکه این تاریخ+ساعت قبلاً پر نشده
        const exist = await Reservation.findOne({ jDate, time });
        if (exist) {
            return NextResponse.json({ error: "این تایم قبلا رزرو شده" }, { status: 400 });
        }

        // ذخیره رزرو
        const newRes = await Reservation.create({
            fullName,
            schoolName,
            phone,
            jDate,
            gDate: new Date(gDate), // تاریخ میلادی برای مرتب‌سازی
            time,
        });

        return NextResponse.json({ message: "رزرو با موفقیت ثبت شد", reservation: newRes });
    } catch (error) {
        console.error(error);
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

        const reservations = await Reservation.find(query).sort({ gDate: 1, time: 1 });

        return NextResponse.json({ reservations });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}