import { ImageResponse } from 'next/og';
import { getChannel, getAgentsByChannel } from '@/lib/agents/data';

export const runtime = 'nodejs';

export const alt = 'F.NEWS — Synthetic Media Marketplace';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ channel: string }> }) {
  const { channel: slug } = await params;
  const channel = getChannel(slug);

  if (!channel) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>
        404
      </div>,
      { ...size }
    );
  }

  const agents = getAgentsByChannel(slug);
  const isFnews = slug === 'fnews';
  const isBmovies = slug === 'bmovies';
  const accentColor = isFnews ? '#dc2626' : isBmovies ? '#d97706' : '#3b82f6';
  const gridRgb = isFnews ? '220, 38, 38' : isBmovies ? '217, 119, 6' : '59, 130, 246';
  const glowRgba = isFnews
    ? 'rgba(220, 38, 38, 0.1)'
    : isBmovies
      ? 'rgba(217, 119, 6, 0.1)'
      : 'rgba(59, 130, 246, 0.08)';
  const nameShadowRgba = isFnews
    ? 'rgba(220, 38, 38, 0.4)'
    : isBmovies
      ? 'rgba(217, 119, 6, 0.4)'
      : 'rgba(59, 130, 246, 0.4)';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000000',
          position: 'relative',
          fontFamily: 'monospace',
          padding: '48px 56px',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(${gridRgb}, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(${gridRgb}, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            display: 'flex',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '600px',
            height: '400px',
            background: `radial-gradient(ellipse at center, ${glowRgba} 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderLeft: '2px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(255,255,255,0.08)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRight: '2px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(255,255,255,0.08)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderLeft: '2px solid rgba(255,255,255,0.08)', borderBottom: '2px solid rgba(255,255,255,0.08)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderRight: '2px solid rgba(255,255,255,0.08)', borderBottom: '2px solid rgba(255,255,255,0.08)', display: 'flex' }} />

        {/* Status row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, zIndex: 10 }}>
          <div style={{ width: 12, height: 12, background: accentColor, borderRadius: '50%', display: 'flex' }} />
          <div style={{ fontSize: 14, color: '#71717a', letterSpacing: '0.2em', textTransform: 'uppercase' as const, display: 'flex' }}>
            {isFnews ? 'Unverified // Synthetic // Satire' : `${agents.length} Agents Online`}
          </div>
        </div>

        {/* Channel name */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
            display: 'flex',
            textShadow: `0 0 60px ${nameShadowRgba}`,
          }}
        >
          {channel.name}
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 22, color: '#a1a1aa', letterSpacing: '0.15em', marginBottom: 40, display: 'flex', textTransform: 'uppercase' as const }}>
          {channel.tagline}
        </div>

        {/* Agent roster */}
        <div style={{ display: 'flex', gap: 48, zIndex: 10, flexWrap: 'wrap' as const }}>
          {agents.slice(0, 5).map((agent) => (
            <div key={agent.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 10, color: '#52525b', letterSpacing: '0.2em', textTransform: 'uppercase' as const, display: 'flex' }}>
                Agent
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', display: 'flex' }}>
                {agent.name}
              </div>
              <div style={{ fontSize: 12, color: '#71717a', display: 'flex' }}>
                {agent.price} SAT
              </div>
            </div>
          ))}
        </div>

        {/* Content warning badge for fnews */}
        {isFnews && (
          <div
            style={{
              position: 'absolute',
              top: 60,
              right: 80,
              width: 160,
              height: 160,
              border: '3px solid rgba(220, 38, 38, 0.5)',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-12deg)',
              zIndex: 10,
            }}
          >
            <div style={{ color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontSize: 10, display: 'flex', marginBottom: 4 }}>
              Content Warning
            </div>
            <div style={{ color: 'rgba(220, 38, 38, 0.5)', fontSize: 20, fontWeight: 900, display: 'flex' }}>
              {channel.badge}
            </div>
            <div style={{ color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: 7, display: 'flex', marginTop: 4 }}>
              Reality Check Required
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 56,
            right: 56,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, background: accentColor, borderRadius: '50%', display: 'flex' }} />
            <div style={{ fontSize: 16, color: '#52525b', display: 'flex' }}>
              path402.com/market/{slug}
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '0.15em', display: 'flex' }}>
            $402 // {isFnews ? 'THE REALEST FAKE NEWS' : channel.name}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
