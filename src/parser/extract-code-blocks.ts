import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

import type { Code } from 'mdast';

import type { CodeBlock } from '../types/index.js';

export async function extractCodeBlocks(markdown: string): Promise<CodeBlock[]> {
  const tree = remark().use(remarkParse).parse(markdown);
  const blocks: CodeBlock[] = [];
  const lines = markdown.split(/\r?\n/);

  visit(tree, 'code', (node) => {
    const codeNode = node as Code;
    const startLine = codeNode.position?.start.line;

    if (startLine == null || !isFencedCodeBlock(lines[startLine - 1] ?? '')) {
      return;
    }

    blocks.push({
      index: blocks.length + 1,
      lang: codeNode.lang ?? null,
      code: codeNode.value,
      meta: codeNode.meta ?? undefined,
    });
  });

  return blocks;
}

function isFencedCodeBlock(openingLine: string): boolean {
  return /^[ \t]{0,3}(```|~~~)/.test(openingLine);
}
