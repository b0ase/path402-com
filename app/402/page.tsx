'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/components/WalletProvider';

interface TokenStats {
  currentPrice: number;
  treasuryBalance: number;
}

export default function WhitepaperPaywallPage() {
  const { wallet, connectHandCash } = useWallet();
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bsvUsdPrice, setBsvUsdPrice] = useState<number>(45);
  const [tokensToReceive, setTokensToReceive] = useState<number>(0);

  // Fetch token stats and BSV price
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, priceRes] = await Promise.all([
          fetch('/api/token/stats'),
          fetch('/api/price/bsv'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (priceRes.ok) {
          const priceData = await priceRes.json();
          if (priceData.bsv_usd) {
            setBsvUsdPrice(priceData.bsv_usd);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate tokens for $0.01 USD
  useEffect(() => {
    if (stats && bsvUsdPrice) {
      // $0.01 USD in sats
      const usdCents = 1; // $0.01
      const satsPerDollar = 100_000_000 / bsvUsdPrice;
      const spendSats = Math.ceil((usdCents / 100) * satsPerDollar);

      // Calculate tokens at current price
      const tokens = Math.floor(spendSats / stats.currentPrice);
      setTokensToReceive(Math.max(1, tokens));
    }
  }, [stats, bsvUsdPrice]);

  const handlePurchase = async () => {
    if (!wallet.connected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Calculate $0.01 USD in sats
      const usdCents = 1;
      const satsPerDollar = 100_000_000 / bsvUsdPrice;
      const spendSats = Math.ceil((usdCents / 100) * satsPerDollar);

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
        let errorText = data.error || 'Purchase failed';
        if (data.details?.includes('spending limit') || data.details?.includes('INSUFFICIENT')) {
          errorText = 'HandCash spending limit exceeded. Visit app.handcash.io to increase your limit.';
        }
        throw new Error(errorText);
      }

      setMessage({
        type: 'success',
        text: `Payment successful! You received ${data.amount.toLocaleString()} $PATH402 tokens. Downloading PDF...`
      });

      // Trigger PDF download
      setTimeout(() => {
        window.open('/whitepaper?download=true', '_blank');
      }, 1500);

    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Purchase failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16">
      <div className="max-w-[800px] mx-auto px-8 font-serif text-gray-900 dark:text-gray-100">

        {/* Title */}
        <header className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
            $402 Token Standard
          </h1>
          <p className="text-lg italic text-gray-700 dark:text-gray-300">
            A Peer-to-Peer System for Content Monetization<br />
            Through Unilateral Token Contracts
          </p>
        </header>

        {/* Paywall Section */}
        <section className="py-12 mb-10 text-center">
          {/* Big Round $402 Button */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={wallet.connected ? handlePurchase : connectHandCash}
              disabled={loading}
              className="w-96 h-96 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 relative flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 50%, #d4d4d4 100%)',
                boxShadow: `
                  0 25px 80px -20px rgba(0, 0, 0, 0.5),
                  0 15px 30px -15px rgba(0, 0, 0, 0.3),
                  inset 0 -10px 30px rgba(0, 0, 0, 0.12),
                  inset 0 10px 30px rgba(255, 255, 255, 0.9)
                `,
              }}
            >
              {/* Inner highlight */}
              <span
                className="absolute inset-6 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 50%)',
                }}
              />
              {/* Content */}
              <span className="relative z-10 flex flex-col items-center">
                {loading ? (
                  <svg className="animate-spin h-20 w-20 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <span className="text-8xl font-bold">$402</span>
                    <span className="text-lg mt-3 text-gray-600">
                      $0.01 → <span className="text-green-600 font-semibold">{tokensToReceive.toLocaleString()}</span>
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg max-w-sm mx-auto text-sm ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}
        </section>

        {/* Abstract */}
        <section className="mb-10">
          <h2 className="text-center text-sm font-bold uppercase tracking-wider mb-4 text-gray-900 dark:text-white">Abstract</h2>
          <p className="text-justify text-[15px] leading-relaxed indent-8 text-gray-800 dark:text-gray-200">
            We propose a protocol for turning any URL path into a priced, tokenized market. The $402 standard
            uses HTTP 402 "Payment Required" responses to create <em>unilateral token contracts</em>—offers
            that become binding agreements upon payment. Unlike traditional paywalls requiring subscriptions or
            advertising, $402 enables <em>atomic micropayments</em> where content access and token acquisition
            occur in a single transaction. The protocol introduces <em>sqrt_decay pricing</em>, a mathematical
            model that rewards early participants while maintaining market fairness. Combined with x402 payment
            verification for multi-chain support and MCP integration for AI agents, $402 creates a new primitive
            for the internet economy: content as property with deterministic pricing and automated enforcement.
          </p>
        </section>

        {/* Author */}
        <section className="text-center mb-10">
          <p className="text-base text-gray-600 dark:text-gray-400">
            Richard Boase<br />
            <a href="mailto:hello@b0ase.com" className="text-blue-600 dark:text-blue-400 hover:underline">hello@b0ase.com</a><br />
            <a href="https://b0ase.com" className="text-blue-600 dark:text-blue-400 hover:underline">b0ase.com</a>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            February 2026
          </p>
        </section>

        {/* Free Alternative */}
        <section className="text-center mb-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Or read the full whitepaper online for free:
          </p>
          <Link
            href="/whitepaper"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Read Online →
          </Link>
        </section>

        {/* Table of Contents Preview */}
        <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/30">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
            What's Inside
          </h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <li>Introduction — The HTTP 402 opportunity</li>
            <li>The Problem — Broken monetization &amp; AI agents</li>
            <li>The $402 Solution — $addresses &amp; discovery protocol</li>
            <li>Unilateral Contract Theory — Legal framework</li>
            <li>Token Economics — sqrt_decay pricing model</li>
            <li>x402 Facilitator Protocol — Multi-chain support</li>
            <li>AI Agent Integration — MCP tools (16 tools)</li>
            <li>Investment Thesis — Market opportunity</li>
            <li>Roadmap — Q1-Q4 2026</li>
            <li>Conclusion — The future of web payments</li>
          </ol>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-10 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>
            <a href="https://path402.com" className="text-blue-600 dark:text-blue-400 hover:underline">path402.com</a>
            {' · '}
            <Link href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">Documentation</Link>
            {' · '}
            <Link href="/exchange" className="text-blue-600 dark:text-blue-400 hover:underline">Exchange</Link>
          </p>
        </footer>

      </div>
    </div>
  );
}
