// src/scripts/seed.js
import 'dotenv/config'; // این dotenv رو فعال می‌کنه
import mongoose from 'mongoose';
import Hall from '../models/hall.js'; // مسیر درست به مدل

const halls = [
    {
        name: "آزمایشگاه شیمی",
        description: "مجهز به وسایل آزمایشگاهی برای دروس شیمی",
        availableDays: ["دوشنبه", "چهارشنبه"]
    },
    {
        name: "کارگاه رباتیک",
        description: "کارگاه تخصصی برای رباتیک و برنامه‌نویسی",
        availableDays: ["شنبه", "سه‌شنبه"]
    },
    {
        name: "سالن همایش",
        description: "برای برگزاری همایش‌ها و جلسات",
        availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"]
    },
    {
        name: "آزمایشگاه فیزیک",
        description: "وسایل و تجهیزات آزمایش‌های فیزیک",
        availableDays: ["یکشنبه", "سه‌شنبه"]
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ اتصال به MongoDB برقرار شد");

        // حذف داده‌های قبلی (اختیاری)
        await Hall.deleteMany({});
        console.log("🗑 داده‌های قبلی پاک شد");

        // اضافه کردن سالن‌ها
        await Hall.insertMany(halls);
        console.log("✅ سالن‌ها با موفقیت اضافه شدند");

        mongoose.disconnect();
    } catch (error) {
        console.error("❌ خطا در عملیات seed:", error);
    }
}

seed();
