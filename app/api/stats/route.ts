import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDatabase();

    const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
    const publishedArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE flag = 'published'").get() as { count: number };
    const draftArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE flag = 'draft'").get() as { count: number };
    const categories = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    const tags = db.prepare('SELECT COUNT(*) as count FROM tags').get() as { count: number };

    return NextResponse.json({
      success: true,
      data: {
        totalArticles: totalArticles.count,
        publishedArticles: publishedArticles.count,
        draftArticles: draftArticles.count,
        categories: categories.count,
        tags: tags.count,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
