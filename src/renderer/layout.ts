import type {
  HighlightResult,
  LayoutResult,
  LayoutVisualLine,
  RenderOptions,
} from '../types/index.js';
import { measureTextColumns, wrapTokensByColumns } from './text-width.js';

const CHAR_WIDTH_RATIO = 0.62;
const MIN_CHARS_PER_LINE = 4;
const MAC_WINDOW_HEIGHT = 28;
const FILENAME_HEIGHT = 22;

export function calculateLayout(highlighted: HighlightResult, options: RenderOptions): LayoutResult {
  const contentWidth = options.maxWidth - options.padding * 2;
  const gutterWidth = options.lineNumbers ? calculateGutterWidth(highlighted.lines.length, options.fontSize) : 0;
  const codeWidth = Math.max(options.fontSize, contentWidth - gutterWidth);
  const charWidth = options.fontSize * CHAR_WIDTH_RATIO;
  const maxCharsPerLine = Math.max(MIN_CHARS_PER_LINE, Math.floor(codeWidth / charWidth));
  const visualLines = highlighted.lines.flatMap((line, index) =>
    wrapHighlightedLine(line.tokens, index + 1, maxCharsPerLine),
  );
  const chromeHeight =
    (options.window === 'mac' ? MAC_WINDOW_HEIGHT : 0) + (options.showFilename ? FILENAME_HEIGHT : 0);
  const height = chromeHeight + options.padding * 2 + visualLines.length * options.lineHeight;

  return {
    width: options.maxWidth,
    height,
    contentWidth,
    codeWidth,
    gutterWidth,
    maxCharsPerLine,
    visualLines,
    chromeHeight,
  };
}

function calculateGutterWidth(lineCount: number, fontSize: number): number {
  const digits = String(Math.max(1, lineCount)).length;

  return Math.ceil(digits * fontSize * CHAR_WIDTH_RATIO + fontSize);
}

function wrapHighlightedLine(
  tokens: { content: string; color?: string; fontStyle?: number }[],
  lineNumber: number,
  maxCharsPerLine: number,
): LayoutVisualLine[] {
  const segments = wrapTokensByColumns(tokens, maxCharsPerLine);

  return segments.map((segment, index) => ({
    lineNumber: index === 0 ? lineNumber : null,
    tokens: segment.tokens,
    text: segment.text,
  }));
}
