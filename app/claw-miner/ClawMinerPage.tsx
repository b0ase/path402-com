'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useColorTheme } from '@/components/ThemePicker';
import { useEffect, useRef, useState, useCallback } from 'react';

const HERO_VIDEOS = [
  '/videos/claw-miner/claw-miner-1.mp4',
  '/videos/claw-miner/claw-miner-2.mp4',
  '/videos/claw-miner/claw-miner-3.mp4',
  '/videos/claw-miner/claw-miner-4.mp4',
  '/videos/claw-miner/claw-miner-5.mp4',
  '/videos/claw-miner/claw-miner-6.mp4',
  '/videos/claw-miner/claw-miner-7.mp4',
];

const stackLayers = [
  {
    label: 'MINING',
    title: 'Dynamic $402 PoW20 Hashrate',
    description: 'Agent-controlled mining that adapts to network difficulty. When competition drops, hashrate rises. When trading offers better ROI, resources shift. Your device optimises continuously.',
    accent: 'emerald',
  },
  {
    label: 'AGENT',
    title: 'OpenClaw AI Runtime',
    description: 'Self-hosted, model-agnostic agent platform. Load Claude, GPT, Kimi, Llama — any LLM. Persistent state, multi-channel messaging, pluggable skills. Your agent runs 24/7 on the device.',
    accent: 'orange',
  },
  {
    label: 'MCP',
    title: 'path402 MCP Server (Native)',
    description: 'The full path402 tool suite running locally. Discover, evaluate, acquire, serve, wallet, economics — every tool call is a real economic action with zero latency.',
    accent: 'cyan',
  },
  {
    label: 'TRADING',
    title: 'Speculative x402 Engine',
    description: 'Autonomous content trading. Your agent discovers underpriced x402 endpoints, acquires tokens, serves content to future buyers, earns the spread. Programmatic market-making.',
    accent: 'amber',
  },
  {
    label: 'MESH',
    title: 'Headscale WireGuard Network',
    description: 'Private encrypted peer-to-peer mesh. Agent-to-agent trades, direct content serving, no central routing. Every connection is end-to-end encrypted. Works from any network.',
    accent: 'indigo',
  },
  {
    label: 'IDENTITY',
    title: '$401 Identity Strand',
    description: 'Cryptographic proof of ownership on BSV. Your agent\'s wallet is derived from your identity via Type-42 key derivation. Every transaction traces back to you.',
    accent: 'purple',
  },
  {
    label: 'PAYMENT',
    title: '$402 Payment Endpoint',
    description: 'Accept micropayments from anyone, instantly. MoneyButton press system. Withdraw and dividend infrastructure. Revenue from mining, trading, and serving flows here.',
    accent: 'green',
  },
  {
    label: 'CONDITIONS',
    title: '$403 Rules Engine',
    description: 'Programmable conditions on tokens and payments. Time locks, access gates, revenue splits. Your agent can read and execute rules automatically.',
    accent: 'rose',
  },
  {
    label: 'APPS',
    title: 'bApps Suite',
    description: 'Bitcoin Writer, Bitcoin Email, Bitcoin Drive — forked under your namespace. Your tokens, your users, your revenue. The agent can publish, send, and store on your behalf.',
    accent: 'blue',
  },
];

const accentColors: Record<string, { border: string; dot: string }> = {
  blue: { border: 'border-blue-500/20', dot: 'bg-blue-500' },
  amber: { border: 'border-amber-500/20', dot: 'bg-amber-500' },
  emerald: { border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  purple: { border: 'border-purple-500/20', dot: 'bg-purple-500' },
  cyan: { border: 'border-cyan-500/20', dot: 'bg-cyan-500' },
  rose: { border: 'border-rose-500/20', dot: 'bg-rose-500' },
  indigo: { border: 'border-indigo-500/20', dot: 'bg-indigo-500' },
  orange: { border: 'border-orange-500/20', dot: 'bg-orange-500' },
  green: { border: 'border-green-500/20', dot: 'bg-green-500' },
};

const mcpTools = [
  { name: 'discover', description: 'Probe a $address — pricing, supply, revenue model, child paths' },
  { name: 'evaluate', description: 'Check budget, estimate ROI, get acquire/skip recommendation' },
  { name: 'acquire', description: 'Pay for a token, store with serving rights, unlock content' },
  { name: 'serve', description: 'Serve content you hold to a buyer, earn revenue share' },
  { name: 'wallet', description: 'Balance, tokens held, total spent/earned, net position' },
  { name: 'economics', description: 'Breakeven analysis, ROI projections, serving participation' },
  { name: 'price_schedule', description: 'Price at each supply level — find optimal entry point' },
  { name: 'batch_discover', description: 'Scan multiple $addresses at once for efficient exploration' },
];

const tradingSteps = [
  { label: 'DISCOVER', color: 'text-cyan-400', description: 'Scan x402 endpoints across the network' },
  { label: 'EVALUATE', color: 'text-amber-400', description: 'Check price, estimate demand, calculate ROI' },
  { label: 'ACQUIRE', color: 'text-orange-400', description: 'Buy the token — satoshis move, content unlocks' },
  { label: 'SERVE', color: 'text-emerald-400', description: 'Future buyer requests it — you serve, you earn' },
  { label: 'EARN', color: 'text-green-400', description: 'Revenue flows to your wallet automatically' },
];

const hostingOptions = [
  {
    title: 'Stay Hosted',
    price: '$1/day',
    description: 'Your ClawMiner keeps running, mining, trading, serving. Pay by signing in via HandCash. Cancel anytime — just stop signing in.',
    icon: '\u2601',
  },
  {
    title: 'Self-Host',
    price: 'Free forever',
    description: 'We hand you Docker images + Headscale config + OpenClaw runtime. Run it on your own hardware. Still connected to the mesh. Still trading.',
    icon: '\u2302',
  },
  {
    title: 'Walk Away',
    price: 'Yours on-chain',
    description: 'Your tokens, identity, inscriptions, acquired content, and trading history live permanently on BSV. No lock-in. Ever.',
    icon: '\u2192',
  },
];

const capabilities = [
  {
    title: 'MCP Server',
    accent: 'orange',
    bgClass: 'bg-orange-500/10 border-orange-500/20',
    textClass: 'text-orange-400',
    description: 'The foundation. Every b0x is a distributed path402 MCP server — always on, zero downtime. The full x402 tool suite running locally on every device.',
  },
  {
    title: 'Agent',
    accent: 'emerald',
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    textClass: 'text-emerald-400',
    description: 'OpenClaw AI runtime — self-hosted, model-agnostic. Claude, GPT, Kimi, Llama. Connects to the local MCP server on startup. Persistent state, pluggable skills.',
  },
  {
    title: 'Mine + Trade',
    accent: 'cyan',
    bgClass: 'bg-cyan-500/10 border-cyan-500/20',
    textClass: 'text-cyan-400',
    description: 'Dynamic $402 mining + speculative x402 content trading. The agent allocates between them for optimal ROI. Two revenue streams, one wallet.',
  },
];

function StickyVideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = HERO_VIDEOS[currentIndex];
    video.load();
    video.play().catch(() => {});
  }, [currentIndex]);

  return (
    <div className="sticky top-[100px] z-0 mx-4 md:mx-12 h-[70vh] overflow-hidden rounded-xl">
      {/* Video */}
      <video
        ref={videoRef}
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* HUD corner brackets */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-orange-500/[0.15]" />
        <div className="absolute top-3 right-3 w-10 h-10 border-r-2 border-t-2 border-orange-500/[0.15]" />
        <div className="absolute bottom-3 left-3 w-10 h-10 border-l-2 border-b-2 border-orange-500/[0.15]" />
        <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-orange-500/[0.15]" />

        <div className="absolute top-5 left-16 text-[7px] font-mono text-orange-600/60 tracking-[0.25em]">
          CLAWMINER // DISTRIBUTED MCP SERVER
        </div>
        <div className="absolute top-5 right-16 text-[7px] font-mono text-orange-600/60 tracking-[0.25em] text-right hidden md:block">
          16.FEB.2026 // MAINNET
        </div>
        <div className="absolute bottom-5 left-16 text-[7px] font-mono text-orange-600/60 tracking-[0.25em]">
          OPENCLAW // MCP // x402
        </div>
        <div className="absolute bottom-5 right-16 text-[7px] font-mono text-orange-600/60 tracking-[0.25em] text-right hidden md:block">
          9 LAYERS ◆ ZERO DOWNTIME
        </div>

        <div className="absolute top-3 left-16 right-16 h-[1px] bg-gradient-to-r from-orange-500/[0.06] via-transparent to-orange-500/[0.06]" />
        <div className="absolute bottom-3 left-16 right-16 h-[1px] bg-gradient-to-r from-orange-500/[0.06] via-transparent to-orange-500/[0.06]" />
      </div>
    </div>
  );
}

function ContentCard({
  children,
  className = '',
  isDark,
}: {
  children: React.ReactNode;
  className?: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-md ${
        isDark
          ? 'bg-black/70 border-white/10'
          : 'bg-white/80 border-black/10'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function ClawMinerPage() {
  const { colorTheme } = useColorTheme();
  const isDark = !['white', 'yellow'].includes(colorTheme);

  return (
    <div className="mt-[100px] md:mt-[110px] mb-6">
      {/* Sticky hero background — rotating video playlist */}
      <StickyVideoHero />

      {/* Content layer — overlaps hero */}
      <div className="relative z-10 -mt-[69vh] pb-12 mx-auto px-4 md:px-0 max-w-[75vw]">

        {/* Hero title card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-orange-600/80 text-[10px] tracking-[0.3em] uppercase font-mono font-bold">
              DISTRIBUTED MCP SERVER : AGENTIC MINER
            </span>
          </div>

          {/* Title card */}
          <div className="bg-black/80 backdrop-blur-sm border border-orange-500/[0.1] rounded-2xl px-6 md:px-16 pt-8 pb-8">
            <div className="relative mb-0">
              <h1
                className="font-black tracking-tighter leading-[0.85] text-white"
                style={{
                  fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
                  fontSize: 'clamp(3rem, 8vw, 8rem)',
                }}
              >
                {'ClawMiner'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>

              {/* Scan line */}
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0], originX: [0, 0, 1, 1] }}
                transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
                className="absolute top-[55%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent"
              />
              <motion.div
                initial={{ scaleX: 0, originX: 1 }}
                animate={{ scaleX: [0, 1, 1, 0], originX: [1, 1, 0, 0] }}
                transition={{ duration: 1, delay: 1.0, ease: 'easeInOut' }}
                className="absolute top-[62%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
              />
            </div>

            {/* Reflection */}
            <div
              className="relative overflow-hidden h-4 md:h-8 select-none mx-auto mb-6"
              aria-hidden="true"
              style={{
                transform: 'scaleY(-1)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 80%)',
                maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 80%)',
              }}
            >
              <div
                className="text-white/30 font-black tracking-tighter leading-[0.85] text-center"
                style={{
                  fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
                  fontSize: 'clamp(3rem, 8vw, 8rem)',
                }}
              >
                ClawMiner
              </div>
            </div>

            <p className="text-orange-400/80 text-xl md:text-2xl tracking-[0.2em] uppercase font-mono font-bold mb-3">
              The Agentic x402 Miner
            </p>

            <p className="text-zinc-600 text-sm font-mono max-w-xl mx-auto mb-6">
              Distributed MCP server. AI agent. Dynamic mining. Speculative x402 trading.
              <br className="hidden sm:block" />
              Same device we&apos;ve been building. New name. The market caught up.
            </p>

            {/* Divider */}
            <div className="border-t border-orange-500/[0.1] my-6" />

            {/* Pricing */}
            <div className="text-sm font-mono font-bold tracking-widest mb-3 text-white/30">ONE-TIME SETUP</div>
            <p className="text-base font-mono mb-2 text-white/60">
              Pay <span className="font-bold text-orange-400">$402</span> in MNEE or BSV to <span className="font-bold text-white">$BOASE</span> via HandCash
            </p>
            <div className="flex items-center justify-center gap-6 mt-3">
              <span className="text-sm text-orange-400/80">
                First month free
              </span>
              <span className="text-sm text-white/30">&middot;</span>
              <span className="text-sm text-white/50">
                Then $1/day <em>or self-host free</em>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Three capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ContentCard isDark={isDark} className="p-6 h-full">
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest mb-4 border ${cap.bgClass}`}>
                    <span className={cap.textClass}>{cap.title.toUpperCase()}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {cap.description}
                  </p>
                </ContentCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What changed */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <ContentCard isDark={isDark} className="p-8">
            <h2 className={`text-sm font-mono font-bold tracking-widest mb-6 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              SAME DEVICE. NEW NAME.
            </h2>
            <div className={`space-y-4 text-lg leading-relaxed ${isDark ? 'text-white/80' : 'text-black/80'}`}>
              <p>
                We&apos;ve been selling this as the &ldquo;$402 b0x&rdquo; — a cloud-hosted SPV node with mining, identity, payments, and apps. That&apos;s accurate. But it undersells what the device actually is.
              </p>
              <p>
                The b0x is a <em>distributed MCP server</em>. Every device on the mesh runs a full path402 instance — the x402 tool suite, always on, always reachable, zero downtime. It runs <Link href="https://github.com/openclaw/openclaw" className="text-orange-400 hover:underline">OpenClaw</Link> agents, mines $402 tokens with dynamic hashrate, and trades x402 content speculatively. All of this was already in the box.
              </p>
              <p>
                Coinbase shipped x402. Anthropic shipped MCP. The market caught up. Now we&apos;re calling it what it is.
              </p>
            </div>
          </ContentCard>
        </motion.div>

        {/* The Stack */}
        <div className="mb-20">
          <ContentCard isDark={isDark} className="p-8">
            <h2 className={`text-sm font-mono font-bold tracking-widest mb-8 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              THE STACK
            </h2>
            <div className="space-y-3">
              {stackLayers.map((layer, i) => {
                const colors = accentColors[layer.accent] || accentColors.orange;
                return (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-xl border ${
                      isDark ? `bg-white/[0.03] ${colors.border}` : `bg-black/[0.02] border-black/10`
                    }`}
                  >
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${colors.dot} shrink-0 translate-y-[-1px]`} />
                      <span className={`text-[10px] font-mono font-bold tracking-widest w-24 shrink-0 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                        {layer.label}
                      </span>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{layer.title}</h3>
                    </div>
                    <p className={`text-sm leading-relaxed ml-[calc(0.5rem+0.75rem+6rem)] ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {layer.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </ContentCard>
        </div>

        {/* MCP Tools */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <ContentCard isDark={isDark} className="p-8">
            <h2 className={`text-sm font-mono font-bold tracking-widest mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              MCP TOOLS (NATIVE)
            </h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              The path402 MCP server is the b0x — it was built for this from day one. Each tool call is a real economic action.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mcpTools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-white/[0.03] border-orange-500/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <code className={`text-xs font-mono font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                      {tool.name}
                    </code>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {tool.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ContentCard>
        </motion.div>

        {/* x402 Trading Flow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <ContentCard isDark={isDark} className="p-8">
            <h2 className={`text-sm font-mono font-bold tracking-widest mb-8 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              THE TRADING LOOP
            </h2>
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              {tradingSteps.map((step, i) => (
                <div key={step.label} className="flex-1 flex flex-col md:flex-row items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex-1 w-full p-4 rounded-xl border text-center ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
                    }`}
                  >
                    <div className={`text-sm font-mono font-bold tracking-widest mb-2 ${step.color}`}>
                      {step.label}
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      {step.description}
                    </p>
                  </motion.div>
                  {i < tradingSteps.length - 1 && (
                    <span className={`text-lg hidden md:block ${isDark ? 'text-white/20' : 'text-black/20'}`}>&rarr;</span>
                  )}
                </div>
              ))}
            </div>
            <p className={`text-xs mt-6 text-center ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              Early buyers earn more per serve. Late buyers join proven demand. Your agent finds the sweet spot.
            </p>
          </ContentCard>
        </motion.div>

        {/* After Month 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <ContentCard isDark={isDark} className="p-8">
            <h2 className={`text-sm font-mono font-bold tracking-widest mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              AFTER MONTH 1 &mdash; YOUR CHOICE
            </h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              No lock-in. No annual contracts. Three paths, all yours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hostingOptions.map((opt, i) => (
                <motion.div
                  key={opt.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    i === 1
                      ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')
                      : (isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10')
                  }`}
                >
                  <div className="text-2xl mb-3">{opt.icon}</div>
                  <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{opt.title}</h3>
                  <div className={`text-sm font-mono font-bold mb-3 ${
                    i === 1
                      ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                      : (isDark ? 'text-white/60' : 'text-black/60')
                  }`}>
                    {opt.price}
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {opt.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ContentCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <ContentCard isDark={isDark} className="text-center p-10">
            <h2 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Get Your ClawMiner</h2>
            <p className="text-5xl font-black text-orange-500 mb-4" style={{ fontFamily: 'var(--font-orbitron), Orbitron, sans-serif' }}>$402</p>
            <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              One payment. The device ships to your door. MCP server running. Agent installed. Mining on power-on.<br />
              Then $1/day for cloud hosting — or self-host free after month one. No lock-in.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://pay.tide.co/pay/034b48ae-31ca-4f94-9bab-edda5904e1c5"
                className="inline-block px-6 py-3 rounded-full font-mono text-sm font-bold bg-orange-500 text-black hover:bg-orange-400 transition-colors"
              >
                Pay via Bank Transfer
              </Link>
              <Link
                href="/blog/claw-miner"
                className={`inline-block px-6 py-3 rounded-full font-mono text-sm font-bold border ${
                  isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'
                } transition-colors`}
              >
                Read the Blog Post
              </Link>
            </div>
          </ContentCard>
        </motion.div>

        {/* Footer tagline */}
        <div className="text-center">
          <p className="text-xs font-mono text-white/20 drop-shadow">
            The Agentic x402 Miner
          </p>
          <p className="text-xs mt-2 text-white/20 drop-shadow">
            <Link href="/" className="hover:underline">b0ase.com</Link> &middot; <Link href="https://path402.com" className="hover:underline">path402.com</Link> &middot; <Link href="/b0x" className="hover:underline">b0x</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
