import type { HighlighterGeneric } from 'shiki';

import type { HighlightResult } from '../types/index.js';

export async function highlightCode(
  highlighter: HighlighterGeneric<any, any>,
  code: string,
  language: string | null,
  theme: string,
): Promise<HighlightResult> {
  const resolvedLanguage = await resolveLanguage(highlighter, language);
  const tokens = highlighter.codeToTokens(code, {
    lang: resolvedLanguage,
    theme,
  });

  return {
    lines: tokens.tokens.map((line) => ({
      tokens: line.map((token) => ({
        content: token.content,
        color: token.color,
        fontStyle: token.fontStyle,
      })),
    })),
    fg: tokens.fg ?? '#ffffff',
    bg: tokens.bg ?? '#000000',
    themeName: tokens.themeName ?? theme,
    language: resolvedLanguage,
  };
}

async function resolveLanguage(highlighter: HighlighterGeneric<any, any>, language: string | null): Promise<string> {
  if (!language) {
    return 'plaintext';
  }

  const alias = highlighter.resolveLangAlias(language) ?? language;

  if (highlighter.getLoadedLanguages().includes(alias)) {
    return alias;
  }

  try {
    await highlighter.loadLanguage(alias);
    return alias;
  } catch {
    return 'plaintext';
  }
}
