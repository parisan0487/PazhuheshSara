// app/api/admin/holidays/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Holiday from "@/models/holiday";

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const deleted = await Holiday.findByIdAndDelete(params.id);
        if (!deleted) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
        return NextResponse.json({ message: "حذف شد" });
    } catch (err) {
        console.error("❌ DELETE /admin/holidays/:id error:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}
