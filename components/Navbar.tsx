'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './WalletProvider';
import { useState } from 'react';

export function Navbar() {
  const { wallet, connectYours, connectHandCash, disconnect, isYoursAvailable } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showGitHubMenu, setShowGitHubMenu] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          $402
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">
            Docs
          </Link>
          <Link href="/exchange" className="text-gray-400 hover:text-white transition-colors text-sm">
            Exchange
          </Link>
          <Link href="/token" className="text-gray-400 hover:text-white transition-colors text-sm">
            Token
          </Link>
          <Link href="/registry" className="text-gray-400 hover:text-white transition-colors text-sm">
            Registry
          </Link>
          {/* GitHub Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowGitHubMenu(!showGitHubMenu)}
              onBlur={() => setTimeout(() => setShowGitHubMenu(false), 150)}
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              GitHub
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showGitHubMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 shadow-xl"
                >
                  <div className="p-2">
                    <a
                      href="https://github.com/b0ase/path402-mcp-server"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors rounded"
                    >
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-white font-medium">MCP Server</div>
                        <div className="text-xs text-gray-400">Protocol implementation</div>
                      </div>
                    </a>

                    <a
                      href="https://github.com/b0ase/path402-com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors rounded"
                    >
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-white font-medium">Website</div>
                        <div className="text-xs text-gray-400">This site's source code</div>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account link when connected */}
          {wallet.connected && (
            <Link href="/account" className="text-gray-400 hover:text-white transition-colors text-sm">
              Account
            </Link>
          )}

          {/* Wallet Connection */}
          {wallet.connected ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/50 text-green-400 font-medium text-sm hover:bg-green-600/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full" />
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
                    className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 shadow-xl"
                  >
                    <div className="p-3 border-b border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">Connected via</div>
                      <div className="text-sm text-white font-medium capitalize">
                        {wallet.provider}
                      </div>
                    </div>
                    {wallet.balance > 0 && (
                      <div className="p-3 border-b border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Balance</div>
                        <div className="text-sm text-white font-mono">
                          {(wallet.balance / 100000000).toFixed(8)} BSV
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        disconnect();
                        setShowWalletMenu(false);
                      }}
                      className="w-full p-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
                className="px-4 py-2 bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connect Wallet
              </motion.button>

              <AnimatePresence>
                {showWalletMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 shadow-xl"
                  >
                    <div className="p-2">
                      <motion.button
                        onClick={() => {
                          connectHandCash();
                          setShowWalletMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors rounded"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 bg-[#38CB7C] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">H</span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-white font-medium">HandCash</div>
                          <div className="text-xs text-gray-400">Social wallet</div>
                        </div>
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          connectYours();
                          setShowWalletMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors rounded"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Y</span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-white font-medium">Yours Wallet</div>
                          <div className="text-xs text-gray-400">
                            {isYoursAvailable ? 'Browser extension' : 'Install extension'}
                          </div>
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
