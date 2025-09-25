import { connectDB } from '@/lib/db'
import { Blogs } from '@/models/blog'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
    await connectDB();
    const { slug } = params;

    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt');

    try {
        const updatedBlog = await Blogs.findOneAndUpdate(
            { slug },
            { title, content, excerpt },
            { new: true }
        );

        if (!updatedBlog) {
            return NextResponse.json({ success: false, message: 'مقاله یافت نشد' }, { status: 404 });
        }

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (err) {
        console.error('Error updating blog:', err);
        return NextResponse.json({ success: false, message: 'خطا در ویرایش مقاله' }, { status: 500 });
    }

}
