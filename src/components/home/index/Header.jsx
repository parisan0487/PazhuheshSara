"use client";
import BlogSlider from "@/ui/BlogSlider";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
    return (
        <div className="rounded-3xl overflow-hidden relative h-auto py-10 px-6">
            {/* دو بخش اصلی */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] items-center gap-10">



                {/* بخش اصلی (عنوان و دکمه‌ها) */}
                <div className="order-1 md:order-1 text-black md:pl-10">
                    {/* عنوان */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="font-bold text-5xl max-md:text-4xl max-sm:text-3xl max-[430px]:text-[27px]!">
                            <p>"پژوهش سرای رازی"</p>
                            <p className="mt-4 mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#019297] via-[#019297] to-[#73ED7C]">
                                پژوهش هزینه نیست، سرمایه است
                            </p>
                        </div>
                    </motion.div>

                    {/* دکمه‌ها */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-wrap gap-4 mt-8"
                    >
                        {/* دکمه اول */}
                        <Link href="/reservations">
                            <button className="relative w-[153px] h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold text-black focus:outline-none max-[379px]:w-[140px]! max-[341px]:w-[125px]!">
                                <span className="absolute inset-0 bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] bg-[length:200%_auto] transition-all duration-400 ease-in-out group-hover:bg-right-bottom"></span>
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    نوبت دهی
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
                            </button>
                        </Link>

                        {/* دکمه دوم */}
                        <Link href="/about">
                            <button className="relative w-[153px] h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold max-[379px]:w-[140px]! max-[341px]:w-[125px]!">
                                <span className="absolute inset-0 bg-[#ededed] transition-all duration-500 ease-in-out"></span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] bg-[length:200%_auto] opacity-0 transition-all duration-800 ease-in-out group-hover:opacity-100 group-hover:bg-left"></span>
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    <span className="text-black group-hover:text-black transition-colors duration-300">
                                        بیشتر بخوانید
                                    </span>
                                    <div className="rotate-[226deg] group-hover:rotate-[179deg] transition-transform duration-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 30 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-[#019297] group-hover:text-black transition-colors duration-300"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M22.72 13.28a.75.75 0 010 1.06l-10 10a.75.75 0 01-1.06-1.06l8.22-8.22H3.75a.75.75 0 010-1.5h16.13l-8.22-8.22a.75.75 0 011.06-1.06l10 10z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </Link>
                    </motion.div>
                </div>


                <div className="order-2 md:order-2 w-full md:w-[85%] mx-auto md:mx-0 max-md:mt-8">
                    <BlogSlider />
                </div>
            </div>
        </div>
    );
}
