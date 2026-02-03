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
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-mono selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Hero Section */}
      <section className="relative py-24 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-8"
              variants={fadeIn}
            >
              HTTP_402: PAYMENT_REQUIRED
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6"
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
                className="text-zinc-300 dark:text-zinc-700"
              >
                402
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-sm text-zinc-500 uppercase tracking-widest max-w-2xl mb-12"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              The Path Token Standard. Turn any URL into a priced, tokenised market.
            </motion.p>

            <motion.p
              className="text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Put a <code className="text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-800">$</code> in front of a path
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
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                whileHover={{ scale: 1.02 }}
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
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Read the Docs
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/token"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Support the Project
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What is $402 */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest">
              The Protocol
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950">
              <pre className="text-zinc-600 dark:text-zinc-400 font-mono text-sm overflow-x-auto">
{`$402 Protocol — The Path Token Standard
├── $pathd (the daemon — any machine can run it)
├── path402-mcp-server (AI agent tools)
├── x402 facilitator (multi-chain payment verification)
└── path402.com (official site + exchange)`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How $addresses work */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest"
              variants={fadeIn}
            >
              $addresses
            </motion.h2>
            <motion.p
              className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl"
              variants={fadeIn}
            >
              Content behind <code className="text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-800">$</code> path segments is $402-gated.
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
                  className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{
                    borderColor: "rgba(161, 161, 170, 1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-sm">{item.code}</code>
                  <p className="text-zinc-500 text-sm mt-2">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest"
              variants={fadeIn}
            >
              Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "sqrt_decay Pricing", desc: "Price decreases as P/sqrt(n). Early buyers get better prices, everyone except the last achieves positive ROI." },
                { title: "AI-Native", desc: "Designed for AI agents as first-class consumers. MCP server included for Claude and other LLMs." },
                { title: "Self-Funding Agents", desc: "Agents acquire tokens, serve content, earn revenue. Over time they become self-funding." },
                { title: "x402 Compatible", desc: "Full x402 facilitator for multi-chain payment verification. BSV inscription for permanent proofs." },
                { title: "HTTP 402", desc: "Uses the dormant HTTP 402 Payment Required status code. Finally giving it purpose." },
                { title: "Multiple Pricing Models", desc: "Fixed, sqrt_decay, logarithmic, or linear with floor. Choose what fits your content." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900/50"
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{
                    borderColor: "rgba(161, 161, 170, 1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Components */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest"
              variants={fadeIn}
            >
              Ecosystem
            </motion.h2>
            <div className="space-y-3">
              {[
                { href: "https://www.npmjs.com/package/path402-mcp-server", title: "path402-mcp-server", desc: "AI agent tools for discovering, evaluating, and acquiring $402 content", tag: "npm", external: true },
                { href: "https://github.com/b0ase/path402-mcp-server", title: "GitHub Repository", desc: "Source code, issues, and contributions", tag: "github", external: true },
                { href: "/exchange", title: "Exchange", desc: "Discover and acquire $PATH402 tokens", tag: "marketplace", external: false },
                { href: "https://b0ase.com/exchange", title: "b0ase.com/exchange", desc: "Live marketplace with real $PATH402 tokens", tag: "live", external: true },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-zinc-200 dark:border-zinc-800 p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors bg-zinc-50 dark:bg-zinc-950"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                          <p className="text-zinc-500 text-sm">{item.desc}</p>
                        </div>
                        <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                          {item.tag}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="block border border-zinc-200 dark:border-zinc-800 p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors bg-zinc-50 dark:bg-zinc-950"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                          <p className="text-zinc-500 text-sm">{item.desc}</p>
                        </div>
                        <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{item.tag}</span>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest">
              Quick Start
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide">Install the MCP Server</h3>
              <pre className="bg-white dark:bg-black p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto mb-6 border border-zinc-200 dark:border-zinc-800">
                npm install path402-mcp-server
              </pre>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide">Add to Claude Desktop</h3>
              <pre className="bg-white dark:bg-black p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto border border-zinc-200 dark:border-zinc-800">
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
          </motion.div>
        </div>
      </section>

      {/* Agent Workflow */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-[10px] font-bold text-zinc-500 mb-12 uppercase tracking-widest text-center"
              variants={fadeIn}
            >
              Agent Workflow
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { num: "1", title: "DISCOVER", desc: "Probe $address, read pricing" },
                { num: "2", title: "EVALUATE", desc: "Check budget, estimate ROI" },
                { num: "3", title: "ACQUIRE", desc: "Pay, receive token + content" },
                { num: "4", title: "SERVE", desc: "Hold token, earn from buyers" },
                { num: "5", title: "REPEAT", desc: "Reinvest, grow portfolio" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-xl font-bold"
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
                  <div className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-1">{step.title}</div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
            Ready to Build?
          </h2>
          <p className="text-zinc-500 mb-8">
            Start monetizing your content with the $402 protocol.
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
