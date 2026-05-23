import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f1117',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            background: '#1a1d27',
            borderRadius: 18,
            border: '2px solid #2a2d3a',
            marginBottom: 32,
          }}
        >
          <div style={{ color: '#6366f1', fontSize: 36, fontWeight: 900, fontFamily: 'monospace' }}>
            {'{}'}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: -2,
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Dev Tooling Online
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: 28,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          30+ free developer tools. No login required.
        </div>

        {/* Tool pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900 }}>
          {['JSON Formatter', 'Base64', 'URL Encode', 'JWT Decoder', 'Regex Tester', 'UUID Generator', 'Timestamp', 'Text Diff'].map((tool) => (
            <div
              key={tool}
              style={{
                background: '#1a1d27',
                border: '1px solid #2a2d3a',
                borderRadius: 8,
                padding: '8px 16px',
                color: '#94a3b8',
                fontSize: 18,
              }}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
