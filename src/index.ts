export const version = '0.1.0';

export { runCli } from './cli/index.js';
export { exportPng } from './exporter/export-png.js';
export { createCodeHighlighter } from './highlighter/create-highlighter.js';
export { highlightCode } from './highlighter/highlight-code.js';
export { extractCodeBlocks } from './parser/extract-code-blocks.js';
export { calculateLayout } from './renderer/layout.js';
export { renderCardSvg } from './renderer/render-card.js';
