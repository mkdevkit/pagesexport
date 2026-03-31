import { NextResponse } from 'next/server';
import { exportAllArticles } from '@/lib/export';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const result = await exportAllArticles();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
