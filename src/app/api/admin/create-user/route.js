import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const body = await req.json();
    const { username, password } = body;

    await connectDB();

    const existing = await User.findOne({ username });
    if (existing) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashed,
        role:'admin',
    });

    return NextResponse.json({ message: 'User created', userId: user._id });
}
