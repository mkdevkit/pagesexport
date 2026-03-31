import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Category, Tag } from '@/lib/db';
import { ArticleWithRelations, PaginationParams, PaginatedResult } from '@/types';
import { loadConfig } from '@/lib/config';
import { directoryExists } from '@/lib/file-utils';
import { exportArticle } from '@/lib/export';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const flag = searchParams.get('flag');

    const db = getDatabase();

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM articles';
    const countParams: any[] = [];

    if (flag) {
      countQuery += ' WHERE flag = ?';
      countParams.push(flag);
    }

    const countResult = db.prepare(countQuery).get(...countParams) as { total: number };
    const total = countResult.total;

    // 获取文章列表
    let query = 'SELECT * FROM articles';
    const queryParams: any[] = [];

    if (flag) {
      query += ' WHERE flag = ?';
      queryParams.push(flag);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    queryParams.push(pageSize, (page - 1) * pageSize);

    const articles = db.prepare(query).all(...queryParams) as ArticleWithRelations[];

    // 为每篇文章添加分类和标签
    for (const article of articles) {
      const categories = db.prepare(`
        SELECT c.* FROM categories c
        INNER JOIN article_categories ac ON c.id = ac.category_id
        WHERE ac.article_id = ?
      `).all(article.id) as Category[];

      const tags = db.prepare(`
        SELECT t.* FROM tags t
        INNER JOIN article_tags at ON t.id = at.tag_id
        WHERE at.article_id = ?
      `).all(article.id) as Tag[];

      article.categories = categories;
      article.tags = tags;
    }

    const result: PaginatedResult<ArticleWithRelations> = {
      data: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      directory,
      title_en,
      title_zh,
      address,
      thumbnail,
      preview,
      description_en,
      description_zh,
      content,
      src,
      categories = [],
      tags = [],
      flag = 'draft',
    } = body;

    if (!directory || !title_en || !title_zh || !address || !thumbnail) {
      return NextResponse.json(
        { success: false, error: 'directory, title_en, title_zh, address, and thumbnail are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO articles (
        directory, title_en, title_zh, address, thumbnail,
        preview, description_en, description_zh, content, src, date, flag,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      directory,
      title_en,
      title_zh,
      address,
      thumbnail,
      preview || null,
      description_en || null,
      description_zh || null,
      content || null,
      src || null,
      now,
      flag,
      now,
      now
    );

    const articleId = result.lastInsertRowid as number;

    // 添加分类关联
    const insertCategory = db.prepare('INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)');
    for (const categoryId of categories) {
      insertCategory.run(articleId, categoryId);
    }

    // 添加标签关联
    const insertTag = db.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
    for (const tagId of tags) {
      insertTag.run(articleId, tagId);
    }

    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId) as ArticleWithRelations;
    article.categories = db.prepare(`
      SELECT c.* FROM categories c
      INNER JOIN article_categories ac ON c.id = ac.category_id
      WHERE ac.article_id = ?
    `).all(articleId) as Category[];

    article.tags = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `).all(articleId) as Tag[];

    // 如果文章是已发布状态，导出 md 文件和图片
    if (flag === 'published') {
      try {
        await exportArticle(articleId);
      } catch (error) {
        console.error('Export failed:', error);
        // 导出失败不影响创建操作
      }
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
