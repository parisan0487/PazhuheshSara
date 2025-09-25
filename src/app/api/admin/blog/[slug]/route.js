import { connectDB } from '@/lib/db'
import { Blogs } from '@/models/blog'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
    const slug = params.slug;
    await connectDB()

    try {
        const blog = await Blogs.findOne({ slug })

        if (!blog) {
            return NextResponse.json({ success: false, message: 'مقاله پیدا نشد' }, { status: 404 })
        }

        return NextResponse.json({ success: true, blog })
    } catch (err) {
        return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    await connectDB()
    const slug = params.slug;
    
    try {
        const deleted = await Blogs.findOneAndDelete({ slug })

        if (!deleted) {
            return NextResponse.json({ success: false, message: 'مقاله پیدا نشد برای حذف' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'مقاله حذف شد' })
    } catch (err) {
        return NextResponse.json({ success: false, message: 'خطا در حذف مقاله' }, { status: 500 })
    }
}

export async function POST(req, { params }) {
    await connectDB()
    const slug = params.slug;
    const formData = await req.formData()

    const title = formData.get('title')
    const content = formData.get('content')

    try {
        const blog = await Blogs.findOneAndUpdate(
            { slug },
            { title, content },
            { new: true }
        )

        if (!blog) {
            return NextResponse.json({ success: false, message: 'مقاله برای ویرایش پیدا نشد' }, { status: 404 })
        }

        return NextResponse.json({ success: true, blog })
    } catch (err) {
        return NextResponse.json({ success: false, message: 'خطا در ویرایش مقاله' }, { status: 500 })
    }
}
