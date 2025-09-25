"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Menu } from "lucide-react"
import clsx from "clsx"

const navItems = [
    { title: "صفحه اصلی", href: "/" },
    // { title: "خدمات", href: "/services" },
    // { title: "وبلاگ", href: "/blog", },
    // { title: "پروژه های ما", href: "/portfolio" },
    { title: "نوبت دهی", href: "/reservations" },
    { title: "دوره های آموزشی", href: "/courses" },
    { title: "درباره ما", href: "/about" },
    // { title: "تماس با ما", href: "/contact" },
]

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function fetchRole() {
            try {
                const res = await fetch("/api/role");
                const data = await res.json();
                setRole(data.role);
            } catch (err) {
                console.error("خطا در گرفتن نقش:", err);
            }
        }

        fetchRole();
    }, []);

    return (
        <div className="min-[1067px]:hidden z-[100]">
            <div onClick={() => setIsOpen(true)} className="p-2 cursor-pointer">
                <Image src="/img/sidebar.svg" alt="لوگو" width={35} height={35} />
            </div>

            {/* لایه تیره زمینه */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* سایدبار شیشه‌ای */}
            <div
                className={clsx(
                    "fixed top-0 right-0 w-[300px] h-full z-50 px-5 py-6 flex flex-col",
                    "backdrop-blur-2xl bg-white/5 border-l border-white/10 shadow-2xl",
                    "transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >

                <div className="flex justify-end">
                    <X
                        className="text-[#019297] cursor-pointer"
                        size={28}
                        onClick={() => setIsOpen(false)}
                    />
                </div>


                <ul className="flex flex-col gap-3 mt-4">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block text-white text-lg px-4 py-2 rounded-xl hover:bg-[#019297]/30 transition duration-300"
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>


                <div className="mt-auto">
                    {role === "admin" ? (
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                            <button className="w-full py-3 rounded-3xl bg-gradient-to-r from-[#019297] to-[#72ED7C] text-black font-semibold text-lg hover:scale-[1.03] transition">
                                پنل ادمین
                            </button>
                        </Link>
                    ) : (
                        <Link href="/contact" onClick={() => setIsOpen(false)}>
                            <button className="w-full py-3 rounded-3xl bg-gradient-to-r from-[#019297] to-[#72ED7C] text-black font-semibold text-lg hover:scale-[1.03] transition">
                                نوبت دهی
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}