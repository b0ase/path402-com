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
  stakedBalance: number;
  availableBalance: number;
  pendingDividends: number;
  totalDividendsEarned: number;
}

interface Stats {
  totalCirculating: number;
  currentPrice: number;
}

interface DerivedAddress {
  address: string;
  publicKey?: string;
  tier: number;
}

export default function AccountPage() {
  const { wallet, disconnect } = useWallet();
  const [holding, setHolding] = useState<Holding | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [derivedAddress, setDerivedAddress] = useState<DerivedAddress | null>(null);
  const [deriving, setDeriving] = useState(false);
  const [deriveError, setDeriveError] = useState<string | null>(null);

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

  const formatNumber = (n: number | undefined | null) => (n ?? 0).toLocaleString();
  const formatSats = (sats: number | undefined | null) => {
    const val = sats ?? 0;
    if (val >= 100000000) {
      return `${(val / 100000000).toFixed(4)} BSV`;
    }
    return `${formatNumber(val)} sats`;
  };

  const deriveAddress = async () => {
    if (!wallet.handle || wallet.provider !== 'handcash') {
      setDeriveError('HandCash connection required');
      return;
    }

    setDeriving(true);
    setDeriveError(null);

    try {
      // Step 1: Get the message to sign
      const messageRes = await fetch('/api/account/derive', {
        headers: {
          'x-wallet-handle': wallet.handle,
          'x-wallet-provider': 'handcash',
        },
      });
      const { message } = await messageRes.json();

      // Step 2: Sign the message via HandCash
      const signRes = await fetch('/api/auth/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!signRes.ok) {
        const err = await signRes.json();
        throw new Error(err.error || 'Failed to sign message');
      }

      const { signature } = await signRes.json();

      // Step 3: Derive address from signature
      const deriveRes = await fetch('/api/account/derive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-handle': wallet.handle,
          'x-wallet-provider': 'handcash',
        },
        body: JSON.stringify({ signature }),
      });

      if (!deriveRes.ok) {
        const err = await deriveRes.json();
        throw new Error(err.error || 'Failed to derive address');
      }

      const result = await deriveRes.json();
      setDerivedAddress({
        address: result.address,
        publicKey: result.publicKey,
        tier: result.tier,
      });
    } catch (error) {
      console.error('Failed to derive address:', error);
      setDeriveError(error instanceof Error ? error.message : 'Failed to derive address');
    } finally {
      setDeriving(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-900 dark:text-white mb-6">Account</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Connect your wallet to view your account.</p>
            <p className="text-zinc-500 text-sm">
              Click "Connect Wallet" in the navbar to get started.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-900 dark:text-white text-sm mb-4 inline-block">
              ← Back to Home
            </Link>
          </motion.div>
          <motion.h1
            className="text-5xl font-bold text-zinc-900 dark:text-white mb-4"
            variants={fadeIn}
          >
            Account
          </motion.h1>
          <motion.p
            className="text-zinc-400"
            variants={fadeIn}
          >
            Manage your $402 holdings and wallet
          </motion.p>
        </motion.div>

        {/* Wallet Info */}
        <motion.div
          className="border border-zinc-200 dark:border-zinc-800 p-6 mb-8 bg-zinc-50 dark:bg-zinc-950 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ borderColor: "rgba(96, 165, 250, 0.5)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-400 mb-1">Connected Wallet</div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 dark:bg-green-400 -full" />
                <span className="text-xl font-bold text-zinc-900 dark:text-white">
                  {wallet.handle ? `@${wallet.handle}` : wallet.address?.slice(0, 12) + '...'}
                </span>
                <span className="text-zinc-500 text-sm capitalize px-2 py-1 bg-gray-100 dark:bg-gray-800 ">
                  {wallet.provider}
                </span>
              </div>
            </div>
            <motion.button
              onClick={disconnect}
              className="px-4 py-2 border border-red-500/50 text-red-600 dark:text-red-400 text-sm hover:bg-red-500/10 transition-colors "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Disconnect
            </motion.button>
          </div>
        </motion.div>

        {/* On-Chain Address */}
        <motion.div
          className="border border-zinc-200 dark:border-zinc-800 p-6 mb-8 bg-zinc-50 dark:bg-zinc-950 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          whileHover={{ borderColor: "rgba(96, 165, 250, 0.5)" }}
        >
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">On-Chain Address</h2>

          {derivedAddress ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 ">
                <div className="text-green-400 text-sm mb-1">Your PATH402 Address</div>
                <div className="font-mono text-zinc-900 dark:text-white break-all">{derivedAddress.address}</div>
                <p className="text-zinc-500 text-xs mt-2">
                  You control this address. Tokens sent here are yours.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(derivedAddress.address)}
                  className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:text-white hover:border-gray-500 transition-colors "
                >
                  Copy Address
                </button>
                <a
                  href={`https://whatsonchain.com/address/${derivedAddress.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:text-white hover:border-gray-500 transition-colors "
                >
                  View on Explorer
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">
                Derive your unique on-chain address from your HandCash signature.
                This address is controlled by YOU - PATH402 never has your keys.
              </p>

              {deriveError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm ">
                  {deriveError}
                </div>
              )}

              {wallet.provider === 'handcash' ? (
                <motion.button
                  onClick={deriveAddress}
                  disabled={deriving}
                  className="px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {deriving ? 'Signing...' : 'Derive My Address'}
                </motion.button>
              ) : (
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                  Connect with HandCash to derive your on-chain address.
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Account Tier */}
        <motion.div
          className="border border-zinc-200 dark:border-zinc-800 p-6 mb-8 bg-zinc-50 dark:bg-zinc-950 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ borderColor: "rgba(96, 165, 250, 0.5)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Account Tier</h2>
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-sm font-medium ">
              Tier 1: Holder
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tier 1 - Current */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 ">
              <div className="text-blue-400 font-medium mb-2">Tier 1: Token Holder</div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Receive tokens
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Hold & transfer (your keys)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> View on registry
                </li>
              </ul>
            </div>

            {/* Tier 2 - Coming Soon */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800/50 border border-zinc-200 dark:border-zinc-800  opacity-60">
              <div className="text-zinc-500 font-medium mb-2">
                Tier 2: Staker
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 ">Coming Soon</span>
              </div>
              <ul className="text-sm text-gray-400 dark:text-gray-500 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-gray-400 dark:text-gray-600">○</span> Stake for dividends
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400 dark:text-gray-600">○</span> Voting rights
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400 dark:text-gray-600">○</span> Requires KYC
                </li>
              </ul>
            </div>
          </div>

          <p className="text-zinc-500 text-xs mt-4">
            Tier 2 staking with dividends and governance will require KYC verification.
          </p>
        </motion.div>

        {/* Holdings */}
        <motion.div
          className="border border-zinc-200 dark:border-zinc-800 p-6 mb-8 bg-zinc-50 dark:bg-zinc-950 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ borderColor: "rgba(96, 165, 250, 0.5)" }}
        >
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">$402 Holdings</h2>

          {loading ? (
            <div className="text-zinc-400">Loading...</div>
          ) : holding && holding.balance > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Total Balance</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {formatNumber(holding.balance)}
                </div>
                <div className="text-sm text-zinc-500">PATH402</div>
              </div>
              <div>
                <div className="text-sm text-zinc-400 mb-1">Available</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {formatNumber(holding.availableBalance)}
                </div>
                <div className="text-sm text-zinc-500">unstaked</div>
              </div>
              <div>
                <div className="text-sm text-zinc-400 mb-1">Staked</div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatNumber(holding.stakedBalance)}
                </div>
                <div className="text-sm text-zinc-500">earning dividends</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-zinc-400 mb-4">You don't hold any $402 tokens yet.</div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/token"
                  className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition-colors "
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
            className="border border-zinc-200 dark:border-zinc-800 p-6 mb-8 bg-zinc-50 dark:bg-zinc-950 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ borderColor: "rgba(96, 165, 250, 0.5)" }}
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Market Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Circulating Supply</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white">
                  {formatNumber(stats.totalCirculating)}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-400 mb-1">Current Price</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white">
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
              className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition-colors "
            >
              Buy More Tokens
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/registry"
              className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 text-zinc-900 dark:text-white hover:border-gray-500 dark:hover:border-white transition-colors "
            >
              View Registry
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
