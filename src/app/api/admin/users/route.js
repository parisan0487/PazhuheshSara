import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';

export async function GET() {
    await connectDB();

    const users = await User.find({}, '-password');

    return NextResponse.json(users);
}
