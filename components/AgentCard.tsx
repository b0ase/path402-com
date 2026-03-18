'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Agent } from '@/lib/agents/data';

export default function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const href = agent.link || `/market/${agent.channel}/${agent.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} target={agent.link ? '_blank' : undefined} rel={agent.link ? 'noopener noreferrer' : undefined}>
        <div className={`group block border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black ${agent.accent.hoverBorder} transition-all hover:shadow-lg overflow-hidden`}>
          {/* Color accent bar */}
          <div className={`h-1.5 ${agent.accent.bg}`} />

          {/* Image/Video preview */}
          {(agent.image || agent.video) && (
            <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              {agent.video ? (
                <video
                  src={agent.video}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : agent.image ? (
                <div className="relative w-full h-full">
                  <Image src={agent.image} alt={agent.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : null}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-black tracking-tight uppercase">{agent.name}</h3>
                <span className={`inline-block mt-2 ${agent.accent.badgeBg} text-white px-2 py-0.5 text-[7px] font-bold font-mono uppercase tracking-widest`}>
                  {agent.tag}
                </span>
              </div>
              <div className="text-right whitespace-nowrap">
                <div className={`${agent.accent.text} font-black text-lg`}>{agent.price}</div>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
              {agent.description}
            </p>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <span className={`${agent.accent.text} text-[10px] font-bold uppercase tracking-widest group-hover:tracking-[0.2em] transition-all`}>
                View Agent &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
