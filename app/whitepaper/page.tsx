'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-900 dark:text-white font-mono selection:bg-zinc-900 selection:text-zinc-900 dark:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Header */}
      <section className="relative py-24 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-900 dark:text-white text-xs uppercase tracking-widest mb-8 inline-block">
                ← Back to Home
              </Link>
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-8"
              variants={fadeIn}
            >
              WHITEPAPER_V1.0.0
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6"
              variants={fadeIn}
            >
              $<span className="text-zinc-700">402</span> Token Standard
            </motion.h1>

            <motion.p
              className="text-zinc-400 max-w-2xl mb-4"
              variants={fadeIn}
            >
              A Peer-to-Peer System for Content Monetization Through Unilateral Token Contracts
            </motion.p>

            <motion.div
              className="flex items-center gap-4 text-zinc-500 text-sm"
              variants={fadeIn}
            >
              <a href="https://x.com/b0ase" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:text-white transition-colors">
                @b0ase
              </a>
              <span>·</span>
              <span>February 2026</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Abstract */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest">Abstract</h2>
          <p className="text-zinc-400 leading-relaxed">
            We propose a protocol for turning any URL path into a priced, tokenized market. The $402 standard
            uses HTTP 402 "Payment Required" responses to create <em className="text-zinc-900 dark:text-white">unilateral token contracts</em>—offers
            that become binding agreements upon payment. Unlike traditional paywalls requiring subscriptions or
            advertising, $402 enables <em className="text-zinc-900 dark:text-white">atomic micropayments</em> where content access and token acquisition
            occur in a single transaction. The protocol introduces <em className="text-zinc-900 dark:text-white">sqrt_decay pricing</em>, a mathematical
            model that rewards early participants while maintaining market fairness. Combined with x402 payment
            verification for multi-chain support and MCP integration for AI agents, $402 creates a new primitive
            for the internet economy: content as property with deterministic pricing and automated enforcement.
          </p>
        </div>
      </section>

      {/* 1. Introduction */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">1. Introduction</h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            The internet was built on a contradiction. HTTP 402 "Payment Required" was defined in 1999, yet
            two decades later, the web still runs on advertising and subscription models that misalign creator
            incentives with consumer value. The vision of native web payments never materialized—until now.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-4">
            The $402 Token Standard resolves this by defining a complete protocol for:
          </p>
          <ul className="space-y-2 text-zinc-400 mb-4">
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Discovery</strong> — Machine-readable pricing at any URL</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Acquisition</strong> — Atomic token purchase with content delivery</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Verification</strong> — Multi-chain payment proofs via x402 facilitator</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Inscription</strong> — Permanent record on BSV blockchain</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">2. The Problem</h2>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">2.1 Broken Monetization Models</h3>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Current web monetization suffers from fundamental flaws. Advertising requires privacy invasion
            and attention manipulation. Subscriptions create high friction and fatigue. Paywalls offer poor
            UX with no price discovery. Tips rely on unpredictable goodwill. None provide deterministic,
            fair pricing that benefits both creators and consumers.
          </p>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">2.2 The AI Agent Problem</h3>
          <p className="text-zinc-400 leading-relaxed mb-6">
            AI agents present a new challenge: they need to access and pay for content programmatically,
            without human intervention. Existing systems require human login, credit card entry, CAPTCHA
            solving, and subscription management. None of these work for autonomous agents.
          </p>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">2.3 The HTTP 402 Void</h3>
          <p className="text-zinc-400 leading-relaxed">
            HTTP 402 "Payment Required" was reserved in HTTP/1.1 for "future use." Twenty-five years later,
            it remains undefined. Coinbase's x402 protocol provides payment verification, but no standard
            exists for price discovery, deterministic pricing, or token-based access rights.
          </p>
        </div>
      </section>

      {/* 3. The $402 Solution */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">3. The $402 Solution</h2>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">3.1 Core Concept: $addresses</h3>
          <p className="text-zinc-400 leading-relaxed mb-4">
            The $402 protocol introduces <em className="text-zinc-900 dark:text-white">$addresses</em>—URL paths prefixed with $ that represent
            tokenized content markets:
          </p>
          <pre className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 text-sm mb-6 overflow-x-auto text-zinc-400">
{`$example.com                 → Site-level token
$example.com/$api            → Section token
$example.com/$api/$premium   → Content token`}
          </pre>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">3.2 HTTP 402 Response</h3>
          <p className="text-zinc-400 leading-relaxed mb-4">
            When a client requests $402-protected content without valid tokens, servers respond:
          </p>
          <pre className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 text-sm overflow-x-auto text-zinc-400">
{`HTTP/1.1 402 Payment Required
X-402-Version: 1.0.0
X-402-Price: 10
X-402-Token: $example.com

{
  "price_sats": 10,
  "token": "$example.com",
  "pricing_model": "sqrt_decay",
  "treasury_remaining": 500000000,
  "accepts": ["bsv", "base", "sol", "eth"]
}`}
          </pre>
        </div>
      </section>

      {/* 4. Unilateral Contract Theory */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">4. Unilateral Contract Theory</h2>

          <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-6 my-6 text-zinc-500 italic">
            "A unilateral contract is a promise exchanged for an act. The promisor makes a promise in
            exchange for the promisee's performance of a specified act."
            <span className="block mt-2 text-xs not-italic text-zinc-600">— Contract Law, Restatement (Second)</span>
          </blockquote>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">4.1 The $402 Offer</h3>
          <p className="text-zinc-400 leading-relaxed mb-4">
            Every HTTP 402 response constitutes a <em className="text-zinc-900 dark:text-white">unilateral offer</em>:
          </p>
          <ul className="space-y-2 text-zinc-400 mb-6">
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Offer</strong>: "Pay X satoshis and receive token T plus content C"</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Acceptance</strong>: Payment to the specified address</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Consideration</strong>: Satoshis exchanged for token + content</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Performance</strong>: Immediate content delivery upon payment</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Token Economics */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">5. Token Economics</h2>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">5.1 sqrt_decay Pricing Model</h3>
          <p className="text-zinc-400 leading-relaxed mb-4">
            The default pricing model uses square root decay based on remaining treasury:
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 mb-6 text-center">
            <p className="text-lg mb-2 text-zinc-900 dark:text-white font-mono">
              price = base_price / √(treasury_remaining + 1)
            </p>
            <p className="text-sm text-zinc-500">
              Where base_price = 223,610 sats (calibrated so 1 BSV ≈ 1% of supply)
            </p>
          </div>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">5.2 Price Schedule</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Treasury</th>
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Price (sats)</th>
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">% Sold</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="py-3">500,000,000</td>
                  <td className="py-3">10</td>
                  <td className="py-3">0%</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3">100,000,000</td>
                  <td className="py-3">22</td>
                  <td className="py-3">80%</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3">10,000,000</td>
                  <td className="py-3">71</td>
                  <td className="py-3">98%</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3">1,000,000</td>
                  <td className="py-3">224</td>
                  <td className="py-3">99.8%</td>
                </tr>
                <tr>
                  <td className="py-3">1,000</td>
                  <td className="py-3">7,072</td>
                  <td className="py-3">99.9998%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">5.3 Revenue Distribution</h3>
          <pre className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 text-sm overflow-x-auto text-zinc-400">
{`"revenue_split": {
  "issuer_bps": 8000,      // 80% to creator
  "facilitator_bps": 2000  // 20% to platform
}`}
          </pre>
        </div>
      </section>

      {/* 6. x402 Facilitator */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">6. x402 Facilitator Protocol</h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            PATH402.com operates as an x402 facilitator—a payment verification service compatible with
            Coinbase's x402 protocol specification. This enables $402 to accept payments from multiple chains.
          </p>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">6.1 Multi-Chain Support</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Network</th>
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Status</th>
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Assets</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="py-3">BSV</td>
                  <td className="py-3 text-blue-400">Primary</td>
                  <td className="py-3">BSV, BSV-20 tokens</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3">Base</td>
                  <td className="py-3">Supported</td>
                  <td className="py-3">USDC, ETH</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3">Solana</td>
                  <td className="py-3">Supported</td>
                  <td className="py-3">USDC, SOL</td>
                </tr>
                <tr>
                  <td className="py-3">Ethereum</td>
                  <td className="py-3">Supported</td>
                  <td className="py-3">USDC, ETH, USDT</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">6.2 Verification Flow</h3>
          <pre className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 text-sm overflow-x-auto text-zinc-400">
{`1. Client → Server: GET /protected-content
2. Server → Client: 402 + X-402-Facilitator header
3. Client → Facilitator: POST /api/x402/verify
4. Facilitator: Verify payment on source chain
5. Facilitator → BSV: Inscribe payment proof
6. Facilitator → Client: { valid: true }
7. Client → Server: GET /content + Authorization
8. Server: Verify with facilitator, deliver content`}
          </pre>
        </div>
      </section>

      {/* 7. AI Agent Integration */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">7. AI Agent Integration</h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            $402 is designed for AI agents as first-class consumers. The MCP (Model Context Protocol)
            server enables Claude, GPT, and other LLMs to discover, evaluate, and acquire content
            autonomously.
          </p>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">7.1 Discovery & Evaluation Tools</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Tool</th>
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Purpose</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_discover</td>
                  <td className="py-3">Probe $address — get pricing, supply, revenue model</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_batch_discover</td>
                  <td className="py-3">Discover multiple $addresses simultaneously</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_evaluate</td>
                  <td className="py-3">Assess ROI viability before purchasing</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_economics</td>
                  <td className="py-3">Analyze breakeven points and projections</td>
                </tr>
                <tr>
                  <td className="py-3 text-blue-400">path402_price_schedule</td>
                  <td className="py-3">View price curve across supply levels</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">7.2 Acquisition & Wallet Tools</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Tool</th>
                  <th className="text-left py-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Purpose</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_acquire</td>
                  <td className="py-3">Pay and receive token + gated content</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_set_budget</td>
                  <td className="py-3">Configure agent spending parameters</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_wallet</td>
                  <td className="py-3">View balance, holdings, net position</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 text-blue-400">path402_transfer</td>
                  <td className="py-3">Transfer tokens to another address</td>
                </tr>
                <tr>
                  <td className="py-3 text-blue-400">path402_history</td>
                  <td className="py-3">View transaction history</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. Investment Thesis */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">8. Investment Thesis</h2>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">8.1 Market Opportunity</h3>
          <p className="text-zinc-400 leading-relaxed mb-6">
            The digital content market exceeds $600B (2025). The emerging AI agent economy is projected
            at $200B+ by 2028. $402 provides infrastructure for both markets.
          </p>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">8.2 Competitive Moat</h3>
          <ul className="space-y-2 text-zinc-400 mb-6">
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Protocol lock-in</strong> — HTTP 402 standard creates network effects</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">First-mover in AI payments</strong> — MCP integration before competitors</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">Multi-chain facilitator</strong> — Captures volume from all ecosystems</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span><strong className="text-zinc-900 dark:text-white">BSV inscription layer</strong> — Permanent proofs create switching costs</span>
            </li>
          </ul>

          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">8.3 Revenue Model</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Facilitator fee</div>
              <div className="text-zinc-900 dark:text-white">20% (2000 bps)</div>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Verification fee</div>
              <div className="text-zinc-900 dark:text-white">200 sats</div>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Inscription fee</div>
              <div className="text-zinc-900 dark:text-white">500 sats</div>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Settlement fee</div>
              <div className="text-zinc-900 dark:text-white">0.1%</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Roadmap */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">9. Roadmap</h2>

          <div className="space-y-4">
            <div className="flex gap-6 items-start border-l-2 border-blue-400 pl-6">
              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest w-20">Q1 2026</span>
              <span className="text-zinc-400">Protocol specification, MCP server v1.0.0, x402 facilitator ✓</span>
            </div>
            <div className="flex gap-6 items-start border-l-2 border-zinc-300 dark:border-zinc-700 pl-6">
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest w-20">Q2 2026</span>
              <span className="text-zinc-400">Token exchange UI, global $address registry, creator tools</span>
            </div>
            <div className="flex gap-6 items-start border-l-2 border-zinc-300 dark:border-zinc-700 pl-6">
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest w-20">Q3 2026</span>
              <span className="text-zinc-400">Agent SDK, self-funding agent templates, agent marketplace</span>
            </div>
            <div className="flex gap-6 items-start border-l-2 border-zinc-300 dark:border-zinc-700 pl-6">
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest w-20">Q4 2026</span>
              <span className="text-zinc-400">Enterprise API, white-label facilitator, cross-facilitator federation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Conclusion */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">10. Conclusion</h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            The $402 Token Standard represents a fundamental shift in how the internet handles value
            exchange. By combining HTTP 402, unilateral contract theory, and deterministic pricing, we
            create a system where content creators earn directly from consumers, early supporters are
            rewarded for their belief, AI agents can autonomously participate in the economy, and every
            transaction creates a permanent, verifiable record.
          </p>
          <p className="text-zinc-900 dark:text-white leading-relaxed">
            HTTP 402 was reserved for "future use" in 1999. That future is now.
          </p>
        </div>
      </section>

      {/* References */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wide">References</h2>
          <ol className="space-y-2 text-zinc-500 text-sm">
            <li>[1] Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.</li>
            <li>[2] RFC 2616 (1999). HTTP/1.1 Status Code 402 Payment Required.</li>
            <li>[3] Coinbase (2024). x402 Protocol Specification.</li>
            <li>[4] Anthropic (2024). Model Context Protocol (MCP).</li>
            <li>[5] Open BSV License version 4.</li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-600 text-sm mb-4">
            This whitepaper is released under the{' '}
            <a href="https://github.com/b0ase/path402-com/blob/main/LICENSE" className="text-blue-400 hover:text-blue-300 transition-colors">
              Open BSV License version 4
            </a>.
          </p>
          <p className="text-zinc-600 text-xs uppercase tracking-widest">
            Version 1.0.0 · February 2026 · <a href="https://path402.com" className="text-blue-400 hover:text-blue-300 transition-colors">path402.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
