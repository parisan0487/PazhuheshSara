import BlogSlider from '@/ui/BlogSlider'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    const res = await fetch(`${process.env.BASE_URL}/api/admin/blog`, { cache: 'no-store' })
    const data = await res.json()
    const blogs = Array.isArray(data) ? data : data.blogs

    return blogs.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPage({ params }) {
    const res = await fetch(`${process.env.BASE_URL}/api/admin/blog/${params.slug}`, {
        cache: 'no-store',
    })

    if (!res.ok) return notFound()

    const { blog } = await res.json()
    if (!blog) return notFound()

    const { title, content, image, createdAt } = blog
    const formattedDate = new Date(createdAt).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="max-w-[85rem] mx-auto px-4 md:px-8 py-12 text-gray-900 overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[80%_20%] gap-8 items-start">

                <article className="bg-white rounded-3xl shadow-md p-6 md:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-snug">{title}</h1>
                    <p className="text-gray-500 text-sm mb-6">تاریخ انتشار: {formattedDate}</p>

                    {image && (
                        <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg prose-slate max-w-none leading-relaxed break-words overflow-hidden [&>*]:max-w-full [&_img]:max-w-full [&_img]:h-auto [&_p]:my-4 [&_table]:max-w-full [&_table]:overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                </article>


                <aside className="sticky top-6 hidden lg:block">
                    <div className="bg-gradient-to-b from-[#f7faf9] to-[#e9fdf5] border border-[#d3f1e7] rounded-3xl shadow-sm p-5 overflow-hidden">
                        <h2 className="text-[#019297] text-xl font-semibold mb-4 text-center">
                            تازه‌ترین خبرها
                        </h2>
                        <div className="overflow-hidden">
                            <BlogSlider />
                        </div>
                    </div>
                </aside>
            </div>


            <div className="lg:hidden mt-10">
                <div className="bg-gradient-to-b from-[#f7faf9] to-[#e9fdf5] border border-[#d3f1e7] rounded-3xl shadow-sm p-5 overflow-hidden">
                    <h2 className="text-[#019297] text-xl font-semibold mb-4 text-center">
                        تازه‌ترین خبرها
                    </h2>
                    <BlogSlider />
                </div>
            </div>
        </div>
    )
}
