'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../../lib/webrtc/useWebRTC';
import { usePaymentChannel } from '../../lib/webrtc/usePaymentChannel';

function generateRoomId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getHandleFromCookie(): string {
  if (typeof document === 'undefined') return 'You';
  const match = document.cookie.match(/hc_handle=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : 'You';
}

export default function VideoCallPage() {
  const {
    callState,
    localStream,
    remoteStream,
    paymentChannel,
    chatMessages,
    audioEnabled,
    videoEnabled,
    callDuration,
    mediaError,
    startPreview,
    createRoom,
    joinRoom,
    hangUp,
    toggleAudio,
    toggleVideo,
    sendChatMessage,
    reset,
  } = useWebRTC();

  const { tokensSent, tokensReceived, isStreaming } =
    usePaymentChannel(paymentChannel);

  const [roomId, setRoomId] = useState(generateRoomId);
  const [chatInput, setChatInput] = useState('');
  const [chatVisible, setChatVisible] = useState(true);

  const localPreviewRef = useRef<HTMLVideoElement>(null);
  const localPipRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const myHandle = getHandleFromCookie();

  // Attach local stream to preview (lobby) and PiP (connected)
  useEffect(() => {
    if (localPreviewRef.current) {
      localPreviewRef.current.srcObject = localStream;
    }
  }, [localStream, callState]);

  useEffect(() => {
    if (localPipRef.current) {
      localPipRef.current.srcObject = localStream;
    }
  }, [localStream, callState]);

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callState]);

  // Auto-start camera on mount
  useEffect(() => {
    if (callState === 'idle') startPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewCall = useCallback(() => {
    reset();
    setRoomId(generateRoomId());
    setChatInput('');
  }, [reset]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  }, [chatInput, sendChatMessage]);

  // ── CONNECTED ──────────────────────────────────────────────
  if (callState === 'connected') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex font-mono">
        {/* Video Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Remote Video */}
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
                Live &mdash; {formatDuration(callDuration)}
              </span>
            </div>

            {/* Room badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
              <span className="text-[10px] font-mono text-zinc-400">
                Room: {roomId}
              </span>
            </div>

            {/* Local PiP */}
            <div className="absolute bottom-4 right-4 w-36 md:w-48 aspect-video border border-zinc-700 rounded overflow-hidden bg-zinc-900 shadow-xl">
              <video
                ref={localPipRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Token Ticker */}
          <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-center gap-6 bg-zinc-950">
            {isStreaming && (
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              &uarr; Sent:{' '}
              <span className="text-white tabular-nums">{tokensSent}</span> tok
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              &darr; Recv:{' '}
              <span className="text-white tabular-nums">{tokensReceived}</span>{' '}
              tok
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              $402/video &middot; 1 tok/sec
            </span>
          </div>

          {/* Controls */}
          <div className="px-4 py-4 flex justify-center gap-3 bg-zinc-950 border-t border-zinc-800">
            <button
              onClick={toggleAudio}
              className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                audioEnabled
                  ? 'border-zinc-700 text-white hover:bg-zinc-800'
                  : 'border-red-800 bg-red-900/50 text-red-400'
              }`}
            >
              {audioEnabled ? 'Mic On' : 'Mic Off'}
            </button>
            <button
              onClick={toggleVideo}
              className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                videoEnabled
                  ? 'border-zinc-700 text-white hover:bg-zinc-800'
                  : 'border-red-800 bg-red-900/50 text-red-400'
              }`}
            >
              {videoEnabled ? 'Cam On' : 'Cam Off'}
            </button>
            <button
              onClick={hangUp}
              className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              End Call
            </button>
            <button
              onClick={() => setChatVisible(!chatVisible)}
              className="ml-auto px-4 py-2.5 border border-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors md:hidden"
            >
              {chatVisible ? 'Hide' : 'Show'} Chat
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        {chatVisible && (
          <div className="w-80 md:w-96 flex flex-col border-l border-zinc-800 bg-black">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-zinc-800">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Text Chat
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {chatMessages.length === 0 ? (
                <div className="text-[10px] text-zinc-600 text-center py-8">
                  No messages yet
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="text-[10px]">
                    <div className="font-bold text-zinc-300">
                      {msg.sender === myHandle ? 'You' : msg.sender}
                    </div>
                    <div className="text-zinc-400 break-words">{msg.text}</div>
                    <div className="text-[8px] text-zinc-600 mt-0.5">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Type message..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ENDED ──────────────────────────────────────────────────
  if (callState === 'ended') {
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
              Call Ended
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
            >
              VIDEO<span className="text-zinc-300 dark:text-zinc-800">.CALL</span>
            </motion.h1>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto border border-zinc-200 dark:border-zinc-800 p-8"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Call Summary
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Duration</span>
                <span className="text-sm font-bold tabular-nums">
                  {formatDuration(callDuration)}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Tokens Sent</span>
                <span className="text-sm font-bold tabular-nums">
                  {tokensSent}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <span className="text-sm text-zinc-500">Tokens Received</span>
                <span className="text-sm font-bold tabular-nums">
                  {tokensReceived}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-sm text-zinc-500">Room</span>
                <span className="text-sm font-bold font-mono">{roomId}</span>
              </div>
            </div>
            <button
              onClick={handleNewCall}
              className="w-full mt-8 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              New Call
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── LOBBY / CONNECTING / IDLE ──────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono">
      <main className="w-full px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
        {/* Header */}
        <header className="mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            P2P Encrypted / WebRTC
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
          >
            VIDEO<span className="text-zinc-300 dark:text-zinc-800">.CALL</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-zinc-500 max-w-lg"
          >
            P2P video calls with $402 token streaming. 1 tok/sec bilateral
            payment channel.
          </motion.div>
        </header>

        {/* Camera Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Camera Preview
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 aspect-video bg-black relative overflow-hidden">
            <video
              ref={localPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {!localStream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                {mediaError ? (
                  <>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-amber-500">
                      {mediaError}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      You can still join calls — video will be one-way
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-4">
                      Camera Access Required
                    </div>
                    <button
                      onClick={startPreview}
                      className="px-6 py-3 border border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-colors"
                    >
                      Enable Camera
                    </button>
                  </>
                )}
              </div>
            )}

            {callState === 'connecting' && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mb-4" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-green-400">
                  Establishing peer connection&hellip;
                </div>
                <div className="text-[10px] text-zinc-500 mt-2">
                  Room: {roomId}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Room Controls */}
        {callState !== 'connecting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Room
            </div>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) =>
                  setRoomId(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-f0-9]/g, '')
                      .slice(0, 6)
                  )
                }
                placeholder="Room ID (hex)"
                className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 placeholder-zinc-400 text-black dark:text-white"
              />
              <button
                onClick={() => setRoomId(generateRoomId())}
                className="px-4 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                Generate
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => createRoom(roomId)}
                disabled={callState === 'idle' || roomId.length < 4}
                className="flex-1 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Create Room
              </button>
              <button
                onClick={() => joinRoom(roomId)}
                disabled={callState === 'idle' || roomId.length < 4}
                className="flex-1 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Join Room
              </button>
            </div>
            <div className="mt-4 text-[10px] text-zinc-400 text-center">
              Share the room ID with your peer to connect
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
