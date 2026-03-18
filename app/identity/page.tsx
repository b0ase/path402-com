'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { formatSupply } from '@/lib/token';
import { initiateKyc, type KycStatus } from '@/lib/kyc/status';
import type { StrengthScore } from '@/lib/strand-strength';

interface IdentityToken {
  id: string;
  holder_id: string;
  symbol: string;
  token_id: string;
  issuer_address: string;
  total_supply: string;
  decimals: number;
  access_rate: number;
  inscription_data: Record<string, unknown> | null;
  broadcast_txid: string | null;
  broadcast_status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface IdentityStrand {
  id: string;
  provider: string;
  strand_type: string;
  strand_subtype: string | null;
  label: string | null;
  source: string;
  on_chain: boolean;
  strand_txid: string | null;
  created_at: string;
}

const LEVEL_COLORS: Record<string, string> = {
  none: 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30',
  basic: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  verified: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  strong: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
  sovereign: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
};

function StrengthBadge({ strength, strandCount }: { strength: StrengthScore; strandCount: number }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-mono ${LEVEL_COLORS[strength.level] || LEVEL_COLORS.none}`}>
      <span className="font-bold">$401 Lv.{strength.levelNumber} {strength.label}</span>
      <span className="opacity-60">&middot;</span>
      <span>{strandCount} strand{strandCount !== 1 ? 's' : ''}</span>
      <span className="opacity-60">&middot;</span>
      <span>{strength.score}pts</span>
    </div>
  );
}

function StrandList({ strands }: { strands: IdentityStrand[] }) {
  if (strands.length === 0) return null;

  return (
    <div className="space-y-1">
      {strands.map((s) => (
        <div key={s.id} className="flex items-center justify-between bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase">
              {s.provider}
            </span>
            <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
              {s.strand_type}{s.strand_subtype ? `/${s.strand_subtype}` : ''}
            </span>
            {s.label && (
              <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[120px]">
                {s.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
              {s.source}
            </span>
            {s.on_chain ? (
              <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">on-chain</span>
            ) : (
              <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-700 uppercase tracking-widest">local</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    local: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    pending: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
    confirmed: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
  };
  return (
    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border ${colors[status] || 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'}`}>
      {status}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-[10px] uppercase tracking-widest"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function PreMintView({ onMint, isMinting, mintError }: {
  onMint: (symbol: string) => void;
  isMinting: boolean;
  mintError: string | null;
}) {
  const [symbolInput, setSymbolInput] = useState('');

  const rawName = symbolInput.replace(/^\$/, '').toUpperCase();
  const preview = rawName ? `$${rawName}` : '';
  const isValid = rawName.length >= 1 && rawName.length <= 20 && /^[A-Z0-9_]+$/.test(rawName);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between min-h-[400px]">
        <div>
          <h3 className="text-xl font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-1">
            Mint Digital DNA
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
            Resolve 401 — deploy your identity token on BSV
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                Symbol
              </label>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-zinc-400 dark:text-zinc-600">$</span>
                <input
                  type="text"
                  value={symbolInput}
                  onChange={(e) => setSymbolInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 20))}
                  placeholder="YOURNAME"
                  className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 font-mono text-xl text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                  disabled={isMinting}
                />
              </div>
              {preview && (
                <div className="mt-2 text-sm font-mono text-indigo-600 dark:text-indigo-400">
                  {preview}
                </div>
              )}
              {symbolInput && !isValid && (
                <div className="mt-2 text-xs font-mono text-red-500">
                  A-Z, 0-9, _ only. 1-20 characters.
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Supply</div>
                <div className="text-sm text-zinc-900 dark:text-white font-mono font-bold">1,000,000,000</div>
              </div>
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Decimals</div>
                <div className="text-sm text-zinc-900 dark:text-white font-mono font-bold">8</div>
              </div>
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Rate</div>
                <div className="text-sm text-zinc-900 dark:text-white font-mono font-bold">1 tok/sec</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {mintError && (
            <div className="mb-3 text-xs font-mono text-red-500 bg-red-500/10 border border-red-500/20 p-2">
              {mintError}
            </div>
          )}
          <button
            onClick={() => onMint(preview)}
            disabled={!isValid || isMinting}
            className={`w-full py-4 font-mono font-bold uppercase text-sm tracking-widest transition-all ${
              !isValid || isMinting
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200'
            }`}
          >
            {isMinting ? 'Inscribing Genesis...' : 'Mint Digital DNA'}
          </button>
          <p className="text-center text-[9px] text-zinc-400 dark:text-zinc-600 mt-3 font-mono uppercase tracking-widest">
            BSV21 inscription stored in Supabase &middot; broadcast when wallet ready
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6 flex items-start gap-4">
          <div className="w-5 h-5 mt-1 shrink-0 text-yellow-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-mono font-bold uppercase mb-2">Video P2P Fuel</h4>
            <p className="text-zinc-500 text-xs font-mono leading-relaxed">
              Tokens stream second-by-second during video calls.
              Both peers exchange tokens — 1 token/sec each direction.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6 flex items-start gap-4">
          <div className="w-5 h-5 mt-1 shrink-0 text-zinc-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-mono font-bold uppercase mb-2">Access Control</h4>
            <p className="text-zinc-500 text-xs font-mono leading-relaxed">
              Set minimum token balance for peers to contact you.
              Raise your price to avoid spam.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6 flex items-start gap-4">
          <div className="w-5 h-5 mt-1 shrink-0 text-zinc-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-mono font-bold uppercase mb-2">Cloud Custody</h4>
            <p className="text-zinc-500 text-xs font-mono leading-relaxed">
              Identity token stored in Supabase.
              Broadcast to BSV when your wallet is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostMintView({ identity, strands, strength }: {
  identity: IdentityToken;
  strands: IdentityStrand[];
  strength: StrengthScore | null;
}) {
  const [kycStatus, setKycStatus] = useState<KycStatus>({ isVerified: false, status: 'unverified' });
  const [kycInitiating, setKycInitiating] = useState(false);

  // Check KYC status on mount
  useEffect(() => {
    const checkKyc = async () => {
      try {
        const response = await fetch('/api/kyc/status');
        if (response.ok) {
          const data = await response.json();
          setKycStatus(data);
        }
      } catch (error) {
        console.error('Failed to check KYC status:', error);
      }
    };
    checkKyc();
  }, []);

  // Derive verification status from strands
  const isKycVerified = strands.some(s => s.strand_type === 'kyc' && s.strand_subtype === 'veriff');
  const isGithubLinked = strands.some(s => s.provider === 'github');

  const handleKyc = async () => {
    setKycInitiating(true);
    try {
      const verificationUrl = await initiateKyc('');
      window.location.href = verificationUrl;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to initiate KYC');
      setKycInitiating(false);
    }
  };

  const handleGithubConnect = () => {
    window.location.href = '/api/auth/github';
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Identity Header */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-mono font-bold text-zinc-900 dark:text-white">{identity.symbol}</h2>
              <StatusBadge status={identity.broadcast_status} />
            </div>
            {strength ? (
              <div className="mt-2">
                <StrengthBadge strength={strength} strandCount={strands.length} />
              </div>
            ) : (
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">No identity strands linked</span>
            )}
          </div>

          <div className="text-right">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Total Supply</div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatSupply(identity.total_supply, identity.decimals)}
            </div>
          </div>
        </div>
      </div>

      {/* VERIFY IDENTITY - KYC Section */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Verify Identity</div>
            <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white uppercase mb-1">Veriff KYC</h3>
            <p className="text-xs font-mono text-zinc-500">
              {isKycVerified ? (
                <span className="text-emerald-600 dark:text-emerald-400">✓ Verified — Sovereign Lv.4 (+10pts)</span>
              ) : (
                <span>Complete identity verification via Veriff to unlock high-value purchases and dividend claims</span>
              )}
            </p>
          </div>
          {!isKycVerified && (
            <button
              onClick={handleKyc}
              disabled={kycInitiating}
              className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 font-mono text-xs uppercase tracking-widest rounded transition-all shrink-0"
            >
              {kycInitiating ? 'Redirecting...' : 'Verify Now'}
            </button>
          )}
        </div>
      </div>

      {/* LINK ACCOUNTS - Social OAuth Section */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6">
        <div className="mb-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Link Accounts</div>
          <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white uppercase">Social Verification</h3>
          <p className="text-xs font-mono text-zinc-500 mt-2">Link GitHub, Twitter, and other accounts to strengthen your identity</p>
        </div>

        <div className="space-y-2">
          {/* GitHub */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm">GitHub</span>
              <span className="text-[9px] font-mono text-zinc-500">+2pts (Basic)</span>
            </div>
            {isGithubLinked ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">✓ Linked</span>
            ) : (
              <button
                onClick={handleGithubConnect}
                className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 font-mono text-xs uppercase tracking-widest rounded transition-all"
              >
                Connect →
              </button>
            )}
          </div>

          {/* Twitter - Coming Soon */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded opacity-60">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm">Twitter</span>
              <span className="text-[9px] font-mono text-zinc-500">+1pt</span>
            </div>
            <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs uppercase tracking-widest">coming soon</span>
          </div>
        </div>
      </div>

      {/* ELIGIBILITY - What Unlocks */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="mb-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Eligibility</div>
          <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white uppercase">What This Unlocks</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`p-3 border rounded ${strength?.level === 'basic' ? 'bg-blue-500/10 border-blue-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
            <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Basic</div>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Identity token + 1 strand</p>
          </div>

          <div className={`p-3 border rounded ${strength?.level === 'verified' ? 'bg-purple-500/10 border-purple-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
            <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Verified</div>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">ID document + vending machine</p>
          </div>

          <div className={`p-3 border rounded ${strength?.level === 'strong' ? 'bg-amber-500/10 border-amber-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
            <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Strong</div>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Paid signing + attestation</p>
          </div>

          <div className={`p-3 border rounded ${strength?.level === 'sovereign' ? 'bg-emerald-500/10 border-emerald-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
            <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Sovereign</div>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">KYC verified + all unlocks</p>
          </div>
        </div>
      </div>

      {/* STRANDS - Verification Details */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6">
        <div className="mb-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Verification Details</div>
          <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white uppercase">Strands</h3>
        </div>

        {strands.length > 0 ? (
          <StrandList strands={strands} />
        ) : (
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
            No strands linked yet. Complete KYC or link a social account to build your identity.
          </p>
        )}
      </div>

      {/* TOKEN DATA - Raw Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Token ID</div>
          <div className="text-xs font-mono text-zinc-900 dark:text-white break-all">
            {identity.token_id.slice(0, 16)}...
            <CopyButton text={identity.token_id} />
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Broadcast</div>
          <div className="text-xs font-mono text-zinc-900 dark:text-white">
            {identity.broadcast_txid ? (
              <>
                {identity.broadcast_txid.slice(0, 16)}...
                <CopyButton text={identity.broadcast_txid} />
              </>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-600">Not broadcast yet</span>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Created</div>
          <div className="text-xs font-mono text-zinc-900 dark:text-white">
            {new Date(identity.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* BSV21 Inscription */}
      {identity.inscription_data && (
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">BSV21 Inscription</div>
            <CopyButton text={JSON.stringify(identity.inscription_data, null, 2)} />
          </div>
          <pre className="text-xs font-mono text-zinc-500 overflow-x-auto whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
            {JSON.stringify(identity.inscription_data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function IdentityPage() {
  const { wallet, connectHandCash } = useWallet();
  const [identity, setIdentity] = useState<IdentityToken | null>(null);
  const [strands, setStrands] = useState<IdentityStrand[]>([]);
  const [strength, setStrength] = useState<StrengthScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);

  const fetchIdentity = useCallback(async () => {
    try {
      const res = await fetch('/api/client/identity');
      const data = await res.json();
      setIdentity(data.identity);
      setStrands(data.strands || []);
      setStrength(data.strength || null);
    } catch {
      // Identity not found
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      fetchIdentity();
    } else {
      setLoading(false);
    }
  }, [wallet.connected, fetchIdentity]);

  const handleMint = async (symbol: string) => {
    setIsMinting(true);
    setMintError(null);
    try {
      const res = await fetch('/api/client/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMintError(data.error || 'Mint failed');
        return;
      }
      setIdentity(data.identity);
      setStrands(data.strands || []);
      setStrength(data.strength || null);
    } catch {
      setMintError('Network error');
    } finally {
      setIsMinting(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16">
        <div className="max-w-[1920px] mx-auto text-center">
          <h1 className="text-2xl font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
            Digital DNA
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-6">
            HTTP_401: UNAUTHORIZED
          </div>
          <p className="text-zinc-500 text-sm mb-8">
            Connect your wallet to prove your identity.
          </p>
          <button
            onClick={connectHandCash}
            className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-zinc-500 text-sm font-mono animate-pulse">Loading identity...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16 pb-20">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            HTTP_401: IDENTITY_REQUIRED
          </div>
          <div className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
            Identity Hub // KYC + Socials + Strands
          </div>
          <h1 className="text-3xl font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
            DIGITAL DNA<span className="text-zinc-300 dark:text-zinc-700">.ID</span>
          </h1>
        </div>

        {identity ? (
          <PostMintView identity={identity} strands={strands} strength={strength} />
        ) : (
          <PreMintView onMint={handleMint} isMinting={isMinting} mintError={mintError} />
        )}
      </div>
    </div>
  );
}
