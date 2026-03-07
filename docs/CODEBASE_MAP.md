---
last_mapped: 2026-03-06T00:00:00Z
total_files: 209
total_tokens: 373000
---

# path402.com — Codebase Map

Website for the $402 protocol. Next.js 16.1.6, React 19, TypeScript, Tailwind, Framer Motion 12.

## Architecture Overview

**Features**: Token-gated content, P2P video chat with payment streaming, live broadcasting, $401 identity integration, BSV-21 tokens, dual-token architecture (500M platform token + 21M HTM PoW20), HandCash/Yours/Metanet wallet support, derived non-custodial BSV wallet, multi-tenant token registry.

### Technology Stack
- **Frontend**: Next.js 16.1.6 (App Router, no src/ directory), React 19, TypeScript, Tailwind CSS, Framer Motion 12
- **Blockchain**: BSV-21 tokens, Ordinals, P2PKH transactions, Proof of Indexing
- **Wallets**: HandCash OAuth, Yours Wallet v4.5.x (browser extension), Metanet/Babbage SDK
- **WebRTC**: P2P video + payment channels (RTCDataChannel '$402-payment'), polling-based signaling
- **Database**: Supabase (Hetzner) with fallback in-memory store
- **Package Manager**: pnpm (never npm/yarn)

### System Flow

```
User Browser (Wallet Connect)
    ↓
WalletProvider → HandCash OAuth / Yours Extension / Metanet Babbage
    ↓
API Routes (45 endpoints across 8 groups)
    ↓
lib/store.ts (Token holder, purchase, stake, dividend management)
lib/tokens/ (Multi-tenant registry + pricing models)
lib/webrtc/ (P2P video + payment channels)
lib/x402/ (x402 protocol verification + inscription)
lib/bsv*.ts (BSV transaction library)
    ↓
Supabase (self-hosted on Hetzner)
AND/OR
In-Memory Fallback Store
    ↓
BSV Blockchain (GorillaPool, WhatsOnChain, 1satordinals)
```

---

## Directory Structure

### `/app` — Pages & Routes (32 pages, 45 API routes)

#### Pages (User-Facing Routes)

```
app/
├── page.tsx                           # Home: $402 protocol overview
├── 402/page.tsx                       # Platform token purchase page
├── $402/page.tsx                      # HTM PoW20 explainer
├── 401/page.tsx                       # $401 identity marketing
├── 403/page.tsx                       # $403 securities protocol (future)
├── account/page.tsx                   # User account dashboard
├── settings/page.tsx                  # Account settings
├── wallet/page.tsx                    # Wallet dashboard (balances, addresses)
├── portfolio/page.tsx                 # Multi-token portfolio view
├── exchange/page.tsx                  # Token marketplace
├── registry/page.tsx                  # Multi-tenant token registry browser
├── token/page.tsx                     # Platform token details page
├── chat/page.tsx                      # P2P video chat entrypoint
├── chat/VideoCallPage.tsx             # WebRTC video UI component
├── live/page.tsx                      # Token-gated live streaming
├── live/LivePage.tsx                  # Live streaming UI
├── identity/page.tsx                  # $401 identity management (strands, KYC)
├── mint/page.tsx                      # Token minting (preview-only, requires desktop)
├── issue/page.tsx                     # Create/issue new tokens (preview, desktop link)
├── claw-miner/page.tsx                # ClawMiner info + download
├── claw-miner/ClawMinerPage.tsx       # ClawMiner UI component
├── download/page.tsx                  # Download desktop client + ClawMinerd
├── market/page.tsx                    # F.NEWS satirical content marketplace
├── b0x/page.tsx                       # b0ase studio intro page
├── whitepaper/page.tsx                # $402 whitepaper (rendered markdown)
├── whitepaper/academic/page.tsx       # Academic whitepaper version
├── x-protocol/page.tsx                # x402 protocol whitepaper
├── protocol/page.tsx                  # Protocol overview/explainer
├── docs/page.tsx                      # Documentation hub
├── docs/spec/page.tsx                 # Technical spec
├── docs/domain-verification/page.tsx  # Domain verification guide
├── library/page.tsx                   # Content library
├── exec-summary/page.tsx              # Executive summary
├── site-index/page.tsx                # Site index/sitemap
└── blog/dns-vs-sdk/page.tsx           # Blog: DNS vs SDK comparison
```

#### API Routes (45 endpoints across 8 groups)

**Auth & Session (5 routes)**
```
/api/auth/handcash/route.ts            # Start HandCash OAuth flow
/api/auth/callback/handcash/route.ts   # OAuth callback (sets cookies)
/api/auth/session/route.ts             # Get authenticated user session
/api/auth/sign/route.ts                # Sign message with wallet
/api/auth/logout/route.ts              # Logout + clear cookies
```

**Account & Wallet (5 routes)**
```
/api/account/derive/route.ts           # Derive non-custodial BSV wallet
/api/account/store-wallet/route.ts     # Store encrypted wallet on server
/api/wallet/register/route.ts          # Register wallet address
/api/wallet/encrypted/route.ts         # Get encrypted WIF
/api/wallet/export/route.ts            # Export decrypted WIF (server-side decryption)
```

**Platform Token (9 routes)**
```
/api/token/buy/route.ts                # Purchase platform tokens (sqrt_decay pricing)
/api/token/price/route.ts              # Get current token price
/api/token/stats/route.ts              # Token supply, circulating, staked, treasury
/api/token/holding/route.ts            # Get user's token balance
/api/token/cap-table/route.ts          # Get cap table (all holders)
/api/token/confirm/route.ts            # Confirm purchase via tx hash
/api/token/preview/route.ts            # Preview token purchase without paying
/api/token/onchain/route.ts            # Verify on-chain token balance
/api/token/withdraw/route.ts           # Withdraw tokens to wallet
```

**Multi-Tenant Token Registry (6 routes)**
```
/api/tokens/route.ts                   # Create new token (with domain verification)
/api/tokens/[address]/route.ts         # Get token by creator address
/api/tokens/[address]/stream/route.ts  # Stream token balances (Server-Sent Events)
/api/tokens/holdings/route.ts          # Get all token holdings for user
/api/tokens/history/route.ts           # Transaction history
/api/tokens/transfer/route.ts          # Transfer tokens between users
```

**Staking & Dividends (4 routes)**
```
/api/stake/route.ts                    # Stake tokens (lock for dividend eligibility)
/api/stake/claim/route.ts              # Unstake tokens + claim dividends
/api/dividends/distribute/route.ts     # Distribute dividends to stakers (admin)
/api/dividends/pending/route.ts        # Get pending dividends for user
```

**WebRTC Signaling & Broadcasting (4 routes)**
```
/api/signal/route.ts                   # WebRTC signaling relay (polling-based)
/api/rooms/route.ts                    # List broadcast rooms
/api/rooms/join/route.ts               # Join broadcast room (HTTP 402 if not token-gated)
```

**x402 Protocol (5 routes)**
```
/api/x402/verify/route.ts              # Verify x402 signature (stub)
/api/x402/inscription/route.ts         # Create x402 inscription (in-memory)
/api/x402/inscription/[id]/route.ts    # Get inscription by ID
/api/x402/settle/route.ts              # Settle payment channel
/api/x402/stats/route.ts               # Get x402 stats
```

**Domain & Identity (5 routes)**
```
/api/domain/verify/route.ts            # Verify domain ownership
/api/domain/verify-template/route.ts   # Get DNS/HTTP verification template
/api/domain/verify-inscribe/route.ts   # Inscribe domain proof on chain
/api/domain/verify-payload/route.ts    # Verify domain signature payload
/api/identity/[handle]/route.ts        # Get identity by handle (public)
/api/client/identity/route.ts          # Get authenticated user's identity
```

**Utilities (2 routes)**
```
/api/price/bsv/route.ts                # Get BSV/USD price
```

**Well-Known & Metadata (3 routes)**
```
/.well-known/ai-plugin.json/route.ts   # ChatGPT plugin manifest
/.well-known/x402.json/route.ts        # x402 protocol metadata
/.well-known/$402.json/route.ts        # Platform token metadata
```

### `/lib` — Core Libraries (31 files)

#### Token Management (`lib/store.ts`, `lib/tokens/`)

**`lib/store.ts`** — Token holder & purchase persistence (540 lines)
- `getOrCreateHolder()` — Create or fetch token holder by address/handle
- `getTokenStats()` — Total supply, circulating, staked, treasury balance
- `createPurchase()` — Create pending purchase record
- `confirmPurchase()` — Mark purchase confirmed + update holder balance
- `stakeTokens()` — Lock tokens for dividend eligibility
- `unstakeTokens()` — Unlock tokens (LIFO order)
- `distributeDividends()` — Distribute staking rewards
- `claimDividends()` — Claim pending dividend payouts
- `getCapTable()` — All holders sorted by balance
- Falls back to in-memory Map if Supabase unavailable

**`lib/tokens/index.ts`** — Multi-tenant token registry
- Register new tokens by domain verification
- Query tokens by creator address
- Track holdings across all tokens

**`lib/tokens/types.ts`** — Token types
- `PricingModel` — 'alice_bond', 'sqrt_decay', 'fixed', 'linear_decay'
- `Token` — symbol, supply, creator, pricing config
- `TokenHolder` — holdings per token

**`lib/tokens/pricing.ts`** — Dynamic pricing models (250 lines)
- `alice_bond()` — Bonding curve (default): price = c × n, early buyers get more
- `sqrt_decay()` — Price = base / sqrt(treasury+1), rewards early buyers as supply depletes
- `fixed()` — Static price per token
- `linear_decay()` — Linear increase as treasury shrinks
- `calibrateConstant()` — Tune bonding curve constant for desired cost-to-acquire-1%
- `calculateTokensForSpend()` — Reverse lookup: how many tokens for $X spend?
- `generatePriceSchedule()` — Price history at different supply levels

#### Blockchain & Transactions (`lib/bsv*.ts`)

**`lib/bsv-send.ts`** — P2PKH BSV payment
- Construct & broadcast simple P2PKH transactions
- Used for token purchases via HandCash

**`lib/bsv-inscribe.ts`** — Ordinals inscription
- Inscribe data on BSV (used for x402 proofs)

**`lib/bsv-verify.ts`** — On-chain payment verification
- Verify transactions are confirmed on-chain
- Check against WhatsOnChain / GorillaPool APIs

**`lib/bsv20-transfer.ts`** — BSV-20 token transfer
- Transfer BSV-20 / BSV-21 tokens
- Used for dividend payouts

**`lib/bsv20.ts`** — BSV-20 utilities

**`lib/bsv-domain-proof.ts`** — Domain verification proof
- Verify domain ownership via on-chain signature

#### Wallet & Auth

**`lib/address-derivation.ts`** — Server-side wallet derivation
- HMAC-SHA256(key: 'PATH402-v1', data: signature + handle) → seed
- Generate P2PKH private key deterministically
- Returns WIF once on first derivation, then encrypted form only

**`lib/client-wallet.ts`** — Client-side wallet derivation
- Browser-side: PBKDF2(100K iterations) + AES-256-GCM encryption
- Protects WIF locally without server involvement

**`lib/types.ts`** — Wallet & token types (138 lines)
- `TOKEN_CONFIG` — $402 HTM PoW20 + legacy $PATH402
- `WalletState` — Connected wallet status, address, balance
- `TokenHolder` — balance, staked, purchased, withdrawn, dividends
- `TokenPurchase`, `Stake`, `Dividend`, `DividendClaim` types
- `YoursWallet` interface for v4.5.x compatibility

#### WebRTC & Streaming (`lib/webrtc/`)

**`lib/webrtc/useWebRTC.ts`** — Main WebRTC hook (300+ lines)
- States: idle → lobby → connecting → connected → ended
- Audio/video toggle, call duration tracking
- ICE candidate buffering (wait for remote description before adding)
- Teardown cleanup on disconnect

**`lib/webrtc/usePaymentChannel.ts`** — Payment channel streaming
- RTCDataChannel named '$402-payment'
- 1 token per second bilateral streaming (caller & callee)
- Automatically calculates cost based on call duration

**`lib/webrtc/useBroadcast.ts`** — Broadcaster hook
- Up to 8 concurrent viewers per room
- Token deduction per viewer per second
- Automatic room creation + cleanup

**`lib/webrtc/useViewer.ts`** — Viewer hook
- Connect to broadcast room
- HTTP 402 response if not token-gated / insufficient balance

**`lib/webrtc/signaling.ts`** — Polling-based signaling relay
- In-memory message queue
- 300ms polling interval (not production-grade for multi-instance)
- Signal types: offer, answer, ice-candidate

**`lib/webrtc/ice-servers.ts`** — ICE server config
- No TURN servers configured (symmetric NAT will fail)
- Uses STUN only

#### x402 Protocol (`lib/x402/`)

**`lib/x402/types.ts`** — x402 types
- `x402Signature` — Verify payment authorization
- `x402Inscription` — On-chain settlement proof

**`lib/x402/verify.ts`** — Signature verification (stub)
- Currently no cryptographic verification
- Needs implementation with ECDSA validation

**`lib/x402/inscription.ts`** — Inscription management (in-memory)
- Create & store x402 inscriptions
- In-memory Map — not real BSV broadcast

#### Identity & Domain

**`lib/strand-strength.ts`** — $401 identity strength calculation
- Levels: none(0), basic(1), verified(2), strong(3), sovereign(4)
- Based on strands (OAuth, KYC, peer attestation)
- Used for staking tier eligibility

**`lib/domain-verification.ts`** — Domain binding
- DNS TXT record verification
- HTTP header verification
- On-chain signature proof

#### Utilities

**`lib/supabase.ts`** — Supabase client
- Nullable initialization (graceful fallback if not configured)
- `isDbConnected()` check

**`lib/token.ts`** — Token utilities
- Symbol validation (^[A-Z0-9$]{1,20}$)
- BSV-21 inscription JSON formatting

### `/components` — React Components (9 files)

**`components/WalletProvider.tsx`** — Wallet connection management (300+ lines)
- Detects HandCash OAuth cookies, Yours Wallet extension, Metanet SDK
- Initializes wallet provider on mount
- Exports `useWallet()` hook for consumer components

**`components/ClientNavigation.tsx`** — Client-side nav
- Conditional rendering based on wallet connection
- Links to authenticated pages

**`components/Navbar.tsx`** — Top navigation bar

**`components/ThemeProvider.tsx`** — Tailwind theme provider
- Dark/light mode toggle

**`components/ThemePicker.tsx`** — Theme selector UI

**`components/Sticky402Button.tsx`** — Sticky CTA button
- Platform token purchase prompt

**`components/PriceCurveChart.tsx`** — Interactive price curve visualization
- Displays sqrt_decay pricing model
- Uses Recharts for charting

**`components/heroes/Hero401.tsx`** — $401 identity hero section
**`components/heroes/Hero403.tsx`** — $403 securities hero section

## Key Features

### Dual-Token Architecture

**Token 1: $402 HTM (PoW20 — BSV-21)**
- Supply: 21M (mirrors Bitcoin)
- Decimals: 8
- Minting: 100% earned via Proof of Indexing (ClawMinerd)
- Inscribed: `294691e2069ce8f6b9a1afd1022c6d32f8b30cb24c07b6584385bd6066e95502_0`
- Not purchasable via API
- Mirrors Bitcoin halving schedule: 50/mint, 210K blocks per era, 33 eras

**Token 2: Platform Token (500M)**
- Supply: 500M (treasury for sale)
- Pricing: sqrt_decay by default (100M base price sats)
- Purchase via HandCash/Yours/Metanet
- Stake to earn serving revenue (dividends)
- Used to pay for: P2P video chat (1 tok/sec), live streaming (1 tok/sec per viewer)

### P2P Video Chat

- **WebRTC**: Direct peer-to-peer audio/video
- **Signaling**: Polling-based relay (in-memory, /api/signal)
- **Payment**: RTCDataChannel '$402-payment' — 1 platform token per second bilateral
- **States**: idle → lobby → connecting → connected → ended
- **Gotcha**: No TURN servers — symmetric NAT blocks P2P
- **Gotcha**: In-memory signaling — multi-instance Vercel breaks calls

### Token-Gated Live Streaming

- **Broadcast**: Creator streams to up to 8 viewers
- **Token Gate**: POST /api/rooms/join returns HTTP 402 if viewer lacks tokens
- **Cost**: 1 token per second per viewer
- **Room Registry**: In-memory Map (same multi-instance issue as signaling)
- **Keepalive**: Client patches room every 30s to prevent timeout

### Derived Non-Custodial Wallet

- **Server-Side**: HMAC-SHA256(key: 'PATH402-v1', data: signature + handle) = seed
- **Derivation**: BIP32 P2PKH address from seed
- **Encryption**: AES-256-GCM with PBKDF2(100K iterations)
- **WIF Return**: Returned ONCE on first derivation
- **Subsequent Access**: Only encrypted form available (server decrypts on export)
- **Benefit**: Users don't need external wallet app for BSV payments

### $401 Identity Integration

- **Strands**: OAuth, KYC, peer attestation pathways
- **Strength Levels**: none(0) → basic(1) → verified(2) → strong(3) → sovereign(4)
- **On-Chain**: BSV-21 identity token per user
- **Staking Tiers**: Higher identity level = higher serving reward multiplier
- **Sync**: Keep strand-strength.ts in sync with path401-com + path402 monorepo

### HandCash OAuth Flow

1. User visits /api/auth/handcash
2. Redirect to market.handcash.io/connect
3. User approves payment permissions
4. Callback receives authToken
5. Sets `hc_handle` + `hc_token` cookies (7 days, httpOnly)
6. WalletProvider detects cookies on mount, fetches profile
7. Auto-populates address from HandCash account

### Three Wallet Providers

| Provider | Method | Status | Notes |
|----------|--------|--------|-------|
| **HandCash** | OAuth → cookies | **Live** | Easiest UX, custodial by default |
| **Yours Wallet** | v4.5.x extension | **Live** | Non-custodial, requires browser extension |
| **Metanet/Babbage** | SDK integration | **Live** | Advanced users, browser extension |

## Database Schema (Supabase)

### Core Tables

**`path402_holders`** (User token balances)
- `id` (primary key)
- `address` (BSV P2PKH)
- `ordinals_address` (Ordinals/Inscription address)
- `handle` (HandCash handle)
- `provider` ('handcash' | 'yours')
- `balance` (spendable tokens)
- `staked_balance` (locked for dividends)
- `total_purchased`, `total_withdrawn`, `total_dividends` (lifetime stats)
- `created_at`, `updated_at`

**`path402_purchases`** (Purchase records)
- `id`, `holder_id`, `amount`, `price_sats`, `total_paid_sats`
- `status` ('pending' | 'confirmed' | 'failed')
- `tx_id` (optional)
- `created_at`, `confirmed_at`

**`path402_stakes`** (Staking records)
- `id`, `holder_id`, `amount`
- `status` ('active' | 'unstaked')
- `staked_at`, `unstaked_at`

**`path402_dividends`** (Dividend distributions)
- `id`, `total_amount`, `per_token_amount`, `total_staked`
- `source_tx_id` (optional), `distributed_at`

**`path402_dividend_claims`** (Individual dividend claims)
- `id`, `dividend_id`, `holder_id`, `amount`
- `staked_at_time`, `status` ('pending' | 'claimed')
- `claimed_at`

**`path402_treasury`** (Treasury state)
- `id`, `balance`, `total_sold`, `total_revenue_sats`

### Multi-Tenant Token Registry

**`tokens`** (User-created tokens)
- `id`, `creator_address`, `symbol`, `name`, `supply`
- `decimals`, `pricing_model`, `base_price_sats`
- `domain_verified` (true/false)
- `created_at`

**`token_holders`** (Holdings per token)
- `id`, `token_id`, `holder_address`, `balance`

**`token_transfers`** (Transfer history)
- `id`, `token_id`, `from_address`, `to_address`, `amount`
- `tx_hash`, `created_at`

## Pricing Models

### sqrt_decay (Default for Platform Token)

```
price = 223_610 / sqrt(treasury_remaining + 1)

Examples (treasury starting at 500M):
- 500M remaining: ~10 sats/token (super cheap!)
- 100M remaining: ~22 sats/token
- 10M remaining: ~71 sats/token
- 1M remaining: ~224 sats/token
- 1K remaining: ~7,072 sats/token
- 1 remaining: ~223,610 sats/token (expensive!)
```

**Behavior**: Exponentially increases as supply depletes. Rewards early buyers.

### alice_bond (Bonding Curve)

```
price(n) = c × n

Integrate from 0 to supply:
Cost to acquire 1% = $1,000 (configurable)
Constant c = 2 × $1,000 / (1% × supply)²
```

**Behavior**: Linear price increase per token. More predictable than sqrt_decay.

## Gotchas & Known Issues

### Critical

1. **x402 verification is stub** — `/api/x402/verify` doesn't perform real ECDSA validation
2. **x402 inscription is in-memory** — Not actually inscribed on BSV; in-memory Map
3. **No TURN servers** — WebRTC will fail behind symmetric NAT
4. **Signaling relay is in-memory** — Multi-instance Vercel deployment breaks P2P calls
5. **Broadcast room registry is in-memory** — Same Vercel issue
6. **checkNonce() uses in-memory Set** — Allows replay attacks on server restarts
7. **BSV price hardcoded** — `/api/price/bsv` returns static $17 USD/BSV

### Important

8. **x402 inscription label mismatch** — `/api/token/price` docs say "alice_bond" but actually uses sqrt_decay
9. **Server-side wallet export** — `/api/wallet/export` decrypts WIF on server (security risk)
10. **Yours v4.5.x async quirks** — `connect()` returns pubKey string immediately, `getAddresses()` needs separate call
11. **Market F.NEWS unlock is simulated** — Uses setTimeout, not real payment verification
12. **Mint & Issue pages are preview-only** — Link to desktop client, can't mint in browser

### Design

13. **No rate limiting** — Zero ratelimit on token buy, stake, or domain verification endpoints
14. **Hardcoded superadmin emails** — Not in codebase, but referenced in deployment scripts

---

## Module Guide

## Navigation Guide

### To Add a New Token Type
1. Create entry in `/lib/tokens/types.ts` (PricingModel enum)
2. Add pricing function to `/lib/tokens/pricing.ts`
3. Update `/api/tokens/route.ts` POST handler

### To Modify Pricing Curve
- Edit `/lib/tokens/pricing.ts` → adjust `BASE_PRICE_SATS`, `ALICE_BOND_ONE_PERCENT_USD`
- For sqrt_decay: base price is the key tuning variable
- For alice_bond: calibrate constant to desired cost-to-acquire-1%

### To Add Wallet Provider
1. Extend `/components/WalletProvider.tsx` with detection logic
2. Add provider type to `lib/types.ts` WalletProvider union
3. Implement connection method + initialize wallet SDK

### To Add WebRTC Feature
1. Create new hook in `/lib/webrtc/use*.ts`
2. Use `useWebRTC()` as base, extend with feature-specific logic
3. Update `/app/chat/VideoCallPage.tsx` or `/app/live/LivePage.tsx` to use

### To Modify Identity System
1. Update `/lib/strand-strength.ts` for strength calculation
2. Keep in sync with path401-com identity strands + path402 monorepo
3. Add new KYC/attestation pathways in `/api/identity/[handle]/route.ts`

### To Verify Domain
1. User navigates to `/app/docs/domain-verification/page.tsx`
2. Follows DNS/HTTP/on-chain verification steps
3. POST `/api/domain/verify` with proof
4. Creates entry in `tokens.domain_verified = true`

## Deployment

- **Hosting**: Vercel (auto-deploy on push to main)
- **Database**: Supabase (self-hosted Hetzner)
- **Blockchain**: GorillaPool (BSV), 1satordinals (indexer), WhatsOnChain (explorer)
- **Signaling**: In-process (breaks on multi-instance, consider separate server)

## Testing

```bash
pnpm dev              # Run Next.js dev server
pnpm build            # Build for production
pnpm test             # Run vitest suite
pnpm test:watch       # Watch test files
pnpm test:coverage    # Generate coverage report
```

## Related Projects

- **path402** — Monorepo with ClawMinerd (Proof of Indexing miner)
- **path401-com** — $401 identity protocol website
- **aigirlfriends** — Uses $402 for P2P payments
- **b0ase.com** — Master studio (links to all protocols)
