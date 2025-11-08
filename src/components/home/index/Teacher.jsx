'use client';

import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

export default function TeachersSection() {
    const teachers = [
        {
            name: "دکتر علی رضایی",
            role: "استاد فیزیک",
            bio: "تجربه ۱۵ ساله در تحقیقات علوم پایه و هدایت دانشجویان.",
            image: null,
        },
        {
            name: "دکتر سارا احمدی",
            role: "استاد ریاضیات",
            bio: "تخصص در هندسه و جبر، با سابقه انتشار مقالات بین‌المللی.",
            image: null,
        },
        {
            name: "دکتر محمد حسینی",
            role: "استاد شیمی",
            bio: "فعال در تحقیقات شیمی تجزیه و آموزش دانشجویان کارشناسی و ارشد.",
            image: null,
        },
        {
            name: "دکتر نرگس کاویانی",
            role: "استاد زیست‌شناسی",
            bio: "تحقیقات در زیست‌شناسی مولکولی و ژنتیک.",
            image: null,
        },
        {
            name: "دکتر رضا مرادی",
            role: "استاد علوم کامپیوتر",
            bio: "تخصص در هوش مصنوعی و یادگیری ماشین.",
            image: null,
        },
    ];

    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#019297] mb-8 text-center">
                اساتید پژوهش‌سرا
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {teachers.map((teacher, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 mb-2 relative">
                            {teacher.image ? (
                                <Image
                                    src={teacher.image}
                                    alt={teacher.name}
                                    fill
                                    className="object-cover rounded-full"
                                />
                            ) : (
                                <User
                                    size={52}
                                    className="rounded-full border-2 border-[#00e0ca] bg-[#1f2937] p-1 text-[#00e0ca] m-auto"
                                />
                            )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">{teacher.name}</h3>
                        <p className="text-[#019297] text-xs mt-1">{teacher.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
