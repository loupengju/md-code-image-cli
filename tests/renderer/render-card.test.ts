import { describe, expect, it } from 'vitest';

import { calculateLayout } from '../../src/renderer/layout.js';
import { renderCardSvg } from '../../src/renderer/render-card.js';
import type { HighlightResult, RenderOptions } from '../../src/types/index.js';

const highlighted: HighlightResult = {
  lines: [
    {
      tokens: [
        { content: 'const value = 1;', color: '#ff79c6' },
      ],
    },
    {
      tokens: [
        { content: 'console.log(value)', color: '#8be9fd' },
      ],
    },
  ],
  fg: '#f8f8f2',
  bg: '#282a36',
  themeName: 'github-dark',
  language: 'ts',
};

const options: RenderOptions = {
  theme: 'github-dark',
  lineNumbers: true,
  window: 'mac',
  background: 'gradient',
  padding: 24,
  radius: 14,
  maxWidth: 320,
  fontFamily: 'JetBrains Mono',
  fontSize: 14,
  lineHeight: 22,
  showFilename: false,
};

describe('renderCardSvg', () => {
  it('renders an svg string with code text', async () => {
    const layout = calculateLayout(highlighted, options);

    const svg = await renderCardSvg(highlighted, layout, options);

    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain(`width="${layout.width}"`);
    expect(svg).toContain(`height="${layout.height}"`);
    expect(svg).toContain(highlighted.bg);
  });

  it('includes window chrome and line numbers when enabled', async () => {
    const layout = calculateLayout(highlighted, options);

    const svg = await renderCardSvg(highlighted, layout, options);

    expect(svg).toContain('1');
    expect(svg).toContain('2');
    expect(svg).toContain('#ff5f57');
  });

  it('changes outer background when transparent mode is used', async () => {
    const gradientSvg = await renderCardSvg(highlighted, calculateLayout(highlighted, options), options);
    const transparentSvg = await renderCardSvg(
      highlighted,
      calculateLayout(highlighted, {
        ...options,
        background: 'transparent',
      }),
      {
        ...options,
        background: 'transparent',
      },
    );

    expect(gradientSvg).toContain('linearGradient');
    expect(transparentSvg).not.toContain('linearGradient');
  });
});
