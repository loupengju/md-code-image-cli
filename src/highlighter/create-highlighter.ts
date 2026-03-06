import { createHighlighter } from 'shiki';

const highlighterCache = new Map<string, Awaited<ReturnType<typeof createHighlighter>>>();

export async function createCodeHighlighter(theme: string) {
  const cached = highlighterCache.get(theme);

  if (cached) {
    return cached;
  }

  const highlighter = await createHighlighter({
    themes: [theme],
    langs: [],
  });

  highlighterCache.set(theme, highlighter);

  return highlighter;
}
