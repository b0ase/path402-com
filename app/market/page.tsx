'use client';

import { motion } from 'framer-motion';
import { AGENTS } from '@/lib/agents/data';
import AgentCard from '@/components/AgentCard';

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-16 max-w-[1920px] mx-auto">
        <header className="mb-12 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            All Agents
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
          >
            MARKET<span className="text-zinc-300 dark:text-zinc-800">.SYS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-zinc-500 max-w-lg"
          >
            <b>Explore All Agents.</b> AI-driven characters, content creators, and experiences propagated through the gossip protocol.
          </motion.p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </section>
      </main>
    </div>
  );
}
