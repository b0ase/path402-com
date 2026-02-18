/**
 * $402 Token Pricing Functions
 *
 * alice_bond (default): Ascending bonding curve — price(n) = c × n
 * - Each token individually priced, price increases linearly
 * - 1% of supply costs $1,000 (configurable)
 * - Early buyers get more tokens per dollar
 *
 * sqrt_decay (legacy): price = base / sqrt(treasury + 1)
 * - Kept for backward compatibility with existing tokens
 */

import { PricingModel } from './types';

/** Default supply for alice_bond tokens */
export const ALICE_BOND_TOTAL_SUPPLY = 1_000_000_000;
/** Default cost to acquire 1% of supply */
export const ALICE_BOND_ONE_PERCENT_USD = 1_000;

/**
 * Calculate the bonding curve constant c such that 1% costs onePercentCostUsd.
 * Integral from 0 to 0.01*S of c*n dn = onePercentCostUsd
 * → c = 2 * onePercentCostUsd / (0.01 * S)²
 */
export function calibrateConstant(
  totalSupply: number = ALICE_BOND_TOTAL_SUPPLY,
  onePercentCostUsd: number = ALICE_BOND_ONE_PERCENT_USD
): number {
  const onePercent = totalSupply * 0.01;
  return (2 * onePercentCostUsd) / (onePercent * onePercent);
}

/**
 * Calculate how many tokens a buyer gets for $X at current queue position (alice_bond).
 */
export function buyTokensAliceBond(
  amountUsd: number,
  currentSold: number,
  totalSupply: number = ALICE_BOND_TOTAL_SUPPLY,
  onePercentCostUsd: number = ALICE_BOND_ONE_PERCENT_USD
): { tokensAwarded: number; totalCostUsd: number; avgPriceUsd: number } {
  const c = calibrateConstant(totalSupply, onePercentCostUsd);
  const remaining = totalSupply - currentSold;
  if (remaining <= 0) return { tokensAwarded: 0, totalCostUsd: 0, avgPriceUsd: 0 };

  const posSquared = currentSold * currentSold;
  const tokens = Math.floor(Math.sqrt(posSquared + (2 * amountUsd) / c) - currentSold);
  const awarded = Math.min(Math.max(0, tokens), remaining);
  if (awarded <= 0) return { tokensAwarded: 0, totalCostUsd: 0, avgPriceUsd: 0 };

  const actualCost = c * ((currentSold + awarded) * (currentSold + awarded) - posSquared) / 2;
  return {
    tokensAwarded: awarded,
    totalCostUsd: actualCost,
    avgPriceUsd: actualCost / awarded
  };
}

/**
 * Calculate current price based on pricing model
 */
export function calculatePrice(
  model: PricingModel,
  basePriceSats: number,
  treasuryRemaining: number,
  decayFactor: number = 1.0
): number {
  switch (model) {
    case 'alice_bond':
      // For alice_bond, basePriceSats isn't used the same way
      // Return a sats approximation based on position
      return Math.ceil(basePriceSats * Math.sqrt(treasuryRemaining + 1));

    case 'sqrt_decay':
      return calculateSqrtDecayPrice(basePriceSats, treasuryRemaining);

    case 'fixed':
      return basePriceSats;

    case 'linear_decay':
      return calculateLinearDecayPrice(basePriceSats, treasuryRemaining, decayFactor);

    default:
      return basePriceSats;
  }
}

/**
 * sqrt_decay pricing: price = base / sqrt(treasury + 1)
 *
 * Examples with base_price = 223,610:
 * - Treasury 500M: 10 sats
 * - Treasury 100M: 22 sats
 * - Treasury 10M: 71 sats
 * - Treasury 1M: 224 sats
 * - Treasury 1K: 7,072 sats
 */
export function calculateSqrtDecayPrice(
  basePriceSats: number,
  treasuryRemaining: number
): number {
  return Math.ceil(basePriceSats / Math.sqrt(treasuryRemaining + 1));
}

/**
 * Linear decay pricing (simpler alternative)
 */
export function calculateLinearDecayPrice(
  basePriceSats: number,
  treasuryRemaining: number,
  decayFactor: number
): number {
  // Price increases as treasury decreases
  const multiplier = 1 + (1 - treasuryRemaining / 500_000_000) * decayFactor;
  return Math.ceil(basePriceSats * multiplier);
}

/**
 * Calculate total cost for purchasing multiple tokens
 * Each token increases price for the next (treasury shrinks)
 */
export function calculateTotalCost(
  model: PricingModel,
  basePriceSats: number,
  treasuryRemaining: number,
  amount: number,
  decayFactor: number = 1.0
): { totalSats: number; avgPrice: number; prices: number[] } {
  const prices: number[] = [];
  let totalSats = 0;

  for (let i = 0; i < amount; i++) {
    const price = calculatePrice(model, basePriceSats, treasuryRemaining - i, decayFactor);
    prices.push(price);
    totalSats += price;
  }

  return {
    totalSats,
    avgPrice: Math.ceil(totalSats / amount),
    prices,
  };
}

/**
 * Calculate how many tokens you get for a given spend amount
 */
export function calculateTokensForSpend(
  model: PricingModel,
  basePriceSats: number,
  treasuryRemaining: number,
  spendSats: number,
  decayFactor: number = 1.0
): {
  tokenCount: number;
  totalCost: number;
  avgPrice: number;
  remainingSats: number;
} {
  let tokenCount = 0;
  let totalCost = 0;

  while (treasuryRemaining - tokenCount > 0) {
    const nextPrice = calculatePrice(
      model,
      basePriceSats,
      treasuryRemaining - tokenCount,
      decayFactor
    );

    if (totalCost + nextPrice > spendSats) {
      break;
    }

    totalCost += nextPrice;
    tokenCount++;
  }

  return {
    tokenCount,
    totalCost,
    avgPrice: tokenCount > 0 ? Math.ceil(totalCost / tokenCount) : 0,
    remainingSats: spendSats - totalCost,
  };
}

/**
 * Generate price schedule showing price at different supply levels
 */
export function generatePriceSchedule(
  model: PricingModel,
  basePriceSats: number,
  initialTreasury: number,
  decayFactor: number = 1.0
): Array<{ treasury: number; price: number; percentSold: number }> {
  const schedule = [];

  const checkpoints = [
    1.0, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05, 0.02, 0.01, 0.001, 0.0001
  ];

  for (const pct of checkpoints) {
    const treasury = Math.floor(initialTreasury * pct);
    const price = calculatePrice(model, basePriceSats, treasury, decayFactor);
    schedule.push({
      treasury,
      price,
      percentSold: ((1 - pct) * 100),
    });
  }

  return schedule;
}

/**
 * Calculate breakeven - how many serves needed to recoup cost
 */
export function calculateBreakeven(
  costSats: number,
  revenuePerServe: number
): number {
  if (revenuePerServe <= 0) return Infinity;
  return Math.ceil(costSats / revenuePerServe);
}

/**
 * Calculate ROI projection
 */
export function calculateROI(
  costSats: number,
  currentValueSats: number,
  servingRevenueSats: number
): {
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  totalReturn: number;
  totalReturnPercent: number;
} {
  const unrealizedPnl = currentValueSats - costSats;
  const totalReturn = unrealizedPnl + servingRevenueSats;

  return {
    unrealizedPnl,
    unrealizedPnlPercent: costSats > 0 ? (unrealizedPnl / costSats) * 100 : 0,
    totalReturn,
    totalReturnPercent: costSats > 0 ? (totalReturn / costSats) * 100 : 0,
  };
}
