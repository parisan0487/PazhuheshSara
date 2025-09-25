"use client";
import { useState, useEffect, useRef } from "react";
import moment from "moment-jalaali";

export default function ReservationUser() {
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [times, setTimes] = useState([
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
  ]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --------- مدال راهنما -----------
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const guideButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const guideSteps = [
    {
      title: "قدم ۱ — پر کردن اطلاعات",
      body: "نام کامل، نام مدرسه و شماره تماس را وارد کن تا رزرو به نام شما ثبت شود.",
    },
    {
      title: "قدم ۲ — انتخاب تاریخ",
      body: "از بین تاریخ‌های موجود، یک روز را انتخاب کن. تاریخ انتخاب شده هایلایت می‌شود (تاریخ ها تا دوهفته آینده قابل انتخاب هستند).",
    },
    {
      title: "قدم ۳ — انتخاب ساعت",
      body: "از بین ساعات نمایش داده شده، یک زمان خالی را انتخاب کن. اگر نوشته «رزرو شده» بود، آن زمان را نمیتوانی انتخاب کنی.",
    },
    {
      title: "قدم ۴ — ثبت نوبت",
      body: "روی زمان موردنظر کلیک کن تا رزرو ارسال شود. پیام تایید یا خطا را در پایین فرم می‌بینی.",
    },
  ];



  const toEnglishDigits = (str) => {
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  };


  const openGuide = () => {
    setGuideStep(0);
    setIsGuideOpen(true);
  };
  const closeGuide = () => {
    setIsGuideOpen(false);
    // بازگرداندن فوکوس به دکمه راهنما
    setTimeout(() => guideButtonRef.current?.focus(), 0);
  };
  const handleNextGuide = () => {
    if (guideStep < guideSteps.length - 1) setGuideStep((s) => s + 1);
    else closeGuide();
  };
  const handlePrevGuide = () => {
    if (guideStep > 0) setGuideStep((s) => s - 1);
  };

  useEffect(() => {
    if (isGuideOpen) {
      // فوکوس روی دکمه بعدی در مدال
      setTimeout(() => nextButtonRef.current?.focus(), 80);
    }
  }, [isGuideOpen, guideStep]);

  useEffect(() => {
    const onKey = (e) => {
      if (!isGuideOpen) return;
      if (e.key === "Escape") closeGuide();
      if (e.key === "ArrowRight") handleNextGuide();
      if (e.key === "ArrowLeft") handlePrevGuide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isGuideOpen, guideStep]);

  // ---------- پیام 2 ثانیه ای ----------
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // محاسبه تاریخ‌های این هفته و هفته بعد
  const getNextTwoWeeks = () => {
    const today = moment();
    const dates = [];
    for (let i = 0; i < 14; i++) {
      dates.push(today.clone().add(i, "days").format("jYYYY/jMM/jDD"));
    }
    return dates;
  };

  const weekDates = getNextTwoWeeks();

  // گرفتن تایم‌های رزرو شده برای روز انتخاب شده
  const fetchReservations = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations?jDate=${date}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در دریافت نوبت‌ها");
      const map = {};
      data.reservations.forEach((r) => {
        map[r.time] = true; // رزرو شده
      });
      setAvailableSlots(map);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate]);

  const handleReserve = async (time) => {
    if (!selectedDate) {
      alert("لطفا ابتدا تاریخ را انتخاب کنید");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          schoolName,
          phone,
          jDate: selectedDate,
          gDate: moment(selectedDate, "jYYYY/jMM/jDD")
            .startOf("day")
            .toISOString(),
          time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ثبت نوبت");

      setMessage("✅ نوبت با موفقیت ثبت شد!");
      fetchReservations(selectedDate); // بروزرسانی تایم‌های آزاد
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-6">رزرو نوبت</h2>

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4 relative">
        {/* دکمه راهنما */}
        <div className="flex justify-end">
          <button
            ref={guideButtonRef}
            onClick={openGuide}
            className="text-sm px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 transition"
            aria-haspopup="dialog"
            aria-expanded={isGuideOpen}
          >
            راهنمایی
          </button>
        </div>

        {/* فرم اطلاعات کاربر */}
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="نام مدرسه"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="شماره تماس"
          value={phone}
          onChange={(e) => {
            // تبدیل اعداد فارسی به انگلیسی
            const englishValue = toEnglishDigits(e.target.value);

            // فقط اعداد مجاز باشن
            if (/^\d*$/.test(englishValue)) {
              setPhone(englishValue);
            }
          }}
          maxLength={11}
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        
        {/* انتخاب تاریخ */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-gray-200">تاریخ مورد نظر</h3>
          <div className="flex flex-wrap gap-3">
            {weekDates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-xl border font-medium transition ${selectedDate === date
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                  : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* تایم‌های آزاد */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-gray-200">ساعات موجود</h3>
          <div className="grid grid-cols-2 gap-3">
            {times.map((time) => {
              const isReserved = availableSlots[time];
              return (
                <button
                  key={time}
                  disabled={isReserved || loading}
                  onClick={() => handleReserve(time)}
                  className={`p-3 rounded-xl text-center font-medium transition shadow-md ${isReserved
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                >
                  {time} {isReserved ? "(رزرو شده)" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <p className="mt-4 text-center text-blue-300 font-medium animate-pulse">
            در حال پردازش...
          </p>
        )}
        {message && (
          <p className="mt-4 text-center text-amber-500 font-medium">{message}</p>
        )}
      </div>

      {/* ---------- Modal Guide ---------- */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeGuide}
            aria-hidden="true"
          />

          <div className="relative bg-gray-900 rounded-2xl p-6 max-w-md w-full text-right text-white shadow-xl transform transition-all duration-200">
            <h3 id="guide-title" className="text-xl font-bold mb-2">
              {guideSteps[guideStep].title}
            </h3>
            <p className="text-gray-300 mb-4">{guideSteps[guideStep].body}</p>

            {/* progress dots */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {guideSteps.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === guideStep ? "bg-green-400" : "bg-gray-700"
                    }`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevGuide}
                disabled={guideStep === 0}
                className={`px-4 py-2 rounded-lg ${guideStep === 0
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
                  }`}
              >
                قبلی
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={closeGuide}
                  className="px-4 py-2 rounded-lg bg-transparent border border-gray-700 hover:bg-gray-800"
                >
                  بستن
                </button>
                <button
                  ref={nextButtonRef}
                  onClick={handleNextGuide}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600"
                >
                  {guideStep === guideSteps.length - 1 ? "تمام" : "بعدی"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
