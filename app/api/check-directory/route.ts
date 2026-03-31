import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { loadConfig } from '@/lib/config';
import { directoryExists } from '@/lib/file-utils';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const directory = searchParams.get('directory');

    if (!directory) {
      return NextResponse.json({ success: false, error: 'Directory parameter is required' }, { status: 400 });
    }

    const config = loadConfig();
    const draftDir = path.join(config.draft_root_dir, directory);

    const exists = await directoryExists(draftDir);

    return NextResponse.json({ success: true, exists });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
