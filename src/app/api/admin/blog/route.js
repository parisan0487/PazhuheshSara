import { connectDB } from '@/lib/db';
import { Blogs } from '@/models/blog';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  const blogs = await Blogs.find().sort({ createdAt: -1 });

  return NextResponse.json({ success: true, blogs });
}
