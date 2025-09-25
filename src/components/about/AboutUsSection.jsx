"use client"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: "easeOut", delay: i * 0.3 },
    }),
}

const buttonVariants = {
    hover: {
        scale: 1.05,
        rotate: [0, 2, -2, 0],
        transition: { duration: 0.6, yoyo: Infinity },
    },
}

const AboutUsSection = () => {
    const paragraphs = [
        "پژوهش‌سرای کاشمر جاییه که خلاقیت و یادگیری دست به دست هم میدن. اینجا بچه‌ها و نوجوانان می‌تونن با ایده‌هاشون بازی کنن، آزمایش بسازن و مهارت‌های جدید یاد بگیرن.",
        "ما سعی کردیم محیطی ایجاد کنیم که هم جذاب باشه هم آموزشی، جایی که دانش‌آموزان می‌تونن با پروژه‌های عملی توانایی‌هاشون رو محک بزنن و رشد کنن.",
        "هدف ما اینه که نسل آینده با تجربه و اعتماد به نفس وارد دنیای علمی و تکنولوژی بشه و از یادگیری لذت ببره."
    ]

    return (
        <section className="py-20 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                <motion.div
                    className="w-full md:w-1/2 text-right max-sm:mb-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        custom={0}
                        variants={textVariants}
                        className="text-3xl sm:text-[45px] font-extrabold text-[#00e0ca] mb-4"
                    >
                        درباره پژوهش‌سرای کاشمر
                    </motion.h2>

                    {paragraphs.map((text, i) => (
                        <motion.p
                            key={i}
                            custom={i + 1}
                            variants={textVariants}
                            className="text-white text-base sm:text-xl leading-relaxed mb-4"
                        >
                            {text}
                        </motion.p>
                    ))}

                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        className="relative w-[180px] h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold text-white focus:outline-none mt-6"
                    >
                        <Link href="/courses">
                            <span className="absolute inset-0 bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] bg-[length:200%_auto] transition-all duration-400 ease-in-out group-hover:bg-right-bottom"></span>
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                دوره‌های آموزشی
                                <div className="rotate-[226deg]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 30 24"
                                        fill="white"
                                        className="w-6 h-6 transform transition-transform duration-400 ease-in-out group-hover:rotate-[-47deg]"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M22.72 13.28a.75.75 0 010 1.06l-10 10a.75.75 0 01-1.06-1.06l8.22-8.22H3.75a.75.75 0 010-1.5h16.13l-8.22-8.22a.75.75 0 011.06-1.06l10 10z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}

export default AboutUsSection
