'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.7, delay, ease },
  }),
}

const tokenomics = [
  { label: 'Token Standard', value: 'BSV-21 (PoW20)' },
  { label: 'Symbol', value: '$402' },
  { label: 'Max Supply', value: '21,000,000' },
  { label: 'Pre-mine', value: '0%' },
  { label: 'Distribution', value: '100% Mined' },
  { label: 'Mining Method', value: 'Proof of Indexing' },
  { label: 'Network', value: 'Bitcoin SV' },
  { label: 'Protocol', value: 'PATH402 (x402)' },
]

const useCases = [
  {
    title: 'Facilitator Fees',
    desc: 'Every x402 payment verification and on-chain inscription requires $402 tokens. Facilitators earn tokens by processing transactions.',
  },
  {
    title: 'Proof of Indexing',
    desc: 'Run a path402d node. Index BSV-21 tokens on the network. Earn $402 for every block you index correctly. No GPUs needed — just uptime and honesty.',
  },
  {
    title: 'Service Payments',
    desc: 'Pay for x402-protected services — VPN, Storage, GPU, Compute, File Conversion — with BSV satoshis or USDC. $402 tokens record the proof.',
  },
  {
    title: 'Revenue Sharing',
    desc: 'Token holders who stake $402 earn a share of facilitator fees. The more the network is used, the more revenue flows to stakers.',
  },
]

export default function Token402Page() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        >
          <source src="/402-BLUE-1.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 60%)' }}
        />

        <div
          className="absolute inset-0 z-[2] opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
        />

        <div className="relative z-10 text-center px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6"
          >
            BSV-21 PoW20 TOKEN
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="hero-title-glow"
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
            }}
          >
            $402
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.7}
            className="mt-8 text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed"
          >
            The native utility token of the PATH402 protocol. 21 million tokens.
            Zero pre-mine. 100% earned through Proof of Indexing.
            Every x402 payment leaves a permanent on-chain receipt — and $402 is the fuel.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.9}
            className="flex gap-4 justify-center mt-10"
          >
            <Link
              href="/402"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-all"
            >
              Buy $402
            </Link>
            <a
              href="https://x402.path402.com"
              className="px-8 py-4 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white uppercase tracking-widest text-xs transition-all"
            >
              x402 Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT IS $402 ── */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4"
          >
            OVERVIEW
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="text-3xl font-bold mb-8 font-display"
          >
            What is $402?
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="space-y-6 text-zinc-400 leading-relaxed"
          >
            <p>
              <strong className="text-white">$402</strong> is a BSV-21 token minted using the{' '}
              <strong className="text-blue-400">PoW20</strong> (Proof of Work 20) standard on Bitcoin SV.
              It powers the PATH402 micropayment protocol — the infrastructure layer that turns any URL
              into a pay-per-use endpoint via HTTP 402.
            </p>
            <p>
              Unlike most tokens, <strong className="text-white">$402 has zero pre-mine</strong>. Every single token in
              circulation was earned through <strong className="text-blue-400">Proof of Indexing</strong> — running a
              path402d daemon node that indexes BSV-21 tokens on the Bitcoin SV blockchain. No ICO, no VC allocation,
              no team tokens. Pure utility, pure work.
            </p>
            <p>
              The protocol uses HTTP status code <code className="text-blue-400 font-mono">402 Payment Required</code> — a
              code that has existed in the HTTP specification since 1997 but was &ldquo;reserved for future use&rdquo; for
              nearly three decades. PATH402 makes it operational: any server can require micropayment before serving
              content, and any client (human or AI agent) can pay automatically.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── TOKENOMICS ── */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4"
          >
            TOKENOMICS
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="text-3xl font-bold mb-12 font-display"
          >
            Supply &amp; Distribution
          </motion.h2>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="relative border border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-500/20" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-blue-500/20" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-blue-500/20" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-blue-500/20" />

            <div className="divide-y divide-zinc-800">
              {tokenomics.map((item, i) => (
                <div key={item.label} className="flex justify-between items-center px-8 py-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold text-white ${i === 1 ? 'font-display' : ''}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
            className="mt-12 text-center"
          >
            <div className="text-6xl font-bold text-blue-400 mb-2 font-display">
              21M
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
              Maximum Supply — Mirrors Bitcoin
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROOF OF INDEXING ── */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4"
          >
            MINING
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="text-3xl font-bold mb-8 font-display"
          >
            Proof of Indexing
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="space-y-6 text-zinc-400 leading-relaxed mb-12"
          >
            <p>
              $402 is mined through <strong className="text-white">Proof of Indexing</strong> — a novel consensus mechanism
              where nodes earn tokens by performing useful work: indexing BSV-21 token transactions on the
              Bitcoin SV blockchain.
            </p>
            <p>
              Run a <code className="text-blue-400 font-mono">path402d</code> daemon. Connect to the BSV network.
              Index token transfers, mints, and burns. Submit your index proofs. Earn $402 proportional to
              the work you contribute.
            </p>
            <p>
              No GPUs. No ASICs. No wasted energy. The mining process itself builds and maintains the
              token indexing infrastructure that the entire x402 ecosystem depends on.{' '}
              <strong className="text-white">The work is the product.</strong>
            </p>
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
            className="relative border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-500/20" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-blue-500/20" />

            <div className="grid gap-4 md:grid-cols-4">
              {[
                { step: '01', label: 'Run Node', desc: 'Deploy path402d daemon' },
                { step: '02', label: 'Index', desc: 'Scan BSV-21 transactions' },
                { step: '03', label: 'Prove', desc: 'Submit index proofs' },
                { step: '04', label: 'Earn', desc: 'Receive $402 tokens' },
              ].map((s) => (
                <div key={s.step} className="text-center py-4">
                  <div className="text-2xl font-bold text-blue-500/30 mb-2 font-display">
                    {s.step}
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-300 mb-1">
                    {s.label}
                  </div>
                  <div className="text-xs text-zinc-500">{s.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4"
          >
            UTILITY
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="text-3xl font-bold mb-16 font-display"
          >
            What $402 Powers
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2 + i * 0.1}
                className="relative border border-zinc-800 bg-zinc-950 p-8"
              >
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-500/20" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-blue-500/20" />

                <h3 className="text-lg font-bold mb-3 font-display">{uc.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOCOL STACK ── */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4"
          >
            ECOSYSTEM
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="text-3xl font-bold mb-12 font-display"
          >
            The Protocol Stack
          </motion.h2>

          <div className="grid gap-1">
            {[
              { code: '401', name: '$401', purpose: 'Identity', desc: 'On-chain passport. KYC via OAuth strands.', color: 'violet', url: '/401' },
              { code: '402', name: '$402', purpose: 'Payment', desc: 'Micropayments. Pay-per-use. The vending machine.', color: 'blue', url: '/402', active: true },
              { code: '403', name: '$403', purpose: 'Securities', desc: 'Access-controlled tokens. Requires $401 KYC.', color: 'amber', url: '/403' },
            ].map((p, i) => (
              <motion.div
                key={p.code}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2 + i * 0.1}
                className={`relative border bg-zinc-950 p-8 flex items-center gap-8 transition-colors ${
                  p.active ? 'border-blue-500/40' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`text-4xl font-bold font-display ${
                    p.color === 'violet' ? 'text-violet-500/40' : p.color === 'blue' ? 'text-blue-500/60' : 'text-amber-500/40'
                  }`}
                >
                  {p.code}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold font-display">{p.name}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{p.purpose}</span>
                    {p.active && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl font-bold text-blue-400 mb-4 font-display">$402</div>
          <p className="text-sm text-zinc-500 mb-8">
            21M supply. 0% pre-mine. 100% mined via Proof of Indexing. BSV-21 PoW20.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/402"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-all"
            >
              Buy $402
            </Link>
            <a
              href="https://x402.path402.com"
              className="px-8 py-4 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white uppercase tracking-widest text-xs transition-all"
            >
              x402 Services
            </a>
            <Link
              href="/"
              className="px-8 py-4 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white uppercase tracking-widest text-xs transition-all"
            >
              Home
            </Link>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              path402.com — BSV-21 PoW20 Token — Proof of Indexing
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
