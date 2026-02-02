# The $402 Standard

**Version**: 1.0.0-draft
**Status**: Living Document
**Reference Implementation**: [PATH402.com](https://path402.com)

## Abstract

The $402 standard defines a protocol for HTTP 402 Payment Required responses, enabling machine-readable pricing, token-gated content access, and micropayment flows between humans, applications, and AI agents.

## Motivation

HTTP 402 "Payment Required" has existed since 1999 but lacked a standardized implementation. The $402 standard provides:

1. **Machine-readable pricing** - AI agents and applications can discover costs before accessing content
2. **Token-gated access** - Content creators monetize without subscriptions or ads
3. **Deterministic pricing** - Transparent, algorithmic pricing models
4. **Interoperability** - Any client, wallet, or agent can participate

## Specification

### 1. HTTP 402 Response

When content requires payment, servers MUST return HTTP 402 with the following headers:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json
X-Path402-Price: <price_in_sats>
X-Path402-Token: <token_symbol>
X-Path402-Address: <payment_address>
X-Path402-Protocol: bsv-20
```

#### Required Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-Path402-Price` | Price in satoshis | `5000` |
| `X-Path402-Token` | Token symbol required | `PATH402.com` |
| `X-Path402-Address` | Payment destination | `1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1` |

#### Optional Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-Path402-Protocol` | Blockchain protocol | `bsv-20` |
| `X-Path402-Paymail` | Paymail address | `pay@path402.com` |
| `X-Path402-Expires` | Quote expiry (ISO 8601) | `2026-02-02T12:00:00Z` |
| `X-Path402-Min-Tokens` | Minimum tokens required | `1` |

#### Response Body

```json
{
  "error": "payment_required",
  "price_sats": 5000,
  "token": "PATH402.com",
  "address": "1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1",
  "message": "This content requires 1 PATH402.com token to access",
  "discovery_url": "https://path402.com/.well-known/path402.json"
}
```

### 2. Discovery Protocol

Servers implementing $402 MUST provide a discovery endpoint at `/.well-known/path402.json`:

```json
{
  "$402_version": "1.0.0",
  "token": {
    "symbol": "PATH402.com",
    "protocol": "bsv-20",
    "inscription_id": "5bf47d3af709a385d3a50a298faa18f9479b090114a69ce8308055861d20e18d_1",
    "total_supply": 1000000000,
    "decimals": 0
  },
  "pricing": {
    "model": "sqrt_decay",
    "base_price_sats": 100000000,
    "current_price_sats": 4473,
    "treasury_remaining": 499967644
  },
  "endpoints": {
    "acquire": "/api/token/buy",
    "balance": "/api/token/holding",
    "preview": "/api/token/preview?spendSats={amount}",
    "stats": "/api/token/stats"
  },
  "payment": {
    "address": "1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1",
    "paymail": "pay@path402.com",
    "accepted_currencies": ["BSV", "USD"]
  }
}
```

### 3. Pricing Models

The $402 standard defines pricing models for token issuance:

#### 3.1 sqrt_decay (Default)

Price decreases with supply, rewarding early adopters:

```
price = base_price / sqrt(treasury_remaining + 1)
```

**Properties**:
- Early buyers get cheaper tokens
- Price increases as treasury depletes
- Deterministic and transparent
- No market manipulation possible

**Example** (base_price = 100,000,000 sats):

| Treasury Remaining | Price (sats) | Price (BSV) |
|-------------------|--------------|-------------|
| 500,000,000 | 4,472 | 0.00004472 |
| 250,000,000 | 6,325 | 0.00006325 |
| 100,000,000 | 10,000 | 0.0001 |
| 10,000,000 | 31,623 | 0.00031623 |
| 1,000,000 | 100,000 | 0.001 |
| 1 | 70,710,678 | 0.707 |

#### 3.2 fixed

Constant price regardless of supply:

```
price = fixed_price
```

#### 3.3 linear_decay

Price decreases linearly:

```
price = base_price * (treasury_remaining / total_supply)
```

### 4. Token-Gated Access

#### 4.1 Access Check Flow

```
Client                           Server
  |                                |
  |-- GET /protected/resource --->|
  |                                |
  |<-- 402 Payment Required ------|
  |    (with pricing headers)      |
  |                                |
  |-- Acquire tokens ------------->|
  |                                |
  |-- GET /protected/resource --->|
  |    Authorization: Bearer <jwt> |
  |                                |
  |<-- 200 OK (content) ----------|
```

#### 4.2 Authorization Header

After acquiring tokens, clients authenticate via:

```http
Authorization: Bearer <jwt_or_signature>
```

Or via wallet-signed message:

```http
X-Path402-Signature: <signature>
X-Path402-Handle: <handle_or_address>
X-Path402-Provider: handcash|yours|other
```

### 5. MCP Server Interface

For AI agent integration, $402 services SHOULD implement MCP (Model Context Protocol) tools:

#### Required Tools

| Tool | Description |
|------|-------------|
| `path402_discover` | Get pricing and token info for a URL |
| `path402_acquire` | Purchase tokens and access content |
| `path402_balance` | Check token balance for an address |

#### Optional Tools

| Tool | Description |
|------|-------------|
| `path402_preview` | Preview cost before purchase |
| `path402_wallet` | Full wallet details |
| `path402_economics` | ROI and breakeven analysis |
| `path402_batch_discover` | Discover multiple URLs |

#### Example: path402_discover

**Input**:
```json
{
  "url": "https://example.com/premium-content"
}
```

**Output**:
```json
{
  "url": "https://example.com/premium-content",
  "requires_payment": true,
  "price_sats": 5000,
  "token": "PATH402.com",
  "token_price_sats": 4473,
  "tokens_needed": 1,
  "total_cost_sats": 4473,
  "discovery_url": "https://example.com/.well-known/path402.json"
}
```

### 6. Token Economics

#### 6.1 Revenue Distribution

The $402 standard recommends transparent revenue sharing:

```
Content Revenue
    ├── 70% → Content Creator/Issuer
    └── 30% → Protocol/Platform
```

#### 6.2 Token Utility

$402-compliant tokens SHOULD provide:

1. **Access rights** - Tokens grant access to content/services
2. **Transferability** - Tokens can be sent to other addresses
3. **On-chain verifiability** - Holdings provable via blockchain

#### 6.3 Optional: Staking

Tokens MAY support staking for:
- Dividend distribution from protocol fees
- Governance rights
- Enhanced access tiers

### 7. Security Considerations

#### 7.1 Payment Verification

- Servers MUST verify on-chain payments before granting access
- Transaction confirmations SHOULD be required for large amounts
- Replay attacks MUST be prevented via nonces or timestamps

#### 7.2 Token Verification

- Token balances MUST be verified on-chain or via trusted oracle
- Signatures MUST be validated against known public keys
- JWT tokens MUST use secure signing algorithms (ES256, EdDSA)

#### 7.3 Rate Limiting

- Discovery endpoints SHOULD implement rate limiting
- Failed payment attempts SHOULD be logged
- Suspicious patterns SHOULD trigger alerts

## Conformance

### Levels of Conformance

| Level | Requirements |
|-------|--------------|
| **$402 Basic** | HTTP 402 response with required headers |
| **$402 Discoverable** | Basic + `/.well-known/path402.json` |
| **$402 Complete** | Discoverable + MCP tools + pricing model |

### Compliance Checklist

- [ ] Returns HTTP 402 for paid content
- [ ] Includes required `X-Path402-*` headers
- [ ] Provides `/.well-known/path402.json` discovery
- [ ] Implements at least one pricing model
- [ ] Verifies payments before granting access
- [ ] Documents token economics

## Reference Implementations

| Implementation | Language | URL |
|---------------|----------|-----|
| PATH402.com | TypeScript/Next.js | https://github.com/b0ase/path402-com |
| path402-mcp-server | TypeScript | https://github.com/b0ase/path402-mcp-server |

## Appendix A: Header Quick Reference

```http
# Required
X-Path402-Price: 5000
X-Path402-Token: PATH402.com
X-Path402-Address: 1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1

# Optional
X-Path402-Protocol: bsv-20
X-Path402-Paymail: pay@path402.com
X-Path402-Expires: 2026-02-02T12:00:00Z
X-Path402-Min-Tokens: 1
X-Path402-Discovery: https://example.com/.well-known/path402.json
```

## Appendix B: Example Implementations

### Minimal 402 Response (Node.js)

```javascript
app.get('/premium', (req, res) => {
  if (!hasValidToken(req)) {
    res.status(402)
      .set('X-Path402-Price', '5000')
      .set('X-Path402-Token', 'PATH402.com')
      .set('X-Path402-Address', PAYMENT_ADDRESS)
      .json({
        error: 'payment_required',
        price_sats: 5000,
        message: 'Payment required to access this content'
      });
    return;
  }
  res.json({ content: 'Premium content here' });
});
```

### Discovery Endpoint

```javascript
app.get('/.well-known/path402.json', (req, res) => {
  res.json({
    $402_version: '1.0.0',
    token: { symbol: 'PATH402.com', protocol: 'bsv-20' },
    pricing: { model: 'sqrt_decay', current_price_sats: 4473 },
    endpoints: { acquire: '/api/token/buy' }
  });
});
```

## Changelog

- **1.0.0-draft** (2026-02-02): Initial specification

## License

This specification is released under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).

---

*The $402 standard is developed by the PATH402.com community. Contributions welcome.*
