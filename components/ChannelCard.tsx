'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Channel } from '@/lib/agents/data';

export default function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/market/${channel.slug}`}
        className={`group block border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black ${channel.accent.hoverBorder} transition-colors`}
      >
        <div className={`h-1.5 ${channel.accent.bg}`} />
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">{channel.name}</h2>
              {channel.badge && (
                <span className={`inline-block mt-2 ${channel.accent.badgeBg} text-white px-2 py-0.5 text-[8px] font-bold font-mono uppercase tracking-widest`}>
                  {channel.badge}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-black tabular-nums">{channel.agentCount}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Agents</div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 font-mono leading-relaxed">
            {channel.tagline}
          </p>
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <span className={`${channel.accent.text} text-[10px] font-bold uppercase tracking-widest group-hover:tracking-[0.3em] transition-all`}>
              Enter Channel &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
