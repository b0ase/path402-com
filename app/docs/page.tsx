import Link from "next/link";

export const metadata = {
  title: "Documentation — $PATH402",
  description: "Learn how to use the $PATH402 protocol for tokenised content and AI-native micropayments.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-gray-500 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-gray-400">
            Everything you need to know about the $PATH402 protocol.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="border border-gray-800 p-6 mb-12">
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Contents</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#what-is-path402" className="text-blue-400 hover:text-blue-300">What is $PATH402?</a></li>
            <li><a href="#addresses" className="text-blue-400 hover:text-blue-300">$addresses</a></li>
            <li><a href="#pricing-models" className="text-blue-400 hover:text-blue-300">Pricing Models</a></li>
            <li><a href="#mcp-server" className="text-blue-400 hover:text-blue-300">MCP Server</a></li>
            <li><a href="#tools" className="text-blue-400 hover:text-blue-300">Available Tools</a></li>
            <li><a href="#self-funding" className="text-blue-400 hover:text-blue-300">Self-Funding Agents</a></li>
          </ul>
        </div>

        {/* What is $PATH402 */}
        <section id="what-is-path402" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">What is $PATH402?</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            $PATH402 is a protocol that turns any URL path into a priced, tokenised market. Put a{" "}
            <code className="text-white bg-gray-900 px-2 py-1">$</code> in front of a path segment
            and it becomes an economic object with a price curve, a supply count, holders who serve
            the content, and revenue that flows to participants.
          </p>
          <p className="text-gray-400 mb-4 leading-relaxed">
            The name combines:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li><strong className="text-white">$PATH</strong> — the namespace/directory concept (every $address is a path)</li>
            <li><strong className="text-white">402</strong> — HTTP 402 Payment Required (the response that triggers payment)</li>
          </ul>
        </section>

        {/* $addresses */}
        <section id="addresses" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">$addresses</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            Content behind <code className="text-white bg-gray-900 px-2 py-1">$</code> path segments
            is $PATH402-gated. Each segment is an independent market.
          </p>
          <pre className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto mb-4">
{`$example.com                    → site-level token (cheap)
$example.com/$blog              → section token
$example.com/$blog/$my-post     → content token (the actual content)`}
          </pre>
          <p className="text-gray-400 leading-relaxed">
            Each <code className="text-white bg-gray-900 px-1">$</code> segment creates a new market
            with its own price curve, supply, and token holders.
          </p>
        </section>

        {/* Pricing Models */}
        <section id="pricing-models" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Pricing Models</h2>
          <div className="space-y-6">
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">sqrt_decay (Recommended)</h3>
              <p className="text-gray-400 text-sm mb-2">
                Price = Base / √(supply + 1). Early buyers pay more, price decreases with supply.
              </p>
              <p className="text-gray-500 text-sm italic">
                Key insight: Every buyer except the last achieves positive ROI.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Fixed</h3>
              <p className="text-gray-400 text-sm">
                Same price for everyone, regardless of supply.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Logarithmic Decay</h3>
              <p className="text-gray-400 text-sm">
                Gentler price decrease than sqrt_decay.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Linear with Floor</h3>
              <p className="text-gray-400 text-sm">
                Linear decrease to a minimum price.
              </p>
            </div>
          </div>
        </section>

        {/* MCP Server */}
        <section id="mcp-server" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">MCP Server</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            The path402-mcp-server enables AI agents to interact with $PATH402 content.
          </p>
          <h3 className="text-xl font-semibold text-white mb-4">Installation</h3>
          <pre className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto mb-6">
npm install path402-mcp-server
          </pre>
          <h3 className="text-xl font-semibold text-white mb-4">Claude Desktop Configuration</h3>
          <pre className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto mb-6">
{`{
  "mcpServers": {
    "path402": {
      "command": "npx",
      "args": ["path402-mcp-server"]
    }
  }
}`}
          </pre>
          <p className="text-gray-400">
            Add this to your <code className="text-white bg-gray-900 px-1">claude_desktop_config.json</code> file.
          </p>
        </section>

        {/* Tools */}
        <section id="tools" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Available Tools</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-gray-400 font-medium">Tool</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_discover</td>
                  <td className="py-3">Probe a $address — get pricing, supply, revenue model</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_evaluate</td>
                  <td className="py-3">Budget check — should the agent buy? Returns ROI estimate</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_acquire</td>
                  <td className="py-3">Pay and receive token + content</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_serve</td>
                  <td className="py-3">Serve content to a requester and earn revenue</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_wallet</td>
                  <td className="py-3">View balance, tokens held, total spent/earned</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_economics</td>
                  <td className="py-3">Deep dive into breakeven, ROI projections</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_batch_discover</td>
                  <td className="py-3">Discover multiple $addresses at once</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 font-mono text-blue-400">path402_price_schedule</td>
                  <td className="py-3">See how price decays with supply</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-blue-400">path402_set_budget</td>
                  <td className="py-3">Configure the agent's spending budget</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Self-Funding Agents */}
        <section id="self-funding" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Self-Funding Agents</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            The vision: an AI agent that starts with a small balance and grows it by:
          </p>
          <ol className="list-decimal list-inside text-gray-400 space-y-2 mb-6">
            <li>Acquiring undervalued tokens early</li>
            <li>Serving content to later buyers</li>
            <li>Reinvesting earnings into new tokens</li>
            <li>Eventually operating at profit</li>
          </ol>
          <p className="text-gray-400 mb-6 leading-relaxed">
            This is possible because sqrt_decay pricing mathematically guarantees positive returns
            for early buyers. The agent's job is to identify good opportunities early.
          </p>
          <h3 className="text-xl font-semibold text-white mb-4">Agent Strategy Tips</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li><strong className="text-white">Buy early:</strong> Position matters. #5 earns more than #500.</li>
            <li><strong className="text-white">Check breakeven:</strong> If breakeven requires 1000+ future buyers, skip.</li>
            <li><strong className="text-white">Diversify:</strong> Hold multiple tokens to average out risk.</li>
            <li><strong className="text-white">Serve actively:</strong> Revenue only flows when you serve.</li>
            <li><strong className="text-white">Monitor ROI:</strong> Use path402_servable to track performance.</li>
          </ul>
        </section>

        {/* Links */}
        <section className="border-t border-gray-800 pt-12">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://github.com/b0ase/path402-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-700 p-4 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white">GitHub Repository</h3>
              <p className="text-gray-400 text-sm">Source code and issues</p>
            </a>
            <a
              href="https://www.npmjs.com/package/path402-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-700 p-4 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white">npm Package</h3>
              <p className="text-gray-400 text-sm">Install and use</p>
            </a>
            <Link
              href="/exchange"
              className="border border-gray-700 p-4 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white">Exchange</h3>
              <p className="text-gray-400 text-sm">Discover and acquire tokens</p>
            </Link>
            <a
              href="https://b0ase.com/exchange"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-700 p-4 hover:border-gray-500 transition-colors"
            >
              <h3 className="font-semibold text-white">Live Exchange</h3>
              <p className="text-gray-400 text-sm">Trade real tokens at b0ase.com</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
