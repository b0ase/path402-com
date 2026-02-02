'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOKEN_CONFIG } from '@/lib/types';

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

  return (
    <main className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Token Registry</h1>
          <p className="text-gray-400 text-lg">
            Cap table for {TOKEN_CONFIG.symbol} token holders
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="border border-gray-800 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Supply</div>
            <div className="text-2xl font-bold">{formatNumber(TOKEN_CONFIG.totalSupply)}</div>
          </div>
          <div className="border border-gray-800 p-6">
            <div className="text-gray-400 text-sm mb-2">Circulating</div>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(data?.stats.totalCirculating || 0)}
            </div>
          </div>
          <div className="border border-gray-800 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Staked</div>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatNumber(data?.stats.totalStaked || 0)}
            </div>
          </div>
          <div className="border border-gray-800 p-6">
            <div className="text-gray-400 text-sm mb-2">Holders</div>
            <div className="text-2xl font-bold">
              {loading ? '...' : data?.stats.totalHolders || 0}
            </div>
          </div>
        </div>

        {/* Treasury Info */}
        <div className="border border-gray-800 p-6 mb-12">
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
        </div>

        {/* Cap Table */}
        <div className="border border-gray-800">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-medium">Token Holders</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading cap table...</div>
          ) : !data?.holders?.length ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No token holders yet</div>
              <Link
                href="/token"
                className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
              >
                Buy Tokens
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={holder.address} className="border-b border-gray-800 hover:bg-gray-900/50">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="mt-12 border border-gray-800 p-6">
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
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/token"
            className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          >
            Buy Tokens
          </Link>
          <a
            href={TOKEN_CONFIG.marketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-600 text-white hover:border-white transition-colors"
          >
            View on 1SatOrdinals
          </a>
        </div>
      </div>
    </main>
  );
}
