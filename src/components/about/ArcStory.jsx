"use client";

import { motion } from "framer-motion";

const timeline = [
    {
        side: "right",
        title: "آغاز از یک نیاز واقعی",
        desc: `مشکلی كه نه فقط به‌عنوان ناظر، بلکه به‌عنوان کسی که باهاش درگير بودیم و لمسش کرده بودیم. 
  يك راه‌حل خلاقانه‌ به ذهن‌مون رسید که به نظرمون می‌تونست تغییرات مثبت و بزرگي ايجاد كنه.
  ایده‌ای که بعدها به‌عنوان یک طرح دانش‌بنیان ثبت اولیه شد.`,
    },
    {
        side: "left",
        title: "از آموزش تا اقدام واقعی",
        desc: `ما دو تا دوست بوديم با سال‌ها سابقه تدریس و فعالیت تو دنیای برنامه‌نویسی.
  تا قبل از اين، بیشتر وقت‌مون صرف آموزش و توسعه برای دیگران بود، اما این بار تصمیم گرفتیم خودمون وارد بازي بشیم و چیزی بسازیم که نه فقط یه نرم‌افزار، بلکه یه نگاه تازه به یه مسئله قدیمی باشه.`,
    },
    {
        side: "right",
        title: "شروع سخت ولی پرامید",
        desc: `اولش هیچی نداشتیم نه دفتر، نه تجهیزات، نه حتی یه میز درست‌وحسابی.
  جلسات‌مون رو تو ساختمونی می‌ذاشتیم که داشت ساخته ميشد و عامل شكل گيري همين ايده بود.
  روي يك روفرشي مي نشستيم و سطل هاي رنگ ميشد ميز لپ تاپ. بحث می‌کردیم، طراحی می‌کردیم، و رؤیا می‌ساختیم.
  شاید سخت بود، ولی اون روزها قلب تپنده‌ی آرک بودن.`,
    },
    {
        side: "left",
        title: "حمایت ها و روشن شدن مسیر",
        desc: `وقتی با دل و ایمان جلو رفتیم، دست‌های یاری‌گر خدا هم به كمكمون اومدن.
  آدم‌هایی وارد مسیرمون شدن مثل محمد، امير، صالح، پريسان، اسما، دكتر رمضاني و بقيه دوستاني که بودن‌شون برکت بود و کمک کردن چراغ راه‌مون روشن‌تر بمونه. 
  از طرف ديگه، ایده‌های جدیدی جرقه زدن؛ ایده‌هایی که حالا داریم با هم روشون کار می‌کنیم و باور داریم می‌تونن دنیای اطراف‌مون رو یه‌کم بهتر کنن.`,
    },
    {
        side: "right",
        title: "تولد آرک",
        desc: `و اینطوری بود که "آرک" متولد شد؛
  یه تیم کوچیک ولی پرانرژی که با ترکیب تجربه، خلاقیت و دغدغه‌مندی، دنبال ساختن راه‌حل‌هایی واقعی برای نیازهای واقعی‌ه.`,
    },
];



export default function ArkStory() {
    return (
        <section className="relative py-20  text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-center mb-16 ">سرگذشت آرک</h2>

                <div className="relative grid grid-cols-9 gap-y-16">
                    {/* خط عمودی تایم‌لاین */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-[#019297] z-0" />

                    {timeline.map((item, index) => {
                        const isLeft = item.side === "left";
                        const animationProps = {
                            initial: { opacity: 0, x: isLeft ? -100 : 100 },
                            whileInView: { opacity: 1, x: 0 },
                            transition: { duration: 0.7, delay: index * 0.2 },
                            viewport: { once: true },
                        };

                        return (
                            <div key={index} className="contents">
                                {isLeft ? (
                                    <>
                                        <div className="col-span-4 flex justify-end">
                                            <motion.div
                                                {...animationProps}
                                                className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg w-[300px] text-right"
                                            >
                                                <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297]">{item.title}</h3>
                                                <p className="text-sm">{item.desc}</p>
                                            </motion.div>
                                        </div>
                                        <div className="col-span-1 flex justify-center items-start relative">
                                            <div className="w-4 h-4 bg-[#019297] rounded-full z-10 mt-2" />
                                        </div>
                                        <div className="col-span-4" />
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-4" />
                                        <div className="col-span-1 flex justify-center items-start relative">
                                            <div className="w-4 h-4 bg-[#019297] rounded-full z-10 mt-2" />
                                        </div>
                                        <div className="col-span-4 flex justify-start">
                                            <motion.div
                                                {...animationProps}
                                                className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg w-[300px] text-right"
                                            >
                                                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297]">{item.title}</h3>
                                                <p className="text-sm">{item.desc}</p>
                                            </motion.div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
