'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import toast from 'react-hot-toast'

export default function EditArticlePage({ params }) {
    const resolvedParams = use(params)
    const slug = resolvedParams.slug
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
    })
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert',
            },
        },
    });

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/admin/blog/${slug}`, { cache: 'no-store' })
                const data = await res.json()

                if (data.success) {
                    setFormData(data.blog)
                    if (editor) {
                        editor.commands.setContent(data.blog.content || '')
                    }
                } else {
                    toast.error('داده‌ی مقاله موفقیت‌آمیز دریافت نشد')
                }
            } catch (err) {
                toast.error('خطا در گرفتن مقاله')
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [slug, editor])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitting(true)

        const formDataToSend = new FormData(event.target)
        formDataToSend.set('content', formData.content)

        try {
            const res = await fetch(`/api/admin/blog/edit/${slug}`, {
                method: 'POST',
                body: formDataToSend,
            })

            if (res.ok) {
                toast.success('مقاله با موفقیت ویرایش شد')
                router.push('/admin/blog')
            } else {
                const text = await res.text()
                toast.error('خطا در ذخیره مقاله: ' + text)
                console.error('Error updating blog:', text)
            }
        } catch (err) {
            toast.error('خطا در ارسال فرم')
            console.error('خطای ارسال فرم:', err)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="text-center py-10">در حال بارگذاری...</p>

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg text-gray-900 border border-gray-200">
            <h1 className="text-2xl font-bold mb-6 text-[#019297]">ویرایش مقاله</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="عنوان مقاله"
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]/60 transition"
                    required
                />
                <input
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="خلاصه کوتاه"
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]/60 transition"
                    required
                />

                <label className="block font-bold text-sm text-gray-700 mb-1 mt-4">ابزار ویرایش</label>
                {editor && (
                    <div className="flex flex-wrap gap-2 mb-2 items-center">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`px-3 py-1 rounded-md border text-sm transition ${editor.isActive('bold')
                                    ? 'bg-[#00e0ca] text-white border-transparent'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            بولد
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`px-3 py-1 rounded-md border text-sm transition ${editor.isActive('italic')
                                    ? 'bg-[#00e0ca] text-white border-transparent'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            ایتالیک
                        </button>

                        <input
                            type="color"
                            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className="w-10 h-10 p-0 border border-gray-300 rounded cursor-pointer bg-white"
                            title="رنگ متن"
                        />
                    </div>
                )}

                <label className="block font-bold text-sm text-gray-700 mb-1">
                    توضیحات مقاله:
                </label>
                <EditorContent
                    editor={editor}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-4 min-h-[200px] font-sans text-sm leading-relaxed focus-within:ring-2 focus-within:ring-[#00e0ca]/40"
                />

                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-semibold transition ${submitting
                            ? 'bg-[#00e0ca]/60 cursor-not-allowed text-white'
                            : 'bg-[#00e0ca] hover:bg-[#00c8b0] text-white'
                        }`}
                    disabled={submitting}
                >
                    {submitting ? 'در حال ذخیره تغییرات...' : 'ذخیره تغییرات'}
                </button>
            </form>
        </div>
    );

}
