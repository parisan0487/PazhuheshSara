import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!file) {
            return NextResponse.json({ error: "هیچ فایلی ارسال نشده" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const upload = await cloudinary.uploader.upload(base64, {
            folder: "reservations", // پوشه مخصوص رزروها
        });

        return NextResponse.json({ url: upload.secure_url });
    } catch (err) {
        console.error("❌ Upload error:", err);
        return NextResponse.json({ error: "خطا در آپلود تصویر" }, { status: 500 });
    }
}
