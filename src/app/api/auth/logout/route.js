import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'خروج انجام شد' });

    // حذف کوکی توکن
    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0), // تاریخ انقضا در گذشته = حذف کوکی
        path: '/',
    });

    return response;
}
