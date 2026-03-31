import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Tag } from '@/lib/db';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name_en, name_zh } = body;

    if (!name_en || !name_zh) {
      return NextResponse.json({ success: false, error: 'name_en and name_zh are required' }, { status: 400 });
    }

    const db = getDatabase();
    db.prepare(
      'UPDATE tags SET name_en = ?, name_zh = ? WHERE id = ?'
    ).run(name_en, name_zh, id);

    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(id) as Tag;

    if (!tag) {
      return NextResponse.json({ success: false, error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tag });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const db = getDatabase();

    // 检查是否有文章正在使用这个标签
    const usageCount = db.prepare('SELECT COUNT(*) as count FROM article_tags WHERE tag_id = ?').get(id) as { count: number };

    if (usageCount.count > 0) {
      return NextResponse.json(
        { success: false, error: `无法删除该标签，有 ${usageCount.count} 篇文章正在使用它` },
        { status: 400 }
      );
    }

    const result = db.prepare('DELETE FROM tags WHERE id = ?').run(id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
