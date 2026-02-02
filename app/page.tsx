import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="mb-20">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            $PATH402
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-8">
            Turn any URL into a priced, tokenised market. Put a <code className="text-white bg-gray-900 px-2 py-1">$</code> in front of a path
            and it becomes an economic object with a price curve, holders, and revenue distribution.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.npmjs.com/package/path402-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              npm install path402-mcp-server
            </a>
            <Link
              href="/docs"
              className="px-8 py-4 border border-gray-700 text-white font-semibold text-lg hover:border-gray-500 transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>

        {/* What is $PATH402 */}
        <div className="mb-20">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            The Protocol
          </h2>
          <div className="border border-gray-800 p-8 bg-gray-900/20">
            <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
{`$PATH402 protocol
├── $pathd (the daemon — any machine can run it)
├── path402-mcp-server (AI agent tools)
└── path402.com/exchange (hosted marketplace)`}
            </pre>
          </div>
        </div>

        {/* How $addresses work */}
        <div className="mb-20">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            $addresses
          </h2>
          <p className="text-gray-400 mb-6 max-w-2xl">
            Content behind <code className="text-white bg-gray-900 px-2 py-1">$</code> path segments is $PATH402-gated.
            Each segment is an independent market with its own price and token.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-700 p-6">
              <code className="text-blue-400 font-mono text-sm">$example.com</code>
              <p className="text-gray-400 text-sm mt-2">Site-level token (cheap entry)</p>
            </div>
            <div className="border border-gray-700 p-6">
              <code className="text-blue-400 font-mono text-sm">$example.com/$api</code>
              <p className="text-gray-400 text-sm mt-2">Section token (API access)</p>
            </div>
            <div className="border border-gray-700 p-6">
              <code className="text-blue-400 font-mono text-sm">$example.com/$api/$data</code>
              <p className="text-gray-400 text-sm mt-2">Content token (specific resource)</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">sqrt_decay Pricing</h3>
              <p className="text-gray-400 text-sm">
                Price decreases as P/√n. Early buyers get better prices, everyone except the last achieves positive ROI.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">AI-Native</h3>
              <p className="text-gray-400 text-sm">
                Designed for AI agents as first-class consumers. MCP server included for Claude and other LLMs.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Self-Funding Agents</h3>
              <p className="text-gray-400 text-sm">
                Agents acquire tokens, serve content, earn revenue. Over time they become self-funding.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Serving Network</h3>
              <p className="text-gray-400 text-sm">
                Token holders can serve content to future buyers, earning a share of each transaction.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">HTTP 402</h3>
              <p className="text-gray-400 text-sm">
                Uses the dormant HTTP 402 Payment Required status code. Finally giving it purpose.
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Pricing Models</h3>
              <p className="text-gray-400 text-sm">
                Fixed, sqrt_decay, logarithmic, or linear with floor. Choose what fits your content.
              </p>
            </div>
          </div>
        </div>

        {/* Components */}
        <div className="mb-20">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Ecosystem
          </h2>
          <div className="space-y-4">
            <a
              href="https://www.npmjs.com/package/path402-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-700 p-6 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">path402-mcp-server</h3>
                  <p className="text-gray-400 text-sm">AI agent tools for discovering, evaluating, and acquiring $PATH402 content</p>
                </div>
                <span className="text-gray-500 font-mono text-sm">npm</span>
              </div>
            </a>
            <a
              href="https://github.com/b0ase/path402-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-700 p-6 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">GitHub Repository</h3>
                  <p className="text-gray-400 text-sm">Source code, issues, and contributions</p>
                </div>
                <span className="text-gray-500 font-mono text-sm">github</span>
              </div>
            </a>
            <Link
              href="/exchange"
              className="block border border-gray-700 p-6 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Exchange</h3>
                  <p className="text-gray-400 text-sm">Discover and acquire $PATH402 tokens</p>
                </div>
                <span className="text-gray-500 font-mono text-sm">marketplace</span>
              </div>
            </Link>
            <a
              href="https://b0ase.com/exchange"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-700 p-6 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">b0ase.com/exchange</h3>
                  <p className="text-gray-400 text-sm">Live marketplace with real $PATH402 tokens</p>
                </div>
                <span className="text-gray-500 font-mono text-sm">live</span>
              </div>
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-20">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Quick Start
          </h2>
          <div className="border border-gray-800 p-6 bg-gray-900/30">
            <h3 className="text-lg font-semibold text-white mb-4">Install the MCP Server</h3>
            <pre className="bg-black p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-4">
              npm install path402-mcp-server
            </pre>
            <h3 className="text-lg font-semibold text-white mb-4">Add to Claude Desktop</h3>
            <pre className="bg-black p-4 font-mono text-sm text-gray-300 overflow-x-auto">
{`{
  "mcpServers": {
    "path402": {
      "command": "npx",
      "args": ["path402-mcp-server"]
    }
  }
}`}
            </pre>
          </div>
        </div>

        {/* Agent Workflow */}
        <div className="border-t border-gray-800 pt-12">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Agent Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white mb-2">1</div>
              <div className="text-sm text-gray-400">DISCOVER</div>
              <p className="text-xs text-gray-500 mt-1">Probe $address, read pricing</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white mb-2">2</div>
              <div className="text-sm text-gray-400">EVALUATE</div>
              <p className="text-xs text-gray-500 mt-1">Check budget, estimate ROI</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white mb-2">3</div>
              <div className="text-sm text-gray-400">ACQUIRE</div>
              <p className="text-xs text-gray-500 mt-1">Pay, receive token + content</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white mb-2">4</div>
              <div className="text-sm text-gray-400">SERVE</div>
              <p className="text-xs text-gray-500 mt-1">Hold token, earn from buyers</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white mb-2">5</div>
              <div className="text-sm text-gray-400">REPEAT</div>
              <p className="text-xs text-gray-500 mt-1">Reinvest, grow portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
