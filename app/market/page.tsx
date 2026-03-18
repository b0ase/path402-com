'use client';

import { motion } from 'framer-motion';
import { TOKEN_GROUPS } from '@/lib/agents/data';
import IPVendingMachine from '@/components/IPVendingMachine';
import VideoCarousel from '@/components/VideoCarousel';

export default function MarketPage() {
  // Find NPG and FNEWS groups (in specific order)
  const npgxGroup = TOKEN_GROUPS.find((g) => g.tokenAddress === 'ip_npgx');
  const fnewsGroup = TOKEN_GROUPS.find((g) => g.tokenAddress === 'ip_fnews');

  const groups = [npgxGroup, fnewsGroup].filter(Boolean);

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
            IP Licence Market
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
            <b>Buy IP Creation Licences.</b> Token-gated rights to create derivative works and build on these universes.
          </motion.p>
        </header>

        <div className="space-y-12">
          {/* NPG Properties Section */}
          {npgxGroup && (
            <section>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-6 text-zinc-500 text-xs tracking-widest uppercase"
              >
                <span className={`w-2 h-2 rounded-full ${npgxGroup.accent.bg}`} />
                NPG Properties
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <IPVendingMachine key={npgxGroup.tokenAddress} tokenGroup={npgxGroup} index={0} />
                <VideoCarousel />
              </div>
            </section>
          )}

          {/* F.NEWS Properties Section */}
          {fnewsGroup && (
            <section>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-6 text-zinc-500 text-xs tracking-widest uppercase"
              >
                <span className={`w-2 h-2 rounded-full ${fnewsGroup.accent.bg}`} />
                F.NEWS Properties
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <IPVendingMachine key={fnewsGroup.tokenAddress} tokenGroup={fnewsGroup} index={1} />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
