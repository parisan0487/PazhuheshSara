// app/api/admin/holidays/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Holiday from "@/models/holiday";
import { toEnglishDigits, jalaaliToGDateStartOfDay } from "@/lib/dateHelpers";

export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        // optional query: month (jYYYY/jMM) or from/to (ISO)
        const jMonth = url.searchParams.get("jMonth"); // e.g. "1404/08"
        let filter = {};
        if (jMonth) {
            // filter by jDate prefix
            filter.jDate = { $regex: `^${toEnglishDigits(jMonth)}` };
        }
        const holidays = await Holiday.find(filter).sort({ gDate: 1 });
        return NextResponse.json({ holidays });
    } catch (err) {
        console.error("❌ GET /admin/holidays error:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { jDate, title } = body;

        if (!jDate) {
            return NextResponse.json({ error: "تاریخ شمسی (jDate) الزامی است" }, { status: 400 });
        }

        const normalized = toEnglishDigits(jDate);
        const gDate = jalaaliToGDateStartOfDay(normalized);
        if (!gDate) {
            return NextResponse.json({ error: "تاریخ وارد شده معتبر نیست" }, { status: 400 });
        }

        // check unique
        const exists = await Holiday.findOne({ jDate: normalized });
        if (exists) {
            return NextResponse.json({ error: "این تاریخ قبلاً به عنوان تعطیل ثبت شده" }, { status: 400 });
        }

        const newH = await Holiday.create({ jDate: normalized, gDate, title: title || "تعطیل رسمی" });
        return NextResponse.json({ message: "ثبت شد", holiday: newH });
    } catch (err) {
        console.error("❌ POST /admin/holidays error:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}
