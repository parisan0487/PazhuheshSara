'use client';

import { motion } from 'framer-motion';

const textReveal = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
        opacity: 1,
        scaleX: 1,
        transition: { duration: 0.8, ease: 'easeInOut' },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 },
    }),
};

// دیتا دستی
const honors = [
    { id: 1, name: "زهرا احمدی", contest: "رتبه اول مسابقات رباتیک" },
    { id: 2, name: "علی رضایی", contest: "رتبه دوم جشنواره خوارزمی" },
    { id: 3, name: "مریم کاظمی", contest: "مدال طلا المپیاد کامپیوتر" },
    { id: 4, name: "حسین مرادی", contest: "رتبه برتر مسابقات کشوری انشا" },
];

export default function HonorsSection() {
    return (
        <section className="py-16 px-4 text-black mb-24">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={textReveal}
                    className="text-[27px] sm:text-4xl md:text-5xl font-bold"
                >
                    افتخارات پژوهش‌سرا
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {honors.map((honor, i) => (
                    <motion.div
                        key={honor.id}
                        className="bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] text-black rounded-2xl p-5 shadow-lg hover:scale-105 transition cursor-pointer"
                        variants={cardVariants}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-bold mb-2">{honor.name}</h3>
                        <p className="text-sm font-medium">{honor.contest}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
