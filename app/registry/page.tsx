'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKEN_CONFIG } from '@/lib/types';

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

interface Holder {
  address: string;
  handle?: string;
  balance: number;
  percentage: number;
}

interface CapTableData {
  holders: Holder[];
  stats: {
    totalHolders: number;
    totalCirculating: number;
    totalStaked: number;
    treasuryBalance: number;
  };
}

export default function RegistryPage() {
  const [data, setData] = useState<CapTableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapTable();
  }, []);

  const fetchCapTable = async () => {
    try {
      const response = await fetch('/api/token/cap-table');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch cap table:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (n: number) => n.toLocaleString();

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const stats = [
    { label: "Total Supply", value: formatNumber(TOKEN_CONFIG.totalSupply) },
    { label: "Circulating", value: loading ? '...' : formatNumber(data?.stats.totalCirculating || 0) },
    { label: "Total Staked", value: loading ? '...' : formatNumber(data?.stats.totalStaked || 0) },
    { label: "Holders", value: loading ? '...' : data?.stats.totalHolders || 0 },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-20">
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
            className="text-5xl font-bold tracking-tight mb-4"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            Token Registry
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Cap table for {TOKEN_CONFIG.symbol} token holders
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="border border-gray-800 p-6"
              variants={scaleIn}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{
                borderColor: "rgba(255,255,255,0.3)",
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
              <motion.div
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {stat.value}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Treasury Info */}
        <motion.div
          className="border border-gray-800 p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">Treasury</div>
              <div className="font-mono text-sm">{TOKEN_CONFIG.txId.slice(0, 20)}...</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-1">Balance</div>
              <div className="text-xl font-bold">
                {loading ? '...' : formatNumber(data?.stats.treasuryBalance || TOKEN_CONFIG.totalSupply)}
              </div>
              <div className="text-gray-500 text-sm">
                {loading
                  ? '...'
                  : `${(((data?.stats.treasuryBalance || TOKEN_CONFIG.totalSupply) / TOKEN_CONFIG.totalSupply) * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cap Table */}
        <motion.div
          className="border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-medium">Token Holders</h2>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="p-12 text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Loading cap table...
              </motion.div>
            ) : !data?.holders?.length ? (
              <motion.div
                key="empty"
                className="p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-gray-400 mb-4">No token holders yet</div>
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
              </motion.div>
            ) : (
              <motion.div
                key="table"
                className="overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Holder</th>
                      <th className="px-6 py-4 text-right">Balance</th>
                      <th className="px-6 py-4 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.holders.map((holder, index) => (
                      <motion.tr
                        key={holder.address}
                        className="border-b border-gray-800"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      >
                        <td className="px-6 py-4 text-gray-400">#{index + 1}</td>
                        <td className="px-6 py-4">
                          {holder.handle ? (
                            <span className="text-green-400">@{holder.handle}</span>
                          ) : (
                            <span className="font-mono text-sm">{truncateAddress(holder.address)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-mono">
                          {formatNumber(holder.balance)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400">
                          {holder.percentage.toFixed(4)}%
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Token Info */}
        <motion.div
          className="mt-12 border border-gray-800 p-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <h3 className="font-medium mb-4">Token Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Symbol:</span>{' '}
              <span className="font-mono">{TOKEN_CONFIG.symbol}</span>
            </div>
            <div>
              <span className="text-gray-400">Protocol:</span>{' '}
              <span className="font-mono">{TOKEN_CONFIG.protocol}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-400">Inscription ID:</span>{' '}
              <a
                href={TOKEN_CONFIG.marketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-400 hover:text-blue-300 break-all"
              >
                {TOKEN_CONFIG.inscriptionId}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="mt-8 flex flex-wrap gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeIn}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/token"
              className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
              Buy Tokens
            </Link>
          </motion.div>
          <motion.a
            href={TOKEN_CONFIG.marketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-600 text-white hover:border-white transition-colors"
            variants={fadeIn}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            View on 1SatOrdinals
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}
