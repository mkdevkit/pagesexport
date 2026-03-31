import { NextRequest, NextResponse } from 'next/server';
import { loadConfig } from '@/lib/config';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// 获取配置文件内容
export async function GET(request: NextRequest) {
  try {
    const configPath = path.join(process.cwd(), 'config.ini');
    const content = await readFile(configPath, 'utf-8');
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// 保存配置文件内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (typeof content !== 'string') {
      return NextResponse.json({ success: false, error: 'Content must be a string' }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), 'config.ini');
    await writeFile(configPath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
