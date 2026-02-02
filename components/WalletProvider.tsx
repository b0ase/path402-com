'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WalletState, WalletProvider as WalletProviderType, YoursWallet } from '@/lib/types';

interface WalletContextType {
  wallet: WalletState;
  connectYours: () => Promise<void>;
  connectHandCash: () => void;
  disconnect: () => Promise<void>;
  isYoursAvailable: boolean;
}

const defaultWalletState: WalletState = {
  connected: false,
  provider: null,
  address: null,
  ordinalsAddress: null,
  handle: null,
  balance: 0,
};

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

declare global {
  interface Window {
    yours?: YoursWallet;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(defaultWalletState);
  const [isYoursAvailable, setIsYoursAvailable] = useState(false);

  // Check for Yours Wallet on mount
  useEffect(() => {
    const checkYours = () => {
      if (typeof window !== 'undefined' && window.yours) {
        setIsYoursAvailable(true);
        // Check if already connected
        window.yours.isConnected().then((connected) => {
          if (connected) {
            restoreYoursSession();
          }
        });
      }
    };

    // Check immediately and after a delay (extension may load slowly)
    checkYours();
    const timeout = setTimeout(checkYours, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Check for HandCash session on mount (via API since cookies are httpOnly)
  useEffect(() => {
    const checkHandCashSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (session.connected && session.provider === 'handcash') {
          setWallet({
            connected: true,
            provider: 'handcash',
            address: null,
            ordinalsAddress: null,
            handle: session.handle,
            balance: 0,
          });
        }
      } catch (error) {
        console.error('Failed to check HandCash session:', error);
      }
    };
    checkHandCashSession();
  }, []);

  const restoreYoursSession = async () => {
    if (!window.yours) return;
    try {
      const addresses = await window.yours.getAddresses();
      const balanceData = await window.yours.getBalance();
      setWallet({
        connected: true,
        provider: 'yours',
        address: addresses.bsvAddress,
        ordinalsAddress: addresses.ordAddress,
        handle: null,
        balance: balanceData.satoshis,
      });
    } catch (error) {
      console.error('Failed to restore Yours session:', error);
    }
  };

  const connectYours = useCallback(async () => {
    if (!window.yours) {
      window.open('https://yours.org', '_blank');
      return;
    }

    try {
      const result = await window.yours.connect();
      const balanceData = await window.yours.getBalance();

      setWallet({
        connected: true,
        provider: 'yours',
        address: result.addresses.bsvAddress,
        ordinalsAddress: result.addresses.ordAddress,
        handle: null,
        balance: balanceData.satoshis,
      });

      // Register wallet with backend
      await fetch('/api/wallet/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'yours',
          address: result.addresses.bsvAddress,
          ordinalsAddress: result.addresses.ordAddress,
        }),
      });
    } catch (error) {
      console.error('Failed to connect Yours Wallet:', error);
      throw error;
    }
  }, []);

  const connectHandCash = useCallback(() => {
    // Redirect to HandCash OAuth flow
    window.location.href = '/api/auth/handcash';
  }, []);

  const disconnect = useCallback(async () => {
    if (wallet.provider === 'yours' && window.yours) {
      try {
        await window.yours.disconnect();
      } catch (error) {
        console.error('Failed to disconnect Yours:', error);
      }
    }

    if (wallet.provider === 'handcash') {
      // Clear server-side cookies
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Failed to logout from HandCash:', error);
      }
    }

    setWallet(defaultWalletState);
  }, [wallet.provider]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectYours,
        connectHandCash,
        disconnect,
        isYoursAvailable,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
