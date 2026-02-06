'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './WalletProvider';
import { ThemeToggle } from './ThemeProvider';
import { useState } from 'react';

export function Navbar() {
  const { wallet, connectYours, connectHandCash, connectMetanet, disconnect, isYoursAvailable } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white font-mono">
          $402
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/whitepaper" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs uppercase tracking-widest">
            Whitepaper
          </Link>
          <Link href="/token" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs uppercase tracking-widest">
            POW20
          </Link>
          <Link href="/download" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs uppercase tracking-widest">
            Download
          </Link>
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs uppercase tracking-widest">
            Docs
          </Link>
          <a
            href="https://github.com/b0ase/path402"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="GitHub"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/download"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            DOWNLOAD
          </Link>

          {/* Wallet Connection */}
          {wallet.connected ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono text-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="w-2 h-2 bg-blue-500" />
                {wallet.handle ? (
                  <span>@{wallet.handle}</span>
                ) : wallet.address ? (
                  <span>{truncateAddress(wallet.address)}</span>
                ) : (
                  <span>Connected</span>
                )}
              </motion.button>

              <AnimatePresence>
                {showWalletMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                  >
                    <Link
                      href="/account"
                      className="block p-3 text-xs text-zinc-900 dark:text-white uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      Account
                    </Link>
                    <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-600 mb-1 uppercase tracking-widest">Connected via</div>
                      <div className="text-xs text-zinc-900 dark:text-white font-mono capitalize">
                        {wallet.provider}
                      </div>
                    </div>
                    {wallet.balance > 0 && (
                      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-600 mb-1 uppercase tracking-widest">Balance</div>
                        <div className="text-xs text-zinc-900 dark:text-white font-mono">
                          {(wallet.balance / 100000000).toFixed(8)} BSV
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        disconnect();
                        setShowWalletMenu(false);
                      }}
                      className="w-full p-3 text-left text-xs text-red-600 dark:text-red-400 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-zinc-200 dark:border-zinc-800"
                    >
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connect
              </motion.button>

              <AnimatePresence>
                {showWalletMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                  >
                    <div className="p-2">
                      <motion.button
                        onClick={() => {
                          connectHandCash();
                          setShowWalletMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 bg-[#38CB7C] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">H</span>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-zinc-900 dark:text-white font-bold uppercase tracking-wide">HandCash</div>
                          <div className="text-[10px] text-zinc-500">Social wallet</div>
                        </div>
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          connectYours();
                          setShowWalletMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 bg-[#6366F1] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Y</span>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-zinc-900 dark:text-white font-bold uppercase tracking-wide">Yours Wallet</div>
                          <div className="text-[10px] text-zinc-500">
                            {isYoursAvailable ? 'Browser extension' : 'Install extension'}
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          connectMetanet();
                          setShowWalletMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-zinc-900 dark:text-white font-bold uppercase tracking-wide">Metanet</div>
                          <div className="text-[10px] text-zinc-500">Babbage Desktop</div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
