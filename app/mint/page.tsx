'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import type { RegisterTokenRequest, AccessMode } from '@/lib/tokens/types';

type MintType = 'domain' | 'email' | 'paymail' | 'content';
type MintStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function MintPage() {
  const [mintType, setMintType] = useState<MintType>('content');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [supply, setSupply] = useState('1000000000');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [dividendRate, setDividendRate] = useState(100);
  const [accessMode, setAccessMode] = useState<AccessMode>('token');
  const [accessRate, setAccessRate] = useState(1);
  const [handle, setHandle] = useState('');
  const [status, setStatus] = useState<MintStatus>('idle');
  const [error, setError] = useState('');
  const [createdToken, setCreatedToken] = useState<{ address: string; name: string } | null>(null);

  // Check for stored handle
  useEffect(() => {
    const stored = localStorage.getItem('handcash_handle') || localStorage.getItem('wallet_handle');
    if (stored) setHandle(stored);
  }, []);

  const getPlaceholder = () => {
    switch (mintType) {
      case 'domain': return 'alice.com';
      case 'email': return 'alice@example.com';
      case 'paymail': return 'alice@handcash.io';
      case 'content': return '$parent/child-name';
    }
  };

  const getTokenAddress = useCallback(() => {
    if (!identifier) return '';
    if (identifier.startsWith('$')) return identifier;
    switch (mintType) {
      case 'domain': return `$${identifier}`;
      case 'email': return `$${identifier.replace('@', '/')}`;
      case 'paymail': return `$${identifier.split('@')[0]}`;
      case 'content': return identifier.startsWith('$') ? identifier : `$${identifier}`;
    }
  }, [identifier, mintType]);

  // Auto-detect parent from address (e.g., $zerodice/game-1 → parent is $zerodice)
  const getParentAddress = useCallback(() => {
    const addr = getTokenAddress();
    const slashIdx = addr.indexOf('/', 1); // skip leading $
    if (slashIdx > 0) return addr.substring(0, slashIdx);
    return '';
  }, [getTokenAddress]);

  const totalTokens = parseInt(supply) || 0;
  const baseUnits = Math.floor(totalTokens / accessRate);
  const hours = Math.floor(baseUnits / 3600);
  const mins = Math.floor((baseUnits % 3600) / 60);
  const secs = baseUnits % 60;

  const handleSubmit = async () => {
    if (!handle) {
      setError('Enter your wallet handle to mint');
      return;
    }
    if (!identifier) {
      setError('Enter an identifier');
      return;
    }

    // issuer_address is required by the API — fall back to handle@handcash.io
    const resolvedIssuerAddress = paymentAddress || `${handle}@handcash.io`;

    setStatus('submitting');
    setError('');

    const address = getTokenAddress();
    const parentAddress = getParentAddress();

    const body: RegisterTokenRequest = {
      address,
      name: name || identifier,
      description: description || undefined,
      content_type: mintType,
      issuer_address: resolvedIssuerAddress,
      pricing_model: 'alice_bond',
      base_price_sats: 500,
      max_supply: totalTokens,
      issuer_share_bps: 8000,
      access_mode: accessMode,
      ...(parentAddress ? { parent_address: parentAddress, parent_share_bps: 5000 } : {}),
      ...(dividendRate < 100 ? {
        dividend_policy: {
          enabled: true,
          stakers_share_bps: dividendRate * 100,
          issuer_share_bps: (100 - dividendRate) * 100,
        }
      } : {
        dividend_policy: { enabled: true, stakers_share_bps: 10000 }
      }),
      // Wire usage_pricing for usage/hybrid access modes
      ...((accessMode === 'usage' || accessMode === 'hybrid') ? {
        usage_pricing: {
          unit_ms: 1000,
          price_sats_per_unit: accessRate,
          prepay_ms: 60000,
        }
      } : {}),
    };

    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-handle': handle,
          'x-wallet-provider': 'handcash',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed (${res.status})`);
        setStatus('error');
        return;
      }

      setCreatedToken({ address: data.token?.address || address, name: data.token?.name || name });
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setStatus('error');
    }
  };

  const isAuthenticated = !!handle;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-16 max-w-[1920px] mx-auto">
        {/* PageHeader */}
        <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6 flex items-end justify-between overflow-hidden relative">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isAuthenticated ? 'bg-green-500' : 'bg-purple-500'}`} />
              {isAuthenticated ? `Minting as ${handle}` : 'Token Creation Protocol'}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              MINT<span className="text-zinc-300 dark:text-zinc-800">.SYS</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-500 max-w-lg"
            >
              <b>Deploy BSV-21 Tokens.</b> Create tradable access tokens for domains, identities, and content.
            </motion.div>
          </div>
        </header>

        {/* Auth Banner — show handle input if not authenticated */}
        {!isAuthenticated && (
          <div className="mb-8 border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-center gap-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter your HandCash handle to mint..."
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && handle) {
                  localStorage.setItem('wallet_handle', handle);
                }
              }}
              className="flex-1 bg-transparent text-sm text-amber-600 dark:text-amber-400 placeholder-amber-600/50 dark:placeholder-amber-400/50 focus:outline-none"
            />
            <button
              onClick={() => { if (handle) localStorage.setItem('wallet_handle', handle); }}
              className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Connect
            </button>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && createdToken && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border border-green-500/30 bg-green-500/5 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                Token Created
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-4">
              <span className="font-mono font-bold">{createdToken.address}</span> is now live on the $402 network.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://402network.online/tokens/${encodeURIComponent(createdToken.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                View on 402network.online
              </a>
              <button
                onClick={() => { setStatus('idle'); setCreatedToken(null); setIdentifier(''); setName(''); setDescription(''); }}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider hover:border-black dark:hover:border-white transition-colors"
              >
                Mint Another
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/5 px-4 py-3 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {error}
            </span>
          </div>
        )}

        {/* 3-Column Form Layout */}
        {status !== 'success' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Column 1: Asset Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Asset Details
              </h3>
              <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-950 border-l-2 border-zinc-900 dark:border-white">
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  Define what you&apos;re tokenizing. This creates a tradable BSV-21 token that represents access rights to your asset.
                </p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-6 space-y-4">
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(['domain', 'email', 'paymail', 'content'] as MintType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => { setMintType(type); setIdentifier(''); }}
                        className={`px-2 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${mintType === type
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'bg-white dark:bg-black text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <p className="text-xs text-zinc-500 mt-1">The {mintType} you want to tokenize</p>
                </div>

                {/* Auto-computed token address */}
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Token Address</label>
                  <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-sm">
                    {getTokenAddress() || '$...'}
                  </div>
                  {getParentAddress() && (
                    <p className="text-xs text-purple-500 mt-1">
                      Child of <span className="font-bold">{getParentAddress()}</span> (50% revenue cascade)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Token"
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Total Supply</label>
                  <input
                    type="number"
                    value={supply}
                    onChange={(e) => setSupply(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors font-mono"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Total tokens to create (immutable)</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this token provide access to?"
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Payment & Economics */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Payment & Economics
              </h3>
              <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-950 border-l-2 border-zinc-900 dark:border-white">
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  Your payment address is permanently inscribed in the token. All token sales route payments here. Dividends are auto-distributed to stakers.
                </p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Payment Address</label>
                  <input
                    type="text"
                    value={paymentAddress}
                    onChange={(e) => setPaymentAddress(e.target.value)}
                    placeholder="alice@handcash.io or 1AliceXYZ..."
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-mono text-sm"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Canonical address inscribed in token</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Dividend Rate</label>
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 mb-2">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-black dark:text-white font-mono">{dividendRate}%</span>
                      <span className="text-xs text-zinc-500">to stakers</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={dividendRate}
                      onChange={(e) => setDividendRate(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-2">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">Percentage auto-distributed to stakers on all payments</p>
                </div>

                <div className="border-l-2 border-black dark:border-white pl-3 py-2 bg-zinc-50 dark:bg-zinc-950">
                  <p className="text-xs font-medium text-zinc-900 dark:text-white mb-1">How dividends work</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {dividendRate === 100
                      ? 'All payments are automatically distributed to stakers proportionally.'
                      : `${dividendRate}% of all payments are distributed to stakers. ${100 - dividendRate}% goes to the payment address.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Access Settings */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Access Settings
              </h3>
              <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-950 border-l-2 border-zinc-900 dark:border-white">
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  Control how tokens grant access to your content. Choose the model that fits your monetization strategy.
                </p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Access Mode</label>
                  <div className="grid grid-cols-1 gap-2">
                    {([
                      { id: 'token' as AccessMode, title: 'Token Gate', desc: 'Hold tokens to access content' },
                      { id: 'usage' as AccessMode, title: 'Pay-per-Use', desc: 'Metered billing per second' },
                      { id: 'hybrid' as AccessMode, title: 'Hybrid', desc: 'Token gate + usage billing' },
                    ]).map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setAccessMode(mode.id)}
                        className={`px-3 py-2 text-left border transition-colors ${accessMode === mode.id
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'bg-white dark:bg-black text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">{mode.title}</div>
                        <div className="text-xs opacity-70">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {accessMode !== 'token' && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Burn Rate</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={accessRate}
                        onChange={(e) => setAccessRate(parseInt(e.target.value) || 1)}
                        min="1"
                        className="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors font-mono"
                      />
                      <span className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono text-xs">per second</span>
                    </div>
                    <div className="mt-2 border-l-2 border-black dark:border-white pl-3 py-2 bg-zinc-50 dark:bg-zinc-950">
                      <p className="text-xs font-medium text-zinc-900 dark:text-white mb-1">Total access time</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {hours.toLocaleString()}h {mins}m {secs}s total
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-6 space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'submitting' || !identifier}
                    className={`block w-full py-3 font-semibold text-center text-sm transition-colors ${
                      status === 'submitting'
                        ? 'bg-zinc-500 text-white cursor-wait'
                        : !identifier
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200'
                    }`}
                  >
                    {status === 'submitting' ? 'Creating Token...' : 'Create Token'}
                  </button>
                  <p className="text-xs text-center text-zinc-500">
                    {isAuthenticated
                      ? 'Token will be registered on the $402 network'
                      : 'Enter your handle above to mint'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
