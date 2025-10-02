'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function Counseling() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden relative py-12 w-full mb-10 px-6 bg-gradient-to-r from-green-50 to-teal-50"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative z-10 text-center max-w-2xl mx-auto"
            >
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">
                    نوبت‌دهی پژوهش‌سرا
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                    برای مشاهده و رزرو وقت‌های خالی، روی دکمه زیر کلیک کنید
                </p>

                <Link
                    href="/reservations"
                    className="bg-gradient-to-r from-teal-500 to-green-400 text-white w-44 py-3 mx-auto rounded-xl hover:shadow-lg hover:scale-105 transition transform font-semibold flex items-center gap-2 justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 32 32"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.7 16c0 .8.4 1.6 1.2 2 2.7 1.6 7.8 4.4 11.5 6.3 3.2 1.6 7.6 3.5 10.7 4.9.3.1.7.2 1 .2.6 0 1.2-.3 1.6-.7.6-.6.7-1.5.5-2.3l-2.8-8.2c-.1-.5-.7-.8-1.2-.8h-6.7c-.7 0-1.2-.4-1.2-1.1s.5-1.1 1.2-1.1h6.7c.5 0 1.1-.3 1.2-.8l2.8-8.3c.2-.8 0-1.7-.6-2.3-.6-.6-1.5-.7-2.3-.3-2.5 1.1-7.4 3.2-10.7 4.9-3.7 1.9-8.8 4.7-11.5 6.3-.8.5-1.2 1.2-1.2 2z"
                        />
                    </svg>
                    دریافت نوبت
                </Link>
            </motion.div>
        </motion.div>
    );
}
