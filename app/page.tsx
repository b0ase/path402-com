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
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-6"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              $
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              PATH402
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mb-8"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Turn any URL into a priced, tokenised market. Put a <code className="text-white bg-gray-900 px-2 py-1">$</code> in front of a path
            and it becomes an economic object with a price curve, holders, and revenue distribution.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.a
              href="https://www.npmjs.com/package/path402-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              npm install path402-mcp-server
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/docs"
                className="inline-block px-8 py-4 border border-gray-700 text-white font-semibold text-lg hover:border-gray-500 transition-colors"
              >
                Read the Docs
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* What is $PATH402 */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            The Protocol
          </h2>
          <motion.div
            className="border border-gray-800 p-8 bg-gray-900/20"
            whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
{`$PATH402 protocol
├── $pathd (the daemon — any machine can run it)
├── path402-mcp-server (AI agent tools)
└── path402.com/exchange (hosted marketplace)`}
            </pre>
          </motion.div>
        </motion.div>

        {/* How $addresses work */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            $addresses
          </motion.h2>
          <motion.p
            className="text-gray-400 mb-6 max-w-2xl"
            variants={fadeIn}
          >
            Content behind <code className="text-white bg-gray-900 px-2 py-1">$</code> path segments is $PATH402-gated.
            Each segment is an independent market with its own price and token.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: "$example.com", desc: "Site-level token (cheap entry)" },
              { code: "$example.com/$api", desc: "Section token (API access)" },
              { code: "$example.com/$api/$data", desc: "Content token (specific resource)" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="border border-gray-700 p-6"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  borderColor: "rgba(96, 165, 250, 0.5)",
                  y: -4,
                  transition: { duration: 0.2 }
                }}
              >
                <code className="text-blue-400 font-mono text-sm">{item.code}</code>
                <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "sqrt_decay Pricing", desc: "Price decreases as P/√n. Early buyers get better prices, everyone except the last achieves positive ROI." },
              { title: "AI-Native", desc: "Designed for AI agents as first-class consumers. MCP server included for Claude and other LLMs." },
              { title: "Self-Funding Agents", desc: "Agents acquire tokens, serve content, earn revenue. Over time they become self-funding." },
              { title: "Serving Network", desc: "Token holders can serve content to future buyers, earning a share of each transaction." },
              { title: "HTTP 402", desc: "Uses the dormant HTTP 402 Payment Required status code. Finally giving it purpose." },
              { title: "Multiple Pricing Models", desc: "Fixed, sqrt_decay, logarithmic, or linear with floor. Choose what fits your content." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="border border-gray-700 p-6"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{
                  borderColor: "rgba(255,255,255,0.3)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  transition: { duration: 0.2 }
                }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Components */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            Ecosystem
          </motion.h2>
          <div className="space-y-4">
            {[
              { href: "https://www.npmjs.com/package/path402-mcp-server", title: "path402-mcp-server", desc: "AI agent tools for discovering, evaluating, and acquiring $PATH402 content", tag: "npm", external: true },
              { href: "https://github.com/b0ase/path402-mcp-server", title: "GitHub Repository", desc: "Source code, issues, and contributions", tag: "github", external: true },
              { href: "/exchange", title: "Exchange", desc: "Discover and acquire $PATH402 tokens", tag: "marketplace", external: false },
              { href: "https://b0ase.com/exchange", title: "b0ase.com/exchange", desc: "Live marketplace with real $PATH402 tokens", tag: "live", external: true },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ x: 8 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-gray-700 p-6 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <motion.span
                        className="text-gray-500 font-mono text-sm"
                        whileHover={{ color: "#fff" }}
                      >
                        {item.tag}
                      </motion.span>
                    </div>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block border border-gray-700 p-6 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <span className="text-gray-500 font-mono text-sm">{item.tag}</span>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
            Quick Start
          </h2>
          <motion.div
            className="border border-gray-800 p-6 bg-gray-900/30"
            whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Install the MCP Server</h3>
            <motion.pre
              className="bg-black p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-4"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              npm install path402-mcp-server
            </motion.pre>
            <h3 className="text-lg font-semibold text-white mb-4">Add to Claude Desktop</h3>
            <motion.pre
              className="bg-black p-4 font-mono text-sm text-gray-300 overflow-x-auto"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
{`{
  "mcpServers": {
    "path402": {
      "command": "npx",
      "args": ["path402-mcp-server"]
    }
  }
}`}
            </motion.pre>
          </motion.div>
        </motion.div>

        {/* Agent Workflow */}
        <motion.div
          className="border-t border-gray-800 pt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            Agent Workflow
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: "1", title: "DISCOVER", desc: "Probe $address, read pricing" },
              { num: "2", title: "EVALUATE", desc: "Check budget, estimate ROI" },
              { num: "3", title: "ACQUIRE", desc: "Pay, receive token + content" },
              { num: "4", title: "SERVE", desc: "Hold token, earn from buyers" },
              { num: "5", title: "REPEAT", desc: "Reinvest, grow portfolio" },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="text-center p-4"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.3 + i * 0.1
                  }}
                >
                  {step.num}
                </motion.div>
                <div className="text-sm text-gray-400">{step.title}</div>
                <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
