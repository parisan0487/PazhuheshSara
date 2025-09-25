"use client"
import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Monitor, Smartphone, Paintbrush } from "lucide-react"

const ServicesSection = () => {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const textVariants = [
        {
            y: useTransform(scrollYProgress, [0.0, 0.2], [0, -50]),
            opacity: useTransform(scrollYProgress, [0.0, 0.15, 0.2], [1, 1, 0])
        },
        {
            y: useTransform(scrollYProgress, [0.2, 0.45], [50, -50]),
            opacity: useTransform(scrollYProgress, [0.2, 0.35, 0.45], [0, 1, 0])
        },
        {
            y: useTransform(scrollYProgress, [0.45, 0.7], [50, -50]),
            opacity: useTransform(scrollYProgress, [0.45, 0.6, 0.7], [0, 1, 0])
        },
        {
            y: useTransform(scrollYProgress, [0.7, 1], [50, 0]),
            opacity: useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1])
        }
    ]

    const dotColors = [
        useTransform(scrollYProgress, [0, 0.1, 0.2], ["#ffffff", "#ffffff", "#444"]),
        useTransform(scrollYProgress, [0.2, 0.35, 0.45], ["#444", "#ffffff", "#444"]),
        useTransform(scrollYProgress, [0.45, 0.6, 0.7], ["#444", "#ffffff", "#444"]),
        useTransform(scrollYProgress, [0.7, 0.85, 1], ["#444", "#ffffff", "#ffffff"]),
    ]

    const texts = [
        {
            icon: <Smartphone className="w-16 h-16 text-[#72ED7C]" />,
            title: "توسعه برنامه های کاربردی",
            content: "مشاوره, طراحی و توسعه برنامه های کاربردی برای موبایل و دسکتاپ"
        },
        {
            icon: <Paintbrush className="w-16 h-16 text-[#019297]" />,
            title: "توسعه وب اپلیکیشن",
            content: "طراحی و توسعه وب اپلیکیشن با تکنولوژی های روز"
        },
        {
            icon: <Monitor className="w-16 h-16 text-[#019297]" />,
            title: "توسعه وب سایت های شخصی و تجاری",
            content: "مشاوره, طراحی و توسعه وبسایت های شخصی و فروشگاهی با کلیه امکانات"
        },
        {
            icon: <Monitor className="w-16 h-16 text-[#019297]" />,
            title: "ارائه خدمات هوش مصنوعی",
            content: "مشاوره و پیاده سازی خدمات مرتبط با کسب و کارهای مبتنی برهوش مصنوعی و چت بات ها"
        },
    ]

    return (
        <section ref={containerRef} className="relative h-[400vh]">
            <div className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 sm:w-full max-w-6xl mx-auto relative text-center md:text-right">

                    {/* تیتر */}
                    <motion.div
                        className="lg:mt-36 md:mt-28 text-transparent bg-clip-text bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] text-7xl lg:text-8xl font-bold max-[379px]:text-6xl!"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        خدمات ما
                    </motion.div>

                    {/* خط بین نقاط */}
                    <div className="relative md:h-[60vh] md:w-6 w-full h-6 flex md:flex-col flex-row items-center justify-between">
                        {/* خط زمینه */}
                        <div className="
                            absolute 
                            md:w-1 md:h-full md:left-1/2 md:-translate-x-1/2
                            w-full h-1 top-1/2 -translate-y-1/2 
                            bg-white/20
                        " />
                        {/* نقاط */}
                        <motion.div className="w-3 h-3 rounded-full z-10" style={{ backgroundColor: dotColors[0] }} />
                        <motion.div className="w-3 h-3 rounded-full z-10" style={{ backgroundColor: dotColors[1] }} />
                        <motion.div className="w-3 h-3 rounded-full z-10" style={{ backgroundColor: dotColors[2] }} />
                        <motion.div className="w-3 h-3 rounded-full z-10" style={{ backgroundColor: dotColors[3] }} />
                    </div>

                    {/* متون */}
                    <div className="relative w-full md:flex-1 h-[45vh] md:h-[60vh]">
                        {texts.map((text, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    y: textVariants[i].y,
                                    opacity: textVariants[i].opacity
                                }}
                                className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center md:items-start"
                            >
                                <div className="mb-6">{text.icon}</div>
                                <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-white">
                                    {text.title}
                                </h3>
                                <p className="text-base sm:text-lg md:text-2xl text-white/80 px-2 sm:px-0">
                                    {text.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
