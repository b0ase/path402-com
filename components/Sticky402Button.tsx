'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { usePathname } from 'next/navigation';

interface TokenStats {
  currentPrice: number;
  treasuryBalance: number;
}

export function Sticky402Button() {
  const { wallet, connectHandCash } = useWallet();
  const pathname = usePathname();
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [bsvUsdPrice, setBsvUsdPrice] = useState<number>(45);
  const [tokensToReceive, setTokensToReceive] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const usdCents = 1;
      const satsPerDollar = 100_000_000 / bsvUsdPrice;
      const spendSats = Math.ceil((usdCents / 100) * satsPerDollar);
      const tokens = Math.floor(spendSats / stats.currentPrice);
      setTokensToReceive(Math.max(1, tokens));
    }
  }, [stats, bsvUsdPrice]);

  // Don't show on /402 page (it has its own big button)
  if (pathname === '/402') {
    return null;
  }

  const handlePurchase = async () => {
    if (!wallet.connected) {
      connectHandCash();
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
        if (data.code === 'NO_ORDINALS_ADDRESS') {
          // Redirect to account page to derive address
          window.location.href = '/account';
          return;
        }

        // Check for missing PAY permission - need to reconnect
        const errorStr = JSON.stringify(data);
        if (errorStr.includes('PAY') || errorStr.includes('Permission not established')) {
          setError('Reconnect wallet to enable payments');
          setTimeout(() => {
            connectHandCash(); // Trigger reconnection
          }, 1500);
          setTimeout(() => setError(null), 5000);
          return;
        }

        // Show error to user
        const errorMsg = data.details || data.error || 'Purchase failed';
        setError(errorMsg);
        setTimeout(() => setError(null), 5000);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Purchase failed');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Success notification */}
      {showSuccess && (
        <div className="absolute bottom-full right-0 mb-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap animate-fade-in">
          +{tokensToReceive.toLocaleString()} $PATH402
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="absolute bottom-full right-0 mb-2 bg-red-500 text-white px-3 py-2 rounded text-xs max-w-[200px] animate-fade-in">
          {error}
        </div>
      )}

      {/* Sticky button */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-20 h-20 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center justify-center relative"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 50%, #d4d4d4 100%)',
          boxShadow: `
            0 10px 40px -10px rgba(0, 0, 0, 0.5),
            0 8px 20px -10px rgba(0, 0, 0, 0.3),
            inset 0 -4px 12px rgba(0, 0, 0, 0.12),
            inset 0 4px 12px rgba(255, 255, 255, 0.9)
          `,
        }}
        title={wallet.connected ? `Buy $PATH402 ($0.01 → ${tokensToReceive.toLocaleString()} tokens)` : 'Connect wallet to buy $PATH402'}
      >
        {/* Inner highlight */}
        <span
          className="absolute inset-2 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 50%)',
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex flex-col items-center">
          {loading ? (
            <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span className="text-lg font-bold">$402</span>
              <span className="text-[8px] text-gray-500">
                {tokensToReceive > 0 ? `+${tokensToReceive.toLocaleString()}` : '$0.01'}
              </span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
