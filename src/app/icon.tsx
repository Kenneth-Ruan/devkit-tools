import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f1117',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
        }}
      >
        <div
          style={{
            color: '#6366f1',
            fontSize: 18,
            fontWeight: 900,
            fontFamily: 'monospace',
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          {'{}'}
        </div>
      </div>
    ),
    { ...size }
  );
}
