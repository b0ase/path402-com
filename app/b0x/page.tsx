'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const ease = [0.22, 1, 0.36, 1] as const;

const included = [
  'Cloud node (always on)',
  '24/7 $402 token mining',
  '$401 identity verification',
  'Payment endpoint',
  'Free .online domain (your choice)',
  'Domain inscription (DNS-DEX)',
  'Your BSV-21 token (100% ownership)',
  'Private VPN mesh (Headscale)',
  'App forks ($bWriter, $bDrive, $bMail)',
  '$402 Miner (Android device)',
  'KYC verification (opt-in, included)',
  'Site deployed with SSL + PWA',
  'Walkthrough call + 30 days support',
];

const freeVsPaid = [
  { item: 'Source code', free: 'Clone from GitHub', paid: 'Pre-configured' },
  { item: 'Cloud hosting', free: 'Find your own server', paid: 'Always-on, 1st month free' },
  { item: 'SPV headers', free: 'Sync yourself', paid: 'Synced and verified' },
  { item: 'Token mining', free: 'Run indexer yourself', paid: 'Mining from day one' },
  { item: 'Domain + token', free: 'Inscribe yourself (0% fee)', paid: 'Done for you' },
  { item: 'Identity + payments', free: 'Wire it up yourself', paid: 'Configured and live' },
  { item: 'App forks', free: 'Fork and deploy yourself', paid: 'Your tokens, deployed' },
  { item: 'Support', free: 'Community / docs', paid: 'Walkthrough call + 30 days' },
];

const roadmap = [
  {
    phase: 'NOW',
    title: 'Mining Node + Apps',
    items: ['SPV node', '$402 mining', 'Headscale VPN mesh', 'bApps access', '$401 identity', 'Your domain + token'],
  },
  {
    phase: 'Q2 2026',
    title: 'Multi-Token Mining',
    items: ['$401 + $403 overlay mining', 'Dividend flows for KYC\'d subs', 'Peer-to-peer mesh connections'],
  },
  {
    phase: 'Q3 2026',
    title: 'AI Agent Integration',
    items: ['OpenClaw autonomous agent', 'Auto-trade on DNS-DEX', 'Auto-press MoneyButtons', '$bMail for your device'],
  },
  {
    phase: 'Q4 2026',
    title: 'Autonomous Economic Node',
    items: ['Self-managing wallet', 'Programmatic token trading', '$403 condition execution', 'Full autonomous revenue'],
  },
];

export default function B0xPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-16 max-w-5xl mx-auto pt-32">
        {/* Status line */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-mono font-bold">
            SUBSCRIPTION PACKAGE
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="font-display font-black tracking-tighter leading-[0.9] mb-6"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
        >
          $402 b0x
        </motion.h1>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mb-4"
        >
          <span className="font-display font-black text-green-500 text-4xl md:text-5xl tracking-tight">
            $1 a day.
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-zinc-600 font-mono text-sm mb-8"
        >
          $1/day &times; 365 days + $402 Miner (Android Hardware Device)
        </motion.p>

        {/* Pitch */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease }}
          className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
        >
          Run a full SPV node on the Bitcoin 402 payments network. Mine tokens across three overlay
          services. Run Bitcoin&apos;s application layer. We ship you a phone.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1, ease }}
          className="flex flex-wrap gap-3"
        >
          <a
            href="https://pay.tide.co/pay/034b48ae-31ca-4f94-9bab-edda5904e1c5"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-green-500 text-black font-mono font-bold text-sm tracking-wider hover:bg-green-400 transition-colors"
          >
            SUBSCRIBE &mdash; PAY &pound; / $
          </a>
          <Link
            href="https://b0ase.com/b0x/subscription"
            className="px-8 py-3 border border-zinc-800 text-zinc-400 font-mono text-sm tracking-wider hover:border-zinc-600 hover:text-white transition-colors"
          >
            FULL DETAILS
          </Link>
        </motion.div>
      </section>

      {/* ═══ DEVICE ═══ */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="border border-zinc-900 overflow-hidden"
        >
          {/* Video / Image */}
          <div className="relative w-full aspect-video bg-black">
            <video
              src="/b0x-miner.mp4"
              poster="/b0x-miner.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase">Hardware</span>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-mono font-bold tracking-wider">
                YOURS TO KEEP
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
              The $402 Miner
            </h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-xl">
              A pre-configured Android device on a private WireGuard-encrypted mesh network.
              Every connection is end-to-end encrypted. It arrives within 30 days, mining $402 tokens
              out of the box. The device is yours regardless of subscription status.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══ INCLUDED ═══ */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase mb-8">
            Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {included.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className="text-green-500/50 text-xs">&#x2713;</span>
                <span className="text-zinc-400">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ FREE vs MANAGED ═══ */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase mb-3">
            Open Source vs Managed
          </h2>
          <p className="text-zinc-600 text-sm font-mono mb-8">
            Everything is open source. The $402 buys our time configuring it for you.
          </p>

          <div className="border border-zinc-900 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 text-[9px] font-mono tracking-[0.2em] text-zinc-700 uppercase p-4 border-b border-zinc-900 bg-zinc-950">
              <div />
              <div>Free</div>
              <div>Managed</div>
            </div>
            {/* Rows */}
            {freeVsPaid.map((row, i) => (
              <div
                key={row.item}
                className={`grid grid-cols-3 text-sm p-4 border-b border-zinc-900/50 ${
                  i % 2 === 0 ? 'bg-zinc-950/50' : ''
                }`}
              >
                <div className="text-white font-medium text-sm">{row.item}</div>
                <div className="text-zinc-600 text-sm">{row.free}</div>
                <div className="text-green-500/70 text-sm">{row.paid}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase mb-8">
            Roadmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmap.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className={`p-6 border ${
                  i === 0 ? 'border-green-500/20 bg-green-500/[0.03]' : 'border-zinc-900'
                }`}
              >
                <div className={`text-[9px] font-mono tracking-[0.3em] mb-2 ${
                  i === 0 ? 'text-green-500' : 'text-zinc-700'
                }`}>
                  {phase.phase}
                </div>
                <h3 className="font-bold text-sm mb-3 text-white">{phase.title}</h3>
                <ul className="space-y-1.5">
                  {phase.items.map(item => (
                    <li key={item} className="text-zinc-500 text-xs flex items-start gap-2">
                      <span className={`mt-1 ${i === 0 ? 'text-green-500/50' : 'text-zinc-800'}`}>&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ AFTER YEAR 1 ═══ */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase mb-8">
            After Year 1
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Stay Hosted', price: '$1/day', desc: 'Keep running. Cancel anytime.', highlight: false },
              { title: 'Self-Host', price: 'Free forever', desc: 'Docker images + config. Your hardware.', highlight: true },
              { title: 'Walk Away', price: 'Yours on-chain', desc: 'Tokens, identity, inscriptions stay on BSV.', highlight: false },
            ].map((opt) => (
              <div
                key={opt.title}
                className={`p-6 border ${
                  opt.highlight
                    ? 'border-green-500/20 bg-green-500/[0.03]'
                    : 'border-zinc-900'
                }`}
              >
                <h3 className="font-bold text-sm mb-1">{opt.title}</h3>
                <div className={`text-sm font-mono font-bold mb-2 ${
                  opt.highlight ? 'text-green-500' : 'text-zinc-600'
                }`}>
                  {opt.price}
                </div>
                <p className="text-zinc-600 text-xs">{opt.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="border border-zinc-900 p-10 md:p-16 text-center"
        >
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            Send $402
          </h2>
          <p className="text-zinc-500 text-sm mb-8 font-mono">
            BSV to <span className="text-blue-400">$BOASE</span> or{' '}
            <span className="text-blue-400">$bcorp</span>. GBP/USD by bank transfer.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-6 py-3 bg-white text-black font-mono text-sm font-bold tracking-wider">
              Pay $BOASE
            </span>
            <span className="px-6 py-3 border border-zinc-800 text-zinc-400 font-mono text-sm tracking-wider">
              Pay $bcorp
            </span>
            <a
              href="https://pay.tide.co/pay/034b48ae-31ca-4f94-9bab-edda5904e1c5"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-black font-mono text-sm font-bold tracking-wider hover:bg-green-400 transition-colors"
            >
              Pay &pound; / $
            </a>
          </div>

          <p className="text-zinc-800 text-xs font-mono">
            The Bitcoin Corporation LTD &middot; Sort code 04-06-05 &middot; Account 28694165
          </p>
          <p className="text-zinc-700 text-xs font-mono mt-2">
            Free .online domain of your choice included
          </p>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 md:px-16 max-w-5xl mx-auto py-12 text-center border-t border-zinc-900">
        <p className="text-zinc-800 text-xs font-mono">
          Bitcoin Corporation LTD &middot; Registered at Companies House
        </p>
        <p className="text-zinc-800 text-xs font-mono mt-2">
          <Link href="/" className="hover:text-zinc-500 transition-colors">path402.com</Link>
          {' '}&middot;{' '}
          <a href="https://b0ase.com/b0x" className="hover:text-zinc-500 transition-colors">b0ase.com/b0x</a>
        </p>
      </footer>
    </div>
  );
}
