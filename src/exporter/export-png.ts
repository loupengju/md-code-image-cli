import { writeFile } from 'node:fs/promises';

import { Resvg } from '@resvg/resvg-js';

export async function exportPng({
  svg,
  outputPath,
  width,
  height,
  scale,
}: {
  svg: string;
  outputPath: string;
  width: number;
  height: number;
  scale: number;
}): Promise<Uint8Array> {
  const renderer = new Resvg(svg, {
    fitTo: {
      mode: 'zoom',
      value: scale,
    },
    imageRendering: 0,
    background: 'rgba(0, 0, 0, 0)',
  });
  const rendered = renderer.render();
  const png = rendered.asPng();

  await writeFile(outputPath, png);

  return png;
}
