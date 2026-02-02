'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function StandardPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">The $402 Standard</h1>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
              v1.0.0-draft
            </span>
          </div>
          <p className="text-xl text-gray-400">
            A protocol specification for HTTP 402 Payment Required
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <a href="#abstract" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors">Abstract</a>
          <a href="#http-402" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors">HTTP 402</a>
          <a href="#discovery" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors">Discovery</a>
          <a href="#pricing" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors">Pricing Models</a>
          <a href="#mcp" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors">MCP Interface</a>
          <a href="#conformance" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors">Conformance</a>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          {/* Abstract */}
          <section id="abstract" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Abstract</h2>
            <p className="text-gray-300">
              The $402 standard defines a protocol for HTTP 402 Payment Required responses, enabling
              machine-readable pricing, token-gated content access, and micropayment flows between
              humans, applications, and AI agents.
            </p>
          </section>

          {/* Motivation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Motivation</h2>
            <p className="text-gray-300 mb-4">
              HTTP 402 "Payment Required" has existed since 1999 but lacked a standardized implementation.
              The $402 standard provides:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong className="text-white">Machine-readable pricing</strong> — AI agents and applications can discover costs before accessing content</li>
              <li><strong className="text-white">Token-gated access</strong> — Content creators monetize without subscriptions or ads</li>
              <li><strong className="text-white">Deterministic pricing</strong> — Transparent, algorithmic pricing models</li>
              <li><strong className="text-white">Interoperability</strong> — Any client, wallet, or agent can participate</li>
            </ul>
          </section>

          {/* HTTP 402 Response */}
          <section id="http-402" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">1. HTTP 402 Response</h2>
            <p className="text-gray-300 mb-4">
              When content requires payment, servers MUST return HTTP 402 with the following headers:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`HTTP/1.1 402 Payment Required
Content-Type: application/json
X-Path402-Price: <price_in_sats>
X-Path402-Token: <token_symbol>
X-Path402-Address: <payment_address>
X-Path402-Protocol: bsv-20`}
            </pre>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Required Headers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 pr-4 text-gray-400">Header</th>
                    <th className="text-left py-2 pr-4 text-gray-400">Description</th>
                    <th className="text-left py-2 text-gray-400">Example</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-green-400">X-Path402-Price</td>
                    <td className="py-2 pr-4">Price in satoshis</td>
                    <td className="py-2 font-mono">5000</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-green-400">X-Path402-Token</td>
                    <td className="py-2 pr-4">Token symbol required</td>
                    <td className="py-2 font-mono">PATH402.com</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-green-400">X-Path402-Address</td>
                    <td className="py-2 pr-4">Payment destination</td>
                    <td className="py-2 font-mono text-xs">1BrbnQon4u...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Response Body</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "error": "payment_required",
  "price_sats": 5000,
  "token": "PATH402.com",
  "address": "1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1",
  "message": "This content requires 1 PATH402.com token",
  "discovery_url": "https://path402.com/.well-known/path402.json"
}`}
            </pre>
          </section>

          {/* Discovery Protocol */}
          <section id="discovery" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">2. Discovery Protocol</h2>
            <p className="text-gray-300 mb-4">
              Servers implementing $402 MUST provide a discovery endpoint at <code className="bg-gray-800 px-2 py-1 rounded">/.well-known/path402.json</code>:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "$402_version": "1.0.0",
  "token": {
    "symbol": "PATH402.com",
    "protocol": "bsv-20",
    "inscription_id": "5bf47d3af709a385d3a5...",
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
  }
}`}
            </pre>
          </section>

          {/* Pricing Models */}
          <section id="pricing" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">3. Pricing Models</h2>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">3.1 sqrt_decay (Default)</h3>
            <p className="text-gray-300 mb-4">
              Price increases as supply decreases, rewarding early adopters:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
{`price = base_price / sqrt(treasury_remaining + 1)`}
            </pre>
            <p className="text-gray-300 mb-4">Properties:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-6">
              <li>Early buyers get cheaper tokens</li>
              <li>Price increases as treasury depletes</li>
              <li>Deterministic and transparent</li>
              <li>No market manipulation possible</li>
            </ul>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 pr-4 text-gray-400">Treasury Remaining</th>
                    <th className="text-left py-2 pr-4 text-gray-400">Price (sats)</th>
                    <th className="text-left py-2 text-gray-400">Price (BSV)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300 font-mono">
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4">500,000,000</td>
                    <td className="py-2 pr-4 text-green-400">4,472</td>
                    <td className="py-2">0.00004472</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4">250,000,000</td>
                    <td className="py-2 pr-4 text-green-400">6,325</td>
                    <td className="py-2">0.00006325</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4">100,000,000</td>
                    <td className="py-2 pr-4 text-yellow-400">10,000</td>
                    <td className="py-2">0.0001</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4">10,000,000</td>
                    <td className="py-2 pr-4 text-orange-400">31,623</td>
                    <td className="py-2">0.00031623</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4">1,000,000</td>
                    <td className="py-2 pr-4 text-red-400">100,000</td>
                    <td className="py-2">0.001</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">3.2 fixed</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`price = fixed_price`}
            </pre>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">3.3 linear_decay</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`price = base_price * (treasury_remaining / total_supply)`}
            </pre>
          </section>

          {/* MCP Interface */}
          <section id="mcp" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">4. MCP Server Interface</h2>
            <p className="text-gray-300 mb-4">
              For AI agent integration, $402 services SHOULD implement MCP (Model Context Protocol) tools:
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Required Tools</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 pr-4 text-gray-400">Tool</th>
                    <th className="text-left py-2 text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-blue-400">path402_discover</td>
                    <td className="py-2">Get pricing and token info for a URL</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-blue-400">path402_acquire</td>
                    <td className="py-2">Purchase tokens and access content</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-blue-400">path402_balance</td>
                    <td className="py-2">Check token balance for an address</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Example: path402_discover</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`// Input
{ "url": "https://example.com/premium-content" }

// Output
{
  "url": "https://example.com/premium-content",
  "requires_payment": true,
  "price_sats": 5000,
  "token": "PATH402.com",
  "token_price_sats": 4473,
  "tokens_needed": 1,
  "total_cost_sats": 4473
}`}
            </pre>
          </section>

          {/* Conformance */}
          <section id="conformance" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">5. Conformance Levels</h2>

            <div className="grid gap-4 mt-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-mono">$402 Basic</span>
                </div>
                <p className="text-gray-300">HTTP 402 response with required headers</p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full font-mono">$402 Discoverable</span>
                </div>
                <p className="text-gray-300">Basic + <code className="bg-gray-800 px-1 rounded">/.well-known/path402.json</code></p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full font-mono">$402 Complete</span>
                </div>
                <p className="text-gray-300">Discoverable + MCP tools + pricing model</p>
              </div>
            </div>
          </section>

          {/* Reference Implementations */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Reference Implementations</h2>
            <div className="grid gap-4 mt-6">
              <a
                href="https://github.com/b0ase/path402-com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors block"
              >
                <div className="font-mono text-white mb-1">PATH402.com</div>
                <div className="text-gray-400 text-sm">TypeScript/Next.js — Reference implementation</div>
              </a>

              <a
                href="https://github.com/b0ase/path402-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors block"
              >
                <div className="font-mono text-white mb-1">path402-mcp-server</div>
                <div className="text-gray-400 text-sm">TypeScript — MCP server for AI agents</div>
              </a>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">
              This specification is released under{' '}
              <a href="https://creativecommons.org/publicdomain/zero/1.0/" className="text-gray-400 hover:text-white">
                CC0 1.0 Universal
              </a>.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Full specification available at{' '}
              <a
                href="https://github.com/b0ase/path402-com/blob/main/docs/%24402-STANDARD.md"
                className="text-gray-400 hover:text-white"
              >
                GitHub
              </a>.
            </p>
          </section>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to PATH402.com
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
