import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        schoolName: { type: String, required: true },
        phone: { type: String, required: true },
        jDate: { type: String, required: true },  // تاریخ شمسی (مثلاً 1403/07/02)
        gDate: { type: Date, required: true },    // تاریخ معادل میلادی برای مرتب‌سازی
        time: { type: String, required: true },   // مثلا "10:00 - 11:00"
        status: {
            type: String,
            enum: ["reserved", "pending"],
            default: "reserved"
        }
    },
    { timestamps: true }
);

// جلوگیری از رزرو تکراری در یک تاریخ + ساعت
ReservationSchema.index({ jDate: 1, time: 1 }, { unique: true });

export default mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
