'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TokenListing {
  id: string;
  address: string;
  name: string;
  description?: string;
  content_type?: string;
  pricing_model: string;
  current_price_sats: number;
  market_cap_sats: number;
  total_supply: number;
  treasury_balance: number;
  issuer_handle: string;
  is_verified: boolean;
}

function formatSats(sats: number): string {
  if (Math.abs(sats) >= 1_000_000) return `${(sats / 1_000_000).toFixed(2)}M`;
  if (Math.abs(sats) >= 1_000) return `${(sats / 1_000).toFixed(1)}K`;
  return sats.toLocaleString();
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

export default function ExchangePage() {
  const [tokens, setTokens] = useState<TokenListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/tokens?limit=100')
      .then(r => r.json())
      .then(data => {
        setTokens(data.tokens || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tokens');
        setLoading(false);
      });
  }, []);

  const contentTypes = ['all', ...new Set(tokens.map(t => t.content_type).filter(Boolean))];
  const filtered = filter === 'all' ? tokens : tokens.filter(t => t.content_type === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-16 max-w-[1920px] mx-auto">
        {/* Header */}
        <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6 flex items-end justify-between overflow-hidden relative">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span>Exchange</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              EXCHANGE<span className="text-zinc-300 dark:text-zinc-800">.MKT</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-500 max-w-lg"
            >
              <b>Token Marketplace.</b> Discover and acquire content tokens on the $402 network.
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "backOut" }}
            className="hidden md:block text-[120px] leading-none font-black text-right select-none"
          >
            $
          </motion.div>
        </header>

        {/* Stats Bar */}
        {!loading && tokens.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 grid grid-cols-3 gap-0 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="border-r border-zinc-200 dark:border-zinc-800 p-6">
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Active Tokens</div>
              <div className="text-2xl font-black">{tokens.length}</div>
            </div>
            <div className="border-r border-zinc-200 dark:border-zinc-800 p-6">
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Total Market Cap</div>
              <div className="text-2xl font-black">{formatSats(tokens.reduce((s, t) => s + t.market_cap_sats, 0))} <span className="text-sm text-zinc-500 font-normal">SAT</span></div>
            </div>
            <div className="p-6">
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Pricing Model</div>
              <div className="text-2xl font-black">alice_bond</div>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        {contentTypes.length > 2 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {contentTypes.map(type => (
              <button
                key={type || 'all'}
                onClick={() => setFilter(type || 'all')}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors whitespace-nowrap ${
                  filter === type
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                }`}
              >
                {type || 'all'}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="text-zinc-500 text-sm animate-pulse">Loading tokens...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="py-20 text-center">
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-zinc-500 text-sm">No tokens found. Register a $address to get started.</div>
          </div>
        )}

        {/* Token Table */}
        {!loading && filtered.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-900 pb-2">
              {filter === 'all' ? 'All Tokens' : filter}
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500">$Address</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500">Issuer</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Price</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Supply</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Market Cap</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Model</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filtered.map((token) => (
                    <motion.tr
                      key={token.id}
                      variants={fadeIn}
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm tracking-tight">{token.name}</div>
                        <div className="text-[10px] font-mono text-blue-500">{token.address}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-zinc-500">{token.issuer_handle}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm">
                        {formatSats(token.current_price_sats)} <span className="text-zinc-500 text-[10px]">SAT</span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm text-zinc-500">
                        {formatSats(token.total_supply)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm text-zinc-500">
                        {formatSats(token.market_cap_sats)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-[10px] font-mono text-zinc-600">{token.pricing_model}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/token?address=${encodeURIComponent(token.address)}`}
                          className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all inline-block"
                        >
                          ACQUIRE
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {/* MCP Tools Reference */}
        <motion.div
          className="border-t border-zinc-200 dark:border-zinc-800 pt-12 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-2">
            For AI Agents
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            Use the path402 MCP server to discover, evaluate, and acquire tokens programmatically.
          </p>
          <pre className="bg-zinc-100 dark:bg-zinc-900 p-6 font-mono text-sm text-zinc-600 dark:text-zinc-400 overflow-x-auto">
            {`# Discovery & Evaluation
path402_discover       # Probe a $address for pricing
path402_batch_discover # Discover multiple addresses
path402_evaluate       # Assess ROI before buying
path402_economics      # Breakeven & projections
path402_price_schedule # View price curve

# Acquisition & Wallet
path402_acquire        # Pay and receive token
path402_set_budget     # Configure spending
path402_wallet         # View holdings

# Serving & Revenue
path402_serve          # Distribute content
path402_servable       # List servable content`}
          </pre>
        </motion.div>
      </main>
    </div>
  );
}
