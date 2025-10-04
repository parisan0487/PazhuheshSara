import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // توجه: bcryptjs برای سازگاری مطمئن
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        await connectDB();

        // پیدا کردن یوزر
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
        }


        // حذف فضای اضافی و مقایسه با bcrypt
        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "رمز عبور اشتباه است" }, { status: 401 });
        }

        // ساخت JWT شامل id و role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        // برگردوندن توکن به عنوان کوکی
        const response = NextResponse.json({ success: true, role: user.role });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 روز
            path: "/",
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
    }
}
