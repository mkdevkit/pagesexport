import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Category } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDatabase();
    const categories = db.prepare('SELECT * FROM categories ORDER BY id DESC').all() as Category[];
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_en, name_zh } = body;

    if (!name_en || !name_zh) {
      return NextResponse.json({ success: false, error: 'name_en and name_zh are required' }, { status: 400 });
    }

    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO categories (name_en, name_zh) VALUES (?, ?)'
    ).run(name_en, name_zh);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as Category;

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
