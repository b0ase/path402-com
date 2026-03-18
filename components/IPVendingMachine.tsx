'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAgentsForTokenGroup } from '@/lib/agents/data';
import { IP_LICENCE_TIERS, getTierForBalance } from '@/lib/licenceTiers';
import type { TokenGroup } from '@/lib/agents/data';

interface TokenData {
  address: string;
  name: string;
  description: string;
  total_supply: number;
  treasury_balance: number;
  base_price_sats: number;
  pricing_model: string;
}

interface VendingMachineProps {
  tokenGroup: TokenGroup;
  index: number;
}

export default function IPVendingMachine({ tokenGroup, index }: VendingMachineProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const agents = getAgentsForTokenGroup(tokenGroup.tokenAddress);
  const currentTier = getTierForBalance(userBalance);
  const percentSold = tokenData
    ? ((tokenData.total_supply - tokenData.treasury_balance) / tokenData.total_supply) * 100
    : 0;

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const encodedAddress = encodeURIComponent(tokenGroup.tokenAddress);
        const response = await fetch(`/api/tokens/${encodedAddress}`);
        if (!response.ok) throw new Error('Failed to fetch token data');
        const { token } = await response.json();
        setTokenData(token);
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token data');
      } finally {
        setLoading(false);
      }
    };

    const fetchHoldings = async () => {
      try {
        const handle = localStorage.getItem('hc_handle');
        if (!handle) {
          setIsConnected(false);
          return;
        }

        const response = await fetch('/api/tokens/holdings', {
          headers: {
            'x-wallet-handle': handle,
            'x-wallet-provider': 'handcash',
          },
        });

        if (!response.ok) {
          setIsConnected(false);
          return;
        }

        const { holdings } = await response.json();
        const groupHolding = holdings.find(
          (h: any) => h.token_address === tokenGroup.tokenAddress
        );
        setUserBalance(groupHolding?.balance ?? 0);
        setIsConnected(!!handle);
      } catch (err) {
        console.error('Error fetching holdings:', err);
        setIsConnected(false);
      }
    };

    fetchTokenData();
    fetchHoldings();
  }, [tokenGroup.tokenAddress]);

  const handleConnect = () => {
    window.location.href = '/api/auth/handcash';
  };

  const handleBuy = async () => {
    try {
      const handle = localStorage.getItem('hc_handle');
      if (!handle) {
        handleConnect();
        return;
      }

      // For now, trigger payment flow
      // In real implementation, this would show payment QR
      const encodedAddress = encodeURIComponent(tokenGroup.tokenAddress);
      const response = await fetch(`/api/tokens/${encodedAddress}`, {
        method: 'POST',
        headers: {
          'x-wallet-handle': handle,
          'x-wallet-provider': 'handcash',
        },
        body: JSON.stringify({
          amount_usd: 0.01,
        }),
      });

      if (response.status === 402) {
        // Payment required
        const headers = response.headers;
        const amount = headers.get('x-bsv-payment-amount');
        const destination = headers.get('x-bsv-payment-destination');
        alert(`Payment required: ${amount} sats to ${destination}`);
      } else if (!response.ok) {
        throw new Error('Purchase failed');
      } else {
        const result = await response.json();
        alert(`Success! You received ${result.tokensAwarded} tokens`);
        // Refresh balance
        location.reload();
      }
    } catch (err) {
      console.error('Error buying tokens:', err);
      alert('Failed to purchase. Please try again.');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 bg-white dark:bg-black animate-pulse"
      >
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
        </div>
      </motion.div>
    );
  }

  if (error || !tokenData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="border border-red-200 dark:border-red-900 rounded-lg p-8 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100"
      >
        <p className="font-mono text-sm">{error || 'Failed to load token'}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-black"
    >
      {/* Accent bar */}
      <div className={`h-1.5 ${tokenGroup.accent.bg}`} />

      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase mb-2">
            {tokenGroup.tokenName}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {tokenGroup.description}
          </p>
        </div>

        {/* Agent Roster */}
        <div className="border-t border-b border-zinc-200 dark:border-zinc-800 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            IP Universe
          </p>
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
              <span
                key={agent.id}
                className={`px-2 py-1 text-xs font-bold ${agent.accent.badgeBg} text-white rounded`}
              >
                {agent.name}
              </span>
            ))}
          </div>
        </div>

        {/* Supply Gauge */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Supply
            </p>
            <span className={`text-xs font-mono ${tokenGroup.accent.text}`}>
              {percentSold.toFixed(1)}% sold
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div
              className={`h-full ${tokenGroup.accent.bg} transition-all`}
              style={{ width: `${Math.min(percentSold, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            {tokenData.total_supply.toLocaleString()} tokens, 1B supply (Alice Bond curve)
          </p>
        </div>

        {/* Tier Table */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Licence Tiers
          </p>
          <div className="space-y-2 text-xs">
            {IP_LICENCE_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={`border rounded px-3 py-2 transition-all ${
                  tier.tier === currentTier.tier
                    ? `${tokenGroup.accent.bg} text-white`
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold">
                    {tier.label}
                    {tier.tier === currentTier.tier && ' ✓'}
                  </span>
                  <span className="font-mono text-[9px] opacity-75">
                    {tier.tokensRequired.toLocaleString()} tokens
                  </span>
                </div>
                <p className="text-[9px] opacity-75 mt-1 line-clamp-1">
                  {tier.rights.slice(0, 1).join(', ')}
                  {tier.rights.length > 1 && '...'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Tier Info */}
        {userBalance > 0 && (
          <div
            className={`rounded px-4 py-3 ${tokenGroup.accent.bg} text-white space-y-2`}
          >
            <p className="text-xs font-bold uppercase tracking-widest">Your Tier</p>
            <div className="space-y-1">
              <p className="text-sm font-black">{currentTier.label}</p>
              <p className="text-[11px] opacity-90">
                {userBalance.toLocaleString()} tokens held
              </p>
            </div>
            <div className="text-[10px] space-y-1 pt-2 border-t border-white/20">
              {currentTier.rights.slice(0, 3).map((right) => (
                <p key={right} className="opacity-90">
                  ✓ {right}
                </p>
              ))}
              {currentTier.rights.length > 3 && (
                <p className="opacity-75">+ {currentTier.rights.length - 3} more rights</p>
              )}
            </div>
          </div>
        )}

        {/* Buy Panel */}
        <button
          onClick={isConnected ? handleBuy : handleConnect}
          className={`w-full py-3 px-4 rounded font-bold uppercase text-sm tracking-widest transition-all ${
            isConnected
              ? `${tokenGroup.accent.bg} text-white hover:opacity-90`
              : 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700'
          }`}
        >
          {isConnected ? (userBalance > 0 ? 'Buy More' : 'Buy Licence — $0.01') : 'Connect HandCash'}
        </button>
      </div>
    </motion.div>
  );
}
