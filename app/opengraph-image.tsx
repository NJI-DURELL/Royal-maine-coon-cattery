import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Royal Maine Coon Cattery — purebred, health-tested Maine Coon kittens';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#12100c',
          backgroundImage:
            'radial-gradient(circle at 18% 12%, rgba(212,175,55,0.28), transparent 42%), radial-gradient(circle at 85% 92%, rgba(212,175,55,0.20), transparent 45%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '64px'
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 120,
            height: 120,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #e4b573, #d4af37)',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
            fontWeight: 800,
            color: '#12100c'
          }}
        >
          RM
        </div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, marginTop: 36, letterSpacing: -1 }}>
          Royal Maine Coon Cattery
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#e4b573', marginTop: 18 }}>
          Purebred · Health-tested · Raised with love
        </div>
      </div>
    ),
    { ...size }
  );
}
