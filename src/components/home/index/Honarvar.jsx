"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, User } from "lucide-react";

const team = [
    { name: "رضا احمدی", role: "رتبه اول المپیاد ریاضی", location: "کاشمر" },
    { name: "سارا موسوی", role: "رتبه دوم المپیاد کامپیوتر", location: "کاشمر" },
    { name: "مهدی کریمی", role: "رتبه سوم مسابقات روبویک", location: "کاشمر" },
    { name: "لیلا رضوانی", role: "رتبه اول مسابقات برنامه‌نویسی", location: "کاشمر" },
    { name: "سعید صادقی", role: "رتبه دوم المپیاد علوم پایه", location: "کاشمر" },
    { name: "مریم نادری", role: "رتبه سوم مسابقات طراحی سایت", location: "کاشمر" },
    { name: "علی رضایی", role: "رتبه اول مسابقه هوش مصنوعی", location: "کاشمر" },
    { name: "زهرا ترابی", role: "رتبه دوم المپیاد کامپیوتر", location: "کاشمر" },
    { name: "حسین دهقانی", role: "رتبه سوم مسابقات الگوریتم", location: "کاشمر" },
    { name: "ندا صفایی", role: "رتبه اول مسابقه خلاقیت دیجیتال", location: "کاشمر" },
];



export default function Honarvar() {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const updateVisibleCount = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleCount(1);
            } else if (width < 768) {
                setVisibleCount(2);
            } else {
                setVisibleCount(5);
            }
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    const visibleMembers = team.slice(startIndex, startIndex + visibleCount);
    const canGoBack = startIndex > 0;
    const canGoForward = startIndex + visibleCount < team.length;

    const handlePrev = () => {
        if (canGoBack) setStartIndex(startIndex - 1);
    };

    const handleNext = () => {
        if (canGoForward) setStartIndex(startIndex + 1);
    };

    return (
        <section className="text-black py-20 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-[#00c4b4]/10 border border-[#00c4b4]/30 p-8 sm:p-10 rounded-xl w-full md:w-[50%] ml-auto text-right shadow-lg mb-12"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#00e0ca]">افتخارات پژوهش‌سرا</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={!canGoBack}
                                className={`p-1.5 rounded-full border border-[#00e0ca] transition ${canGoBack
                                    ? "hover:bg-[#00e0ca]/10"
                                    : "opacity-30 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canGoForward}
                                className={`p-1.5 rounded-full border border-[#00e0ca] transition ${canGoForward
                                    ? "hover:bg-[#00e0ca]/10"
                                    : "opacity-30 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-7">
                        «نفرات برتر کاشمر، نمونه‌ای از تلاش و خلاقیت»
                    </p>
                </motion.div>


                {/* کارت‌ها */}
                <div className="mt-[-70px] md:mr-16">
                    <motion.div
                        key={startIndex}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6 items-center sm:items-stretch"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {visibleMembers.map((member, i) => (
                                <div
                                    key={i}
                                    className="bg-[#1f2937] rounded-2xl p-4 shadow-xl hover:shadow-2xl transition duration-300 flex items-center gap-3"
                                >
                                    <User
                                        size={40}
                                        className="rounded-full border-2 border-[#00e0ca] bg-[#1f2937] p-1 text-[#00e0ca]"
                                    />
                                    <div>
                                        <h4 className="font-bold text-[#00e0ca] text-sm">{member.name}</h4>
                                        <p className="text-gray-200 text-xs">{member.role}</p>
                                        <p className="text-gray-500 text-[10px]">{member.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
