import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monoFontPath = path.resolve(__dirname, '../../fonts/JetBrainsMono-Regular.woff');
const cjkFontPath = path.resolve(__dirname, '../../fonts/NotoSansSC-Regular.woff');

type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: 'normal';
};

let fontDataPromise: Promise<SatoriFont[]> | null = null;

export async function getCodeFonts(): Promise<SatoriFont[]> {
  if (!fontDataPromise) {
    fontDataPromise = loadAllCodeFonts();
  }

  return fontDataPromise;
}

async function loadAllCodeFonts(): Promise<SatoriFont[]> {
  return Promise.all([
    loadFont('JetBrains Mono', monoFontPath),
    loadFont('Noto Sans SC', cjkFontPath),
  ]);
}

async function loadFont(name: string, fontPath: string): Promise<SatoriFont> {
  const buffer = await readFile(fontPath);

  return {
    name,
    data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    weight: 400,
    style: 'normal',
  };
}
