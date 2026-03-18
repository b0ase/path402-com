'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-8 max-w-lg"
      >
        {/* 404 Code */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-9xl font-black tracking-tighter mb-4"
          >
            <span className="text-zinc-300 dark:text-zinc-800">4</span>
            <span className="text-zinc-900 dark:text-zinc-100">0</span>
            <span className="text-zinc-300 dark:text-zinc-800">4</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Page Not Found
          </motion.p>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The page you're looking for doesn't exist on this $402 protocol endpoint.
          </p>
          <p className="text-xs text-zinc-500 font-mono">
            HTTP 404 — Resource Not Found
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-3 pt-4"
        >
          <Link
            href="/market"
            className="px-6 py-3 bg-green-500 text-white font-bold uppercase text-sm tracking-widest rounded hover:bg-green-600 transition-all"
          >
            ← Back to Market
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white font-bold uppercase text-sm tracking-widest rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all"
          >
            Home
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-[10px] text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-800"
        >
          path402.com — $402 Protocol Payment Vending Machine
        </motion.p>
      </motion.div>
    </div>
  );
}
