import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Hall from "@/models/hall";

// گرفتن همه سالن‌ها
export async function GET() {
    try {
        await connectDB();

        const halls = await Hall.find();

        return NextResponse.json({ halls });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}

// ساخت سالن جدید (مثلا برای ادمین)
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, description, availableDays } = body;

        if (!name || !availableDays || availableDays.length === 0) {
            return NextResponse.json({ error: "نام سالن و روزهای باز بودن الزامی است" }, { status: 400 });
        }

        const newHall = await Hall.create({ name, description, availableDays });

        return NextResponse.json({ message: "سالن با موفقیت ایجاد شد", hall: newHall });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}


// ویرایش سالن
export async function PUT(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, name, description, availableDays } = body;

        if (!id || !name || !availableDays || availableDays.length === 0) {
            return NextResponse.json({ error: "همه فیلدهای لازم الزامی است" }, { status: 400 });
        }

        const hall = await Hall.findById(id);
        if (!hall) return NextResponse.json({ error: "سالن یافت نشد" }, { status: 404 });

        hall.name = name;
        hall.description = description;
        hall.availableDays = availableDays;

        await hall.save();

        return NextResponse.json({ message: "سالن با موفقیت ویرایش شد", hall });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}

// حذف سالن
export async function DELETE(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "آیدی سالن لازم است" }, { status: 400 });

        const hall = await Hall.findByIdAndDelete(id);
        if (!hall) return NextResponse.json({ error: "سالن یافت نشد" }, { status: 404 });

        return NextResponse.json({ message: "سالن با موفقیت حذف شد" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}
