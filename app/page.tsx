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
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/whitepaper"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Read the Whitepaper
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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

      {/* Two Models */}
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
              Two Models, One Protocol
            </motion.h2>
            <motion.p
              className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl"
              variants={fadeIn}
            >
              The same primitive works for personal attention and digital assets.
              Any addressable endpoint can become a tokenized market.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
                whileHover={{
                  borderColor: "rgba(161, 161, 170, 1)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Personal Tokens</div>
                <div className="space-y-3 mb-6">
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block">$RICHARD</code>
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block">$ALICE</code>
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block">$SPIELBERG</code>
                </div>
                <p className="text-zinc-500 text-sm mb-4">Your time is the asset. 1 token = 1 second of attention.</p>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>→ Friends invest in friends</li>
                  <li>→ Tokens don&apos;t burn—reusable passes</li>
                  <li>→ Price rises with demand</li>
                </ul>
              </motion.div>
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
                whileHover={{
                  borderColor: "rgba(161, 161, 170, 1)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Domain Tokens</div>
                <div className="space-y-3 mb-6">
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block">$example.com</code>
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block">$example.com/$api</code>
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-lg block">$example.com/$blog</code>
                </div>
                <p className="text-zinc-500 text-sm mb-4">Your content is the asset. Token = access pass.</p>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>→ DNS proves ownership at mint</li>
                  <li>→ Visitors become shareholders</li>
                  <li>→ Revenue flows up the tree</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Flywheel */}
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
              The Flywheel
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950">
              <pre className="text-zinc-600 dark:text-zinc-400 font-mono text-sm overflow-x-auto">
{`Buy Access → Stake Tokens → Run Infrastructure → Earn Revenue → New Buyers Repeat

Every role is the same person at different stages:
  Visitor → Buyer → Holder → Staker → Partner

No separate classes. The path is open to everyone.`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The 50% Rule */}
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
              Hierarchical Ownership
            </motion.h2>
            <motion.p
              className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl"
              variants={fadeIn}
            >
              Child paths give <strong className="text-zinc-900 dark:text-white">50% of tokens to parent</strong>.
              Revenue flows up the tree. Works for both personal and domain tokens.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
              >
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Personal Example</div>
                <pre className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">
{`$richard
├── $richard/consulting  → 50%
└── $richard/mentorship  → 50%`}
                </pre>
              </motion.div>
              <motion.div
                className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
                variants={scaleIn}
              >
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Domain Example</div>
                <pre className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">
{`$example.com
├── $example.com/$api    → 50%
└── $example.com/$blog   → 50%`}
                </pre>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Model */}
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
              Revenue Split
            </motion.h2>
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Creator</span>
                    <span className="font-bold text-2xl text-zinc-900 dark:text-white">70%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2">
                    <div className="bg-zinc-900 dark:bg-white h-2" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Stakers (investors)</span>
                    <span className="font-bold text-2xl text-zinc-900 dark:text-white">20%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2">
                    <div className="bg-zinc-500 h-2" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Protocol</span>
                    <span className="font-bold text-2xl text-zinc-900 dark:text-white">10%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2">
                    <div className="bg-zinc-400 h-2" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-zinc-500 text-sm mt-6">
                Every token sale, every access request—the protocol earns 10%.
              </p>
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
                { title: "Bearer Shares", desc: "Pay for access, receive tradeable tokens. Early buyers get more tokens per dollar. Resell to latecomers at profit." },
                { title: "Proof of Serve", desc: "Nodes earn through actual contribution: serve content, relay messages, maintain indexes. No wasted computation." },
                { title: "sqrt_decay Pricing", desc: "Price determined by remaining treasury. Early buyers always get better prices. The curve is your constitution." },
                { title: "AI Agents", desc: "First-class participants. Agents can buy, stake, serve, and earn—becoming self-funding over time." },
                { title: "Multi-Chain", desc: "BSV is the settlement layer. Accept payments from Base, Solana, Ethereum. All inscribed on BSV." },
                { title: "KYC Optional", desc: "Bearer tier: hold and trade freely. Staker tier: complete KYC, stake tokens, receive dividends." },
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
                { href: "/exchange", title: "Exchange", desc: "Discover and acquire $402 tokens", tag: "marketplace", external: false },
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

      {/* Flywheel in Action */}
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
              The Flywheel in Action
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { num: "1", title: "BUY", desc: "Pay entry fee, receive bearer shares" },
                { num: "2", title: "STAKE", desc: "Lock tokens, become partner" },
                { num: "3", title: "SERVE", desc: "Run indexer, maintain registry" },
                { num: "4", title: "EARN", desc: "Entry fees + API fees + dividends" },
                { num: "5", title: "GROW", desc: "New buyers repeat the cycle" },
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
            Tokenize Anything Addressable
          </h2>
          <p className="text-zinc-500 mb-8">
            Your attention. Your API. Your content. Mint an access token and let the market find the price.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/exec-summary"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Read Exec Summary
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
