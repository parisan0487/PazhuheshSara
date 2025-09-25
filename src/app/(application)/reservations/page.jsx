"use client";
import { useState, useEffect } from "react";
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


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000); // بعد از 2 ثانیه پاک می‌شود

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
          gDate: moment(selectedDate, "jYYYY/jMM/jDD").startOf("day").toISOString(),
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

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
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
          onChange={(e) => setPhone(e.target.value)}
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

        {loading && <p className="mt-4 text-center text-blue-300 font-medium animate-pulse">در حال پردازش...</p>}
        {message && <p className="mt-4 text-center text-amber-500 font-medium">{message}</p>}
      </div>
    </div>
  );
}
