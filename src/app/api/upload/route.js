import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
        await fs.mkdir(uploadDir, { recursive: true }); // اگر پوشه نبود بسازش
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (err) {
        console.error('❌ File save error:', err);
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
}
