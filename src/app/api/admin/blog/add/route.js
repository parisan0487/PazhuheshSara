import { connectDB } from '@/lib/db';
import { Blogs } from '@/models/blog';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();

        const { title, content, image, excerpt } = await request.json();

        if (!title || !content || !image) {
            return NextResponse.json({ success: false, message: 'تمام فیلدها الزامی است' }, { status: 400 });
        }

        const newBlog = await Blogs.create({
            title,
            content,
            image,
            excerpt,
            slug: title.trim().toLowerCase().replace(/\s+/g, '-'), 
        });

        return NextResponse.json({ success: true, blog: newBlog });
    } catch (error) {
        console.error('خطا در POST /blogs:', error);
        return NextResponse.json({ success: false, message: 'خطا در سرور' }, { status: 500 });
    }
}
