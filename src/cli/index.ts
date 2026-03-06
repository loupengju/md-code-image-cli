#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { Command } from 'commander';

import { exportPng } from '../exporter/export-png.js';
import { createCodeHighlighter } from '../highlighter/create-highlighter.js';
import { highlightCode } from '../highlighter/highlight-code.js';
import { extractCodeBlocks } from '../parser/extract-code-blocks.js';
import { calculateLayout } from '../renderer/layout.js';
import { renderCardSvg } from '../renderer/render-card.js';
import type { CliOptions, CliRunSummary, RenderOptions } from '../types/index.js';
import { ensureDir } from '../utils/ensure-dir.js';
import { buildOutputFileName } from '../utils/file-naming.js';

type RunCliOptions = {
  cwd?: string;
  exportPngOverride?: typeof exportPng;
};

export async function runCli(argv: string[], overrides: RunCliOptions = {}): Promise<CliRunSummary> {
  const cwd = overrides.cwd ?? process.cwd();
  const cliOptions = parseCliArgs(argv, cwd);
  const markdown = await readFile(cliOptions.input, 'utf8');
  const blocks = await extractCodeBlocks(markdown);
  const highlighter = await createCodeHighlighter(cliOptions.theme);
  const renderOptions = toRenderOptions(cliOptions);
  const writePng = overrides.exportPngOverride ?? exportPng;

  await ensureDir(cliOptions.out);

  const summary: CliRunSummary = {
    processed: blocks.length,
    succeeded: 0,
    failed: 0,
    errors: [],
  };

  for (const block of blocks) {
    const outputPath = path.join(cliOptions.out, buildOutputFileName(block.index, block.lang));

    try {
      const highlighted = await highlightCode(highlighter, block.code, block.lang, cliOptions.theme);
      const layout = calculateLayout(highlighted, renderOptions);
      const svg = await renderCardSvg(highlighted, layout, renderOptions);

      await writePng({
        svg,
        outputPath,
        width: layout.width,
        height: layout.height,
        scale: cliOptions.scale,
      });

      summary.succeeded += 1;
    } catch (error) {
      summary.failed += 1;
      summary.errors.push({
        index: block.index,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return summary;
}

function parseCliArgs(argv: string[], cwd: string): CliOptions {
  const program = new Command();

  program
    .name('md-code-image')
    .argument('<input>')
    .option('--out <path>', 'Output directory', './output')
    .option('--theme <theme>', 'Shiki theme name', 'github-dark')
    .option('--line-numbers', 'Render line numbers', false)
    .option('--window <style>', 'Window chrome style', 'none')
    .option('--background <mode>', 'Background mode', 'solid')
    .option('--padding <number>', 'Card padding', '24')
    .option('--radius <number>', 'Card radius', '12')
    .option('--scale <number>', 'PNG scale factor', '2')
    .option('--max-width <number>', 'Maximum card width', '800');

  program.parse(['node', 'md-code-image', ...argv], { from: 'node' });

  const input = program.args[0];
  const options = program.opts();

  return {
    input: path.resolve(cwd, input),
    out: path.resolve(cwd, options.out),
    theme: options.theme,
    lineNumbers: Boolean(options.lineNumbers),
    window: options.window,
    background: options.background,
    padding: Number(options.padding),
    radius: Number(options.radius),
    scale: Number(options.scale),
    maxWidth: Number(options.maxWidth),
  } as CliOptions;
}

function toRenderOptions(options: CliOptions): RenderOptions {
  return {
    theme: options.theme,
    lineNumbers: options.lineNumbers,
    window: options.window,
    background: options.background,
    padding: options.padding,
    radius: options.radius,
    maxWidth: options.maxWidth,
    fontFamily: 'JetBrains Mono',
    fontSize: 16,
    lineHeight: 24,
    showFilename: false,
  };
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const summary = await runCli(argv);

  process.stdout.write(`Processed ${summary.processed} code blocks\n`);
  process.stdout.write(`Succeeded: ${summary.succeeded}\n`);
  process.stdout.write(`Failed: ${summary.failed}\n`);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
