import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Tag } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDatabase();
    const tags = db.prepare('SELECT * FROM tags ORDER BY id DESC').all() as Tag[];
    return NextResponse.json({ success: true, data: tags });
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
      'INSERT INTO tags (name_en, name_zh) VALUES (?, ?)'
    ).run(name_en, name_zh);

    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid) as Tag;

    return NextResponse.json({ success: true, data: tag });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
