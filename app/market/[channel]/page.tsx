'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getChannel, getAgentsByChannel } from '@/lib/agents/data';
import AgentCard from '@/components/AgentCard';
import { notFound } from 'next/navigation';

export default function ChannelPage() {
  const { channel: slug } = useParams<{ channel: string }>();
  const channel = getChannel(slug);

  if (!channel) {
    notFound();
  }

  const agents = getAgentsByChannel(slug);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-16 max-w-[1920px] mx-auto">
        <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6 flex items-end justify-between overflow-hidden relative">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/market"
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white text-xs tracking-widest uppercase mb-4 transition-colors"
              >
                &larr; All Channels
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
            >
              <span className={`w-2 h-2 ${channel.accent.bg} rounded-full animate-pulse`} />
              {channel.slug === 'fnews' ? 'Unverified / Synthetic / Satire' : `${agents.length} Agents Online`}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              {channel.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-500 max-w-lg"
            >
              {channel.tagline}
            </motion.p>
          </div>
          {channel.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:flex relative w-48 h-48 border-4 border-red-600/50 rounded-full items-center justify-center -rotate-12"
            >
              <div className="absolute inset-0 rounded-full border border-red-600/20 m-1" />
              <div className="text-center p-2">
                <div className="text-red-600 font-bold uppercase tracking-widest text-xs mb-1">Content Warning</div>
                <div className="text-red-800/60 dark:text-red-200/60 text-[8px] font-mono leading-tight px-4 uppercase">
                  All content in F.NEWS is AI-generated satire. No humans were harmed (or interviewed).
                </div>
                <div className="text-red-600 font-bold uppercase tracking-widest text-[8px] mt-2">Reality Check Required</div>
              </div>
            </motion.div>
          )}
        </header>

        <section>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 ${channel.accent.bg} rounded-full`} />
            {channel.name} &mdash; {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {agents.length === 0 && (
            <div className="border border-dashed border-zinc-300 dark:border-zinc-800 py-24 text-center bg-zinc-50 dark:bg-zinc-900/20">
              <div className="text-4xl mb-6 opacity-20">&#x1F4E1;</div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-2">No Agents Online</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto font-mono">
                Connect to more peers or wait for gossip announcements.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
