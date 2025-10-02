'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const textReveal = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
        opacity: 1,
        scaleX: 1,
        transition: {
            duration: 0.8,
            ease: 'easeInOut',
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
            delay: i * 0.1,
        },
    }),
};

// دیتا رو دستی تعریف می‌کنیم
const projects = [
    {
        id: 1,
        title: "فضای پژوهش‌سرا",
        image: "/images/research1.jpg",
        url: "#",
        content: "نمایی از فضای داخلی پژوهش‌سرا برای فعالیت‌های علمی و پژوهشی.",
    },
    {
        id: 2,
        title: "آزمایشگاه",
        image: "/images/research2.jpg",
        url: "#",
        content: "بخشی از آزمایشگاه پژوهش‌سرا که دانش‌آموزان در آن پروژه‌های علمی انجام می‌دهند.",
    },
    {
        id: 3,
        title: "کارگاه",
        image: "/images/research3.jpg",
        url: "#",
        content: "کارگاه پژوهش‌سرا با امکانات لازم برای ساخت و طراحی پروژه‌های دانش‌آموزی.",
    },
];

export default function ProjectsSection() {
    return (
        <section className="py-16 px-4 text-black mb-24">
            <div className="max-w-4xl text-center mb-12">
                <div className="flex justify-between">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={textReveal}
                        className="text-2xl sm:text-4xl font-bold"
                    >
                        فضای پژوهش‌سرا:
                    </motion.h2>
                </div>
            </div>

            {/* گالری استاتیک */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        className="flex flex-col bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl p-3 hover:scale-105 transition"
                        variants={cardVariants}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="w-full h-48 relative">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2 mt-2.5 text-center">{project.title}</h3>

                        <p className="text-sm text-gray-200 mb-4 leading-relaxed text-justify break-words">
                            {project.content}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
