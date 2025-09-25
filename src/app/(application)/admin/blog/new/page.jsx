'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import toast from 'react-hot-toast';

export default function NewBlogsPage() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();



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

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.url);


    } catch (err) {
      console.error(err);
      setError('خطای غیرمنتظره در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const html = editor?.getHTML() || '';
    const plainText = editor?.getText() || '';

    if (!title.trim() || !excerpt.trim() || !plainText.trim() || !imageUrl) {
      setError('لطفاً همه‌ی فیلدها را پر کنید');
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('/api/admin/blog/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content: html,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('مقاله با موفقیت اضافه شد')
        router.push('/admin/blog');
      } else {
        setError(data.message || 'خطا در ثبت مقاله');
        toast.error('خطا در ثبت مقاله')
      }
    } catch (err) {
      console.error(err);
      toast.error('خطای غیرمنتظره در ثبت مقاله');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#1a1a1a] rounded-lg shadow-lg text-white border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-[#00e0ca]">افزودن مقاله جدید</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="عنوان مقاله"
          className="w-full p-3 rounded bg-[#121212] border border-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
          required
        />


        <textarea
          placeholder="توضیح کوتاه (excerpt)"
          className="w-full p-3 rounded bg-[#121212] border border-gray-700 text-white"
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          disabled={uploading}
          required
        />

        {/* Toolbar */}
        <label className="block font-bold text-sm text-gray-300 mb-1 mt-4">ابزار ویرایش</label>
        {editor && (
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-[#00e0ca]' : 'bg-gray-700'
                }`}
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-[#00e0ca]' : 'bg-gray-700'
                }`}
            >
              Italic
            </button>

           
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-10 h-10 p-0 border-0 cursor-pointer"
              title="انتخاب رنگ متن"
            />
          </div>
        )}

    
        <label className="block font-bold text-sm text-gray-300 mb-1">توضیحات مقاله:</label>
        <div className="bg-[#121212] border border-gray-700 rounded p-3 min-h-[300px] text-white">
          <EditorContent editor={editor} />
        </div>


        <label className="block text-[#00e0ca] mt-10 font-semibold">تصویر شاخص مقاله:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailUpload}
          disabled={uploading}
          className="file:bg-[#00e0ca] file:text-black file:rounded file:px-4 file:py-1 cursor-pointer bg-[#2a2a2a] w-full"
        />
        {uploading && <p className="text-[#00e0ca]">در حال آپلود...</p>}

        {imageUrl && (
          <div className="mt-4 relative w-30 h-30 rounded-lg border border-[#00e0ca] overflow-hidden" style={{ width: '120px', height: '120px' }}>
            <Image
              src={imageUrl}
              alt="تصویر شاخص"
              fill
              style={{ objectFit: 'cover' }}
              sizes="120px"
              priority
            />
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              className="absolute top-1 left-1 bg-red-600 text-white rounded px-2 py-1 text-sm"
            >
              حذف
            </button>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded text-black font-semibold transition ${uploading || !title.trim() || !excerpt.trim() || !editor?.getHTML().trim() || !imageUrl
            ? 'bg-[#00e0ca]/60 cursor-not-allowed'
            : 'bg-[#00e0ca] hover:bg-[#00bfa1]'
            }`}
          disabled={uploading || !title.trim() || !excerpt.trim() || !editor?.getHTML().trim() || !imageUrl}
        >
          {uploading ? 'در حال ذخیره مقاله...' : 'ذخیره مقاله'}
        </button>
      </form>
    </div>
  );
}
