export function buildOutputFileName(index: number, language: string | null): string {
  const suffix = sanitizeLanguage(language);

  return `code-${String(index).padStart(2, '0')}-${suffix}.png`;
}

function sanitizeLanguage(language: string | null): string {
  if (!language) {
    return 'txt';
  }

  return language.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') || 'txt';
}
