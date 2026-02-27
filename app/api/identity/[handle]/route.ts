import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateStrength } from '@/lib/strand-strength';

// GET /api/identity/:handle — public $401 identity lookup
// No auth required — identity levels are publicly verifiable by design
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { handle } = await params;

  if (!handle || handle.length > 64) {
    return NextResponse.json({ error: 'Invalid handle' }, { status: 400 });
  }

  // 1. Look up holder by handle
  const { data: holder } = await supabase
    .from('path402_holders')
    .select('id, handle, provider')
    .eq('handle', handle)
    .single();

  if (!holder) {
    return NextResponse.json({ error: 'Handle not found' }, { status: 404 });
  }

  // 2. Get identity token
  const { data: identity } = await supabase
    .from('path402_identity_tokens')
    .select('id, symbol, token_id, broadcast_status, created_at')
    .eq('holder_id', holder.id)
    .single();

  if (!identity) {
    return NextResponse.json({
      handle,
      identity: null,
      strength: { level: 'none', levelNumber: 0, label: 'None', score: 0 },
      strandCount: 0,
      strands: [],
    });
  }

  // 3. Get active strands
  const { data: strands } = await supabase
    .from('path401_identity_strands')
    .select('provider, strand_type, strand_subtype, label, source, on_chain, created_at')
    .eq('identity_token_id', identity.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  const activeStrands = strands || [];

  // 4. Calculate live strength
  const strength = calculateStrength(activeStrands);

  return NextResponse.json({
    handle,
    identity: {
      symbol: identity.symbol,
      tokenId: identity.token_id,
      broadcastStatus: identity.broadcast_status,
    },
    strength: {
      level: strength.level,
      levelNumber: strength.levelNumber,
      label: strength.label,
      score: strength.score,
    },
    strandCount: activeStrands.length,
    strands: activeStrands.map(s => ({
      provider: s.provider,
      strandType: s.strand_type,
      strandSubtype: s.strand_subtype,
      label: s.label,
      source: s.source,
      onChain: s.on_chain,
    })),
  });
}
