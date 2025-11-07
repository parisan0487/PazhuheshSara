import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/reservation";

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
        const jDate = url.searchParams.get("jDate");
        const normalized = toEnglishDigits(jDate);

        const first = await Reservation.findOne({ jDate: normalized });

        if (!first) {
            return NextResponse.json({ gender: null }); // هنوز تعیین نشده
        }

        return NextResponse.json({ gender: first.gender }); // female یا male
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
