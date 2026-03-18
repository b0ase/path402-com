'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NPGX_VIDEO_UUIDS, getNpgxVideoUrl } from '@/lib/agents/npgx-videos';

interface VideoCarouselProps {
  autoPlayInterval?: number; // ms between videos
}

export default function VideoCarousel({ autoPlayInterval = 5000 }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const currentUuid = NPGX_VIDEO_UUIDS[currentIndex];
  const currentUrl = getNpgxVideoUrl(currentUuid);
  const progress = ((currentIndex + 1) / NPGX_VIDEO_UUIDS.length) * 100;

  // Auto-advance to next video
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % NPGX_VIDEO_UUIDS.length);
    }, autoPlayInterval);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, isHovered, autoPlayInterval]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + NPGX_VIDEO_UUIDS.length) % NPGX_VIDEO_UUIDS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % NPGX_VIDEO_UUIDS.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newIndex = Math.floor(percent * NPGX_VIDEO_UUIDS.length);
    setCurrentIndex(Math.min(newIndex, NPGX_VIDEO_UUIDS.length - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Video Container */}
      <div
        className="relative w-full bg-black rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full aspect-video bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              src={currentUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Controls (show on hover) */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-center justify-between px-4"
          >
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
              aria-label="Previous video"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
              aria-label="Next video"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Play/Pause Button (bottom right) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 1.5A.75.75 0 005 2.25v15.5a.75.75 0 001.5 0V2.25A.75.75 0 005.75 1.5zm9.5 0a.75.75 0 00-.75.75v15.5a.75.75 0 001.5 0V2.25a.75.75 0 00-.75-.75z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Video Counter & Info */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span className="font-mono">
          Video {currentIndex + 1} of {NPGX_VIDEO_UUIDS.length}
        </span>
        <span className="font-mono text-[10px]">{currentUuid}</span>
      </div>

      {/* Progress Bar */}
      <div
        onClick={handleProgressClick}
        className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
      >
        <motion.div
          className="h-full bg-pink-600"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="px-3 py-1.5 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-all"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
              isPlaying
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {isPlaying ? 'Playing' : 'Paused'}
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-3 py-1.5 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-all"
        >
          Next →
        </button>
      </div>

      {/* Stats */}
      <div className="text-[10px] text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-3">
        <p>Viewing 143 Grok-generated promotional videos from the NPGX universe</p>
      </div>
    </motion.div>
  );
}
