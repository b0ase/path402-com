'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { buyTokensAliceBond } from '@/lib/tokens/pricing';

const MAX_SPEND_USD = 10000;
const DEMO_AGENT = {
  name: 'ALEX BONES',
  tag: 'F.NEWS',
  description: 'THE JEPSTEIN FILES: GLOBALIST PLOT REVEALED',
  video: 'https://pub-fee9eb6b685a48f2aa263c104838ce5e.r2.dev/videos/alex_bones.mp4',
  tokenAddress: 'ip_fnews',
  tokenName: '$FNEWS',
};

export default function VendingMachinePage() {
  const [spendUsd, setSpendUsd] = useState(0.01);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [tokensPerPenny, setTokensPerPenny] = useState(0);

  // Mock token data
  const tokenData = {
    total_supply: 1_000_000_000,
    treasury_balance: 950_000_000, // 5% sold
  };

  // Calculate tokens for spend amount
  useEffect(() => {
    const result = buyTokensAliceBond(spendUsd, tokenData.total_supply - tokenData.treasury_balance);
    setEstimatedTokens(result.tokensAwarded);
  }, [spendUsd]);

  // Calculate tokens per penny
  useEffect(() => {
    const result = buyTokensAliceBond(0.01, tokenData.total_supply - tokenData.treasury_balance);
    setTokensPerPenny(result.tokensAwarded);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center border-b border-zinc-200 dark:border-zinc-800 pb-8"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Showcase</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            VENDING<span className="text-zinc-300 dark:text-zinc-800">.MACHINE</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Token-gated IP licensing vending machine. Click an agent card on the market to buy creation rights using the bonding curve pricing model.
          </p>
        </motion.div>

        {/* Vending Machine Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden max-w-5xl mx-auto"
        >
          {/* Landscape Layout */}
          <div className="flex flex-col md:flex-row">
            {/* Video Left */}
            <div className="w-full md:w-2/5 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-8">
              <div className="w-full border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-black aspect-video">
                <video
                  src={DEMO_AGENT.video}
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>

            {/* Content Right */}
            <div className="flex-1 p-8 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-black uppercase mb-2">{DEMO_AGENT.name}</h2>
                <p className="text-sm font-mono text-red-600">{DEMO_AGENT.tag}</p>
              </div>

              {/* Pricing Info */}
              <div className="rounded-lg p-4 bg-red-600 text-white space-y-3">
                <div>
                  <p className="text-xs opacity-75 mb-1">ONE PENNY GETS YOU</p>
                  <p className="text-3xl font-black">
                    {tokensPerPenny.toLocaleString()}
                  </p>
                  <p className="text-xs opacity-75">tokens for $0.01</p>
                </div>
                <p className="text-xs opacity-90 border-t border-white/20 pt-3">
                  As more tokens are purchased, you get fewer tokens per penny. Early buyers get the best deal on this ascending bonding curve.
                </p>
              </div>

              {/* Spend Input */}
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
                      onChange={(e) =>
                        setSpendUsd(Math.min(parseFloat(e.target.value) || 0.01, MAX_SPEND_USD))
                      }
                      className="flex-1 px-4 py-3 text-2xl font-black font-mono bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-sm text-zinc-500">USD</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    Your Purchase
                  </p>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Amount:</span>
                    <span className="text-xl font-black">${spendUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-zinc-200 dark:border-zinc-800 pt-2">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Tokens you'll get:
                    </span>
                    <span className="text-2xl font-black text-red-600">
                      {estimatedTokens.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-zinc-500">
                    <span>Price per token:</span>
                    <span className="font-mono">
                      ${estimatedTokens > 0 ? (spendUsd / estimatedTokens).toFixed(10) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <button
                disabled={spendUsd > MAX_SPEND_USD}
                className={`w-full py-3.5 px-6 rounded-lg font-bold uppercase text-base tracking-widest transition-all ${
                  spendUsd > MAX_SPEND_USD
                    ? 'opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-700'
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                }`}
              >
                Buy {estimatedTokens.toLocaleString()} Tokens
              </button>

              {spendUsd > MAX_SPEND_USD && (
                <p className="text-xs text-red-500 text-center">
                  Max: ${MAX_SPEND_USD} (KYC required for larger amounts)
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 space-y-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Alice Bond */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-2">
              <h3 className="font-black uppercase text-sm">Alice Bond Curve</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Ascending bonding curve. Early buyers get more tokens per dollar. Price increases linearly as supply depletes.
              </p>
            </div>

            {/* IP Licences */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-2">
              <h3 className="font-black uppercase text-sm">IP Licences</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Buy creation rights to derivative works. Build on existing universes with proper licensing tiers and revenue caps.
              </p>
            </div>

            {/* Tokenomics */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-2">
              <h3 className="font-black uppercase text-sm">Tokenomics</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                1B token supply per IP. Revenue split: 90% issuer, 10% platform. Max $10K per purchase (KYC required above).
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 space-y-4">
            <h2 className="text-2xl font-black uppercase">How It Works</h2>
            <ol className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-3">
                <span className="font-black text-zinc-900 dark:text-zinc-100">1.</span>
                <span>
                  Visit <code className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-[11px]">/market</code> and click
                  any agent card
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-zinc-900 dark:text-zinc-100">2.</span>
                <span>The vending machine modal opens with video on left, purchase interface on right</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-zinc-900 dark:text-zinc-100">3.</span>
                <span>See "ONE PENNY GETS YOU X TOKENS" showing current bonding curve price</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-zinc-900 dark:text-zinc-100">4.</span>
                <span>Enter custom spend amount ($0.01–$10,000) and watch tokens update in real-time</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-zinc-900 dark:text-zinc-100">5.</span>
                <span>Connect HandCash wallet and buy tokens for IP creation licence</span>
              </li>
            </ol>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <p>
              This is a showcase of the vending machine concept. Visit{' '}
              <code className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-[11px]">/market</code> to use the
              live system.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
