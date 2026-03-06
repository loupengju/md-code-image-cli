# md-code-image-cli Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone Node.js CLI that parses Markdown fenced code blocks and exports each one as a syntax-highlighted PNG image.

**Architecture:** The CLI reads one Markdown file, extracts fenced code blocks with `remark`, converts each block to Shiki token lines, lays them out into a card model, renders SVG through Satori, and converts SVG to PNG through `@resvg/resvg-js`. The implementation keeps parsing, highlighting, rendering, and exporting separate so later extensions do not disturb the core pipeline.

**Tech Stack:** TypeScript, Vitest, Commander, remark, remark-parse, unist-util-visit, Shiki, Satori, @resvg/resvg-js

---

### Task 1: Bootstrap the standalone package

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `README.md`
- Create: `src/index.ts`
- Create: `src/types/index.ts`

**Step 1: Write the failing test**

Create a smoke test that imports the public entrypoint and asserts the exported API shape.

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/smoke.test.ts`
Expected: FAIL because the project files do not exist yet.

**Step 3: Write minimal implementation**

Add the TypeScript package skeleton, scripts, and a minimal public entrypoint.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/smoke.test.ts`
Expected: PASS.

### Task 2: Implement Markdown code block extraction

**Files:**
- Create: `src/parser/extract-code-blocks.ts`
- Create: `tests/parser/extract-code-blocks.test.ts`

**Step 1: Write the failing test**

Cover:
- multiple fenced blocks
- language preservation
- indentation and blank-line preservation
- ignoring non-code nodes

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/parser/extract-code-blocks.test.ts`
Expected: FAIL because extractor is missing.

**Step 3: Write minimal implementation**

Parse Markdown with `remark-parse` and traverse with `unist-util-visit` to collect code nodes.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/parser/extract-code-blocks.test.ts`
Expected: PASS.

### Task 3: Implement highlighting with fallback behavior

**Files:**
- Create: `src/highlighter/create-highlighter.ts`
- Create: `src/highlighter/highlight-code.ts`
- Create: `tests/highlighter/highlight-code.test.ts`

**Step 1: Write the failing test**

Cover:
- known language tokenization
- unknown language fallback
- theme colors exposed

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/highlighter/highlight-code.test.ts`
Expected: FAIL because the highlighter helpers do not exist.

**Step 3: Write minimal implementation**

Initialize one Shiki highlighter and map token output to a project-specific line/token model.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/highlighter/highlight-code.test.ts`
Expected: PASS.

### Task 4: Implement layout calculation

**Files:**
- Create: `src/renderer/layout.ts`
- Create: `tests/renderer/layout.test.ts`

**Step 1: Write the failing test**

Cover:
- width budget calculation
- line wrapping
- line-number gutter width
- wrapped continuation line numbering

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/renderer/layout.test.ts`
Expected: FAIL because layout logic is missing.

**Step 3: Write minimal implementation**

Add deterministic monospace layout helpers that convert logical lines into visual lines and compute card dimensions.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/renderer/layout.test.ts`
Expected: PASS.

### Task 5: Implement SVG card rendering

**Files:**
- Create: `src/renderer/fonts.ts`
- Create: `src/renderer/render-card.tsx`
- Create: `tests/renderer/render-card.test.ts`
- Create: `fonts/`

**Step 1: Write the failing test**

Cover:
- SVG output string exists
- mac window chrome rendering
- line-number rendering
- background mode differences

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/renderer/render-card.test.ts`
Expected: FAIL because renderer is missing.

**Step 3: Write minimal implementation**

Load the bundled font, build a JSX tree, and render SVG through Satori.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/renderer/render-card.test.ts`
Expected: PASS.

### Task 6: Implement PNG export

**Files:**
- Create: `src/exporter/export-png.ts`
- Create: `tests/exporter/export-png.test.ts`

**Step 1: Write the failing test**

Cover:
- PNG bytes returned
- output file written
- scaling affects raster size metadata or byte content

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/exporter/export-png.test.ts`
Expected: FAIL because exporter is missing.

**Step 3: Write minimal implementation**

Use `@resvg/resvg-js` to rasterize SVG and persist it to disk.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/exporter/export-png.test.ts`
Expected: PASS.

### Task 7: Implement CLI orchestration

**Files:**
- Create: `src/cli/index.ts`
- Create: `tests/cli/cli.test.ts`
- Create: `fixtures/sample.md`

**Step 1: Write the failing test**

Cover:
- default output directory
- custom flags
- file naming `code-01-js.png`
- continue-on-error batch behavior

**Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/cli/cli.test.ts`
Expected: FAIL because CLI is missing.

**Step 3: Write minimal implementation**

Add argument parsing, default resolution, orchestrated rendering, summary output, and exit-code behavior.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/cli/cli.test.ts`
Expected: PASS.

### Task 8: Final verification and docs

**Files:**
- Modify: `README.md`
- Verify: `tests/`

**Step 1: Run focused tests**

Run:
- `npm test -- --run tests/parser/extract-code-blocks.test.ts`
- `npm test -- --run tests/highlighter/highlight-code.test.ts`
- `npm test -- --run tests/renderer/layout.test.ts`
- `npm test -- --run tests/renderer/render-card.test.ts`
- `npm test -- --run tests/exporter/export-png.test.ts`
- `npm test -- --run tests/cli/cli.test.ts`

Expected: PASS.

**Step 2: Run full suite**

Run: `npm test`
Expected: PASS.

**Step 3: Update README**

Document installation, usage, options, output naming, limitations, and development commands.

**Step 4: Final verification**

Run: `npm test`
Expected: PASS after documentation changes.
