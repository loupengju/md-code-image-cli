# md-code-image-cli

Generate syntax-highlighted PNG images from Markdown fenced code blocks in pure Node.js.

Built-in font fallback covers Latin code text and Simplified Chinese comments/strings.

The published package vendors the runtime fonts it needs. Font license notices are included in `LICENSES/`.

## Requirements

- Node.js 18+

## Install

```bash
npm install
```

From npm:

```bash
npm install -g md-code-image-cli
```

## Build

```bash
npm run build
```

## Usage

```bash
node dist/cli/index.js input.md
```

Installed globally:

```bash
md-code-image input.md
```

Or in development:

```bash
npm run dev -- input.md
```

## Options

- `--out <path>`: output directory, default `./output`
- `--theme <theme>`: Shiki theme, default `github-dark`
- `--line-numbers`: render line numbers
- `--window <mac|none>`: window chrome style, default `none`
- `--background <solid|gradient|transparent>`: outer background, default `solid`
- `--padding <number>`: card padding, default `24`
- `--radius <number>`: card radius, default `12`
- `--scale <1|2|3>`: PNG export scale, default `2`
- `--max-width <number>`: maximum card width, default `800`

## Output

Each fenced code block is exported as a separate PNG:

```text
output/
  code-01-js.png
  code-02-ts.png
  code-03-bash.png
```

Unnamed or unsupported languages fall back to `txt` for filenames and plaintext highlighting for rendering.

## Development

```bash
npm test
```

## Publish Notes

Local manual publish:

```bash
npm test
npm run build
npm publish
```

`prepublishOnly` already runs test and build automatically.

Automated publish:

- Every push or merge into `main` bumps the patch version automatically
- The workflow commits the updated `package.json` and `package-lock.json`
- The same workflow tags the release as `v<version>` and publishes to npm

## License

- Project code: `MIT`, see `LICENSE`
- Bundled fonts: `SIL Open Font License 1.1`, see `LICENSES/`
