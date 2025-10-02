"use client";
import { useState, useEffect } from "react";
import moment from "moment-jalaali";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function ReservationUser() {
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ fullName: "", schoolName: "", phone: "" });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [times] = useState([
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
  ]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // مدال راهنما
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const guideSteps = [
    { title: "مرحله اول", body: "ابتدا اطلاعات شخصی (نام، مدرسه و شماره تماس) را وارد کنید." },
    { title: "مرحله دوم", body: "تاریخ موردنظر را از تقویم انتخاب و تایید کنید." },
    { title: "مرحله سوم", body: "یکی از ساعت‌های آزاد را انتخاب کنید." },
    { title: "مرحله چهارم", body: "در پایان با دکمه «تایید نهایی» رزرو خود را ثبت کنید." },
  ];

  const openGuide = () => { setIsGuideOpen(true); setGuideStep(0); };
  const closeGuide = () => setIsGuideOpen(false);
  const handleNextGuide = () => { if (guideStep < guideSteps.length - 1) setGuideStep(guideStep + 1); else closeGuide(); };
  const handlePrevGuide = () => { if (guideStep > 0) setGuideStep(guideStep - 1); };

  const toEnglishDigits = (str) => str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

  const fetchReservations = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations?jDate=${date}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در دریافت نوبت‌ها");

      const map = {};
      data.reservations.filter((r) => r.jDate === date).forEach((r) => {
        map[r.time] = true;
      });
      setAvailableSlots(map);
    } catch (err) {
      showMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchReservations(selectedDate);
  }, [selectedDate]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // --- ولیدیشن ---
  const validateFullName = (value) => {
    if (value.trim().length < 3) return "نام باید حداقل ۳ حرف باشد";
    return "";
  };
  const validateSchoolName = (value) => {
    if (value.trim().length < 3) return "نام مدرسه باید حداقل ۳ حرف باشد";
    return "";
  };
  const validatePhone = (value) => {
    if (!/^\d{11}$/.test(value)) return "شماره تماس باید دقیقا ۱۱ رقم باشد";
    return "";
  };

  const handleFinalSubmit = async () => {
    const newErrors = {
      fullName: validateFullName(fullName),
      schoolName: validateSchoolName(schoolName),
      phone: validatePhone(phone),
    };
    setErrors(newErrors);

    if (newErrors.fullName || newErrors.schoolName || newErrors.phone) {
      showMessage("❌ لطفا خطاهای فرم را برطرف کنید");
      return;
    }
    if (!selectedDate || !confirmed) {
      showMessage("❌ لطفا تاریخ را انتخاب و تایید کنید");
      return;
    }
    if (!selectedTime) {
      showMessage("❌ لطفا یک ساعت را انتخاب کنید");
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
          gDate: moment(selectedDate, "jYYYY/jMM/jDD").startOf("day").toISOString(),
          time: selectedTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ثبت نوبت");

      showMessage("✅ نوبت با موفقیت ثبت شد!");
      fetchReservations(selectedDate);
      setSelectedTime("");
    } catch (err) {
      showMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-green-900 drop-shadow-lg">
        رزرو نوبت
      </h2>

      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl space-y-6 relative border border-gray-200">

        {/* دکمه راهنما */}
        <div className="flex justify-end mb-4">
          <button
            onClick={openGuide}
            className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold shadow-md hover:bg-green-200 transition"
          >
            راهنمایی
          </button>
        </div>

        {/* نام */}
        <div>
          <input
            type="text"
            placeholder="نام و نام خانوادگی"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setErrors({ ...errors, fullName: validateFullName(e.target.value) });
            }}
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner placeholder-gray-400 transition-all"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* مدرسه */}
        <div>
          <input
            type="text"
            placeholder="نام مدرسه"
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value);
              setErrors({ ...errors, schoolName: validateSchoolName(e.target.value) });
            }}
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner placeholder-gray-400 transition-all"
          />
          {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
        </div>

        {/* شماره تماس */}
        <div>
          <input
            type="text"
            placeholder="شماره تماس"
            value={phone}
            onChange={(e) => {
              const englishValue = toEnglishDigits(e.target.value);
              if (/^\d*$/.test(englishValue)) {
                setPhone(englishValue);
                setErrors({ ...errors, phone: validatePhone(englishValue) });
              }
            }}
            maxLength={11}
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner placeholder-gray-400 transition-all"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* انتخاب تاریخ */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-gray-800">انتخاب تاریخ</h3>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={selectedDate}
            onChange={(date) => {
              if (date) {
                const jDate = date.format("YYYY/MM/DD");
                setSelectedDate(jDate);
                setConfirmed(false);
              }
            }}
            placeholder="انتخاب تاریخ..."
            className="custom-calendar w-full rounded-xl border border-gray-300 p-3 shadow-inner transition-all focus:ring-2 focus:ring-green-400"
            style={{ backgroundColor: "white" }}
          />

          <button
            onClick={() => setConfirmed(true)}
            className={`mt-4 w-full px-5 py-3 rounded-2xl font-semibold transition-all ${confirmed ? "bg-green-600 text-white shadow-lg scale-105" : "bg-gray-400 text-white hover:bg-gray-500 shadow-md"
              }`}
          >
            {confirmed ? "✔ تاریخ تایید شد" : "تایید تاریخ"}
          </button>
        </div>

        {/* تایم‌ها */}
        {confirmed && (
          <div>
            <h3 className="mb-2 font-semibold text-lg text-gray-800">ساعات موجود</h3>
            <div className="grid grid-cols-3 gap-3">
              {times.map((time) => {
                const isReserved = availableSlots[time];
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    disabled={isReserved || loading}
                    onClick={() => setSelectedTime(time)}
                    className={`text-sm p-3 rounded-2xl font-medium transition-all shadow-md border ${isReserved
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                        : isSelected
                          ? "bg-green-700 text-white border-green-800 scale-110 shadow-lg"
                          : "bg-green-500 hover:bg-green-600 text-white border-green-600"
                      }`}
                  >
                    {time} {isReserved ? "❌" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* تایید نهایی */}
        {confirmed && (
          <button
            onClick={handleFinalSubmit}
            disabled={loading}
            className="mt-6 w-full px-5 py-4 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-extrabold shadow-lg transition-transform hover:scale-105"
          >
            تایید نهایی رزرو
          </button>
        )}

        {loading && <p className="mt-4 text-center text-green-600 font-medium animate-pulse">در حال پردازش...</p>}
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("❌") ? "text-red-600" : "text-green-600"} transition-opacity duration-500`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
