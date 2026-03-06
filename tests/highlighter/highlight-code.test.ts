import { describe, expect, it } from 'vitest';

import { createCodeHighlighter } from '../../src/highlighter/create-highlighter.js';
import { highlightCode } from '../../src/highlighter/highlight-code.js';

describe('highlightCode', () => {
  it('tokenizes a known language with theme colors', async () => {
    const highlighter = await createCodeHighlighter('github-dark');

    const result = await highlightCode(highlighter, 'const value = 1;', 'ts', 'github-dark');

    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].tokens.map((token) => token.content).join('')).toBe('const value = 1;');
    expect(result.bg).toMatch(/^#/);
    expect(result.fg).toMatch(/^#/);
    expect(result.language).toBe('ts');
  });

  it('falls back to plaintext for an unsupported language', async () => {
    const highlighter = await createCodeHighlighter('github-dark');

    const result = await highlightCode(highlighter, 'hello world', 'made-up-language', 'github-dark');

    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].tokens.map((token) => token.content).join('')).toBe('hello world');
    expect(result.language).toBe('plaintext');
  });
});
