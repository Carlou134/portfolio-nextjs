import { ImageResponse } from 'next/og';

export const alt = 'Carlos Vásquez — Fullstack Developer | DevOps & IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '96px',
          backgroundColor: '#0A0F1E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#00E5A0',
              display: 'flex',
            }}
          />
          <span style={{ fontSize: 30, color: '#9CA3AF' }}>Disponible · Lima, Perú</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 80,
            fontWeight: 700,
            color: '#F9FAFB',
            marginTop: 32,
          }}
        >
          Carlos Vásquez
        </div>

        <div style={{ display: 'flex', fontSize: 40, color: '#00E5A0', marginTop: 20 }}>
          Fullstack Developer · DevOps & IA
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#9CA3AF', marginTop: 32 }}>
          .NET · React · Next.js · IA aplicada
        </div>
      </div>
    ),
    { ...size }
  );
}
