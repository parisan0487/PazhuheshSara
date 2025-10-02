"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SideBar from "./SideBar";

export default function Navbar() {
    const pathname = usePathname();
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

    const navLinks = [
        { href: "/", label: "صفحه اصلی" },
        // { href: "/services", label: "خدمات" },
        // { href: "/portfolio", label: "پروژه های ما" },
        // { href: "/blog", label: "وبلاگ" },
        { href: "/reservations", label: "نوبت دهی" },
        { href: "/courses", label: "دوره های آموزشی" },
        { href: "/about", label: "درباره ما" },
        // { href: "/contact", label: "تماس با ما" },
    ];

    return (
        <div className="rounded-3xl overflow-hidden bg-white shadow-md border border-gray-200">
            <div className="m-4">
                <div className="flex justify-between gap-4 items-center text-right">
                    {/* لوگو و منو */}
                    <nav className="flex gap-8">
                        <div className="flex items-center gap-2 z-10">
                            <Link href="/">
                                <Image
                                    src="/img/logo.jpg"
                                    alt="لوگو"
                                    width={70}
                                    height={70}
                                    className="rounded-full shadow-sm border border-gray-300"
                                />
                            </Link>
                        </div>
                        <ul className="flex gap-7 text-lg items-center max-[1067px]:hidden">
                            {navLinks.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href} className="relative group">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-1 relative font-bold transition-colors duration-500 hover:text-[#00b894] ${isActive ? "text-[#00b894]" : "text-gray-800"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* شماره و دکمه‌ها */}
                    <div className="flex gap-5 max-[1067px]:hidden">
                        <div className="flex gap-2 mt-3 items-center">
                            <div className="rotate-[253deg] h-7 m-0">
                                {/* آیکن تلفن */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                >
                                    <path
                                        d="M18.2461 16.0694C17.462 15.2953 16.4832 15.2953 15.7041 16.0694C15.1098 16.6587 14.5155 17.248 13.9312 17.8473C13.7713 18.0121 13.6365 18.0471 13.4417 17.9372C13.0572 17.7274 12.6477 17.5576 12.2781 17.3279C10.5551 16.2442 9.11178 14.8508 7.83327 13.2826C7.19901 12.5035 6.63467 11.6695 6.24013 10.7306C6.16023 10.5408 6.17521 10.416 6.33003 10.2611C6.92433 9.68681 7.50366 9.0975 8.08798 8.50818C8.90203 7.68914 8.90203 6.73026 8.08298 5.90622C7.61853 5.43677 7.15407 4.9773 6.68961 4.50785C6.21017 4.02841 5.73572 3.54398 5.25129 3.06953C4.4672 2.30542 3.48834 2.30542 2.70925 3.07452C2.10995 3.66384 1.53562 4.26813 0.926333 4.84745C0.361991 5.38183 0.0773229 6.03607 0.0173928 6.80018C-0.0774965 8.04373 0.227148 9.21736 0.656647 10.361C1.53562 12.7283 2.87406 14.8308 4.49717 16.7586C6.68961 19.3655 9.30656 21.4281 12.368 22.9164C13.7464 23.5856 15.1747 24.1 16.7279 24.1849C17.7967 24.2448 18.7256 23.9751 19.4697 23.1411C19.9791 22.5718 20.5534 22.0524 21.0928 21.508C21.8919 20.699 21.8969 19.7201 21.1028 18.921C20.1539 17.9671 19.2 17.0183 18.2461 16.0694Z"
                                        fill="black"
                                    />
                                </svg>
                            </div>
                            <span className="text-gray-800 text-[1.1rem] font-bold z-10 transition-colors duration-500 hover:text-[#00b894]">
                                09304898743
                            </span>
                        </div>

                        {role === "admin" ? (
                            <Link
                                href="/admin"
                                className="relative w-40 h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold text-white focus:outline-none"
                            >
                                <span
                                    className="absolute inset-0 bg-gradient-to-r from-[#00b894] via-[#73ED7C] to-[#00b894] bg-[length:200%_auto] transition-all duration-400 ease-in-out group-hover:bg-right-bottom"
                                ></span>
                                <div className="relative z-10">پنل ادمین</div>
                            </Link>
                        ) : (
                            <Link href="/reservations">
                                <button
                                    className="relative w-40 h-12 rounded-3xl overflow-hidden group flex items-center justify-center text-center font-bold text-white focus:outline-none"
                                >
                                    <span
                                        className="absolute inset-0 bg-gradient-to-r from-[#00b894] via-[#73ED7C] to-[#00b894] bg-[length:200%_auto] transition-all duration-400 ease-in-out group-hover:bg-right-bottom"
                                    ></span>
                                    <div className="relative z-10 flex items-center gap-2">
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
                        )}
                    </div>
                    <SideBar />
                </div>
            </div>
        </div>
    );
}
