'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Session {
  connected: boolean;
  provider: string | null;
  handle: string | null;
}

interface Holding {
  token_address: string;
  balance: number;
  total_spent_sats: number;
  avg_cost_sats: number;
  token?: {
    address: string;
    name: string;
    current_price_sats: number;
  };
  current_value_sats?: number;
  unrealized_pnl_sats?: number;
  unrealized_pnl_percent?: number;
}

interface PortfolioData {
  holdings: Holding[];
  summary: {
    total_value_sats: number;
    total_cost_sats: number;
    net_pnl_sats: number;
    net_pnl_percent: number;
  };
}

function formatSats(sats: number): string {
  if (Math.abs(sats) >= 1_000_000) return `${(sats / 1_000_000).toFixed(2)}M`;
  if (Math.abs(sats) >= 1_000) return `${(sats / 1_000).toFixed(1)}K`;
  return sats.toLocaleString();
}

export default function PortfolioPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check session first
    fetch('/api/auth/session')
      .then(r => r.json())
      .then((sess: Session) => {
        setSession(sess);
        if (!sess.connected) {
          setLoading(false);
          return;
        }
        // Fetch holdings
        return fetch('/api/tokens/holdings', {
          headers: {
            'x-wallet-handle': sess.handle || '',
            'x-wallet-provider': sess.provider || '',
          },
        })
          .then(r => r.json())
          .then(data => {
            setPortfolio(data);
            setLoading(false);
          });
      })
      .catch(() => {
        setError('Failed to load session');
        setLoading(false);
      });
  }, []);

  // Not connected — show login prompt
  if (!loading && session && !session.connected) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center px-6"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">Authentication Required</div>
          <h1 className="text-3xl font-black tracking-tighter mb-4">
            PORTFOLIO<span className="text-zinc-300 dark:text-zinc-800">.SYS</span>
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            Connect your wallet to view your token holdings, P&L, and dividend history.
          </p>
          <a
            href="/api/auth/handcash"
            className="inline-block px-8 py-3 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-colors border border-zinc-300"
          >
            Connect HandCash
          </a>
          <div className="mt-6">
            <Link href="/exchange" className="text-zinc-500 text-xs hover:text-white transition-colors">
              Browse the Exchange instead
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center">
        <div className="text-zinc-500 text-sm animate-pulse">Loading portfolio...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  const summary = portfolio?.summary || { total_value_sats: 0, total_cost_sats: 0, net_pnl_sats: 0, net_pnl_percent: 0 };
  const holdings = portfolio?.holdings || [];

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
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {session?.handle} / Holdings
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              PORTFOLIO<span className="text-zinc-300 dark:text-zinc-800">.SYS</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-500 max-w-lg"
            >
              <b>Asset Performance.</b> Real-time valuation of your acquired content tokens.
            </motion.div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/exchange" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-zinc-800 px-4 py-2">
              Exchange
            </Link>
            <a href="/api/auth/logout" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors border border-zinc-800 px-4 py-2">
              Disconnect
            </a>
          </div>
        </header>

        {/* Portfolio Summary */}
        <section className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-900 pb-2">
            Ledger Summary
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
            <div className="border-r border-b md:border-b-0 border-zinc-200 dark:border-zinc-800 p-8">
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Total Value</div>
              <div className="text-3xl md:text-4xl font-black tracking-tighter">{formatSats(summary.total_value_sats)} <span className="text-base text-zinc-500 font-normal">SAT</span></div>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-8">
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Total Cost</div>
              <div className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-400">{formatSats(summary.total_cost_sats)} <span className="text-base text-zinc-500 font-normal">SAT</span></div>
            </div>
            <div className="border-r border-zinc-200 dark:border-zinc-800 p-8">
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Net P&L</div>
              <div className={`text-3xl md:text-4xl font-black tracking-tighter ${summary.net_pnl_sats >= 0 ? 'text-black dark:text-white' : 'text-red-500'}`}>
                {summary.net_pnl_sats >= 0 ? '+' : ''}{formatSats(summary.net_pnl_sats)} <span className="text-base text-zinc-500 font-normal">SAT</span>
              </div>
            </div>
            <div className="p-8">
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Assets</div>
              <div className="text-3xl md:text-4xl font-black tracking-tighter">{holdings.length}</div>
            </div>
          </div>
        </section>

        {/* Holdings Table */}
        {holdings.length === 0 ? (
          <div className="py-16 text-center border border-zinc-200 dark:border-zinc-800">
            <div className="text-zinc-500 text-sm mb-4">No holdings yet.</div>
            <Link
              href="/exchange"
              className="inline-block px-6 py-2 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Browse Exchange
            </Link>
          </div>
        ) : (
          <section>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-900 pb-2">
              Asset Inventory
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500">Token</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Balance</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Avg Cost</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Current Price</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">Value</th>
                    <th className="py-4 px-6 text-[9px] uppercase tracking-widest font-bold text-zinc-500 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {holdings.map((h) => (
                    <tr key={h.token_address} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm tracking-tight">{h.token?.name || h.token_address}</div>
                        <div className="text-[10px] font-mono text-blue-500">{h.token_address}</div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm">{h.balance.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right font-mono text-sm text-zinc-500">{formatSats(h.avg_cost_sats)}</td>
                      <td className="py-4 px-6 text-right font-mono text-sm text-zinc-500">{formatSats(h.token?.current_price_sats || 0)}</td>
                      <td className="py-4 px-6 text-right font-mono text-sm">{formatSats(h.current_value_sats || 0)}</td>
                      <td className={`py-4 px-6 text-right font-mono text-sm font-bold ${(h.unrealized_pnl_sats || 0) >= 0 ? 'text-black dark:text-white' : 'text-red-500'}`}>
                        {(h.unrealized_pnl_sats || 0) >= 0 ? '+' : ''}{formatSats(h.unrealized_pnl_sats || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
