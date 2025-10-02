"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Users, BadgeCheck, Headphones } from "lucide-react";

const FeatureBox = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });

    const features = [
        {
            icon: <Calendar className="w-6 h-6 text-[#73ED7C]" />,
            title: "پرورش و تقویت خلاقیت",
            desc: "جهت پیشبرد اهداف آموزشی و پژوهشی در مقاطع مختلف تحصیلی",
        },
        // {
        //     icon: <Users className="w-6 h-6 text-[#019297]" />,
        //     title: "همکاری با بیش از ۸ استارتاپ",
        //     desc: "شرکای تجاری موفق",
        // },
        {
            icon: <BadgeCheck className="w-6 h-6 text-[#019297]" />,
            title: "جشنواره‌ها",
            desc: "جشنواره‌ها و کنفرانس‌های علمی -پژوهشی در سطح استانی و کشوری",
        },
        {
            icon: <Headphones className="w-6 h-6 text-[#73ED7C]" />,
            title: "شکوفایی ایده‌ها",
            desc: "شکل‌گیری پژوهش خلاق در چارچوب تفکر علمی دانش‌آموزان",
        },

    ];

    return (
        <div className="flex justify-center px-4 py-12 mt-5">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-7xl px-4 max-sm:px-10 py-6 bg-white rounded-lg shadow-xl border border-gray-200"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 max-sm:gap-y-0">
                    {features.map((feature, index) => (
                        <React.Fragment key={index}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                                className="flex flex-col items-center text-center relative px-4"
                            >
                                <div className="p-4 bg-white rounded-full shadow-md mb-3 border border-gray-200">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg text-black dark:text-gray-100 mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-black/80 dark:text-gray-300 text-sm">
                                    {feature.desc}
                                </p>

                                {/* Divider عمودی فقط در md به بالا */}
                                {index < features.length - 1 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 h-20 w-px bg-green-300" />
                                )}
                            </motion.div>

                            {/* Divider افقی فقط در موبایل و تبلت */}
                            {index < features.length - 1 && (
                                <div className="sm:hidden w-full h-px bg-green-300 my-4" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default FeatureBox;

