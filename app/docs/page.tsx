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

export default function DocsPage() {
  const tocItems = [
    { id: "what-is-path402", label: "What is $PATH402?" },
    { id: "addresses", label: "$addresses" },
    { id: "pricing-models", label: "Pricing Models" },
    { id: "mcp-server", label: "MCP Server" },
    { id: "tools", label: "Available Tools" },
    { id: "self-funding", label: "Self-Funding Agents" },
  ];

  const pricingModels = [
    { title: "sqrt_decay (Recommended)", desc: "Price = Base / √(supply + 1). Early buyers pay more, price decreases with supply.", note: "Key insight: Every buyer except the last achieves positive ROI." },
    { title: "Fixed", desc: "Same price for everyone, regardless of supply." },
    { title: "Logarithmic Decay", desc: "Gentler price decrease than sqrt_decay." },
    { title: "Linear with Floor", desc: "Linear decrease to a minimum price." },
  ];

  const tools = [
    { name: "path402_discover", desc: "Probe a $address — get pricing, supply, revenue model" },
    { name: "path402_evaluate", desc: "Budget check — should the agent buy? Returns ROI estimate" },
    { name: "path402_acquire", desc: "Pay and receive token + content" },
    { name: "path402_serve", desc: "Serve content to a requester and earn revenue" },
    { name: "path402_wallet", desc: "View balance, tokens held, total spent/earned" },
    { name: "path402_economics", desc: "Deep dive into breakeven, ROI projections" },
    { name: "path402_batch_discover", desc: "Discover multiple $addresses at once" },
    { name: "path402_price_schedule", desc: "See how price decays with supply" },
    { name: "path402_set_budget", desc: "Configure the agent's spending budget" },
  ];

  const resources = [
    { href: "https://github.com/b0ase/path402-mcp-server", title: "GitHub Repository", desc: "Source code and issues", external: true },
    { href: "https://www.npmjs.com/package/path402-mcp-server", title: "npm Package", desc: "Install and use", external: true },
    { href: "/exchange", title: "Exchange", desc: "Discover and acquire tokens", external: false },
    { href: "https://b0ase.com/exchange", title: "Live Exchange", desc: "Trade real tokens at b0ase.com", external: true },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Link href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm mb-4 inline-block">
              ← Back to Home
            </Link>
          </motion.div>
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            Documentation
          </motion.h1>
          <motion.p
            className="text-gray-400"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Everything you need to know about the $PATH402 protocol.
          </motion.p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          className="border border-gray-800 p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Contents</h2>
          <ul className="space-y-2 text-sm">
            {tocItems.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <a href={`#${item.id}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                  {item.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* What is $PATH402 */}
        <motion.section
          id="what-is-path402"
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
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
        </motion.section>

        {/* $addresses */}
        <motion.section
          id="addresses"
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">$addresses</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            Content behind <code className="text-white bg-gray-900 px-2 py-1">$</code> path segments
            is $PATH402-gated. Each segment is an independent market.
          </p>
          <motion.pre
            className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto mb-4"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
{`$example.com                    → site-level token (cheap)
$example.com/$blog              → section token
$example.com/$blog/$my-post     → content token (the actual content)`}
          </motion.pre>
          <p className="text-gray-400 leading-relaxed">
            Each <code className="text-white bg-gray-900 px-1">$</code> segment creates a new market
            with its own price curve, supply, and token holders.
          </p>
        </motion.section>

        {/* Pricing Models */}
        <motion.section
          id="pricing-models"
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            variants={fadeIn}
          >
            Pricing Models
          </motion.h2>
          <div className="space-y-4">
            {pricingModels.map((model, i) => (
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
                <h3 className="text-lg font-semibold text-white mb-2">{model.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{model.desc}</p>
                {model.note && (
                  <p className="text-gray-500 text-sm italic">{model.note}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* MCP Server */}
        <motion.section
          id="mcp-server"
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">MCP Server</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            The path402-mcp-server enables AI agents to interact with $PATH402 content.
          </p>
          <h3 className="text-xl font-semibold text-white mb-4">Installation</h3>
          <motion.pre
            className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto mb-6"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
npm install path402-mcp-server
          </motion.pre>
          <h3 className="text-xl font-semibold text-white mb-4">Claude Desktop Configuration</h3>
          <motion.pre
            className="bg-gray-900 p-6 font-mono text-sm text-gray-300 overflow-x-auto mb-6"
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
          <p className="text-gray-400">
            Add this to your <code className="text-white bg-gray-900 px-1">claude_desktop_config.json</code> file.
          </p>
        </motion.section>

        {/* Tools */}
        <motion.section
          id="tools"
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
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
                {tools.map((tool, i) => (
                  <motion.tr
                    key={tool.name}
                    className="border-b border-gray-800"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <td className="py-3 font-mono text-blue-400">{tool.name}</td>
                    <td className="py-3">{tool.desc}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Self-Funding Agents */}
        <motion.section
          id="self-funding"
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
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
        </motion.section>

        {/* Links */}
        <motion.section
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
            Resources
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                {resource.external ? (
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-gray-700 p-4 hover:border-gray-500 transition-colors"
                  >
                    <h3 className="font-semibold text-white">{resource.title}</h3>
                    <p className="text-gray-400 text-sm">{resource.desc}</p>
                  </a>
                ) : (
                  <Link
                    href={resource.href}
                    className="block border border-gray-700 p-4 hover:border-gray-500 transition-colors"
                  >
                    <h3 className="font-semibold text-white">{resource.title}</h3>
                    <p className="text-gray-400 text-sm">{resource.desc}</p>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
