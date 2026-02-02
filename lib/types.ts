// Token Configuration
export const TOKEN_CONFIG = {
  symbol: 'PATH402.com',
  name: 'PATH402.com Protocol Token',
  totalSupply: 1_000_000_000,
  decimals: 0,
  inscriptionId: '5bf47d3af709a385d3a50a298faa18f9479b090114a69ce8308055861d20e18d_1',
  txId: '5bf47d3af709a385d3a50a298faa18f9479b090114a69ce8308055861d20e18d',
  protocol: 'bsv-20',
  marketUrl: 'https://1sat.market/outpoint/5bf47d3af709a385d3a50a298faa18f9479b090114a69ce8308055861d20e18d_1/timeline',
};

// Wallet types
export type WalletProvider = 'yours' | 'handcash' | null;

export interface WalletState {
  connected: boolean;
  provider: WalletProvider;
  address: string | null;
  ordinalsAddress: string | null;
  handle: string | null;
  balance: number;
}

// Token holder
export interface TokenHolder {
  id: string;
  address: string;
  ordinalsAddress?: string;
  handle?: string;
  provider: WalletProvider;
  balance: number;
  stakedBalance: number;
  totalPurchased: number;
  totalWithdrawn: number;
  totalDividends: number;
  createdAt: string;
  updatedAt: string;
}

// Purchase record
export interface TokenPurchase {
  id: string;
  holderId: string;
  amount: number;
  priceSats: number;
  totalPaidSats: number;
  txId?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

// Stake record
export interface Stake {
  id: string;
  holderId: string;
  amount: number;
  stakedAt: string;
  unstakedAt?: string;
  status: 'active' | 'unstaked';
}

// Dividend distribution
export interface Dividend {
  id: string;
  totalAmount: number;
  perTokenAmount: number;
  totalStaked: number;
  sourceTxId?: string;
  distributedAt: string;
  claims: DividendClaim[];
}

export interface DividendClaim {
  id: string;
  dividendId: string;
  holderId: string;
  amount: number;
  stakedAtTime: number;
  claimedAt?: string;
  status: 'pending' | 'claimed';
}

// Yours Wallet provider interface (injected as window.yours)
export interface YoursWallet {
  isReady: boolean;
  connect: () => Promise<{ pubKey: string; addresses: YoursAddresses }>;
  disconnect: () => Promise<void>;
  isConnected: () => Promise<boolean>;
  getPubKeys: () => Promise<{ bsvPubKey: string; ordPubKey: string; identityPubKey: string }>;
  getAddresses: () => Promise<YoursAddresses>;
  getBalance: () => Promise<{ bsv: number; satoshis: number }>;
  getOrdinals: () => Promise<YoursOrdinal[]>;
  sendBsv: (params: { address: string; satoshis: number }) => Promise<{ txid: string }>;
  transferOrdinal: (params: { address: string; origin: string }) => Promise<{ txid: string }>;
  signMessage: (params: { message: string }) => Promise<{ sig: string; pubKey: string }>;
}

export interface YoursAddresses {
  bsvAddress: string;
  ordAddress: string;
  identityAddress: string;
}

export interface YoursOrdinal {
  origin: string;
  outpoint: string;
  satoshis: number;
  data?: {
    types?: string[];
    bsv20?: {
      sym: string;
      amt: string;
    };
  };
}

// HandCash types (simplified)
export interface HandCashProfile {
  handle: string;
  displayName: string;
  avatarUrl?: string;
  paymail: string;
}
