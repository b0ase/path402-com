'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/components/WalletProvider';
import { TOKEN_CONFIG } from '@/lib/types';

interface HolderStats {
  totalHolders: number;
  totalStaked: number;
  totalCirculating: number;
  treasuryBalance: number;
}

interface UserHolding {
  balance: number;
  stakedBalance: number;
  availableBalance: number;
  pendingDividends: number;
  totalDividendsEarned: number;
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
  const [buyAmount, setBuyAmount] = useState('1000000');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const TOKEN_PRICE_SATS = 1;

  useEffect(() => {
    fetch('/api/token/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

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

  const handleBuy = async () => {
    if (!wallet.connected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    const amount = parseInt(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
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
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Purchase failed');
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

      setMessage({ type: 'success', text: `Successfully purchased ${amount.toLocaleString()} tokens!` });

      const holdingRes = await fetch('/api/token/holding', {
        headers: {
          'x-wallet-address': wallet.address || '',
          'x-wallet-provider': wallet.provider || '',
          'x-wallet-handle': wallet.handle || '',
        },
      });
      setHolding(await holdingRes.json());
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
    <div className="min-h-screen bg-black pt-20">
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
              <p className="text-gray-400">{TOKEN_CONFIG.name}</p>
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
                    className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
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
            { label: 'Total Supply', value: TOKEN_CONFIG.totalSupply.toLocaleString() },
            { label: 'Holders', value: stats?.totalHolders ?? '—' },
            { label: 'Total Staked', value: stats?.totalStaked?.toLocaleString() ?? '—' },
            { label: 'Protocol', value: TOKEN_CONFIG.protocol },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="border border-gray-700 p-6"
              variants={scaleIn}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{
                borderColor: 'rgba(255,255,255,0.3)',
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
                    <div className="text-gray-400 text-sm">{item.label}</div>
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
            className="border border-gray-700 p-6"
            variants={scaleIn}
            whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Buy Tokens</h2>
            <p className="text-gray-400 text-sm mb-4">
              Purchase PATH402.com tokens. Price: {TOKEN_PRICE_SATS} sat per token.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Amount</label>
                <motion.input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="1000000"
                  className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gray-500 outline-none transition-colors"
                  whileFocus={{ borderColor: 'rgba(255,255,255,0.4)' }}
                />
              </div>
              <div className="text-gray-400 text-sm">
                Total: {(parseInt(buyAmount) * TOKEN_PRICE_SATS || 0).toLocaleString()} sats
              </div>
              <motion.button
                onClick={handleBuy}
                disabled={loading || !wallet.connected}
                className="w-full px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? 'Processing...' : wallet.connected ? 'Buy Tokens' : 'Connect Wallet to Buy'}
              </motion.button>
            </div>
          </motion.div>

          {/* Stake Tokens */}
          <motion.div
            className="border border-gray-700 p-6"
            variants={scaleIn}
            whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Stake Tokens</h2>
            <p className="text-gray-400 text-sm mb-4">
              Stake your tokens to earn dividends from $PATH402 protocol fees.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Stake Amount</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Amount to stake"
                  max={holding?.availableBalance || 0}
                  className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gray-500 outline-none"
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
              <div className="border-t border-gray-800 pt-4 mt-4">
                <label className="text-gray-400 text-sm block mb-2">Unstake Amount</label>
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="Amount to unstake"
                  max={holding?.stakedBalance || 0}
                  className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gray-500 outline-none"
                />
                <motion.button
                  onClick={handleUnstake}
                  disabled={loading || !wallet.connected || !holding?.stakedBalance}
                  className="w-full mt-2 px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Unstake
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Withdraw Tokens */}
        <AnimatePresence>
          {wallet.connected && holding && holding.availableBalance > 0 && (
            <motion.div
              className="border border-gray-700 p-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Withdraw to Ordinals Wallet</h2>
              <p className="text-gray-400 text-sm mb-4">
                Withdraw your tokens to an external ordinals-compatible wallet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Amount</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    max={holding.availableBalance}
                    className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gray-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm block mb-2">Ordinals Address</label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Ordinals address (starts with 1)"
                    className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gray-500 outline-none"
                  />
                </div>
              </div>
              <motion.button
                onClick={handleWithdraw}
                disabled={loading}
                className="mt-4 px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 transition-colors"
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
          className="border border-gray-700 p-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
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
          className="border-t border-gray-800 pt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider"
            variants={fadeIn}
          >
            Trade
          </motion.h2>
          <motion.div className="flex flex-wrap gap-4" variants={fadeIn}>
            <motion.a
              href={TOKEN_CONFIG.marketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              View on 1sat.market
            </motion.a>
            <motion.a
              href="https://yours.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
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
