export type CodeBlock = {
  index: number;
  lang: string | null;
  code: string;
  meta?: string;
};

export type HighlightToken = {
  content: string;
  color?: string;
  fontStyle?: number;
};

export type HighlightedLine = {
  tokens: HighlightToken[];
};

export type HighlightResult = {
  lines: HighlightedLine[];
  fg: string;
  bg: string;
  themeName: string;
  language: string;
};

export type WindowStyle = 'mac' | 'none';
export type BackgroundMode = 'solid' | 'gradient' | 'transparent';

export type CliOptions = {
  input: string;
  out: string;
  theme: string;
  lineNumbers: boolean;
  window: WindowStyle;
  background: BackgroundMode;
  padding: number;
  radius: number;
  scale: 1 | 2 | 3;
  maxWidth: number;
};

export type RenderOptions = Omit<CliOptions, 'input' | 'out' | 'theme' | 'scale'> & {
  theme: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  showFilename: boolean;
  filename?: string;
};

export type LayoutLineToken = {
  content: string;
  color?: string;
  fontStyle?: number;
};

export type LayoutVisualLine = {
  lineNumber: number | null;
  tokens: LayoutLineToken[];
  text: string;
};

export type LayoutResult = {
  width: number;
  height: number;
  contentWidth: number;
  codeWidth: number;
  gutterWidth: number;
  maxCharsPerLine: number;
  visualLines: LayoutVisualLine[];
  chromeHeight: number;
};

export type CliRunSummary = {
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ index: number; message: string }>;
};
