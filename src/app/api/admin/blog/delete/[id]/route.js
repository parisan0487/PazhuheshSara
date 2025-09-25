import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'
import { Blogs } from '@/models/blog'

export async function DELETE(request, { params }) {
    await connectDB();
    const { id } = params;

    try {
        const deleted = await Blogs.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, message: 'مقاله پیدا نشد' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('خطا در حذف:', err);
        return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
    }
}
