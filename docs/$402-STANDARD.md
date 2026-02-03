# The $402 Standard

**Version**: 2.0.0
**Status**: Living Document
**Reference Implementation**: [PATH402.com](https://path402.com)
**Canonical Vision**: [PROTOCOL_VISION.md](PROTOCOL_VISION.md)

## Abstract

The $402 standard defines a protocol for turning URL paths into shareholder businesses. Using HTTP 402 "Payment Required" responses, $402 enables machine-readable pricing, token-gated content access, hierarchical ownership, and staking partnerships.

## Core Concepts

### $addresses

Every `$path` is an economic entity:

```
$example.com                    → Site-level entity
$example.com/$blog              → Blog section entity
$example.com/$blog/$premium     → Premium content entity
$example.com/$api               → API access entity
```

The `$` prefix means: "this path is a shareholder business."

### The Flywheel

```
Buy Access → Stake Tokens → Run Infrastructure → Earn Revenue → New Buyers Repeat
```

Every role is the same person at different stages. No separate classes.

## HTTP 402 Response

When content requires payment, servers MUST return HTTP 402 with the following headers:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json
X-$402-Version: 2.0.0
X-$402-Price: <price_in_sats>
X-$402-Token: <$path>
X-$402-Model: <pricing_model>
```

### Required Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-$402-Version` | Protocol version | `2.0.0` |
| `X-$402-Price` | Price in satoshis | `5000` |
| `X-$402-Token` | $path for this content | `$example.com/$blog` |

### Optional Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-$402-Model` | Pricing model | `sqrt_decay` |
| `X-$402-Treasury` | Remaining treasury | `499000000` |
| `X-$402-Parent` | Parent $path | `$example.com` |
| `X-$402-Expires` | Quote expiry (ISO 8601) | `2026-02-02T12:00:00Z` |
| `X-$402-Accepts` | Accepted payment methods | `bsv,base,sol,eth` |

### Response Body

```json
{
  "error": "payment_required",
  "price_sats": 5000,
  "token": "$example.com/$blog",
  "pricing_model": "sqrt_decay",
  "treasury_remaining": 499000000,
  "parent": "$example.com",
  "accepts": ["bsv", "base", "sol", "eth"],
  "discovery_url": "https://example.com/.well-known/$402.json"
}
```

## Discovery Protocol

Servers implementing $402 MUST provide a discovery endpoint at `/.well-known/$402.json`:

```json
{
  "$402_version": "2.0.0",
  "extensions": ["$402-curves", "$402-hierarchy", "$402-compliance"],
  "root": {
    "path": "$example.com",
    "inscription_id": "abc123...",
    "pricing": {
      "model": "sqrt_decay",
      "base": 100000000,
      "current_price": 4472
    }
  },
  "children": [
    {
      "path": "$example.com/$blog",
      "inscription_id": "def456...",
      "parent_inscription": "abc123...",
      "parent_share_bps": 5000
    }
  ],
  "stakers": [
    {
      "address": "1ABC...",
      "staked": 1000000,
      "indexer_endpoint": "https://indexer.example.com/api"
    }
  ],
  "payment": {
    "address": "1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1",
    "paymail": "pay@example.com",
    "accepted_currencies": ["BSV", "USDC", "ETH", "SOL"]
  }
}
```

## Pricing Models

### sqrt_decay (Default)

Price changes based on square root of supply or treasury.

**Investment variant** (early buyers get cheap tokens):
```json
{
  "model": "sqrt_decay",
  "formula": "base / sqrt(treasury_remaining + 1)",
  "direction": "price_increases_as_treasury_depletes",
  "base": 100000000
}
```

**Content variant** (early buyers pay premium):
```json
{
  "model": "sqrt_decay",
  "formula": "base / sqrt(supply + 1)",
  "direction": "price_decreases_as_supply_grows",
  "base": 10000
}
```

### fixed

Constant price regardless of supply:
```json
{
  "model": "fixed",
  "price": 1000
}
```

### Other Models

- `linear` — Price changes linearly
- `exponential` — Price changes exponentially
- `bonding_curve` — AMM-style bonding curve

## Hierarchical Ownership

### The 50% Rule

When a child path is created, 50% of tokens go to the parent by default:

```json
{
  "p": "$402",
  "op": "create",
  "path": "$example.com/$blog",
  "parent": "$example.com",
  "parent_share_bps": 5000,
  "pricing": {
    "model": "sqrt_decay",
    "base": 10000000
  }
}
```

### Revenue Flow

Entry fees flow UP the hierarchy:
- 50% to current path shareholders
- 50% to parent path (which splits recursively)

### Root Access

Majority shareholder in root has access to all children.

## Staking Partners

### Requirements

To become a staking partner:

```json
{
  "p": "$402",
  "op": "stake",
  "path": "$example.com",
  "amount": 1000000,
  "commitment": {
    "indexer_endpoint": "https://my-indexer.com/api",
    "uptime_sla": 0.99
  }
}
```

### Staker Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Run indexer | Track token movements on-chain |
| Maintain registry | Serve shareholder data via API |
| Index children | Discover new child path inscriptions |
| Uptime commitment | Keep infrastructure available |

### Staker Revenue

| Source | Description |
|--------|-------------|
| Entry fees | Share of new token purchases (70%) |
| Child fees | Share of child path creation fees |
| API fees | Revenue from registry queries |
| Dividends | Proportional to staked amount |

### Slashing

| Violation | Consequence |
|-----------|-------------|
| Offline >24h | Warning |
| Offline >7d | 10% slash |
| False data | Full slash + ban |

## Two-Tier Token System

| Tier | KYC | Dividends | Can Trade | Can Stake |
|------|-----|-----------|-----------|-----------|
| **Bearer** | No | No | Yes | No |
| **Staker** | Yes | Yes | Yes | Yes |

Anyone can hold and trade. Only KYC'd users can stake and receive dividends.

## Extensions

$402 uses a core + extensions architecture:

### Core (Required)

```json
{
  "p": "$402",
  "version": "2.0",
  "path": "$myblog.com",
  "pricing": { "model": "fixed", "price": 500 }
}
```

### Standard Extensions

| Extension | What It Adds |
|-----------|--------------|
| `$402-curves` | sqrt_decay, linear, exponential, bonding |
| `$402-compliance` | KYC, staking, dividends, registry |
| `$402-hierarchy` | Parent/child relationships, revenue flow |
| `$402-containers` | Data embedded in inscriptions |
| `$402-governance` | Voting rights, proposals |

## MCP Server Interface

For AI agent integration, $402 services SHOULD implement MCP tools:

### Discovery Tools

| Tool | Description |
|------|-------------|
| `path402_discover` | Get pricing and token info for a $path |
| `path402_batch_discover` | Discover multiple $paths |
| `path402_economics` | ROI and breakeven analysis |

### Acquisition Tools

| Tool | Description |
|------|-------------|
| `path402_acquire` | Purchase tokens and access content |
| `path402_wallet` | View balance and holdings |
| `path402_transfer` | Transfer tokens |

### Staking Tools

| Tool | Description |
|------|-------------|
| `path402_stake` | Stake tokens as partner |
| `path402_unstake` | Unstake tokens (with cooldown) |
| `path402_serve` | Serve content and earn revenue |

## Conformance Levels

| Level | Requirements |
|-------|--------------|
| **$402 Basic** | HTTP 402 + required headers |
| **$402 Discoverable** | Basic + `/.well-known/$402.json` |
| **$402 Hierarchical** | Discoverable + parent/child + 50% rule |
| **$402 Complete** | Hierarchical + staking + MCP tools |

## Security Considerations

### Payment Verification

- Servers MUST verify on-chain payments before granting access
- Transaction confirmations SHOULD be required for large amounts
- Replay attacks MUST be prevented via nonces or timestamps

### Staker Verification

- Multiple stakers should agree on registry state
- Disagreements resolved by checking on-chain inscriptions
- Slash stakers who serve false data

### Rate Limiting

- Discovery endpoints SHOULD implement rate limiting
- Failed payment attempts SHOULD be logged

## Reference Implementations

| Implementation | Language | URL |
|---------------|----------|-----|
| PATH402.com | TypeScript/Next.js | https://github.com/b0ase/path402-com |
| path402-mcp-server | TypeScript | https://github.com/b0ase/path402-mcp-server |

## Changelog

- **2.0.0** (2026-02-03): Complete rewrite with 7-step model, hierarchical ownership, staking partners
- **1.0.0-draft** (2026-02-02): Initial specification

## License

This specification is released under the [Open BSV License version 4](https://github.com/b0ase/path402-com/blob/main/LICENSE).

---

*The $402 standard is developed by the PATH402.com community. Contributions welcome.*
