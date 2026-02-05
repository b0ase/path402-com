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
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2"
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
              className="text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-6"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              PATH 402 TOKEN PROTOCOL
            </motion.p>

            <motion.p
              className="text-sm text-zinc-500 uppercase tracking-widest max-w-2xl mb-12"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Turn any URL into a shareholder business
            </motion.p>

            <motion.p
              className="text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Put a <code className="text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-800">$</code> in front of any path
              and it becomes a tokenized asset. Whether that path points to a person, a domain, or an API—
              tokens gate access, payment flows to holders.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.a
                href="https://www.npmjs.com/package/path402"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                npm install path402
              </motion.a>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/whitepaper"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Read the Whitepaper
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/exec-summary"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Exec Summary
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Core Idea */}
      <section className="py-16 px-6 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest">
              The Core Idea
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6">
                Every domain becomes a shareholder company. Every path becomes a tradable asset.
              </p>
              <p className="text-zinc-900 dark:text-white text-xl font-bold mb-6">
                Buy tickets. Hold shares. Run indexers. Earn rewards.
              </p>
              <p className="text-zinc-500 text-sm">
                The path402d network indexes the blockchain and serves content via a professional BRC-24 Lookup Overlay. Indexers earn a 5% protocol fee for every ticket verified and served.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
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
              Payment Flow
            </motion.h2>
            <div className="space-y-4">
              {[
                { step: "1", text: "Client requests a '$' path", code: "GET /$video-1" },
                { step: "2", text: "Server returns 402 (BRC-105 Challenge)", code: 'HTTP/1.1 402 Payment Required\nx-bsv-payment-satoshis-required: 1000\nx-bsv-payment-derivation-prefix: <nonce>' },
                { step: "3", text: "Client sends BRC-103 Auth + Payment", code: 'x-bsv-auth-identity-key: <pubkey>\nx-bsv-payment: { transaction, derivationSuffix }' },
                { step: "4", text: "Server verifies via BRC-104/105", code: null },
                { step: "5", text: "Server grants access + Indexer Stamp", code: "200 OK" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950"
                  variants={fadeIn}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-sm font-bold shrink-0">
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">{item.text}</p>
                    {item.code && (
                      <code className="text-xs text-zinc-500 mt-1 block font-mono">{item.code}</code>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Examples */}
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
              Examples
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
              >
                <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block mb-4">$alice</code>
                <p className="text-zinc-500 text-sm mb-2">Alice hosts a video. She mints 10,000 tokens.</p>
                <p className="text-zinc-400 text-xs">1 token = 1 view. Token returns to Alice after use. She resells it.</p>
              </motion.div>
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
              >
                <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block mb-4">$bob/$chatroom</code>
                <p className="text-zinc-500 text-sm mb-2">Bob runs a chatroom. He mints 100 tokens.</p>
                <p className="text-zinc-400 text-xs">1 token = 1 hour access. Max 100 concurrent users. Price floats with demand.</p>
              </motion.div>
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
              >
                <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block mb-4">$charlie/$api</code>
                <p className="text-zinc-500 text-sm mb-2">Charlie offers an API. 1 token = 1 call.</p>
                <p className="text-zinc-400 text-xs">Bulk buyers get volume discounts via secondary market.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Token Model */}
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
              Token Model
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={fadeIn}
              >
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Properties</h3>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li><strong className="text-zinc-900 dark:text-white">Path-bound:</strong> Each token tied to a specific path</li>
                  <li><strong className="text-zinc-900 dark:text-white">Reusable Tickets:</strong> Permanent access passes or consumable vouchers</li>
                  <li><strong className="text-zinc-900 dark:text-white">Tradeable:</strong> Buy/sell on secondary markets</li>
                  <li><strong className="text-zinc-900 dark:text-white">UTXO-based:</strong> No double-spend possible</li>
                </ul>
              </motion.div>
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={fadeIn}
              >
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Path Hierarchy</h3>
                <pre className="text-zinc-600 dark:text-zinc-400 font-mono text-sm mb-4">
                  {`$alice           → access to all
$alice/chatroom  → access to chatroom only
$alice/video-1   → access to video only`}
                </pre>
                <p className="text-zinc-500 text-xs">Parent path tokens grant access to all child paths.</p>
              </motion.div>
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
          >
            <h2 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest">
              Quick Start
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide">Install path402</h3>
              <pre className="bg-white dark:bg-black p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto mb-6 border border-zinc-200 dark:border-zinc-800">
                npm install -g path402
              </pre>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide">Run the Daemon</h3>
              <pre className="bg-white dark:bg-black p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto mb-6 border border-zinc-200 dark:border-zinc-800">
                path402d start
              </pre>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide">Add to Claude Desktop</h3>
              <pre className="bg-white dark:bg-black p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto border border-zinc-200 dark:border-zinc-800">
                {`{
  "mcpServers": {
    "path402": {
      "command": "npx",
      "args": ["path402"]
    }
  }
}`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ecosystem */}
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
                { href: "/download", title: "Desktop Client", desc: "Download the $402 daemon for Mac, Windows, Linux", tag: "download", external: false },
                { href: "https://www.npmjs.com/package/path402", title: "path402", desc: "MCP server + daemon + CLI in one package", tag: "npm", external: true },
                { href: "https://github.com/b0ase/path402", title: "GitHub", desc: "Source code, issues, and contributions", tag: "github", external: true },
                { href: "/protocol", title: "Protocol Economics", desc: "Advanced mechanics: staking, dividends, flywheel", tag: "advanced", external: false },
                { href: "/docs", title: "Documentation", desc: "Protocol spec, API reference, guides", tag: "docs", external: false },
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-4">
            The $ is the signal. The ticket is the proof.
          </h2>
          <p className="text-zinc-500 mb-8">
            The web finally works the way it was supposed to.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/protocol"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Protocol Economics →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
