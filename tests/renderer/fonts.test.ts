import { describe, expect, it } from 'vitest';

import { getCodeFonts } from '../../src/renderer/fonts.js';

describe('getCodeFonts', () => {
  it('loads both monospace latin and chinese fallback fonts', async () => {
    const fonts = await getCodeFonts();

    expect(fonts.length).toBeGreaterThanOrEqual(2);
    expect(fonts.some((font) => font.name === 'JetBrains Mono')).toBe(true);
    expect(fonts.some((font) => font.name === 'Noto Sans SC')).toBe(true);
  });
});
