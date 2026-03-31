import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Article } from '@/lib/db';
import { loadConfig } from '@/lib/config';
import { copyDirectory, removeDirectory, directoryExists } from '@/lib/file-utils';
import { exportArticle } from '@/lib/export';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const db = getDatabase();
    const config = loadConfig();

    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as Article;
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // 检查文章是否已经是已发布状态
    if (article.flag === 'published') {
      return NextResponse.json({ success: false, error: '文章已经是已发布状态' }, { status: 400 });
    }

    const directory = article.directory;

    // 草稿目录
    const draftDir = path.join(config.draft_root_dir, directory);
    // 导出目录
    const exportDir = path.join(config.astro_export_dir, directory);

    // 检查草稿目录是否存在
    if (await directoryExists(draftDir)) {
      // 删除导出目录
      if (await directoryExists(exportDir)) {
        await removeDirectory(exportDir);
      }
      // 复制草稿目录到导出目录
      await copyDirectory(draftDir, exportDir);
    } else {
      // 如果草稿目录不存在，确保导出目录存在
      await import('fs/promises').then(({ mkdir }) => mkdir(exportDir, { recursive: true }));
    }

    // 更新文章状态为已发布
    db.prepare('UPDATE articles SET flag = ?, updated_at = ? WHERE id = ?').run('published', new Date().toISOString(), id);

    // 导出 Astro 文件（包括 md 文件和图片）
    await exportArticle(article.id);

    const updatedArticle = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
