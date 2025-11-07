import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/reservation";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const id = params.id;
        const deleted = await Reservation.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "رزرو پیدا نشد" }, { status: 404 });
        }

        return NextResponse.json({ message: "رزرو با موفقیت حذف شد ✅" });
    } catch (error) {
        console.error("❌ Delete error:", error);
        return NextResponse.json({ error: "خطای سرور در حذف رزرو" }, { status: 500 });
    }
}
