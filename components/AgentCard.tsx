'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { buyTokensAliceBond } from '@/lib/tokens/pricing';
import type { Agent } from '@/lib/agents/data';

interface TokenData {
  address: string;
  name: string;
  total_supply: number;
  treasury_balance: number;
}

const MAX_SPEND_USD = 10000;

export default function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [spendUsd, setSpendUsd] = useState(0.01);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const href = agent.link || `/market/${agent.channel}/${agent.id}`;

  // Fetch token data when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        // For now, use agent.id as a simple token address mapping
        // In production, would need proper token address lookup
        const tokenAddress = `ip_${agent.id.toLowerCase()}`;
        const encodedAddress = encodeURIComponent(tokenAddress);
        const response = await fetch(`/api/tokens/${encodedAddress}`);
        if (response.ok) {
          const { token } = await response.json();
          setTokenData(token);
        }
      } catch (err) {
        console.error('Error fetching token:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTokenData();
  }, [isOpen, agent.id]);

  // Calculate tokens for spend amount
  useEffect(() => {
    if (!tokenData) return;
    const result = buyTokensAliceBond(spendUsd, tokenData.total_supply - tokenData.treasury_balance);
    setEstimatedTokens(result.tokensAwarded);
  }, [spendUsd, tokenData]);

  // Check if connected
  useEffect(() => {
    const handle = localStorage.getItem('hc_handle');
    setIsConnected(!!handle);
  }, []);

  const handleBuy = async () => {
    if (!isConnected) {
      window.location.href = '/api/auth/handcash';
      return;
    }
    if (spendUsd > MAX_SPEND_USD) {
      alert(`Max $${MAX_SPEND_USD}. Contact support for larger amounts.`);
      return;
    }
    // Purchase would happen here via API
    alert(`Would purchase ${estimatedTokens} tokens for $${spendUsd}`);
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Card */}
      <div
        onClick={() => setIsOpen(true)}
        className={`group cursor-pointer block border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black ${agent.accent.hoverBorder} transition-all hover:shadow-lg overflow-hidden`}>
        {/* Color accent bar */}
        <div className={`h-1.5 ${agent.accent.bg}`} />

        {/* Image/Video preview */}
        {(agent.image || agent.video) && (
          <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
            {agent.video ? (
              <video
                src={agent.video}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                autoPlay
                loop
                playsInline
              />
            ) : agent.image ? (
              <div className="relative w-full h-full">
                <Image src={agent.image} alt={agent.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : null}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-black tracking-tight uppercase">{agent.name}</h3>
              <span className={`inline-block mt-2 ${agent.accent.badgeBg} text-white px-2 py-0.5 text-[7px] font-bold font-mono uppercase tracking-widest`}>
                {agent.tag}
              </span>
            </div>
            <div className="text-right whitespace-nowrap">
              <div className={`${agent.accent.text} font-black text-lg`}>{agent.price}</div>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {agent.description}
          </p>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900">
            <span className={`${agent.accent.text} text-[10px] font-bold uppercase tracking-widest group-hover:tracking-[0.2em] transition-all`}>
              Buy Licence &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-md w-full p-6 space-y-4"
            >
              {/* Header */}
              <div>
                <h2 className="text-2xl font-black uppercase mb-1">{agent.name}</h2>
                <p className="text-xs text-zinc-500">{agent.tag}</p>
              </div>

              {/* Spend Input */}
              {loading ? (
                <div className="py-6 text-center text-sm text-zinc-500">Loading...</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Spend Amount (USD)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">$</span>
                      <input
                        type="number"
                        min="0.01"
                        max={MAX_SPEND_USD}
                        step="0.01"
                        value={spendUsd}
                        onChange={(e) => setSpendUsd(Math.min(parseFloat(e.target.value) || 0.01, MAX_SPEND_USD))}
                        className="flex-1 px-3 py-2 text-sm font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    {spendUsd > MAX_SPEND_USD && (
                      <p className="text-xs text-red-500">Max: ${MAX_SPEND_USD}</p>
                    )}
                  </div>

                  {/* Estimate */}
                  {estimatedTokens > 0 && (
                    <div className={`rounded px-3 py-2 ${agent.accent.bg} text-white`}>
                      <p className="text-xs opacity-75">You will receive</p>
                      <p className="text-lg font-black">{estimatedTokens.toLocaleString()} tokens</p>
                    </div>
                  )}

                  {/* Buy Button */}
                  <button
                    onClick={handleBuy}
                    disabled={spendUsd > MAX_SPEND_USD}
                    className={`w-full py-2.5 px-4 rounded font-bold uppercase text-sm tracking-widest transition-all ${
                      spendUsd > MAX_SPEND_USD
                        ? 'opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-700'
                        : `${agent.accent.bg} text-white hover:opacity-90`
                    }`}
                  >
                    {isConnected ? 'Buy Now' : 'Connect & Buy'}
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-xs font-mono text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
