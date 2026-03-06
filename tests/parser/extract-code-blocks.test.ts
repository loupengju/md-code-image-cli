import { describe, expect, it } from 'vitest';

import { extractCodeBlocks } from '../../src/parser/extract-code-blocks.js';

describe('extractCodeBlocks', () => {
  it('extracts fenced code blocks and preserves formatting', async () => {
    const markdown = [
      '# Title',
      '',
      '```ts',
      'const value = 1;',
      '',
      '  console.log(value);',
      '```',
      '',
      'paragraph',
      '',
      '```bash',
      'echo "hi"',
      '```',
    ].join('\n');

    const blocks = await extractCodeBlocks(markdown);

    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({
      index: 1,
      lang: 'ts',
      code: 'const value = 1;\n\n  console.log(value);',
    });
    expect(blocks[1]).toMatchObject({
      index: 2,
      lang: 'bash',
      code: 'echo "hi"',
    });
  });

  it('ignores indented code and non-code nodes', async () => {
    const markdown = [
      '    const fromIndent = true;',
      '',
      '`inline`',
      '',
      '```',
      'plain text block',
      '```',
    ].join('\n');

    const blocks = await extractCodeBlocks(markdown);

    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      index: 1,
      lang: null,
      code: 'plain text block',
    });
  });
});
