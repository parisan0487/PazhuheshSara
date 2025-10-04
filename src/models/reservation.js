import mongoose from "mongoose";

delete mongoose.models.Reservation;

const ReservationSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        schoolName: { type: String, required: true },
        grade: { type: String, required: true }, // مقطع تحصیلی (مثلا "دهم", "یازدهم", "دوازدهم")
        gender: { type: String, enum: ["male", "female"], required: true }, // جنسیت
        studentCount: { type: Number, required: true, min: 1, default: 1 },

        phone: { type: String, required: true },
        jDate: { type: String, required: true }, // تاریخ شمسی
        gDate: { type: Date, required: true },   // تاریخ میلادی برای مرتب‌سازی
        time: { type: String, required: true },

        hall: { type: mongoose.Schema.Types.ObjectId, ref: "Hall", required: true }, // ارجاع به سالن

        status: {
            type: String,
            enum: ["reserved", "pending"],
            default: "reserved"
        }
    },
    { timestamps: true }
);

// جلوگیری از رزرو تکراری در یک تاریخ + ساعت + سالن
ReservationSchema.index({ jDate: 1, time: 1, hall: 1 }, { unique: true });


export default mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
