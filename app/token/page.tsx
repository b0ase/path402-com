'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/components/WalletProvider';
import { TOKEN_CONFIG } from '@/lib/types';
import PriceCurveChart from '@/components/PriceCurveChart';

interface HolderStats {
  totalHolders: number;
  totalStaked: number;
  totalCirculating: number;
  treasuryBalance: number;
  currentPrice: number;
  totalSold: number;
}

interface UserHolding {
  balance: number;
  stakedBalance: number;
  availableBalance: number;
  pendingDividends: number;
  totalDividendsEarned: number;
}

interface PurchasePreview {
  tokenCount: number;
  totalCost: number;
  avgPrice: number;
  remainingSats: number;
  currentPrice: number;
}

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

export default function TokenPage() {
  const { wallet, connectYours, connectHandCash, disconnect, isYoursAvailable } = useWallet();
  const [stats, setStats] = useState<HolderStats | null>(null);
  const [holding, setHolding] = useState<UserHolding | null>(null);
  const [spendAmount, setSpendAmount] = useState('100000000'); // 1 BSV = 100M sats (stored in sats)
  const [spendUnit, setSpendUnit] = useState<'sats' | 'bsv'>('bsv');
  const [preview, setPreview] = useState<PurchasePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bsvUsdPrice, setBsvUsdPrice] = useState<number>(45); // Default fallback
  const [showUsd, setShowUsd] = useState(false);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    fetch('/api/token/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  // Fetch preview when spend amount changes
  // Note: spendAmount is ALWAYS stored in sats internally
  useEffect(() => {
    const spendSats = parseInt(spendAmount || '0');

    if (!spendSats || spendSats <= 0) {
      setPreview(null);
      return;
    }

    setPreviewLoading(true);
    const debounceTimeout = setTimeout(() => {
      fetch(`/api/token/preview?spendSats=${spendSats}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setPreview(data);
          } else {
            setPreview(null);
          }
        })
        .catch(() => setPreview(null))
        .finally(() => setPreviewLoading(false));
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [spendAmount, spendUnit]);

  useEffect(() => {
    if (wallet.connected) {
      fetch('/api/token/holding', {
        headers: {
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
          'x-wallet-handle': wallet.handle || '',
        },
      })
        .then((res) => res.json())
        .then(setHolding)
        .catch(console.error);
    } else {
      setHolding(null);
    }
  }, [wallet]);

  // Fetch BSV/USD price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/price/bsv');
        const data = await res.json();
        if (data.bsv_usd) {
          setBsvUsdPrice(data.bsv_usd);
        }
      } catch (err) {
        console.error('Failed to fetch BSV price:', err);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrice();
    // Refresh price every 60 seconds
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = async () => {
    if (!wallet.connected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    // spendAmount is always stored in sats
    const spendSats = parseInt(spendAmount || '0');

    if (isNaN(spendSats) || spendSats <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    if (!preview || preview.tokenCount === 0) {
      setMessage({ type: 'error', text: 'Amount too low to purchase any tokens at current price' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/token/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
          'x-wallet-handle': wallet.handle || '',
        },
        body: JSON.stringify({ spendSats }),
      });

      const data = await res.json();

      if (!res.ok) {
        // User-friendly error messages
        let errorText = data.error || 'Purchase failed';
        if (data.details) {
          // Check for common HandCash errors
          if (data.details.includes('spending limit') || data.details.includes('INSUFFICIENT')) {
            errorText = 'HandCash spending limit exceeded. Visit app.handcash.io to increase your limit.';
          } else {
            errorText = `${data.error}: ${data.details}`;
          }
        }
        throw new Error(errorText);
      }

      if (wallet.provider === 'yours' && window.yours && data.paymentAddress) {
        const paymentResult = await window.yours.sendBsv({
          address: data.paymentAddress,
          satoshis: data.totalSats,
        });

        await fetch('/api/token/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchaseId: data.purchaseId,
            txId: paymentResult.txid,
          }),
        });
      }

      setMessage({ type: 'success', text: `Successfully purchased ${data.amount.toLocaleString()} tokens for ${(data.totalSats / 100_000_000).toFixed(4)} BSV!` });

      // Refresh stats and holdings
      const [holdingRes, statsRes] = await Promise.all([
        fetch('/api/token/holding', {
          headers: {
            'x-wallet-address': wallet.address || '',
            'x-wallet-provider': wallet.provider || '',
            'x-wallet-handle': wallet.handle || '',
          },
        }),
        fetch('/api/token/stats'),
      ]);
      setHolding(await holdingRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Purchase failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    const amount = parseInt(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
        body: JSON.stringify({ amount, action: 'stake' }),
      });

      if (!res.ok) throw new Error('Staking failed');

      setMessage({ type: 'success', text: `Staked ${amount.toLocaleString()} tokens!` });
      setStakeAmount('');

      const holdingRes = await fetch('/api/token/holding', {
        headers: {
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
      });
      setHolding(await holdingRes.json());
    } catch (error) {
      setMessage({ type: 'error', text: 'Staking failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    const amount = parseInt(unstakeAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
        body: JSON.stringify({ amount, action: 'unstake' }),
      });

      if (!res.ok) throw new Error('Unstaking failed');

      setMessage({ type: 'success', text: `Unstaked ${amount.toLocaleString()} tokens!` });
      setUnstakeAmount('');

      const holdingRes = await fetch('/api/token/holding', {
        headers: {
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
      });
      setHolding(await holdingRes.json());
    } catch (error) {
      setMessage({ type: 'error', text: 'Unstaking failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }
    if (!withdrawAddress) {
      setMessage({ type: 'error', text: 'Please enter a withdrawal address' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/token/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
        body: JSON.stringify({ amount, toAddress: withdrawAddress }),
      });

      if (!res.ok) throw new Error('Withdrawal failed');

      setMessage({ type: 'success', text: `Withdrawal of ${amount.toLocaleString()} tokens initiated!` });
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Withdrawal failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDividends = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stake/claim', {
        method: 'POST',
        headers: {
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
      });

      if (!res.ok) throw new Error('Claim failed');

      const data = await res.json();
      setMessage({ type: 'success', text: `Claimed ${data.amount} sats in dividends!` });

      const holdingRes = await fetch('/api/token/holding', {
        headers: {
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
        },
      });
      setHolding(await holdingRes.json());
    } catch (error) {
      setMessage({ type: 'error', text: 'Claim failed' });
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm mb-4 inline-block">
              ← Back to Home
            </Link>
          </motion.div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
              <motion.h1
                className="text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {TOKEN_CONFIG.symbol}
              </motion.h1>
              <p className="text-zinc-400">{TOKEN_CONFIG.name}</p>
            </motion.div>
            <motion.div
              className="flex gap-3"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              {!wallet.connected ? (
                <>
                  <motion.button
                    onClick={connectYours}
                    className="px-6 py-3 bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isYoursAvailable ? 'Connect Yours' : 'Get Yours Wallet'}
                  </motion.button>
                  <motion.button
                    onClick={connectHandCash}
                    className="px-6 py-3 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Connect HandCash
                  </motion.button>
                </>
              ) : (
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {wallet.handle || wallet.address?.slice(0, 8) + '...'}
                    </div>
                    <div className="text-gray-500 text-sm capitalize">{wallet.provider}</div>
                  </div>
                  <motion.button
                    onClick={disconnect}
                    className="px-4 py-2 border border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Disconnect
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className={`mb-8 p-4 border ${
                message.type === 'success'
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Token Info */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {[
            { label: 'Current Price', value: stats?.currentPrice ? `${stats.currentPrice.toLocaleString()} sats` : '—' },
            { label: 'Tokens Sold', value: stats?.totalSold?.toLocaleString() ?? '—' },
            { label: 'Holders', value: stats?.totalHolders ?? '—' },
            { label: 'Treasury', value: stats?.treasuryBalance?.toLocaleString() ?? '—' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
              variants={scaleIn}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{
                borderColor: 'rgba(128,128,128,0.5)',
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-gray-500 text-sm uppercase tracking-wider mb-2">{stat.label}</div>
              <motion.div
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {stat.value}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* User Holdings */}
        <AnimatePresence>
          {wallet.connected && holding && (
            <motion.div
              className="border border-blue-500/30 bg-blue-500/10 p-6 mb-12"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Your Holdings</h2>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  { label: 'Total Balance', value: (holding.balance ?? 0).toLocaleString(), color: 'text-white' },
                  { label: 'Available', value: (holding.availableBalance ?? 0).toLocaleString(), color: 'text-white' },
                  { label: 'Staked', value: (holding.stakedBalance ?? 0).toLocaleString(), color: 'text-purple-400' },
                  { label: 'Pending Dividends', value: `${(holding.pendingDividends ?? 0).toLocaleString()} sats`, color: 'text-green-400' },
                  { label: 'Total Earned', value: `${(holding.totalDividendsEarned ?? 0).toLocaleString()} sats`, color: 'text-green-400' },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeIn}>
                    <div className="text-zinc-400 text-sm">{item.label}</div>
                    <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                  </motion.div>
                ))}
              </motion.div>
              {holding.pendingDividends > 0 && (
                <motion.button
                  onClick={handleClaimDividends}
                  disabled={loading}
                  className="mt-4 px-6 py-2 bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Claim Dividends
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Buy Tokens */}
          <motion.div
            className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
            variants={scaleIn}
            whileHover={{ borderColor: 'rgba(128,128,128,0.4)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Buy Tokens</h2>
              {/* BSV/USD Toggle */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${!showUsd ? 'text-white' : 'text-gray-500'}`}>BSV</span>
                <button
                  onClick={() => setShowUsd(!showUsd)}
                  className={`relative w-10 h-5 -full transition-colors ${showUsd ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white -full transition-transform ${
                      showUsd ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className={`text-xs ${showUsd ? 'text-white' : 'text-gray-500'}`}>USD</span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              sqrt_decay pricing: price increases as treasury depletes. Early buyers win.
              {stats?.currentPrice && (
                <span className="block mt-1 text-green-400">
                  Current price: {stats.currentPrice.toLocaleString()} sats/token
                  {showUsd && !priceLoading && (
                    <span className="text-gray-400 ml-2">
                      (${((stats.currentPrice / 100_000_000) * bsvUsdPrice).toFixed(4)} USD)
                    </span>
                  )}
                </span>
              )}
              {!priceLoading && (
                <span className="block mt-1 text-gray-500 text-xs">
                  BSV/USD: ${bsvUsdPrice.toFixed(2)}
                </span>
              )}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 text-sm block mb-2">Amount to Spend</label>
                <div className="flex gap-2">
                  <motion.input
                    type="number"
                    value={spendUnit === 'bsv' ? (parseFloat(spendAmount) / 100_000_000 || '') : spendAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (spendUnit === 'bsv') {
                        setSpendAmount(String(Math.floor(parseFloat(val || '0') * 100_000_000)));
                      } else {
                        setSpendAmount(val);
                      }
                    }}
                    placeholder={spendUnit === 'bsv' ? '1' : '100000000'}
                    step={spendUnit === 'bsv' ? '0.001' : '1'}
                    className="flex-1 bg-black border border-zinc-800 p-3 text-white focus:border-gray-500 outline-none transition-colors"
                    whileFocus={{ borderColor: 'rgba(128,128,128,0.6)' }}
                  />
                  <select
                    value={spendUnit}
                    onChange={(e) => setSpendUnit(e.target.value as 'sats' | 'bsv')}
                    className="bg-black border border-zinc-800 px-4 text-white focus:border-gray-500 outline-none"
                  >
                    <option value="bsv">BSV</option>
                    <option value="sats">sats</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <AnimatePresence mode="wait">
                {previewLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-900/50 border border-gray-700 p-4"
                  >
                    <span className="text-gray-400">Calculating...</span>
                  </motion.div>
                ) : preview && preview.tokenCount > 0 ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-900/20 border border-green-500/30 p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-400">You'll receive:</span>
                      <span className="text-white font-bold text-lg">{preview.tokenCount.toLocaleString()} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg price:</span>
                      <span className="text-gray-300">
                        {showUsd
                          ? `$${((preview.avgPrice / 100_000_000) * bsvUsdPrice).toFixed(4)}`
                          : `${preview.avgPrice.toLocaleString()} sats`
                        }/token
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total cost:</span>
                      <span className="text-gray-300">
                        {showUsd
                          ? `$${((preview.totalCost / 100_000_000) * bsvUsdPrice).toFixed(2)} USD`
                          : `${(preview.totalCost / 100_000_000).toFixed(4)} BSV`
                        }
                      </span>
                    </div>
                    {preview.remainingSats > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remainder (not spent):</span>
                        <span className="text-gray-500">
                          {showUsd
                            ? `$${((preview.remainingSats / 100_000_000) * bsvUsdPrice).toFixed(4)}`
                            : `${preview.remainingSats.toLocaleString()} sats`
                          }
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : preview === null && parseInt(spendAmount) > 0 ? (
                  <motion.div
                    key="insufficient"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-900/20 border border-red-500/30 p-4"
                  >
                    <span className="text-red-400">
                      Amount too low. Min: {stats?.currentPrice?.toLocaleString() || '—'} sats for 1 token
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                onClick={handleBuy}
                disabled={loading || !wallet.connected || !preview || preview.tokenCount === 0}
                className="w-full px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? 'Processing...' : wallet.connected ? `Buy ${preview?.tokenCount?.toLocaleString() || 0} Tokens` : 'Connect Wallet to Buy'}
              </motion.button>
            </div>
          </motion.div>

          {/* Stake Tokens */}
          <motion.div
            className="border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950"
            variants={scaleIn}
            whileHover={{ borderColor: 'rgba(128,128,128,0.4)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Stake Tokens</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Stake your tokens to earn dividends from $402 protocol fees.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 text-sm block mb-2">Stake Amount</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Amount to stake"
                  max={holding?.availableBalance || 0}
                  className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-gray-500 outline-none"
                />
              </div>
              <motion.button
                onClick={handleStake}
                disabled={loading || !wallet.connected || !holding?.availableBalance}
                className="w-full px-6 py-3 bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Stake
              </motion.button>
              <div className="border-t border-zinc-800 pt-4 mt-4">
                <label className="text-zinc-400 text-sm block mb-2">Unstake Amount</label>
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="Amount to unstake"
                  max={holding?.stakedBalance || 0}
                  className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-gray-500 outline-none"
                />
                <motion.button
                  onClick={handleUnstake}
                  disabled={loading || !wallet.connected || !holding?.stakedBalance}
                  className="w-full mt-2 px-6 py-3 border border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 disabled:opacity-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Unstake
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Price Curve Chart */}
        {stats && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PriceCurveChart
              treasuryRemaining={stats.treasuryBalance}
              currentPrice={stats.currentPrice}
              tokensToBuy={preview?.tokenCount || 0}
              bsvUsdPrice={bsvUsdPrice}
              showUsd={showUsd}
            />
          </motion.div>
        )}

        {/* Withdraw Tokens */}
        <AnimatePresence>
          {wallet.connected && holding && holding.availableBalance > 0 && (
            <motion.div
              className="border border-zinc-800 p-6 mb-12 bg-zinc-950"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ borderColor: 'rgba(128,128,128,0.4)' }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Withdraw to Ordinals Wallet</h2>
              <p className="text-zinc-400 text-sm mb-4">
                Withdraw your tokens to an external ordinals-compatible wallet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Amount</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    max={holding.availableBalance}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-gray-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-zinc-400 text-sm block mb-2">Ordinals Address</label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Ordinals address (starts with 1)"
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-gray-500 outline-none"
                  />
                </div>
              </div>
              <motion.button
                onClick={handleWithdraw}
                disabled={loading}
                className="mt-4 px-6 py-3 border border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Withdraw
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Token Info */}
        <motion.div
          className="border border-zinc-800 p-6 mb-12 bg-zinc-950"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          whileHover={{ borderColor: 'rgba(128,128,128,0.4)' }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Token Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Inscription ID:</span>
              <a
                href={TOKEN_CONFIG.marketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 ml-2 break-all"
              >
                {TOKEN_CONFIG.inscriptionId}
              </a>
            </div>
            <div>
              <span className="text-gray-500">Transaction:</span>
              <a
                href={`https://whatsonchain.com/tx/${TOKEN_CONFIG.txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 ml-2 break-all"
              >
                {TOKEN_CONFIG.txId.slice(0, 16)}...
              </a>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          className="border-t border-zinc-800 pt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-zinc-500 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            Trade
          </motion.h2>
          <motion.div className="flex flex-wrap gap-4" variants={fadeIn}>
            <motion.a
              href={TOKEN_CONFIG.marketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              View on 1sat.market
            </motion.a>
            <motion.a
              href="https://yours.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Yours Wallet
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
