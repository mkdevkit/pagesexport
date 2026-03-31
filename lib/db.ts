import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { loadConfig } from './config';

export interface Category {
  id: number;
  name_en: string;
  name_zh: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name_en: string;
  name_zh: string;
  created_at: string;
}

export interface Article {
  id: number;
  directory: string;
  title_en: string;
  title_zh: string;
  address: string;
  thumbnail: string;
  preview?: string;
  description_en?: string;
  description_zh?: string;
  content?: string;
  date: string;
  flag: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ArticleCategory {
  article_id: number;
  category_id: number;
}

export interface ArticleTag {
  article_id: number;
  tag_id: number;
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const config = loadConfig();
    const dbDir = config.sqlite_db_dir;

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'content.db');
    db = new Database(dbPath);

    // 启用 WAL 模式
    db.pragma('journal_mode = WAL');

    initializeTables(db);
  }

  return db!;
}

function initializeTables(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      directory TEXT NOT NULL UNIQUE,
      title_en TEXT NOT NULL,
      title_zh TEXT NOT NULL,
      address TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      preview TEXT,
      description_en TEXT,
      description_zh TEXT,
      content TEXT,
      src TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      flag TEXT DEFAULT 'draft' CHECK(flag IN ('draft', 'published')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS article_categories (
      article_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, category_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  // 迁移：添加 content 字段（如果不存在）
  try {
    const columns = database.prepare("PRAGMA table_info(articles)").all() as any[];
    const hasContentColumn = columns.some((col: any) => col.name === 'content');
    if (!hasContentColumn) {
      database.exec('ALTER TABLE articles ADD COLUMN content TEXT');
    }
  } catch (error) {
    // 如果迁移失败，记录错误但不中断程序
    console.error('Migration error:', error);
  }

  // 迁移：添加 src 字段（如果不存在）
  try {
    const columns = database.prepare("PRAGMA table_info(articles)").all() as any[];
    const hasSrcColumn = columns.some((col: any) => col.name === 'src');
    if (!hasSrcColumn) {
      database.exec('ALTER TABLE articles ADD COLUMN src TEXT');
    }
  } catch (error) {
    // 如果迁移失败，记录错误但不中断程序
    console.error('Migration error:', error);
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
