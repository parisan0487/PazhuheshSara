// app/api/admin/holidays/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Holiday from "@/models/holiday";


function toEnglishDigits(str) {
    if (!str) return str;
    return str
        .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584));
}


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
        const body = await req.json();
        const rawDate = body.jDate;

        // تبدیل همه اعداد فارسی به انگلیسی
        const normalizedDate = toEnglishDigits(rawDate);
        console.log("normalizedDaten", normalizedDate)

        // مطمئن شو سه بخش داره و صفرها رو تکمیل کن
        const parts = normalizedDate.split(/[\/\-]/);
        const jDate = `${parts[0].padStart(4, "0")}/${parts[1].padStart(2, "0")}/${parts[2].padStart(2, "0")}`;
        console.log("jDate", jDate)

        const newHoliday = await Holiday.create({
            title: body.title,
            jDate,
        });

        return NextResponse.json({ success: true, holiday: newHoliday });
    } catch (err) {
        console.error("❌ Holiday POST error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
