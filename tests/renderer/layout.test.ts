import { describe, expect, it } from 'vitest';

import { calculateLayout } from '../../src/renderer/layout.js';
import type { HighlightResult, RenderOptions } from '../../src/types/index.js';

const highlighted: HighlightResult = {
  lines: [
    {
      tokens: [
        { content: 'const value = 12345', color: '#fff' },
      ],
    },
    {
      tokens: [
        { content: 'console.log(value)', color: '#fff' },
      ],
    },
  ],
  fg: '#ffffff',
  bg: '#000000',
  themeName: 'github-dark',
  language: 'ts',
};

const options: RenderOptions = {
  theme: 'github-dark',
  lineNumbers: true,
  window: 'mac',
  background: 'solid',
  padding: 20,
  radius: 12,
  maxWidth: 120,
  fontFamily: 'JetBrains Mono',
  fontSize: 10,
  lineHeight: 16,
  showFilename: false,
};

describe('calculateLayout', () => {
  it('wraps long lines and keeps continuation line numbers blank', () => {
    const result = calculateLayout(highlighted, options);

    expect(result.maxCharsPerLine).toBeGreaterThan(1);
    expect(result.visualLines.length).toBeGreaterThan(highlighted.lines.length);
    expect(result.visualLines[0].lineNumber).toBe(1);
    expect(result.visualLines[1].lineNumber).toBeNull();
  });

  it('allocates gutter width when line numbers are enabled', () => {
    const withNumbers = calculateLayout(highlighted, options);
    const withoutNumbers = calculateLayout(highlighted, {
      ...options,
      lineNumbers: false,
    });

    expect(withNumbers.gutterWidth).toBeGreaterThan(0);
    expect(withoutNumbers.gutterWidth).toBe(0);
    expect(withNumbers.codeWidth).toBeLessThan(withNumbers.contentWidth);
  });

  it('changes chrome height when the window bar is enabled', () => {
    const withWindow = calculateLayout(highlighted, options);
    const withoutWindow = calculateLayout(highlighted, {
      ...options,
      window: 'none',
    });

    expect(withWindow.chromeHeight).toBeGreaterThan(withoutWindow.chromeHeight);
    expect(withWindow.height).toBeGreaterThan(withoutWindow.height);
  });

  it('counts chinese characters as double-width for wrapping', () => {
    const result = calculateLayout(
      {
        ...highlighted,
        lines: [
          {
            tokens: [{ content: '// 中文注释中文注释', color: '#fff' }],
          },
        ],
      },
      {
        ...options,
        lineNumbers: false,
        window: 'none',
        maxWidth: 120,
      },
    );

    expect(result.visualLines.length).toBeGreaterThan(1);
  });
});
