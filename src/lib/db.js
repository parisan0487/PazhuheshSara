import mongoose from 'mongoose';

export async function connectDB() {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGODB_URI);
}