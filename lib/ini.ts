export function parseIni(content: string): Record<string, any> {
  const result: Record<string, any> = {};
  let currentSection: string | null = null;

  const lines = content.split('\n');

  for (let line of lines) {
    line = line.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith(';') || line.startsWith('#')) {
      continue;
    }

    // Section header
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      result[currentSection] = {};
      continue;
    }

    // Key-value pair
    const keyValueMatch = line.match(/^([^=]+)=(.*)$/);
    if (keyValueMatch && currentSection) {
      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();
      result[currentSection][key] = value;
    }
  }

  return result;
}

export function stringifyIni(obj: Record<string, any>): string {
  const lines: string[] = [];

  for (const [section, data] of Object.entries(obj)) {
    lines.push(`[${section}]`);

    for (const [key, value] of Object.entries(data)) {
      lines.push(`${key}=${value}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}
