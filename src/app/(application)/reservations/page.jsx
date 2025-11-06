"use client";
import { useState, useEffect } from "react";
import moment from "moment-jalaali";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import GradeSelect from "@/ui/GradeSelect";
import HallSelect from "@/ui/HallSelect";
import GenderSelect from "@/ui/GenderSelect";

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
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [grade, setGrade] = useState("");
  const [gender, setGender] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [allowedGender, setAllowedGender] = useState("")

  // مدال راهنما
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [isWeekInfoOpen, setIsWeekInfoOpen] = useState(false);


  const guideSteps = [
    {
      title: "مرحله اول: وارد کردن اطلاعات شخصی",
      body: `
📌 لطفا نام و نام خانوادگی، نام مدرسه و شماره تلفن خود را وارد کنید.
⚠️ توجه: حتماً اطلاعات صحیح باشد، زیرا برای تماس یا تایید رزرو استفاده خواهد شد.
`
    },
    {
      title: "مرحله دوم: انتخاب سالن، مقطع و جنسیت",
      body: `
🏫 سالن موردنظر خود را از بین گزینه‌ها انتخاب کنید.
🗓️ توجه: هر سالن فقط در روزهای مشخصی باز است. برای اطلاع از روزهای باز، از دکمه "اطلاعات این هفته" استفاده کنید.
🎓 مقطع تحصیلی دانش‌آموزان را انتخاب کنید.
👧👦 جنسیت دانش‌آموزان هم باید مشخص شود.
`
    },
    {
      title: "مرحله سوم: انتخاب تاریخ و ساعت",
      body: `
📅 با تقویم تاریخ موردنظر خود را وارد کنید.
🟢 توجه: هر هفته یا مخصوص دختران است یا پسران. پس از انتخاب تاریخ، متن زیر جدول مشخص می‌کند.
⏰ ساعت مدنظر خود را انتخاب کنید. ساعت‌هایی که خاکستری هستند، قبلاً رزرو شده و قابل انتخاب نیستند.
`
    },
    {
      title: "مرحله چهارم: تایید نهایی رزرو",
      body: `
✅ پس از وارد کردن همه اطلاعات (جنسیت، تاریخ، سالن و ساعت)، روی دکمه «تایید نهایی رزرو» کلیک کنید.
🎉 اگر همه موارد درست باشند، پیام موفقیت نمایش داده می‌شود.
❌ در غیر این صورت پیام خطا نمایش داده می‌شود.
`
    },
  ];



  const openGuide = () => { setIsGuideOpen(true); setGuideStep(0); };
  const closeGuide = () => setIsGuideOpen(false);
  const handleNextGuide = () => { if (guideStep < guideSteps.length - 1) setGuideStep(guideStep + 1); else closeGuide(); };
  const handlePrevGuide = () => { if (guideStep > 0) setGuideStep(guideStep - 1); };

  const toEnglishDigits = (str) => str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());// اعداد به انگلیسی
  const toPersianDigits = (str) => { const persianDigits = "۰۱۲۳۴۵۶۷۸۹"; return str.replace(/\d/g, (d) => persianDigits[d]); };//اعداد به فارسی


  useEffect(() => {
    setSelectedTime("");
  }, [selectedHall]);


  useEffect(() => {
    if (selectedDate) {
      const englishDate = toEnglishDigits(selectedDate);
      const weekNumber = moment(englishDate, "jYYYY/jMM/jDD").jWeek();
      const gender = weekNumber % 2 === 0 ? "female" : "male";
      setAllowedGender(gender);
    } else {
      setAllowedGender("");
    }
  }, [selectedDate]);



  const fetchReservations = async (date) => {
    if (!date) return;
    setLoading(true);
    console.log("✅ date", date);

    try {
      const res = await fetch(`/api/admin/reservations?jDate=${date}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "خطا در دریافت نوبت‌ها");

      // ساختار درست: availableSlots = { hallId: { time: true } }
      const slots = {};

      data.reservations.forEach((r) => {
        const reservationDate = toEnglishDigits(r.jDate); // تبدیل تاریخ رزرو به انگلیسی
        const selected = toEnglishDigits(date);          // تبدیل تاریخ انتخاب شده به انگلیسی
        console.log("✅ r.jDate", r.jDate);

        if (reservationDate === selected) {
          const hallId = typeof r.hall === "object" ? String(r.hall._id) : String(r.hall);

          if (!slots[hallId]) slots[hallId] = {};
          slots[hallId][r.time] = true;
        }
      });
      console.log("✅ slots", slots);

      setAvailableSlots(slots);

      console.log("✅ AvailableSlots after fetch:", availableSlots);


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


  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("/api/admin/halls");
        const data = await res.json();
        setHalls(data.halls || []);
      } catch (err) {
        showMessage("❌ خطا در دریافت سالن‌ها");
      }
    };
    fetchHalls();
  }, []);


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
    if (!selectedDate) {
      showMessage("❌ لطفا تاریخ را انتخاب و تایید کنید");
      return;
    }
    if (!selectedTime) {
      showMessage("❌ لطفا یک ساعت را انتخاب کنید");
      return;
    }

    setLoading(true);
    setMessage("");

    const studentCountNumber = Number(studentCount);
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          schoolName,
          phone,
          jDate: selectedDate,
          // gDate: moment(selectedDate, "jYYYY/jMM/jDD").startOf("day").toISOString(),
          time: selectedTime,
          hall: selectedHall,
          grade,
          gender,
          studentCount: studentCountNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ثبت نوبت");

      showMessage("✅ نوبت با موفقیت ثبت شد!");
      fetchReservations(selectedDate);
      setSelectedTime("");


      // setFullName("");
      // setSchoolName("");
      // setPhone("");
      // setSelectedDate("");
      // setSelectedTime("");
      // setSelectedHall("");
      // setGrade("");
      // setGender("");
      setStudentCount(0)
      // setErrors({});
    } catch (err) {
      showMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 mt-16">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-green-900 drop-shadow-lg">
        رزرو نوبت
      </h2>

      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl space-y-6 relative border border-gray-200">

        {/* دکمه راهنما */}
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={openGuide}
            className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold shadow-md hover:bg-green-200 transition"
          >
            راهنمایی
          </button>
          <button
            onClick={() => setIsWeekInfoOpen(true)}
            className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold shadow-md hover:bg-green-200 transition"
          >
            اطلاعات سالن ها
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

        {/* انتخاب سالن */}
        <div>
          <HallSelect
            selected={selectedHall}
            setSelected={setSelectedHall}
            halls={halls}
          />
        </div>

        {/* مقطع تحصیلی */}
        <div>
          <GradeSelect selected={grade} setSelected={setGrade} />
        </div>

        {/* جنسیت */}
        <div>
          <GenderSelect selected={gender} setSelected={setGender} />
        </div>

        {/* تعداد دانش‌آموزان */}
        <div>
          <input
            type="text"
            placeholder="تعداد دانش‌آموزان"
            value={studentCount === 0 ? "" : studentCount} // صفر نشون داده نشه
            onChange={(e) => {
              const toEnglishDigits = (str) =>
                str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

              const englishValue = toEnglishDigits(e.target.value);

              // فقط اعداد 0 تا 999
              if (/^\d{0,3}$/.test(englishValue)) {
                const numberValue = Number(englishValue);
                setStudentCount(numberValue);

                // اعتبارسنجی: باید حداقل 1 باشه
                setErrors({
                  ...errors,
                  studentCount:
                    numberValue > 0 ? "" : "تعداد دانش‌آموزان باید بیشتر از صفر باشد",
                });
              }
            }}
            maxLength={3}
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner placeholder-gray-400 transition-all"
          />
          {errors.studentCount && (
            <p className="text-red-500 text-sm mt-1">{errors.studentCount}</p>
          )}
        </div>


        {/* انتخاب تاریخ */}
        <div className="bg-gray-50 p-4 rounded-2xl shadow-inner border border-gray-200 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">انتخاب تاریخ</h3>

          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={selectedDate}
            onChange={(date) => {
              if (date) {
                const jDate = date.format("YYYY/MM/DD");
                setSelectedDate(jDate);
              }
            }}
            placeholder="انتخاب تاریخ..."
            className="w-full rounded-xl border border-gray-300 p-3 shadow-inner focus:ring-2 focus:ring-green-400 transition-all"
            style={{ backgroundColor: "white" }}
          />

          {selectedDate ? (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">این هفته مخصوص: </span>
              <span className="text-green-600">
                {allowedGender === "female" ? "پسران" : "دختران"}
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">⏳ ابتدا یک تاریخ انتخاب کنید</p>
          )}
        </div>


        {/* تایم‌ها */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-gray-800">ساعات موجود</h3>
          <div className="grid grid-cols-3 gap-3">
            {times.map((time) => {
              const isReserved = Boolean(availableSlots[selectedHall]?.[time]);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  disabled={isReserved || loading || !selectedHall}
                  onClick={() => setSelectedTime(time)}
                  className={`text-sm p-3 rounded-2xl font-medium transition-all shadow-md border
            ${isReserved
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                      : isSelected
                        ? "bg-green-700 text-white border-green-800 scale-110 shadow-lg"
                        : "bg-green-500 hover:bg-green-600 text-white border-green-600"
                    }`}
                >
                  {toPersianDigits(time)}
                </button>
              );
            })}
          </div>
        </div>


        {/* تایید نهایی */}
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="mt-6 w-full px-5 py-4 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-extrabold shadow-lg transition-transform hover:scale-105"
        >
          تایید نهایی رزرو
        </button>


        {loading && <p className="mt-4 text-center text-green-600 font-medium animate-pulse">در حال پردازش...</p>}
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("❌") ? "text-red-600" : "text-green-600"} transition-opacity duration-500`}>
            {message}
          </p>
        )}
      </div>

      {/* جدول اطلاعات هفته */}
      {isWeekInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full text-right text-gray-800 shadow-2xl transform transition-all duration-300 scale-95 animate-fade-in">
            <h3 className="text-2xl font-bold mb-3 text-green-700">اطلاعات سالن ها</h3>

            <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-center text-sm bg-gray-50 shadow-lg">
              <thead className="bg-green-200 text-gray-900 font-semibold">
                <tr>
                  <th className="border border-gray-400 px-3 py-2">سالن</th>
                  <th className="border border-gray-400 px-3 py-2">روزهای باز</th>
                </tr>
              </thead>
              <tbody>
                {halls.length > 0 ? (
                  halls.map((hall) => (
                    <tr key={hall._id} className="hover:bg-green-50 transition-colors">
                      <td className="border border-gray-400 px-3 py-2 font-medium">{hall.name}</td>
                      <td className="border border-gray-400 px-3 py-2">
                        {hall.availableDays && hall.availableDays.length > 0
                          ? hall.availableDays.join("، ")
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-3 text-gray-600 font-medium">
                      هیچ سالنی ثبت نشده
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsWeekInfoOpen(false)}
                className="px-5 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ---------- Modal Guide ---------- */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
        >
          <div className="relative bg-gray-900 rounded-3xl p-6 max-w-md w-full text-right text-white shadow-2xl transform transition-all duration-300 scale-95 animate-fade-in">
            {/* عنوان مرحله */}
            <h3 id="guide-title" className="text-xl font-bold mb-3">
              {guideSteps[guideStep].title}
            </h3>

            {/* توضیحات */}
            <p className="text-gray-300 mb-5">{guideSteps[guideStep].body}</p>

            {/* نشانگر مراحل */}
            <div className="flex items-center justify-center gap-2 mb-5">
              {guideSteps.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === guideStep ? "bg-green-400 scale-125" : "bg-gray-600"} transition-transform`}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* دکمه‌ها */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevGuide}
                disabled={guideStep === 0}
                className={`px-5 py-2 rounded-xl ${guideStep === 0 ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                قبلی
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={closeGuide}
                  className="px-5 py-2 rounded-xl bg-transparent border border-gray-700 hover:bg-gray-800"
                >
                  بستن
                </button>

                <button
                  onClick={handleNextGuide}
                  className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 shadow-lg"
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
