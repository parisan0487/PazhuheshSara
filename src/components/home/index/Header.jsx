"use client"
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {


    return (
        <div className="rounded-3xl overflow-hidden relative h-[25rem]">
            <div>

                <div className="text-white min-md:mt-36 min-md:mr-20 mr-3 max-md:mt-20">
                    {/* متن‌ها */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="font-bold text-5xl max-md:text-4xl max-sm:text-3xl max-[430px]:text-[27px]!">
                            <p>"پژوهش سرای رازی"</p>
                            <p className="mt-4 mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#019297] via-[#019297] to-[#73ED7C]">
                                پژوهش هزینه نیست سرمایه است
                            </p>
                        </div>
                    </motion.div>

                    {/* دکمه‌ها */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.4,
                            duration: 0.5
                        }}
                        className="flex space-x-4 mt-8"
                    >
                        {/* دکمه اول */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <Link href="/reservations">
                                <button className="relative w-[160px] h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold text-black focus:outline-none max-[379px]:w-[140px]! max-[341px]:w-[125px]!">
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
                        </motion.div>

                        {/* دکمه دوم */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                        >
                            <Link href="/about">
                                <button className="relative w-[160px] h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold max-[379px]:w-[140px]! max-[341px]:w-[125px]!">
                                    <span className="absolute inset-0 bg-white transition-all duration-500 ease-in-out"></span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] bg-[length:200%_auto] opacity-0 transition-all duration-800 ease-in-out group-hover:opacity-100 group-hover:bg-left"></span>
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        <span className="text-black group-hover:text-white transition-colors duration-300">
                                            بیشتر بخوانید
                                        </span>
                                        <div className="rotate-[226deg] group-hover:rotate-[179deg] transition-transform duration-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 30 24"
                                                fill="currentColor"
                                                className="w-6 h-6 text-[#019297] group-hover:text-white transition-colors duration-300"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M22.72 13.28a.75.75 0 010 1.06l-10 10a.75.75 0 01-1.06-1.06l8.22-8.22H3.75a.75.75 0 010-1.5h16.13l-8.22-8.22a.75.75 0 011.06-1.06l10 10z" clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div >
    );
}
