'use client';

import Link from "next/link";
import { motion } from "framer-motion";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function ExchangePage() {
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
        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Link href="/" className="text-gray-500 hover:text-white text-sm mb-4 inline-block">
              ← Back to Home
            </Link>
          </motion.div>
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            Exchange
          </motion.h1>
          <motion.p
            className="text-gray-400 max-w-2xl"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Discover and acquire $PATH402 tokens. View current prices, supply levels, and economics
            before making a purchase.
          </motion.p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          className="border border-blue-500/30 bg-blue-500/10 p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
        >
          <h3 className="text-blue-400 font-semibold mb-2">Live Exchange at b0ase.com</h3>
          <p className="text-gray-400 text-sm mb-4">
            For live token trading with real payments, visit the full exchange at b0ase.com.
            This page shows example tokens and pricing models.
          </p>
          <motion.a
            href="https://b0ase.com/exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go to Live Exchange →
          </motion.a>
        </motion.div>

        {/* Token List */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            Example Tokens
          </motion.h2>
          <div className="space-y-4">
            {exampleTokens.map((token, i) => (
              <motion.div
                key={token.address}
                className="border border-gray-700 p-6"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  borderColor: "rgba(96, 165, 250, 0.5)",
                  y: -2,
                  transition: { duration: 0.2 }
                }}
              >
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
                  <motion.button
                    className="px-4 py-2 bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Acquire Token
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Explanation */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            How Pricing Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "sqrt_decay",
                desc: "Price = Base / √(supply + 1). Early buyers pay more, price decreases as supply grows.",
                code: ["Supply 0: 500 SAT", "Supply 10: 151 SAT", "Supply 100: 50 SAT"]
              },
              {
                title: "Revenue Split",
                desc: "Each purchase is split between the issuer and existing token holders (serving network).",
                code: ["Issuer: 50%", "Network: 50%"]
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="border border-gray-700 p-6"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  borderColor: "rgba(255,255,255,0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                <motion.div
                  className="bg-gray-900 p-4 font-mono text-sm"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  {item.code.map((line, j) => (
                    <div key={j} className="text-gray-500">{line}</div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Agent Tools */}
        <motion.div
          className="border-t border-gray-800 pt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            For AI Agents
          </h2>
          <p className="text-gray-400 mb-6">
            Use the path402-mcp-server to discover, evaluate, and acquire tokens programmatically.
          </p>
          <motion.pre
            className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
{`# Install the MCP server
npm install path402-mcp-server

# Tools available:
path402_discover    # Probe a $address
path402_evaluate    # Budget check
path402_acquire     # Pay and receive token
path402_wallet      # View holdings
path402_economics   # Deep financial analysis`}
          </motion.pre>
        </motion.div>
      </div>
    </div>
  );
}
