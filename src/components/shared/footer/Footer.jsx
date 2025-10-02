"use client";
import Link from "next/link";


export default function Footer() {
    return (
        <footer className="bg-[#062e2e] text-white pt-16 pb-10 px-6 md:px-10 my-3 rounded-4xl mt-10">
            <div className="flex flex-col md:flex-row md:justify-between gap-10">
                {/* سمت راست
                <div className="md:w-1/2 text-center md:text-right space-y-4">
                    <h2 className="text-[28px] md:text-[2.70rem] font-bold leading-relaxed">
                        توسعه و طراحی میکنیم <span className="text-green-500">پروژه</span>
                        <br />
                        های <span className="text-green-400">موفق را</span>
                    </h2>
                </div> */}

                {/* سمت چپ */}
                <div className="md:w-1/2 flex flex-col md:flex-row md:gap-40 text-center md:text-right gap-10">
                    {/* آدرس شرکت */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-[25px] transition-colors duration-500 hover:text-[#73ED7C]">آدرس پژوهش سرا</h3>
                        <p className="text-sm">خراسان رضوی  , کاشمر</p>
                    </div>

                    {/* تماس با شرکت */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-[25px] transition-colors duration-500 hover:text-[#73ED7C]">تماس</h3>
                        <p className="text-sm">arc.team1403@gmail.com</p>
                        <p className="text-sm">09304898743</p>
                    </div>
                </div>
            </div>

            {/* خط جداکننده و فوتر پایین */}
            <div className="mt-10 border-t border-white/20 pt-10 text-sm flex flex-col md:flex-row justify-between items-center gap-6 text-center">
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[15px] sm:text-lg sm:font-bold font-medium">
                    <Link href="/" className="hover:text-green-400 transition">صفحه اصلی</Link>
                    <Link href="/reservations" className="hover:text-green-400 transition">نوبت دهی</Link>
                    <Link href="/portfolio" className="hover:text-green-400 transition">دوره های آموزشی</Link>
                    <Link href="/about" className="hover:text-green-400 transition">درباره ما</Link>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">
                    تمامی حقوق این سایت برای <span className="font-bold text-white">پژوهس سرا</span> محفوظ است.
                </p>
            </div>


        </footer>
    );
}

