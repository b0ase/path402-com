'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWallet } from '@/components/WalletProvider';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

interface Holding {
  balance: number;
  percentage: number;
  totalSpent: number;
}

interface Stats {
  totalCirculating: number;
  currentPrice: number;
}

export default function AccountPage() {
  const { wallet, disconnect } = useWallet();
  const [holding, setHolding] = useState<Holding | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wallet.connected) {
      fetchAccountData();
    } else {
      setLoading(false);
    }
  }, [wallet.connected, wallet.handle, wallet.address]);

  const fetchAccountData = async () => {
    try {
      const [holdingRes, statsRes] = await Promise.all([
        fetch('/api/token/holding'),
        fetch('/api/token/stats'),
      ]);

      if (holdingRes.ok) {
        const holdingData = await holdingRes.json();
        setHolding(holdingData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (n: number) => n.toLocaleString();
  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(4)} BSV`;
    }
    return `${formatNumber(sats)} sats`;
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Account</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view your account.</p>
            <p className="text-gray-500 text-sm">
              Click "Connect Wallet" in the navbar to get started.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Link href="/" className="text-gray-500 hover:text-white text-sm mb-4 inline-block">
              ← Back to Home
            </Link>
          </motion.div>
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            variants={fadeIn}
          >
            Account
          </motion.h1>
          <motion.p
            className="text-gray-400"
            variants={fadeIn}
          >
            Manage your $PATH402 holdings and wallet
          </motion.p>
        </motion.div>

        {/* Wallet Info */}
        <motion.div
          className="border border-gray-800 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-xl font-bold text-white">
                  {wallet.handle ? `@${wallet.handle}` : wallet.address?.slice(0, 12) + '...'}
                </span>
                <span className="text-gray-500 text-sm capitalize px-2 py-1 bg-gray-800 rounded">
                  {wallet.provider}
                </span>
              </div>
            </div>
            <motion.button
              onClick={disconnect}
              className="px-4 py-2 border border-red-500/50 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Disconnect
            </motion.button>
          </div>
        </motion.div>

        {/* Holdings */}
        <motion.div
          className="border border-gray-800 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <h2 className="text-lg font-semibold text-white mb-6">$PATH402 Holdings</h2>

          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : holding && holding.balance > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Balance</div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(holding.balance)}
                </div>
                <div className="text-sm text-gray-500">PATH402</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Ownership</div>
                <div className="text-2xl font-bold text-white">
                  {holding.percentage.toFixed(4)}%
                </div>
                <div className="text-sm text-gray-500">of circulating</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-white">
                  {formatSats(holding.totalSpent)}
                </div>
                <div className="text-sm text-gray-500">acquisition cost</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">You don't hold any $PATH402 tokens yet.</div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/token"
                  className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                >
                  Buy Tokens
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Market Stats */}
        {stats && (
          <motion.div
            className="border border-gray-800 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <h2 className="text-lg font-semibold text-white mb-6">Market Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Circulating Supply</div>
                <div className="text-xl font-bold text-white">
                  {formatNumber(stats.totalCirculating)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-xl font-bold text-white">
                  {formatSats(stats.currentPrice)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/token"
              className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
              Buy More Tokens
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/registry"
              className="inline-block px-6 py-3 border border-gray-600 text-white hover:border-white transition-colors"
            >
              View Registry
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
