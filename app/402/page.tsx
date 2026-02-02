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
    transition: { staggerChildren: 0.05 }
  }
};

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeIn} className="mb-6">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm rounded-full">
              Whitepaper v1.0.0 · February 2026
            </span>
          </motion.div>
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            The Path $402 Token Standard
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            A Peer-to-Peer System for Content Monetization Through Unilateral Token Contracts
          </motion.p>
          <motion.div variants={fadeIn} className="mt-8 text-sm text-gray-500">
            Richard Boase · b0ase.com · hello@b0ase.com
          </motion.div>
        </motion.div>

        {/* Table of Contents */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border border-gray-200 dark:border-gray-800 p-6 mb-16 rounded-lg"
        >
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              { href: "#abstract", label: "Abstract" },
              { href: "#introduction", label: "1. Introduction" },
              { href: "#problem", label: "2. The Problem" },
              { href: "#solution", label: "3. The $402 Solution" },
              { href: "#unilateral-contracts", label: "4. Unilateral Contract Theory" },
              { href: "#economics", label: "5. Token Economics" },
              { href: "#x402-facilitator", label: "6. x402 Facilitator Protocol" },
              { href: "#ai-agents", label: "7. AI Agent Integration" },
              { href: "#investment", label: "8. Investment Thesis" },
              { href: "#roadmap", label: "9. Roadmap" },
              { href: "#conclusion", label: "10. Conclusion" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.nav>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-gray dark:prose-invert prose-lg max-w-none"
        >
          {/* Abstract */}
          <section id="abstract" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Abstract</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We propose a protocol for turning any URL path into a priced, tokenized market. The $402 standard
              uses HTTP 402 "Payment Required" responses to create <strong>unilateral token contracts</strong>—offers
              that become binding agreements upon payment. Unlike traditional paywalls requiring subscriptions or
              advertising, $402 enables <strong>atomic micropayments</strong> where content access, token acquisition,
              and revenue distribution occur in a single transaction.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              The protocol introduces <strong>sqrt_decay pricing</strong>, a mathematical model that rewards early
              participants while maintaining market fairness. Combined with <strong>x402 payment verification</strong>
              for multi-chain support and <strong>MCP integration</strong> for AI agents, $402 creates a new primitive
              for the internet economy: content as property with deterministic pricing and automated enforcement.
            </p>
          </section>

          {/* 1. Introduction */}
          <section id="introduction" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The internet was built on a contradiction. HTTP 402 "Payment Required" was defined in 1999, yet
              two decades later, the web still runs on advertising and subscription models that misalign creator
              incentives with consumer value. The vision of native web payments never materialized—until now.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              The Path $402 Token Standard resolves this by defining a complete protocol for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li><strong>Discovery</strong> — Machine-readable pricing at any URL</li>
              <li><strong>Acquisition</strong> — Atomic token purchase with content delivery</li>
              <li><strong>Serving</strong> — Token holders earn by distributing content</li>
              <li><strong>Verification</strong> — Multi-chain payment proofs via x402 facilitator</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              This paper describes the technical specification, economic model, and investment case for the
              $402 protocol and its reference implementation at path402.com.
            </p>
          </section>

          {/* 2. The Problem */}
          <section id="problem" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">2. The Problem</h2>

            <h3 className="text-xl font-bold mt-8 mb-4">2.1 Broken Monetization Models</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Current web monetization suffers from fundamental flaws:
            </p>
            <div className="overflow-x-auto mt-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 pr-4 text-gray-500 dark:text-gray-400 font-medium">Model</th>
                    <th className="text-left py-3 text-gray-500 dark:text-gray-400 font-medium">Problems</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-medium">Advertising</td>
                    <td className="py-3">Privacy invasion, attention manipulation, race to bottom</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-medium">Subscriptions</td>
                    <td className="py-3">High friction, subscription fatigue, all-or-nothing</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-medium">Paywalls</td>
                    <td className="py-3">Poor UX, no price discovery, no secondary market</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-medium">Tips/Donations</td>
                    <td className="py-3">Relies on goodwill, unpredictable revenue</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">2.2 The AI Agent Problem</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              AI agents present a new challenge: they need to access and pay for content programmatically,
              without human intervention. Existing systems require:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Human login and authentication</li>
              <li>Credit card entry and billing addresses</li>
              <li>CAPTCHA solving and bot detection</li>
              <li>Monthly subscription management</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              None of these work for autonomous agents. The web needs a native payment layer that machines
              can use directly.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">2.3 The HTTP 402 Void</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              HTTP 402 "Payment Required" was reserved in HTTP/1.1 for "future use." Twenty-five years later,
              it remains undefined. Coinbase's x402 protocol provides payment verification, but no standard
              exists for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Discovering prices before hitting paywalls</li>
              <li>Deterministic pricing that prevents arbitrary charges</li>
              <li>Token-based access rights that users own</li>
              <li>Revenue sharing among content distributors</li>
            </ul>
          </section>

          {/* 3. The Solution */}
          <section id="solution" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">3. The $402 Solution</h2>

            <h3 className="text-xl font-bold mt-8 mb-4">3.1 Core Concept: $addresses</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The $402 protocol introduces <strong>$addresses</strong>—URL paths prefixed with $ that represent
              tokenized content markets:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 mb-6 text-gray-800 dark:text-gray-300">
{`$example.com                 → Site-level token (entry point)
$example.com/$api            → Section token (API access tier)
$example.com/$api/$premium   → Content token (specific resource)`}
            </pre>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Each $ segment creates an independent market with its own:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li><strong>Price curve</strong> — Algorithmic pricing based on supply</li>
              <li><strong>Token supply</strong> — Finite tokens representing access rights</li>
              <li><strong>Holder registry</strong> — Who owns tokens and can serve content</li>
              <li><strong>Revenue distribution</strong> — How payments flow to participants</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">3.2 HTTP 402 Response Specification</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              When a client requests $402-protected content without valid tokens, servers respond:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 mb-6 text-gray-800 dark:text-gray-300">
{`HTTP/1.1 402 Payment Required
Content-Type: application/json
X-402-Version: 1.0.0
X-402-Price: 10
X-402-Token: $example.com
X-402-Chain: bsv
X-402-Facilitator: https://path402.com/api/x402/verify

{
  "error": "payment_required",
  "price_sats": 10,
  "token": "$example.com",
  "pricing_model": "sqrt_decay",
  "treasury_remaining": 500000000,
  "discovery_url": "https://example.com/.well-known/x402.json",
  "acquire_url": "https://example.com/api/acquire",
  "accepts": ["bsv", "base", "sol", "eth"]
}`}
            </pre>

            <h3 className="text-xl font-bold mt-8 mb-4">3.3 Discovery Protocol</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All $402-compliant servers expose <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">/.well-known/x402.json</code>:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 text-gray-800 dark:text-gray-300">
{`{
  "x402_version": "1.0.0",
  "name": "Example Content Network",
  "token": {
    "symbol": "$example.com",
    "total_supply": 1000000000,
    "treasury_remaining": 500000000,
    "inscription_id": "5bf47d3af709a385d3a5...",
    "chain": "bsv"
  },
  "pricing": {
    "model": "sqrt_decay",
    "base_price_sats": 223610,
    "current_price_sats": 10,
    "formula": "price = base / sqrt(treasury + 1)"
  },
  "revenue_split": {
    "issuer_bps": 8000,
    "facilitator_bps": 2000
  },
  "facilitator": "https://path402.com/api/x402"
}`}
            </pre>
          </section>

          {/* 4. Unilateral Contract Theory */}
          <section id="unilateral-contracts" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">4. Unilateral Contract Theory</h2>

            <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 text-gray-600 dark:text-gray-400 italic">
              "A unilateral contract is a promise exchanged for an act. The promisor makes a promise in
              exchange for the promisee's performance of a specified act."
              <span className="block mt-2 text-sm not-italic">— Contract Law, Restatement (Second)</span>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">4.1 The $402 Offer</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Every HTTP 402 response constitutes a <strong>unilateral offer</strong>:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li><strong>Offer</strong>: "Pay X satoshis and receive token T plus content C"</li>
              <li><strong>Acceptance</strong>: Payment to the specified address</li>
              <li><strong>Consideration</strong>: Satoshis exchanged for token + content</li>
              <li><strong>Performance</strong>: Immediate content delivery upon payment confirmation</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              This mirrors Bitcoin's own design. As Satoshi noted in the whitepaper: "We define an electronic
              coin as a chain of digital signatures." Similarly, we define a <strong>$402 access right</strong>
              as a chain of payments verified by the facilitator.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">4.2 Binding Through Performance</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The contract becomes binding through the act of payment, not through explicit agreement.
              This creates several legal properties:
            </p>
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mt-4 mb-6">
              <div className="grid gap-4">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Deterministic Terms</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Price is computed algorithmically—no negotiation, no hidden fees</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Atomic Execution</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Payment and delivery occur in a single transaction—no escrow needed</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Immutable Record</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Payment proof inscribed on BSV blockchain—permanent evidence</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Transferable Rights</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Token ownership conveys access rights—secondary markets possible</div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">4.3 The Serving Right</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Token holders gain not just access but <strong>serving rights</strong>—the ability to distribute
              content and earn from subsequent buyers. This creates a novel property structure:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 text-gray-800 dark:text-gray-300">
{`Token Holder Rights:
├── Access Right: View/consume the content
├── Serving Right: Distribute to new buyers
├── Revenue Right: Earn from distribution
└── Transfer Right: Sell token to others`}
            </pre>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              This transforms content from a static asset into a productive one. Early believers who
              acquire tokens become infrastructure for later adopters, earning proportional revenue.
            </p>
          </section>

          {/* 5. Token Economics */}
          <section id="economics" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">5. Token Economics</h2>

            <h3 className="text-xl font-bold mt-8 mb-4">5.1 sqrt_decay Pricing Model</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The default pricing model uses square root decay based on remaining treasury:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 mb-6 text-gray-800 dark:text-gray-300">
{`price = base_price / √(treasury_remaining + 1)

Where:
  base_price = 223,610 sats (calibrated so 1 BSV ≈ 1% of supply)
  treasury_remaining = Tokens left for sale

As treasury depletes, price INCREASES → early buyers are rewarded`}
            </pre>

            <h3 className="text-xl font-bold mt-8 mb-4">5.2 Mathematical Properties</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This formula produces desirable properties—early buyers get lower prices:
            </p>

            <div className="overflow-x-auto mt-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 pr-4 text-gray-500 dark:text-gray-400 font-medium">Treasury Remaining</th>
                    <th className="text-left py-3 pr-4 text-gray-500 dark:text-gray-400 font-medium">Price (sats)</th>
                    <th className="text-left py-3 text-gray-500 dark:text-gray-400 font-medium">% Sold</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300 font-mono">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4">500,000,000</td>
                    <td className="py-3 pr-4 text-green-600 dark:text-green-400">10</td>
                    <td className="py-3 text-gray-500">0%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4">100,000,000</td>
                    <td className="py-3 pr-4 text-green-600 dark:text-green-400">22</td>
                    <td className="py-3 text-gray-500">80%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4">10,000,000</td>
                    <td className="py-3 pr-4 text-yellow-600 dark:text-yellow-400">71</td>
                    <td className="py-3 text-gray-500">98%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4">1,000,000</td>
                    <td className="py-3 pr-4 text-yellow-600 dark:text-yellow-400">224</td>
                    <td className="py-3 text-gray-500">99.8%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4">1,000</td>
                    <td className="py-3 pr-4 text-red-600 dark:text-red-400">7,072</td>
                    <td className="py-3 text-gray-500">99.9998%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mt-6 mb-6">
              <div className="font-bold text-blue-900 dark:text-blue-300 mb-2">Key Insight: Early Mover Advantage</div>
              <p className="text-blue-800 dark:text-blue-400 text-sm">
                With sqrt_decay pricing, <strong>early buyers acquire tokens at the lowest prices</strong>. As
                the treasury depletes, each subsequent token costs more. First movers who believe in the content
                are rewarded—late adopters pay a premium but still get access at a deterministic, fair price.
              </p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">5.3 Revenue Distribution (Configurable)</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Content creators implementing $402 can configure revenue splits. The recommended default:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 text-gray-800 dark:text-gray-300">
{`Recommended Split (configurable per token):
├── Issuer/Creator:   70-90%
├── Facilitator:      5-20%
└── Referrer/CDN:     5-10% (optional)

Discovery document specifies:
  "revenue_split": {
    "issuer_bps": 8000,
    "facilitator_bps": 2000
  }`}
            </pre>

            <h3 className="text-xl font-bold mt-8 mb-4">5.4 Token Value Dynamics</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Token value derives from three sources:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 text-gray-800 dark:text-gray-300">
{`Value Sources:
├── Access Right:   Token unlocks protected content
├── Scarcity:       Fixed supply, increasing price floor
└── Secondary:      Tradeable on BSV-20 markets

Example: $BLOG token for premium content
  - Creator prices at 1000 sats base
  - Early supporters get cheap access
  - Can resell tokens if content gains popularity`}
            </pre>
          </section>

          {/* 6. x402 Facilitator Protocol */}
          <section id="x402-facilitator" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">6. x402 Facilitator Protocol</h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              PATH402.com operates as an <strong>x402 facilitator</strong>—a payment verification service
              compatible with Coinbase's x402 protocol specification. This enables $402 to accept payments
              from multiple chains.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">6.1 Multi-Chain Support</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-6">
              {[
                { chain: "BSV", status: "Primary", color: "green" },
                { chain: "Base", status: "Supported", color: "blue" },
                { chain: "Solana", status: "Supported", color: "purple" },
                { chain: "Ethereum", status: "Supported", color: "gray" },
              ].map((item) => (
                <div key={item.chain} className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-center">
                  <div className="font-bold text-gray-900 dark:text-white">{item.chain}</div>
                  <div className={`text-sm text-${item.color}-600 dark:text-${item.color}-400`}>{item.status}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">6.2 Verification Flow</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 text-gray-800 dark:text-gray-300">
{`1. Client → Content Server: GET /protected-content
2. Server → Client: 402 + X-Path402-Facilitator header
3. Client → Facilitator: POST /api/x402/verify
   { paymentHeader, paymentPayload, paymentSignature }
4. Facilitator: Verify payment on source chain
5. Facilitator → BSV: Inscribe payment proof
6. Facilitator → Client: { valid: true, inscriptionId }
7. Client → Server: GET /protected-content + Authorization header
8. Server: Verify with facilitator, deliver content`}
            </pre>

            <h3 className="text-xl font-bold mt-8 mb-4">6.3 BSV Inscription Layer</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All payment verifications are permanently inscribed on BSV blockchain:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li><strong>Proof of payment</strong> — Cryptographic evidence of transaction</li>
              <li><strong>Chain of custody</strong> — Track token ownership history</li>
              <li><strong>Dispute resolution</strong> — Immutable record for arbitration</li>
              <li><strong>Audit trail</strong> — Complete transaction history</li>
            </ul>
          </section>

          {/* 7. AI Agent Integration */}
          <section id="ai-agents" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">7. AI Agent Integration</h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              $402 is designed for AI agents as <strong>first-class consumers</strong>. The MCP (Model Context
              Protocol) server enables Claude, GPT, and other LLMs to discover, evaluate, and acquire content
              autonomously.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">7.1 MCP Tools</h3>
            <div className="overflow-x-auto mt-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 pr-4 text-gray-500 dark:text-gray-400 font-medium">Tool</th>
                    <th className="text-left py-3 text-gray-500 dark:text-gray-400 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-mono text-blue-600 dark:text-blue-400">path402_discover</td>
                    <td className="py-3">Probe URL, get pricing and token info</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-mono text-blue-600 dark:text-blue-400">path402_evaluate</td>
                    <td className="py-3">Check budget, estimate ROI</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-mono text-blue-600 dark:text-blue-400">path402_acquire</td>
                    <td className="py-3">Pay and receive token + content</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-mono text-blue-600 dark:text-blue-400">x402_verify</td>
                    <td className="py-3">Verify payment from any chain</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 pr-4 font-mono text-blue-600 dark:text-blue-400">x402_inscription</td>
                    <td className="py-3">Get BSV proof for payment</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">7.2 Self-Funding Agent Architecture</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The vision: AI agents that start with a small balance and grow it autonomously:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm mt-4 text-gray-800 dark:text-gray-300">
{`Agent Lifecycle:
1. DISCOVER → Find undervalued tokens
2. EVALUATE → Check ROI vs. budget
3. ACQUIRE → Buy tokens early
4. SERVE → Distribute content, earn fees
5. REINVEST → Buy more tokens
6. COMPOUND → Exponential growth`}
            </pre>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Because sqrt_decay guarantees positive ROI for early buyers, agents with good discovery
              heuristics can become self-sustaining—and eventually profitable.
            </p>
          </section>

          {/* 8. Investment Thesis */}
          <section id="investment" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">8. Investment Thesis</h2>

            <h3 className="text-xl font-bold mt-8 mb-4">8.1 Market Opportunity</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-4 mb-6">
              <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$600B+</div>
                <div className="text-gray-600 dark:text-gray-400">Digital content market (2025)</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$200B+</div>
                <div className="text-gray-600 dark:text-gray-400">AI agent economy (projected 2028)</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">8.2 Competitive Moat</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Protocol lock-in</strong> — HTTP 402 standard creates network effects</li>
              <li><strong>First-mover in AI payments</strong> — MCP integration before competitors</li>
              <li><strong>Multi-chain facilitator</strong> — Captures volume from all ecosystems</li>
              <li><strong>BSV inscription layer</strong> — Permanent proofs create switching costs</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">8.3 Revenue Model</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mt-4 mb-6">
              <div className="grid gap-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">Platform fee (per transaction)</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">20% (2000 bps)</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">x402 verification fee</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">100-500 sats</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">BSV inscription fee</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">1000 sats</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Enterprise API access</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">Monthly SaaS</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">8.4 Token Value Accrual</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The $PATH402 token (deployed on BSV) accrues value through:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li><strong>Fee buybacks</strong> — Platform fees used to acquire and burn tokens</li>
              <li><strong>Staking rewards</strong> — Token holders earn from facilitator fees</li>
              <li><strong>Governance rights</strong> — Vote on protocol parameters</li>
              <li><strong>Access tiers</strong> — Hold tokens for premium API limits</li>
            </ul>
          </section>

          {/* 9. Roadmap */}
          <section id="roadmap" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">9. Roadmap</h2>

            <div className="space-y-6 mt-6">
              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">Q1 2026</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Protocol Foundation</div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    <li>✓ HTTP 402 response specification</li>
                    <li>✓ sqrt_decay pricing model</li>
                    <li>✓ MCP server v1.0.0</li>
                    <li>✓ x402 facilitator integration</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Q2 2026</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Exchange & Discovery</div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    <li>→ Token exchange UI</li>
                    <li>→ Global $address registry</li>
                    <li>→ Creator onboarding tools</li>
                    <li>→ Mobile wallet integration</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Q3 2026</div>
                  <div className="text-xs text-gray-500">Planned</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">AI Agent Marketplace</div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    <li>○ Agent SDK release</li>
                    <li>○ Self-funding agent templates</li>
                    <li>○ Agent-to-agent content trading</li>
                    <li>○ Performance leaderboards</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Q4 2026</div>
                  <div className="text-xs text-gray-500">Planned</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Enterprise & Scale</div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    <li>○ Enterprise API with SLAs</li>
                    <li>○ White-label facilitator</li>
                    <li>○ Governance token launch</li>
                    <li>○ Cross-facilitator federation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Conclusion */}
          <section id="conclusion" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">10. Conclusion</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Path $402 Token Standard represents a fundamental shift in how the internet handles value
              exchange. By combining HTTP 402, unilateral contract theory, and deterministic pricing, we
              create a system where:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4 mb-6">
              <li>Content creators earn directly from consumers</li>
              <li>Early supporters are rewarded for their belief</li>
              <li>AI agents can autonomously participate in the economy</li>
              <li>Every transaction creates a permanent, verifiable record</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              HTTP 402 was reserved for "future use" in 1999. That future is now.
            </p>

            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mt-8 text-center">
              <div className="font-bold text-gray-900 dark:text-white text-xl mb-2">Join the Protocol</div>
              <div className="text-gray-600 dark:text-gray-400 mb-4">Support the $402 standard and earn as an early participant</div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/token"
                  className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Acquire $PATH402
                </Link>
                <a
                  href="https://github.com/b0ase/path402-mcp-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:border-gray-500 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12">
            <p className="text-gray-500 text-sm">
              This whitepaper is released under the{' '}
              <a
                href="https://github.com/b0ase/path402-com/blob/main/LICENSE"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Open BSV License version 4
              </a>.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Version 1.0.0 · February 2026 · path402.com
            </p>
          </section>
        </motion.article>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <Link href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Back to PATH402.com
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
