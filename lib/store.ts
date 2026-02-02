// Simple in-memory store for development
// Replace with Supabase or PostgreSQL for production

import type { TokenHolder, TokenPurchase, Stake, Dividend, DividendClaim } from './types';
import { TOKEN_CONFIG } from './types';

// In-memory storage (will reset on server restart)
const holders = new Map<string, TokenHolder>();
const purchases: TokenPurchase[] = [];
const stakes: Stake[] = [];
const dividends: Dividend[] = [];

// Treasury wallet (holds tokens for sale)
const TREASURY = {
  balance: TOKEN_CONFIG.totalSupply,
  address: process.env.TREASURY_ADDRESS || '1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1',
  totalSold: 0,
  totalRevenue: 0,
};

// Payment address for token purchases (same as treasury)
export const PAYMENT_ADDRESS = process.env.TREASURY_ADDRESS || '1BrbnQon4uZPSxNwt19ozwtgHPDbgvaeD1';

// Helper to generate IDs
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// Get or create holder
export function getOrCreateHolder(
  address: string,
  provider: 'yours' | 'handcash',
  ordinalsAddress?: string,
  handle?: string
): TokenHolder {
  const key = provider === 'handcash' ? `handcash:${handle}` : `ord:${address}`;

  if (!holders.has(key)) {
    const holder: TokenHolder = {
      id: generateId(),
      address,
      ordinalsAddress,
      handle,
      provider,
      balance: 0,
      stakedBalance: 0,
      totalPurchased: 0,
      totalWithdrawn: 0,
      totalDividends: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    holders.set(key, holder);
  }

  return holders.get(key)!;
}

// Get holder by address or handle
export function getHolder(address?: string, handle?: string): TokenHolder | null {
  if (handle) {
    return holders.get(`handcash:${handle}`) || null;
  }
  if (address) {
    return holders.get(`ord:${address}`) || null;
  }
  return null;
}

// Get all holders
export function getAllHolders(): TokenHolder[] {
  return Array.from(holders.values());
}

// Get token stats
export function getTokenStats() {
  const allHolders = getAllHolders();
  const totalStaked = allHolders.reduce((sum, h) => sum + h.stakedBalance, 0);
  const totalCirculating = allHolders.reduce((sum, h) => sum + h.balance, 0);

  return {
    totalHolders: allHolders.filter(h => h.balance > 0).length,
    totalStaked,
    totalCirculating,
    treasuryBalance: TREASURY.balance,
    totalSold: TREASURY.totalSold,
    totalRevenue: TREASURY.totalRevenue,
  };
}

// Create a purchase
export function createPurchase(
  holderId: string,
  amount: number,
  priceSats: number
): TokenPurchase {
  const purchase: TokenPurchase = {
    id: generateId(),
    holderId,
    amount,
    priceSats,
    totalPaidSats: amount * priceSats,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  purchases.push(purchase);
  return purchase;
}

// Confirm a purchase
export function confirmPurchase(purchaseId: string, txId: string): boolean {
  const purchase = purchases.find(p => p.id === purchaseId);
  if (!purchase || purchase.status !== 'pending') return false;

  purchase.status = 'confirmed';
  purchase.txId = txId;

  // Update holder balance
  const holder = Array.from(holders.values()).find(h => h.id === purchase.holderId);
  if (holder) {
    holder.balance += purchase.amount;
    holder.totalPurchased += purchase.amount;
    holder.updatedAt = new Date().toISOString();
  }

  // Update treasury
  TREASURY.balance -= purchase.amount;
  TREASURY.totalSold += purchase.amount;
  TREASURY.totalRevenue += purchase.totalPaidSats;

  return true;
}

// For HandCash purchases (auto-confirm since payment is verified)
export function processPurchaseImmediate(
  holderId: string,
  amount: number,
  priceSats: number,
  txId?: string
): TokenPurchase {
  const purchase = createPurchase(holderId, amount, priceSats);

  // Auto-confirm for verified payments
  purchase.status = 'confirmed';
  purchase.txId = txId;

  // Update holder balance
  const holder = Array.from(holders.values()).find(h => h.id === holderId);
  if (holder) {
    holder.balance += amount;
    holder.totalPurchased += amount;
    holder.updatedAt = new Date().toISOString();
  }

  // Update treasury
  TREASURY.balance -= amount;
  TREASURY.totalSold += amount;
  TREASURY.totalRevenue += amount * priceSats;

  return purchase;
}

// Stake tokens
export function stakeTokens(holderId: string, amount: number): Stake | null {
  const holder = Array.from(holders.values()).find(h => h.id === holderId);
  if (!holder || holder.balance - holder.stakedBalance < amount) return null;

  const stake: Stake = {
    id: generateId(),
    holderId,
    amount,
    stakedAt: new Date().toISOString(),
    status: 'active',
  };

  stakes.push(stake);
  holder.stakedBalance += amount;
  holder.updatedAt = new Date().toISOString();

  return stake;
}

// Unstake tokens
export function unstakeTokens(holderId: string, amount: number): boolean {
  const holder = Array.from(holders.values()).find(h => h.id === holderId);
  if (!holder || holder.stakedBalance < amount) return false;

  // Mark stakes as unstaked (LIFO)
  let remaining = amount;
  for (let i = stakes.length - 1; i >= 0 && remaining > 0; i--) {
    const stake = stakes[i];
    if (stake.holderId === holderId && stake.status === 'active') {
      if (stake.amount <= remaining) {
        stake.status = 'unstaked';
        stake.unstakedAt = new Date().toISOString();
        remaining -= stake.amount;
      } else {
        // Partial unstake - create new stake for remainder
        stake.amount -= remaining;
        remaining = 0;
      }
    }
  }

  holder.stakedBalance -= amount;
  holder.updatedAt = new Date().toISOString();

  return true;
}

// Get holder's active stakes
export function getHolderStakes(holderId: string): Stake[] {
  return stakes.filter(s => s.holderId === holderId && s.status === 'active');
}

// Distribute dividends (called by $PATH402 protocol)
export function distributeDividends(totalAmount: number, sourceTxId?: string): Dividend {
  const allHolders = getAllHolders();
  const totalStaked = allHolders.reduce((sum, h) => sum + h.stakedBalance, 0);

  if (totalStaked === 0) {
    throw new Error('No staked tokens to distribute to');
  }

  const perTokenAmount = totalAmount / totalStaked;

  const dividend: Dividend = {
    id: generateId(),
    totalAmount,
    perTokenAmount,
    totalStaked,
    sourceTxId,
    distributedAt: new Date().toISOString(),
    claims: [],
  };

  // Create claims for each staker
  for (const holder of allHolders) {
    if (holder.stakedBalance > 0) {
      const claim: DividendClaim = {
        id: generateId(),
        dividendId: dividend.id,
        holderId: holder.id,
        amount: Math.floor(holder.stakedBalance * perTokenAmount),
        stakedAtTime: holder.stakedBalance,
        status: 'pending',
      };
      dividend.claims.push(claim);
    }
  }

  dividends.push(dividend);
  return dividend;
}

// Get pending dividends for a holder
export function getPendingDividends(holderId: string): number {
  let total = 0;
  for (const dividend of dividends) {
    for (const claim of dividend.claims) {
      if (claim.holderId === holderId && claim.status === 'pending') {
        total += claim.amount;
      }
    }
  }
  return total;
}

// Claim dividends
export function claimDividends(holderId: string): number {
  let total = 0;
  const holder = Array.from(holders.values()).find(h => h.id === holderId);

  for (const dividend of dividends) {
    for (const claim of dividend.claims) {
      if (claim.holderId === holderId && claim.status === 'pending') {
        claim.status = 'claimed';
        claim.claimedAt = new Date().toISOString();
        total += claim.amount;
      }
    }
  }

  if (holder) {
    holder.totalDividends += total;
    holder.updatedAt = new Date().toISOString();
  }

  return total;
}

// Get total dividends earned by a holder
export function getTotalDividendsEarned(holderId: string): number {
  const holder = Array.from(holders.values()).find(h => h.id === holderId);
  return holder?.totalDividends || 0;
}

// Cap table
export function getCapTable(): Array<{ address: string; handle?: string; balance: number; percentage: number }> {
  const allHolders = getAllHolders()
    .filter(h => h.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  return allHolders.map(h => ({
    address: h.address,
    handle: h.handle,
    balance: h.balance,
    percentage: (h.balance / TOKEN_CONFIG.totalSupply) * 100,
  }));
}
