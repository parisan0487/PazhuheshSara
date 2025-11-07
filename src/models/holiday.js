import mongoose from "mongoose";

delete mongoose.models.Holiday;

const HolidaySchema = new mongoose.Schema({
  jDate: { type: String, required: true, unique: true },          
  title: { type: String, default: "تعطیل رسمی" },       
}, { timestamps: true });

export default mongoose.models.Holiday || mongoose.model("Holiday", HolidaySchema);
