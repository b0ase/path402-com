import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * PUBLIC x402 Content/Token Resolution Endpoint
 *
 * Resolves $402 tokens, content access, and payment status.
 * This is the core endpoint that x402 nodes serve to external apps.
 *
 * GET /api/content/resolve?address=$npgx.website/$MIKA
 * GET /api/content/resolve?holder=alice&token=$npgx.website/$MIKA
 * GET /api/content/resolve?domain=npgx.website
 *
 * No auth required — token metadata is public.
 * Holdings queries require holder param.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  const holder = req.nextUrl.searchParams.get('holder')
  const domain = req.nextUrl.searchParams.get('domain')
  const txid = req.nextUrl.searchParams.get('txid')

  if (!address && !holder && !domain && !txid) {
    return NextResponse.json(
      { error: 'Provide address, holder, domain, or txid' },
      { status: 400, headers: CORS_HEADERS },
    )
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503, headers: CORS_HEADERS },
    )
  }

  try {
    // Resolve token by address (e.g. "$npgx.website/$MIKA")
    if (address) {
      const token = await resolveToken(address)
      if (!token) {
        return NextResponse.json(
          { token: null, message: 'Token not found' },
          { headers: CORS_HEADERS },
        )
      }

      // If holder specified, include their holdings
      let holdings = null
      if (holder) {
        holdings = await getHoldings(address, holder)
      }

      return NextResponse.json(
        { token, holdings, node: 'path402.com', protocol: '$402' },
        { headers: CORS_HEADERS },
      )
    }

    // List all tokens for a domain
    if (domain) {
      const tokens = await resolveByDomain(domain)
      return NextResponse.json(
        { tokens, domain, node: 'path402.com', protocol: '$402' },
        { headers: CORS_HEADERS },
      )
    }

    // Resolve a holder's portfolio
    if (holder) {
      const portfolio = await resolveHolderPortfolio(holder)
      return NextResponse.json(
        { holder, portfolio, node: 'path402.com', protocol: '$402' },
        { headers: CORS_HEADERS },
      )
    }

    // Verify a specific transaction
    if (txid) {
      const tx = await resolveTransaction(txid)
      return NextResponse.json(
        { transaction: tx, node: 'path402.com', protocol: '$402' },
        { headers: CORS_HEADERS },
      )
    }

    return NextResponse.json(
      { error: 'No resolution strategy matched' },
      { status: 400, headers: CORS_HEADERS },
    )
  } catch (e) {
    console.error('[content/resolve] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Resolution failed' },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}

// ── Resolution Strategies ───────────────────────────────────────────────────

interface ResolvedToken {
  address: string
  name: string
  description: string
  contentType: string
  pricingModel: string
  currentPriceSats: number
  totalSupply: number
  maxSupply: number
  holdersCount: number
  isActive: boolean
  isVerified: boolean
  accessUrl: string | null
  iconUrl: string | null
  issuer: { handle: string; address: string }
  parent: string | null
  createdAt: string
}

async function resolveToken(address: string): Promise<ResolvedToken | null> {
  const { data: token } = await supabase!
    .from('tokens')
    .select('*')
    .eq('address', address)
    .eq('is_active', true)
    .single()

  if (!token) return null

  // Get holder count
  const { count } = await supabase!
    .from('token_holdings')
    .select('*', { count: 'exact', head: true })
    .eq('token_address', address)
    .gt('balance', 0)

  return {
    address: token.address,
    name: token.name,
    description: token.description || '',
    contentType: token.content_type || 'general',
    pricingModel: token.pricing_model || 'alice_bond',
    currentPriceSats: token.base_price_sats || 0,
    totalSupply: token.total_supply || 0,
    maxSupply: token.max_supply || 0,
    holdersCount: count || 0,
    isActive: token.is_active,
    isVerified: token.is_verified || false,
    accessUrl: token.access_url,
    iconUrl: token.icon_url,
    issuer: {
      handle: token.issuer_handle || '',
      address: token.issuer_address || '',
    },
    parent: token.parent_address || null,
    createdAt: token.created_at,
  }
}

async function resolveByDomain(domain: string): Promise<ResolvedToken[]> {
  // Match tokens whose address starts with $domain
  const prefix = `$${domain}`
  const { data: tokens } = await supabase!
    .from('tokens')
    .select('*')
    .like('address', `${prefix}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(100)

  if (!tokens?.length) return []

  return tokens.map((t: any) => ({
    address: t.address,
    name: t.name,
    description: t.description || '',
    contentType: t.content_type || 'general',
    pricingModel: t.pricing_model || 'alice_bond',
    currentPriceSats: t.base_price_sats || 0,
    totalSupply: t.total_supply || 0,
    maxSupply: t.max_supply || 0,
    holdersCount: 0,
    isActive: t.is_active,
    isVerified: t.is_verified || false,
    accessUrl: t.access_url,
    iconUrl: t.icon_url,
    issuer: { handle: t.issuer_handle || '', address: t.issuer_address || '' },
    parent: t.parent_address || null,
    createdAt: t.created_at,
  }))
}

interface HoldingInfo {
  balance: number
  stakedBalance: number
  totalAcquired: number
  totalSpentSats: number
  avgCostSats: number
}

async function getHoldings(tokenAddress: string, holder: string): Promise<HoldingInfo | null> {
  const { data } = await supabase!
    .from('token_holdings')
    .select('*')
    .eq('token_address', tokenAddress)
    .or(`holder_handle.eq.${holder},holder_address.eq.${holder}`)
    .single()

  if (!data) return null

  return {
    balance: data.balance || 0,
    stakedBalance: data.staked_balance || 0,
    totalAcquired: data.total_acquired || 0,
    totalSpentSats: data.total_spent_sats || 0,
    avgCostSats: data.avg_cost_sats || 0,
  }
}

async function resolveHolderPortfolio(holder: string) {
  const { data } = await supabase!
    .from('token_holdings')
    .select('*, tokens!inner(name, address, content_type, is_active)')
    .or(`holder_handle.eq.${holder},holder_address.eq.${holder}`)
    .gt('balance', 0)
    .limit(100)

  if (!data?.length) return []

  return data.map((h: any) => ({
    token: {
      address: h.tokens?.address,
      name: h.tokens?.name,
      contentType: h.tokens?.content_type,
    },
    balance: h.balance,
    stakedBalance: h.staked_balance || 0,
    totalAcquired: h.total_acquired || 0,
  }))
}

async function resolveTransaction(txid: string) {
  // Check x402 inscriptions
  const { data: inscription } = await supabase!
    .from('x402_inscriptions')
    .select('*')
    .eq('payment_tx_id', txid)
    .single()

  if (inscription) {
    return {
      type: 'x402_inscription',
      ...inscription,
    }
  }

  // Check token transactions
  const { data: tokenTx } = await supabase!
    .from('token_transactions')
    .select('*')
    .eq('payment_tx_id', txid)
    .single()

  if (tokenTx) {
    return {
      type: 'token_transaction',
      ...tokenTx,
    }
  }

  return null
}
