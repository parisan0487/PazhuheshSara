import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcrypt';

export async function DELETE(req, { params }) {
    await connectDB();

    const userId = params.id;
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: 'کاربر با موفقیت حذف شد' });
}



export async function PUT(req, { params }) {
    await connectDB();

    const userId = params.id;
    const body = await req.json();

    const { username, role, password } = body;

    const updateFields = { username, role };

    if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    return NextResponse.json(updatedUser);
}
