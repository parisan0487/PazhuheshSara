import mongoose from "mongoose";

const HallSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    availableDays: [
        {
            type: String,
            enum: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"]
        }
    ]
});

export default mongoose.models.Hall || mongoose.model("Hall", HallSchema);
