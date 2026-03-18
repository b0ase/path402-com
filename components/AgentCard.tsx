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
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-5xl w-full overflow-hidden"
            >
              {/* Landscape Layout: Media Left, Content Right */}
              <div className="flex flex-col md:flex-row">
                {/* Media Section */}
                {(agent.image || agent.video) && (
                  <div className="relative w-full md:w-2/5 h-64 md:h-96 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                    {agent.video ? (
                      <video
                        src={agent.video}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : agent.image ? (
                      <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                    ) : null}
                  </div>
                )}

                {/* Content */}
                <div className="p-8 space-y-6 flex-1">
                {/* Header */}
                <div>
                  <h2 className="text-3xl font-black uppercase mb-2">{agent.name}</h2>
                  <p className={`text-sm font-mono ${agent.accent.text}`}>{agent.tag}</p>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-sm text-zinc-500">Loading price data...</div>
                ) : (
                  <>
                    {/* Pricing Info */}
                    <div className={`rounded-lg p-4 ${agent.accent.bg} text-white space-y-3`}>
                      <div>
                        <p className="text-xs opacity-75 mb-1">ONE PENNY GETS YOU</p>
                        <p className="text-3xl font-black">
                          {(buyTokensAliceBond(0.01, tokenData?.total_supply ? tokenData.total_supply - tokenData.treasury_balance : 0).tokensAwarded).toLocaleString()}
                        </p>
                        <p className="text-xs opacity-75">tokens for $0.01</p>
                      </div>
                      <p className="text-xs opacity-90 border-t border-white/20 pt-3">
                        As more tokens are purchased, you get fewer tokens per penny. Early buyers get the best deal on this ascending bonding curve.
                      </p>
                    </div>

                    {/* Spend Input Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">
                          How Much Do You Want To Spend?
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black">$</span>
                          <input
                            type="number"
                            min="0.01"
                            max={MAX_SPEND_USD}
                            step="0.01"
                            value={spendUsd}
                            onChange={(e) => setSpendUsd(Math.min(parseFloat(e.target.value) || 0.01, MAX_SPEND_USD))}
                            className="flex-1 px-4 py-3 text-2xl font-black font-mono bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                          <span className="text-sm text-zinc-500">USD</span>
                        </div>
                        {spendUsd > MAX_SPEND_USD && (
                          <p className="text-xs text-red-500 mt-2">Max: ${MAX_SPEND_USD} (KYC required for larger amounts)</p>
                        )}
                      </div>

                      {/* Visual Breakdown */}
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Your Purchase</p>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">Amount:</span>
                          <span className="text-xl font-black">${spendUsd.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-baseline border-t border-zinc-200 dark:border-zinc-800 pt-2">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">Tokens you'll get:</span>
                          <span className={`text-2xl font-black ${agent.accent.text}`}>
                            {estimatedTokens.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs text-zinc-500">
                          <span>Price per token:</span>
                          <span className="font-mono">${(spendUsd / estimatedTokens).toFixed(10)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={handleBuy}
                      disabled={spendUsd > MAX_SPEND_USD || estimatedTokens === 0}
                      className={`w-full py-3.5 px-6 rounded-lg font-bold uppercase text-base tracking-widest transition-all ${
                        spendUsd > MAX_SPEND_USD || estimatedTokens === 0
                          ? 'opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                          : `${agent.accent.bg} text-white hover:opacity-90 hover:shadow-lg`
                      }`}
                    >
                      {isConnected ? `Buy ${estimatedTokens.toLocaleString()} Tokens` : 'Connect HandCash & Buy'}
                    </button>
                  </>
                )}

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 text-xs font-mono text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
