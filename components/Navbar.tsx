'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './WalletProvider';
import { useState } from 'react';

export function Navbar() {
  const { wallet, connectYours, connectHandCash, disconnect, isYoursAvailable } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          $PATH402
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
          <a
            href="https://github.com/b0ase/path402-mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            GitHub
          </a>

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
