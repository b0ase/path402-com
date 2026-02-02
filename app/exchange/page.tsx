import Link from "next/link";

export const metadata = {
  title: "Exchange — $PATH402",
  description: "Discover and acquire $PATH402 tokens. View pricing, supply, and economics.",
};

export default function ExchangePage() {
  // Example tokens for display
  const exampleTokens = [
    {
      address: "$b0ase.com/$blog",
      price: 500,
      supply: 0,
      description: "Access to b0ase blog content",
      model: "sqrt_decay",
    },
    {
      address: "$b0ase.com/$api",
      price: 1000,
      supply: 0,
      description: "API access credits",
      model: "sqrt_decay",
    },
    {
      address: "$b0ase.com/$premium",
      price: 2500,
      supply: 0,
      description: "Premium content access",
      model: "sqrt_decay",
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-gray-500 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">Exchange</h1>
          <p className="text-gray-400 max-w-2xl">
            Discover and acquire $PATH402 tokens. View current prices, supply levels, and economics
            before making a purchase.
          </p>
        </div>

        {/* Info Banner */}
        <div className="border border-blue-500/30 bg-blue-500/10 p-6 mb-12">
          <h3 className="text-blue-400 font-semibold mb-2">Live Exchange at b0ase.com</h3>
          <p className="text-gray-400 text-sm mb-4">
            For live token trading with real payments, visit the full exchange at b0ase.com.
            This page shows example tokens and pricing models.
          </p>
          <a
            href="https://b0ase.com/exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            Go to Live Exchange →
          </a>
        </div>

        {/* Token List */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Example Tokens
          </h2>
          <div className="space-y-4">
            {exampleTokens.map((token) => (
              <div key={token.address} className="border border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <code className="text-blue-400 font-mono text-lg">{token.address}</code>
                    <p className="text-gray-400 text-sm mt-1">{token.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{token.price} SAT</div>
                    <div className="text-gray-500 text-sm">Supply: {token.supply}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-gray-500 text-sm font-mono">{token.model}</span>
                  <button className="px-4 py-2 bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors">
                    Acquire Token
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Explanation */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            How Pricing Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">sqrt_decay</h3>
              <p className="text-gray-400 text-sm mb-4">
                Price = Base / √(supply + 1). Early buyers pay more, price decreases as supply grows.
              </p>
              <div className="bg-gray-900 p-4 font-mono text-sm">
                <div className="text-gray-500">Supply 0: 500 SAT</div>
                <div className="text-gray-500">Supply 10: 151 SAT</div>
                <div className="text-gray-500">Supply 100: 50 SAT</div>
              </div>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Revenue Split</h3>
              <p className="text-gray-400 text-sm mb-4">
                Each purchase is split between the issuer and existing token holders (serving network).
              </p>
              <div className="bg-gray-900 p-4 font-mono text-sm">
                <div className="text-gray-500">Issuer: 50%</div>
                <div className="text-gray-500">Network: 50%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Tools */}
        <div className="border-t border-gray-800 pt-12">
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            For AI Agents
          </h2>
          <p className="text-gray-400 mb-6">
            Use the path402-mcp-server to discover, evaluate, and acquire tokens programmatically.
          </p>
          <pre className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto">
{`# Install the MCP server
npm install path402-mcp-server

# Tools available:
path402_discover    # Probe a $address
path402_evaluate    # Budget check
path402_acquire     # Pay and receive token
path402_wallet      # View holdings
path402_economics   # Deep financial analysis`}
          </pre>
        </div>
      </div>
    </div>
  );
}
