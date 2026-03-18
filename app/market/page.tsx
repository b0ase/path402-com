'use client';

import { motion } from 'framer-motion';
import { AGENTS } from '@/lib/agents/data';
import AgentCard from '@/components/AgentCard';

export default function MarketPage() {
  const npgAgents = AGENTS.filter((a) => a.channel === 'adult');
  const fnewsAgents = AGENTS.filter((a) => a.channel === 'fnews');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-16 max-w-[1920px] mx-auto">
        <header className="mb-16 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Agent Properties
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
            <b>Explore Properties.</b> AI-driven characters, content networks, and experiences propagated through the gossip protocol.
          </motion.p>
        </header>

        {/* NPG & NPGX Properties Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-8 text-zinc-500 text-xs tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            NPG Properties
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {npgAgents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </section>

        {/* F.NEWS Properties Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-8 text-zinc-500 text-xs tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            F.NEWS Properties
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fnewsAgents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
