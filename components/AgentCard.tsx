'use client';

import { useState, useRef, useCallback } from 'react';
import type { Agent } from '@/lib/agents/data';

const PREVIEW_LIMIT = 5;

function ExternalAgentCard({ agent }: { agent: Agent }) {
  return (
    <a
      href={agent.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black ${agent.accent.hoverBorder} transition-colors`}
    >
      <div className="aspect-[9/14] bg-black border-b border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        {agent.image && (
          <img
            src={agent.image}
            alt={agent.name}
            className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ${agent.video ? 'group-hover:opacity-0' : ''}`}
          />
        )}
        {agent.video && (
          <video
            src={agent.video}
            muted
            playsInline
            loop
            preload="metadata"
            className={`w-full h-full object-cover transition-all duration-500 ${agent.image ? 'absolute inset-0 opacity-0 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'}`}
            onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
            onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
          />
        )}
        {!agent.image && !agent.video && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-800 font-mono text-4xl font-bold">?</span>
          </div>
        )}
        <div className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black px-3 py-1 font-mono text-xs font-bold z-20">
          {agent.price}
        </div>
        <div className={`absolute bottom-0 left-0 ${agent.accent.badgeBg} text-white px-2 py-0.5 text-[8px] font-bold font-mono uppercase tracking-widest z-20`}>
          {agent.tag}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg tracking-tight uppercase">{agent.name}</h3>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">${agent.id}</div>
        </div>
        <p className="text-xs text-zinc-500 font-mono h-12 leading-relaxed line-clamp-3">
          {agent.description}
        </p>
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
          <span className={`inline-block py-3 w-full text-center ${agent.accent.bg}/10 hover:${agent.accent.bg}/20 ${agent.accent.text} text-[10px] font-bold uppercase tracking-widest transition-all`}>
            Enter
          </span>
        </div>
      </div>
    </a>
  );
}

function PreviewAgentCard({ agent }: { agent: Agent }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    setPreviewTime(vid.currentTime);
    if (!isUnlocked && vid.currentTime >= PREVIEW_LIMIT) {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isUnlocked]);

  const handleVideoLoaded = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.muted = !isUnlocked;
    vid.play().catch(() => {});
  }, [isUnlocked]);

  const handlePreview = useCallback(() => {
    setShowVideo(true);
    setIsPlaying(true);
    setPreviewTime(0);
  }, []);

  const handleUnlock = useCallback(() => {
    setStatus('DOWNLOADING...');
    setTimeout(() => {
      setIsUnlocked(true);
      setShowVideo(true);
      setStatus('SEEDING (RATIO 0.0)');
      const vid = videoRef.current;
      if (vid) {
        vid.muted = false;
        vid.currentTime = 0;
        vid.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 2000);
  }, []);

  const handlePlayFull = useCallback(() => {
    setShowVideo(true);
    setIsPlaying(true);
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }, []);

  const previewPct = isUnlocked
    ? (videoRef.current ? (previewTime / (videoRef.current.duration || 1)) * 100 : 0)
    : (previewTime / PREVIEW_LIMIT) * 100;

  return (
    <div className={`group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors relative`}>
      {status && (
        <div className="absolute top-0 left-0 z-20 bg-green-500 text-black px-2 py-0.5 text-[10px] font-bold font-mono uppercase tracking-widest">
          {status}
        </div>
      )}

      <div
        className="aspect-video bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden cursor-pointer"
        onMouseEnter={() => { if (!showVideo && !isPlaying) { setShowVideo(true); setIsPlaying(true); setPreviewTime(0); } }}
        onMouseLeave={() => { if (!isUnlocked && isPlaying) { const vid = videoRef.current; if (vid) { vid.pause(); vid.currentTime = 0; } setIsPlaying(false); setShowVideo(false); setPreviewTime(0); } }}
      >
        {agent.image && !showVideo && (
          <img
            src={agent.image}
            alt={agent.name}
            className={`w-full h-full object-cover transition-all duration-500 ${isUnlocked ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
          />
        )}

        {showVideo && (
          <video
            ref={videoRef}
            src={agent.video}
            poster={agent.image}
            className="w-full h-full object-cover"
            playsInline
            muted
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedData={handleVideoLoaded}
            onEnded={() => setIsPlaying(false)}
          />
        )}

        {!agent.image && !showVideo && (
          <span className="text-zinc-300 dark:text-zinc-800 font-mono text-4xl font-bold">?</span>
        )}

        {isPlaying && showVideo && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="h-1 bg-zinc-800/50">
              <div className="h-full bg-red-500 transition-all duration-100 ease-linear" style={{ width: `${Math.min(previewPct, 100)}%` }} />
            </div>
            {!isUnlocked && (
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="bg-black/70 text-red-500 font-mono text-[9px] font-bold px-2 py-0.5">
                  PREVIEW {previewTime.toFixed(1)}s / {PREVIEW_LIMIT}s
                </span>
              </div>
            )}
          </div>
        )}

        {!isPlaying && showVideo && !isUnlocked && previewTime >= PREVIEW_LIMIT && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
            <div className="text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">Preview ended</div>
            <div className="text-zinc-500 font-mono text-[9px]">Buy ticket to watch full clip</div>
          </div>
        )}

        {!isUnlocked && !showVideo && (
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        )}

        <div className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black px-3 py-1 font-mono text-xs font-bold z-20">
          {agent.price}
        </div>

        <div className={`absolute bottom-0 left-0 ${agent.accent.badgeBg} text-white px-2 py-0.5 text-[8px] font-bold font-mono uppercase tracking-widest z-20`}>
          {agent.tag}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg tracking-tight uppercase">{agent.name}</h3>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{agent.id}</div>
        </div>
        <p className="text-xs text-zinc-500 font-mono h-12 leading-relaxed line-clamp-3">
          {agent.description}
        </p>
        <div className="pt-4 flex items-center gap-0 border-t border-zinc-100 dark:border-zinc-900">
          {!isUnlocked ? (
            <>
              <button
                onClick={handlePreview}
                disabled={isPlaying}
                className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-black dark:text-white text-[10px] font-bold uppercase tracking-widest transition-all border-r border-zinc-200 dark:border-zinc-800 disabled:opacity-50"
              >
                {isPlaying ? 'WATCHING...' : previewTime >= PREVIEW_LIMIT ? 'PREVIEW ENDED' : 'WATCH PREVIEW'}
              </button>
              <button
                onClick={handleUnlock}
                className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                BUY TICKET
              </button>
            </>
          ) : (
            <button
              onClick={handlePlayFull}
              className="w-full py-3 bg-green-500 text-black font-bold uppercase tracking-widest text-[10px]"
            >
              {isPlaying ? 'NOW PLAYING' : 'PLAY FULL CLIP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgentCard({ agent }: { agent: Agent }) {
  if (agent.link) {
    return <ExternalAgentCard agent={agent} />;
  }
  return <PreviewAgentCard agent={agent} />;
}
