import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ role: 'guest' });
        }

        const user = verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ role: user.role });
    } catch (err) {
        return NextResponse.json({ role: 'guest' });
    }
}