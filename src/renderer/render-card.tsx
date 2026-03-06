import satori from 'satori';

import { getCodeFonts } from './fonts.js';

import type { HighlightResult, LayoutResult, RenderOptions } from '../types/index.js';

export async function renderCardSvg(
  highlighted: HighlightResult,
  layout: LayoutResult,
  options: RenderOptions,
): Promise<string> {
  const fonts = await getCodeFonts();
  const svg = await satori(<Card highlighted={highlighted} layout={layout} options={options} />, {
    width: layout.width,
    height: layout.height,
    fonts,
  });

  return svg;
}

function Card({
  highlighted,
  layout,
  options,
}: {
  highlighted: HighlightResult;
  layout: LayoutResult;
  options: RenderOptions;
}) {
  const outerBackground = getOuterBackground(options.background);

  return (
    <div
      style={{
        width: layout.width,
        height: layout.height,
        display: 'flex',
        background: outerBackground,
        padding: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: layout.width,
          height: layout.height,
          backgroundColor: highlighted.bg,
          borderRadius: options.radius,
          overflow: 'hidden',
          padding: options.padding,
          color: highlighted.fg,
          fontFamily: `${options.fontFamily}, Noto Sans SC`,
          fontSize: options.fontSize,
        }}
      >
        {options.window === 'mac' ? <MacWindowBar /> : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            marginTop: layout.chromeHeight > 0 && options.window === 'mac' ? 8 : 0,
          }}
        >
          {layout.visualLines.map((line, index) => (
            <div
              key={`${index}-${line.text}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                height: options.lineHeight,
              }}
            >
              {options.lineNumbers ? (
                <div
                  style={{
                    width: layout.gutterWidth,
                    color: '#6e7681',
                    flexShrink: 0,
                  }}
                >
                  {line.lineNumber == null ? '' : String(line.lineNumber)}
                </div>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  whiteSpace: 'pre',
                  flex: 1,
                }}
              >
                {line.tokens.map((token, tokenIndex) => (
                  <span
                    key={`${index}-${tokenIndex}-${token.content}`}
                    style={{
                      color: token.color ?? highlighted.fg,
                      whiteSpace: 'pre',
                      fontStyle: (token.fontStyle ?? 0) & 1 ? 'italic' : 'normal',
                      fontWeight: (token.fontStyle ?? 0) & 2 ? 700 : 400,
                    }}
                  >
                    {token.content}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MacWindowBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 28,
      }}
    >
      <Circle color="#ff5f57" />
      <Circle color="#febc2e" />
      <Circle color="#28c840" />
    </div>
  );
}

function Circle({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        backgroundColor: color,
      }}
    />
  );
}

function getOuterBackground(mode: RenderOptions['background']): string {
  if (mode === 'transparent') {
    return 'transparent';
  }

  if (mode === 'gradient') {
    return 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)';
  }

  return '#111827';
}
