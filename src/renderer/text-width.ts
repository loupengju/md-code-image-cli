import type { HighlightToken, LayoutLineToken } from '../types/index.js';

export function measureTextColumns(text: string): number {
  let width = 0;

  for (const char of text) {
    width += getCharacterColumns(char);
  }

  return width;
}

export function wrapTokensByColumns(tokens: HighlightToken[], maxColumns: number): Array<{
  text: string;
  tokens: LayoutLineToken[];
}> {
  const segments: Array<{ text: string; tokens: LayoutLineToken[] }> = [];
  let currentTokens: LayoutLineToken[] = [];
  let currentText = '';
  let currentColumns = 0;

  const pushCurrent = () => {
    segments.push({
      text: currentText,
      tokens: currentTokens,
    });
    currentTokens = [];
    currentText = '';
    currentColumns = 0;
  };

  for (const token of tokens) {
    let tokenBuffer = '';

    for (const char of token.content) {
      const charColumns = getCharacterColumns(char);

      if (currentColumns > 0 && currentColumns + charColumns > maxColumns) {
        if (tokenBuffer.length > 0) {
          currentTokens.push({
            content: tokenBuffer,
            color: token.color,
            fontStyle: token.fontStyle,
          });
          tokenBuffer = '';
        }

        pushCurrent();
      }

      tokenBuffer += char;
      currentText += char;
      currentColumns += charColumns;
    }

    if (tokenBuffer.length > 0) {
      currentTokens.push({
        content: tokenBuffer,
        color: token.color,
        fontStyle: token.fontStyle,
      });
    }
  }

  if (currentText.length === 0) {
    return [
      {
        text: '',
        tokens: [],
      },
    ];
  }

  if (segments.length === 0 || currentText.length > 0) {
    pushCurrent();
  }

  return segments;
}

function getCharacterColumns(char: string): number {
  const codePoint = char.codePointAt(0);

  if (codePoint == null) {
    return 0;
  }

  if (char === '\t') {
    return 2;
  }

  if (
    (codePoint >= 0x1100 && codePoint <= 0x115f) ||
    (codePoint >= 0x2329 && codePoint <= 0x232a) ||
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf && codePoint !== 0x303f) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
    (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
    (codePoint >= 0xff00 && codePoint <= 0xff60) ||
    (codePoint >= 0xffe0 && codePoint <= 0xffe6) ||
    (codePoint >= 0x20000 && codePoint <= 0x3fffd)
  ) {
    return 2;
  }

  return 1;
}
