import fs from 'fs';
import path from 'path';
import { parseIni } from './ini';

export interface Config {
  astro_export_dir: string;
  sqlite_db_dir: string;
  draft_root_dir: string;
  image_url_prefix: string;
}

let config: Config | null = null;

export function loadConfig(): Config {
  if (config) {
    return config;
  }

  const configPath = path.join(process.cwd(), 'config.ini');

  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件 config.ini 不存在');
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');
  const parsed = parseIni(configContent);

  config = {
    astro_export_dir: path.resolve(parsed.config.astro_export_dir || './astro_export'),
    sqlite_db_dir: path.resolve(parsed.config.sqlite_db_dir || './data'),
    draft_root_dir: path.resolve(parsed.config.draft_root_dir || './drafts'),
    image_url_prefix: parsed.config.image_url_prefix || '/uploads',
  };

  // 确保目录存在
  [config.astro_export_dir, config.draft_root_dir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  return config;
}

export function reloadConfig(): Config {
  config = null;
  return loadConfig();
}
