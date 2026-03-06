# md-code-image-cli Design

## Goal

Build a pure Node.js CLI that extracts fenced code blocks from a Markdown file and exports each block as a syntax-highlighted PNG image without any browser runtime.

## Constraints

- Must use `remark`, `remark-parse`, and `unist-util-visit` for Markdown parsing.
- Must use `shiki` for syntax highlighting.
- Must use `satori` for JSX-to-SVG rendering.
- Must use `@resvg/resvg-js` for SVG-to-PNG rendering.
- Must not use Puppeteer, Playwright, Electron, DOM APIs, or HTML screenshot workflows.
- Docker support is no longer required.

## Architecture

The pipeline is:

`Markdown file` -> `remark AST` -> `code block extraction` -> `Shiki token lines` -> `layout engine` -> `Satori JSX` -> `SVG` -> `resvg PNG` -> `filesystem output`

The renderer follows a token-first design. Shiki only provides tokenized lines and theme colors. Layout, soft wrapping, line numbers, window chrome, padding, radius, and output sizing are all computed in Node.js and rendered directly with Satori components.

## Module Layout

```text
src/
  cli/
  parser/
  highlighter/
  renderer/
  exporter/
  utils/
  types/
```

- `src/cli`: parse flags, validate inputs, orchestrate the pipeline, report summary.
- `src/parser`: read Markdown and extract fenced code blocks with language metadata.
- `src/highlighter`: initialize and cache the Shiki highlighter, map code to token lines.
- `src/renderer`: compute dimensions and wrap points, build the code card JSX tree, render SVG through Satori.
- `src/exporter`: render PNGs with resvg and write them to disk.
- `src/utils`: naming, directories, validation, formatting helpers.
- `src/types`: shared runtime models.

## Data Model

```ts
type CodeBlock = {
  index: number;
  lang: string | null;
  code: string;
  meta?: string;
};

type CliOptions = {
  input: string;
  out: string;
  theme: string;
  lineNumbers: boolean;
  window: 'mac' | 'none';
  background: 'solid' | 'gradient' | 'transparent';
  padding: number;
  radius: number;
  scale: 1 | 2 | 3;
  maxWidth: number;
};

type HighlightedLine = {
  tokens: Array<{ content: string; color?: string; fontStyle?: number }>;
};
```

## Rendering Strategy

### Fonts

The project vendors a monospace font into `fonts/` so layout is stable across machines. Satori loads the font as an `ArrayBuffer` during startup.

### Width and Wrap

The renderer uses a deterministic monospace width estimate based on font size and a fixed width ratio. Available code width is:

`maxWidth - padding*2 - optional line number gutter`

Each logical line is split into one or more visual lines when it exceeds the computed character budget. Wrapped continuation rows keep the same token styling but do not increment the displayed line number.

### Card Chrome

- Optional Mac-style window bar.
- Optional line number gutter.
- Theme-derived code background and foreground colors.
- Configurable outer background mode: solid, gradient, transparent.
- Configurable padding, radius, and scale.

## CLI Contract

Default command:

```bash
md-code-image input.md
```

Default behavior:

- output directory: `./output`
- default theme
- no line numbers
- no window chrome
- scale `2`

Supported flags:

- `--out`
- `--theme`
- `--line-numbers`
- `--window`
- `--background`
- `--padding`
- `--radius`
- `--scale`
- `--max-width`

## Error Handling

- Missing input file: fail fast, exit non-zero.
- Unknown language: fall back to plain text highlighting.
- Unknown theme: fail fast with a clear message.
- Per-block render failure: log the error, continue processing remaining blocks.
- Output directories are created automatically.

## Testing Strategy

- Parser unit tests for extraction correctness and formatting preservation.
- Highlighter unit tests for supported and unsupported languages.
- Layout unit tests for wrapping, dimensions, and line-number behavior.
- CLI integration tests for PNG export count, naming, and continue-on-error behavior.

## Non-Goals For v1

- Folder-wide Markdown discovery.
- Language filtering.
- SVG export.
- Watermarks.
- Web API mode.
- Social-media preset layouts.
