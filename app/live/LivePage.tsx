'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { useBroadcast } from '@/lib/webrtc/useBroadcast';
import { useViewer } from '@/lib/webrtc/useViewer';

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function generateRoomId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface ActiveRoom {
  id: string;
  creatorHandle: string;
  tokenAddress: string;
  tokenName: string;
  viewerCount: number;
  createdAt: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function LivePage() {
  const { wallet } = useWallet();
  const broadcast = useBroadcast();
  const viewer = useViewer();

  const [activeRooms, setActiveRooms] = useState<ActiveRoom[]>([]);
  const [tokenAddress, setTokenAddress] = useState('');
  const [mode, setMode] = useState<'lobby' | 'creator' | 'viewer'>('lobby');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Poll active rooms
  useEffect(() => {
    if (mode !== 'lobby') return;
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch('/api/rooms');
        if (res.ok) {
          const data = await res.json();
          if (active) setActiveRooms(data.rooms || []);
        }
      } catch {
        // skip
      }
    };
    poll();
    const timer = setInterval(poll, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [mode]);

  // Attach local stream to preview
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = broadcast.localStream;
    }
  }, [broadcast.localStream, broadcast.broadcastState]);

  // Attach local stream to broadcasting view
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = broadcast.localStream;
    }
  }, [broadcast.localStream, mode]);

  // Attach remote stream to viewer
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = viewer.remoteStream;
    }
  }, [viewer.remoteStream, viewer.viewerState]);

  // Auto-start preview when entering creator flow
  useEffect(() => {
    if (mode === 'lobby' && broadcast.broadcastState === 'idle') {
      broadcast.startPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoLive = useCallback(async () => {
    if (!wallet.handle || !tokenAddress.startsWith('$')) return;
    const roomId = generateRoomId();
    setMode('creator');
    await broadcast.goLive(roomId, tokenAddress, wallet.handle);
  }, [broadcast, wallet.handle, tokenAddress]);

  const handleJoinRoom = useCallback(
    async (roomId: string) => {
      if (!wallet.handle || !wallet.provider) return;
      setMode('viewer');
      await viewer.joinBroadcast(roomId, wallet.handle, wallet.provider);
    },
    [viewer, wallet.handle, wallet.provider]
  );

  const handleEndBroadcast = useCallback(() => {
    broadcast.endBroadcast();
  }, [broadcast]);

  const handleLeaveBroadcast = useCallback(() => {
    viewer.leaveBroadcast();
  }, [viewer]);

  const handleBackToLobby = useCallback(() => {
    broadcast.reset();
    viewer.reset();
    setMode('lobby');
    setTokenAddress('');
  }, [broadcast, viewer]);

  // ── CREATOR BROADCASTING ─────────────────────────────────────
  if (mode === 'creator' && broadcast.broadcastState === 'live') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col font-mono">
        <div className="flex-1 relative min-h-0">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Live indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
              Live &mdash; {formatDuration(broadcast.broadcastDuration)}
            </span>
            <span className="text-zinc-600 mx-1">|</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {broadcast.viewerCount} watching
            </span>
          </div>

          {/* Token badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
            <span className="text-[10px] font-mono text-zinc-400">
              {tokenAddress}
            </span>
          </div>
        </div>

        {/* Token Ticker */}
        <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-center gap-6 bg-zinc-950">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            &darr; Earned:{' '}
            <span className="text-white tabular-nums">{broadcast.totalTokensReceived}</span> tok
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            $402/live &middot; 1 tok/sec per viewer
          </span>
        </div>

        {/* Controls */}
        <div className="px-4 py-4 flex justify-center gap-3 bg-zinc-950 border-t border-zinc-800">
          <button
            onClick={broadcast.toggleAudio}
            className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-colors ${
              broadcast.audioEnabled
                ? 'border-zinc-700 text-white hover:bg-zinc-800'
                : 'border-red-800 bg-red-900/50 text-red-400'
            }`}
          >
            {broadcast.audioEnabled ? 'Mic On' : 'Mic Off'}
          </button>
          <button
            onClick={broadcast.toggleVideo}
            className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-colors ${
              broadcast.videoEnabled
                ? 'border-zinc-700 text-white hover:bg-zinc-800'
                : 'border-red-800 bg-red-900/50 text-red-400'
            }`}
          >
            {broadcast.videoEnabled ? 'Cam On' : 'Cam Off'}
          </button>
          <button
            onClick={handleEndBroadcast}
            className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            End Broadcast
          </button>
        </div>
      </div>
    );
  }

  // ── CREATOR ENDED ────────────────────────────────────────────
  if (mode === 'creator' && broadcast.broadcastState === 'ended') {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
        <main className="w-full px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
          <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
            >
              <span className="w-2 h-2 bg-zinc-500 rounded-full" />
              Broadcast Ended
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              LIVE<span className="text-zinc-300 dark:text-zinc-800">.STREAM</span>
            </motion.h1>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto border border-zinc-200 dark:border-zinc-800 p-8"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Broadcast Summary
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Duration</span>
                <span className="text-sm font-bold tabular-nums">
                  {formatDuration(broadcast.broadcastDuration)}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Tokens Earned</span>
                <span className="text-sm font-bold tabular-nums">
                  {broadcast.totalTokensReceived}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-sm text-zinc-500">Peak Viewers</span>
                <span className="text-sm font-bold tabular-nums">
                  {broadcast.viewerCount}
                </span>
              </div>
            </div>
            <button
              onClick={handleBackToLobby}
              className="w-full mt-8 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              New Broadcast
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── VIEWER CONNECTED ─────────────────────────────────────────
  if (mode === 'viewer' && viewer.viewerState === 'connected') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col font-mono">
        <div className="flex-1 relative min-h-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Live indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
              Live &mdash; {formatDuration(viewer.viewDuration)}
            </span>
          </div>

          {/* Creator + token badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400">
              @{viewer.creatorHandle}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-[10px] font-mono text-zinc-400">
              {viewer.tokenName}
            </span>
          </div>
        </div>

        {/* Token Ticker */}
        <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-center gap-6 bg-zinc-950">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            &uarr; Sent:{' '}
            <span className="text-white tabular-nums">{viewer.tokensSent}</span> tok
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            $402/live &middot; 1 tok/sec
          </span>
        </div>

        {/* Controls */}
        <div className="px-4 py-4 flex justify-center gap-3 bg-zinc-950 border-t border-zinc-800">
          <button
            onClick={handleLeaveBroadcast}
            className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    );
  }

  // ── VIEWER DENIED (402) ──────────────────────────────────────
  if (mode === 'viewer' && viewer.viewerState === 'denied' && viewer.deniedInfo) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
        <main className="w-full px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
          <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4 text-amber-500 text-xs tracking-widest uppercase"
            >
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              402 — Token Required
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              ACCESS<span className="text-zinc-300 dark:text-zinc-800">.DENIED</span>
            </motion.h1>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto border border-amber-500/30 p-8"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
              Token Required to Watch
            </div>
            <p className="text-sm text-zinc-500 mb-6">
              {viewer.deniedInfo.message}
            </p>
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Required Token</div>
              <div className="text-sm font-bold">{viewer.deniedInfo.tokenName}</div>
              <div className="text-xs text-zinc-500 font-mono mt-1">{viewer.deniedInfo.tokenAddress}</div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/token"
                className="flex-1 px-6 py-3 border border-amber-500 text-amber-500 text-[10px] font-bold uppercase tracking-widest text-center hover:bg-amber-500 hover:text-black transition-colors"
              >
                Acquire Token
              </Link>
              <button
                onClick={handleBackToLobby}
                className="flex-1 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Back
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── VIEWER ENDED ─────────────────────────────────────────────
  if (mode === 'viewer' && viewer.viewerState === 'ended') {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
        <main className="w-full px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
          <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
            >
              <span className="w-2 h-2 bg-zinc-500 rounded-full" />
              Stream Ended
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              LIVE<span className="text-zinc-300 dark:text-zinc-800">.STREAM</span>
            </motion.h1>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto border border-zinc-200 dark:border-zinc-800 p-8"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Viewing Summary
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Duration</span>
                <span className="text-sm font-bold tabular-nums">
                  {formatDuration(viewer.viewDuration)}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Tokens Sent</span>
                <span className="text-sm font-bold tabular-nums">
                  {viewer.tokensSent}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-sm text-zinc-500">Creator</span>
                <span className="text-sm font-bold">@{viewer.creatorHandle}</span>
              </div>
            </div>
            <button
              onClick={handleBackToLobby}
              className="w-full mt-8 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Back to Live
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── VIEWER JOINING ───────────────────────────────────────────
  if (mode === 'viewer' && (viewer.viewerState === 'checking' || viewer.viewerState === 'joining')) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse inline-block mb-4" />
          <div className="text-[10px] font-bold uppercase tracking-widest text-green-400">
            {viewer.viewerState === 'checking' ? 'Checking token access\u2026' : 'Joining broadcast\u2026'}
          </div>
        </div>
      </div>
    );
  }

  // ── LOBBY ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
        {/* Header */}
        <header className="mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Token-Gated Broadcasting / WebRTC
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
          >
            LIVE<span className="text-zinc-300 dark:text-zinc-800">.STREAM</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-zinc-500 max-w-lg"
          >
            Token-gated live video. Creators broadcast, token holders watch.
            1 tok/sec via $402 payment channels.
          </motion.div>
        </header>

        {/* Active Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Live Now {activeRooms.length > 0 && `(${activeRooms.length})`}
          </div>
          {activeRooms.length === 0 ? (
            <div className="border border-zinc-200 dark:border-zinc-800 p-8 text-center">
              <div className="text-sm text-zinc-400">No active broadcasts</div>
              <div className="text-[10px] text-zinc-500 mt-1">Be the first to go live</div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {activeRooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-zinc-200 dark:border-zinc-800 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Live</span>
                  </div>
                  <div className="text-sm font-bold mb-1">@{room.creatorHandle}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mb-3">{room.tokenName}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">
                      {room.viewerCount} watching
                    </span>
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={!wallet.connected}
                      className="px-4 py-1.5 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Go Live Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Go Live
          </div>

          {/* Camera Preview */}
          <div className="border border-zinc-200 dark:border-zinc-800 aspect-video bg-black relative overflow-hidden mb-4">
            <video
              ref={previewVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {!broadcast.localStream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                {broadcast.mediaError ? (
                  <>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-amber-500">
                      {broadcast.mediaError}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Audio-only broadcast available
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-4">
                      Camera Access Required
                    </div>
                    <button
                      onClick={broadcast.startPreview}
                      className="px-6 py-3 border border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-colors"
                    >
                      Enable Camera
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Token Address + Go Live */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="Token address (e.g. $zerodice)"
              className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 placeholder-zinc-400 text-black dark:text-white"
            />
            <button
              onClick={handleGoLive}
              disabled={!wallet.connected || !tokenAddress.startsWith('$') || broadcast.broadcastState === 'idle'}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Go Live
            </button>
          </div>

          {!wallet.connected && (
            <div className="text-[10px] text-amber-500 text-center">
              Connect wallet to broadcast or watch
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
