# BRC Alignment (Draft)

This document maps the $402 / Path402 architecture to existing **Bitcoin SV BRCs**.

**Core idea:** most of the plumbing we need already exists in the BRC stack. Path402 layers **tokenised data trees + operator incentives** on top.

---

## Mapping Overview

| Path402 Layer | BRC(s) | Role |
|---|---|---|
| Wallet / Interface | **BRC‑100** | Vendor‑neutral wallet → app interface (identity, signing, tx handling). |
| Mutual Auth | **BRC‑103** | Peer‑to‑peer mutual authentication + certificate exchange. |
| HTTP Auth | **BRC‑104** | HTTP transport for BRC‑103 (`/.well-known/auth`, `x-bsv-auth` headers). |
| HTTP 402 Payments | **BRC‑105** | Standardized 402 paywall + payment proof. |
| Overlay Index + Lookup | **BRC‑22**, **BRC‑24** | Submit/lookup model for topic‑based UTXO state. |

**Path402 EARN / PoW20** is **not currently covered** by existing BRCs.  
It should be treated as a **separate incentive layer** (candidate for a new BRC).

---

## How Path402 Uses These BRCs

1. **$pathd nodes ≈ BRC‑22/24 overlay nodes**  
   Path402 “indexers” can be interpreted as overlay nodes providing submit/lookup APIs for domain/path state.

2. **Serving paid content = BRC‑105**  
   When on BSV, paid access should follow the BRC‑105 handshake for 402.

3. **Authenticated access = BRC‑103/104**  
   If a server needs to authenticate clients before serving data, use BRC‑103/104 flows.

4. **Wallet integration = BRC‑100**  
   Wallets that expose BRC‑100 can be used for signing, payment, and identity primitives.

---

## Multi‑Chain Note (x402)

The codebase supports a **multi‑chain facilitator (x402)**, but **BSV‑native flows should prefer BRC‑105** for interoperability with the BSV ecosystem.

---

## Next Spec Work (Proposed)

- Define **EARN / PoW20 visibility + accountability** as a standalone spec.
- Style it like existing BRCs so it can be reviewed and adopted consistently.
